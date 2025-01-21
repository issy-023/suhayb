<template>
  <div class="community-chat">
    <!-- HEADER -->
    <div class="chat-header">
      <h2>Community Chat App</h2>
      <button class="leave-button" @click="leaveCommunity">Leave</button>
    </div>

    <!-- POST BERICHT -->
    <div class="new-message-box">
      <textarea v-model="newMessage" placeholder="Type message here..."></textarea>
      <input type="file" @change="handleFileChange" accept="image/*" />
      <button class="post-button" @click="postMessage">Post</button>
    </div>

    <!-- OVERZICHT VAN POSTS -->
    <div class="posts-container">
      <div v-for="message in chatMessages" :key="message.id" class="message-box">
        <div class="user-info">
          <span class="user-avatar"></span>
          <span class="username">{{ message.username }}</span>
        </div>

        <!-- Als er een image is, toon 'm -->
        <img
            v-if="message.image"
            :src="message.image"
            alt="Post Image"
            class="message-image"
        />
        <p class="message-area">{{ message.text }}</p>

        <!-- ACTIE KNOPPEN: Like/Unlike, Share, Comments etc. -->
        <div class="message-actions">
          <button @click="toggleLike(message.id)">
            {{ message.isLiked ? "Unlike" : "Like" }}
          </button>
          <span>{{ message.likeCount }} Likes</span>
          <button @click="reportPost(message.id)">Report</button>

          <button @click="toggleComments(message.id)">
            {{ isCommentsOpen(message.id) ? "Hide" : "Show" }} Comments
          </button>
        </div>

        <!-- COMMENT-SECTIE IN-/UITKLAPBAAR -->
        <div v-if="isCommentsOpen(message.id)" class="comments-section">
          <div v-for="comment in message.comments" :key="comment.id" class="comment">
            <span class="comment-username">{{ comment.user?.username }}</span>
            <p class="comment-text">{{ comment.content }}</p>
          </div>
          <div class="new-comment-box">
            <textarea v-model="newComments" placeholder="Add a comment..." />
            <button @click="addComment(message.id)">Comment</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { API_URL } from "@/config";
import jwtDecode from "jwt-decode";

export default {
  name: "CommunityChatComponent",
  props: ["communityId"],

  data() {
    return {
      chatMessages: [],   // Hier komen de posts in
      newMessage: "",     // Tekst van nieuwe post
      selectedFile: null, // Geüploade afbeelding
      openComments: {},   // Bijhouden welke post z'n comments open heeft staan
      newComments: "",    // Tekst van nieuwe comment
    };
  },

  methods: {
    /**
     * 1) POSTS OPHALEN
     * Haal de posts op voor deze communityId.
     * De back-end geeft per post o.a. 'likedByUser' en 'likeCount' terug,
     * zodat we weten of de huidige user al geliket heeft.
     */
    async fetchPosts() {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found.");

        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;

        // GET /api/communities/{communityId}/posts?userId=...
        const response = await fetch(
            `${API_URL}/api/communities/${this.communityId}/posts?userId=${userId}`,
            {
              method: "GET",
              headers: { Authorization: `Bearer ${token}` },
            }
        );

        if (!response.ok) throw new Error("Failed to fetch posts");
        const posts = await response.json();

        // Sla de posts op in chatMessages, met 'isLiked' als boolean
        this.chatMessages = posts.map((post) => ({
          id: post.id,
          text: post.content,
          username: post.user?.username || "Anonymous",
          // Image in base64
          image: post.image ? `data:image/jpeg;base64,${post.image}` : null,
          likeCount: post.likeCount,
          isLiked: post.likedByUser, // Belangrijk: true als user 'm al geliket heeft
          comments: post.comments || [],
        }));
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    },

    /**
     * 2) LIKE OF UNLIKE
     * Als post.isLiked = true, dan 'unlike', anders 'like'.
     */
    async toggleLike(messageId) {
      const token = localStorage.getItem("token");
      if (!token) return alert("User not authenticated. Please log in.");

      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;

      // Post vinden
      const post = this.chatMessages.find((msg) => msg.id === messageId);
      if (!post) return;

      // Bepaal of we POST (like) of DELETE (unlike) moeten doen
      const method = post.isLiked ? "DELETE" : "POST";
      const endpoint = `${API_URL}/api/communities/${this.communityId}/posts/${messageId}/like?userId=${userId}`;

      try {
        const response = await fetch(endpoint, {
          method,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error toggling like:", errorText);
          return;
        }

        // Optimistic update: direct in de UI de status veranderen
        if (post.isLiked) {
          // Was al geliket → unlike
          post.isLiked = false;
          post.likeCount--;
        } else {
          // Nog niet geliket → like
          post.isLiked = true;
          post.likeCount++;
        }
      } catch (error) {
        console.error("Error toggling like:", error);
      }
    },

    /**
     * 3) COMMENT TOEVOEGEN
     * Plaats een nieuwe comment op een postId.
     */
    async addComment(messageId) {
      const token = localStorage.getItem("token");
      if (!token) return alert("User not authenticated. Please log in.");

      try {
        const decodedToken = jwtDecode(token);

        // POST /api/comments/{postId}/saveComments
        const response = await fetch(
            `${API_URL}/api/comments/${messageId}/saveComments`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                content: this.newComments,
                userId: decodedToken.id,
              }),
            }
        );

        if (!response.ok) throw new Error("Failed to add comment");
        // Commentveld legen
        this.newComments = "";

        // Comments herophalen
        await this.fetchComments(messageId);
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    },

    /**
     * 4) COMMENTS OPHALEN
     * Haal de comments op voor een specifieke postId.
     */
    async fetchComments(postId) {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        // GET /api/comments/{postId}/getComments
        const response = await fetch(
            `${API_URL}/api/comments/${postId}/getComments`,
            {
              method: "GET",
              headers: { Authorization: `Bearer ${token}` },
            }
        );
        if (!response.ok) throw new Error("Failed to fetch comments");

        const comments = await response.json();

        // Post in onze chatMessages updaten
        const postIndex = this.chatMessages.findIndex((msg) => msg.id === postId);
        if (postIndex !== -1) {
          this.chatMessages[postIndex].comments = comments;
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    },

    /**
     * 5) NIEUWE POST PLAATSEN
     * Met optioneel bestand (image).
     */
    async postMessage() {
      const token = localStorage.getItem("token");
      if (!token) return alert("User not authenticated. Please log in.");

      try {
        const decodedToken = jwtDecode(token);

        // Bouw de FormData
        const formData = new FormData();
        formData.append("content", this.newMessage);
        formData.append("userid", decodedToken.id);
        if (this.selectedFile) formData.append("image", this.selectedFile);

        // POST /api/communities/{communityId}/posts/create
        const response = await fetch(
            `${API_URL}/api/communities/${this.communityId}/posts/create`,
            {
              method: "POST",
              headers: { Authorization: `Bearer ${token}` },
              body: formData,
            }
        );

        if (!response.ok) throw new Error("Failed to post message");

        // Reset text en file
        this.newMessage = "";
        this.selectedFile = null;

        // Refresh de postlijst
        this.fetchPosts();
      } catch (error) {
        console.error("Error posting message:", error);
      }
    },

    /**
     * 6) BESTAND UPLOADEN
     * Check of het een image is en max 5MB.
     */
    handleFileChange(event) {
      const file = event.target.files[0];
      if (!file.type.startsWith("image/")) {
        return alert("Please upload a valid image file.");
      }
      if (file.size > 5 * 1024 * 1024) {
        return alert("File size exceeds 5MB. Please upload a smaller file.");
      }
      this.selectedFile = file;
    },

    /**
     * 7) COMMENTS IN-/UITKLAPPEN
     * openComments[postId] = true/false
     */
    toggleComments(messageId) {
      this.openComments[messageId] = !this.openComments[messageId];
      // Alleen als we ze net openklikken, comments ophalen
      if (this.openComments[messageId]) {
        this.fetchComments(messageId);
      }
    },
    isCommentsOpen(messageId) {
      return !!this.openComments[messageId];
    },

    /**
     * 8) BERICHT DELEN
     * Voorbeeldfunctionaliteit: toont simpelweg een alert.
     */
    shareMessage(messageId) {
      alert(`Sharing post with ID: ${messageId} (add your logic here)`);
    },

    /**
     * 9) COMMUNITY VERLATEN
     * Stuur een DELETE-request naar /api/communities/{communityId}/leave?userId=...
     */
    async leaveCommunity() {
      const token = localStorage.getItem("token");
      if (!token) return alert("User not authenticated. Please log in.");

      try {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;

        // DELETE /api/communities/{communityId}/leave?userId=...
        const response = await fetch(
            `${API_URL}/api/communities/${this.communityId}/leave?userId=${userId}`,
            {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            }
        );

        if (!response.ok) throw new Error("Failed to leave community");

        alert("You have left the community.");
        // Navigeer terug naar een communities-overzicht, of wat je wilt
        this.$router.push({ name: "Communities" });
      } catch (error) {
        console.error("Error leaving community:", error);
      }

  },async reportPost(messageId,communityId) {
    const token = localStorage.getItem("token");
    if (!token) return alert("User not authenticated. Please log in.");

    try {
      // Voorbeeld: je hebt in de backend een endpoint: POST /api/posts/{postId}/report
      const response = await fetch(`${API_URL}/api/communities/${communityId}/posts/${messageId}/report`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error reporting post:", errorText);
        alert(`Error reporting post: ${errorText}`);
        return;
      }

      alert("Post reported successfully.");
    } catch (error) {
      console.error("Error reporting post:", error);
    }
  },
},

  /**
   * Bij het laden van de pagina (component), meteen fetchPosts aanroepen.
   */
  mounted() {
    this.fetchPosts();
  },
};
</script>






<style>
* {
  font-family: "Outfit", sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;

}

.community-chat {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background-color: #F9F9F9;
  color: #17003C;
  width: 100vw;
  height: 100vh;
  padding: 1.5rem;
  overflow: hidden;
}

.chat-header {
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 800px;
  margin-bottom: 1rem;
}

.new-message-box {
  flex-shrink: 0;
  background-color: #17003C;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 20px;
  width: 100%;
  max-width: 800px;
  border-radius: 10px;
}

textarea {
  width: 100%;
  border-radius: 10px;
  padding: 10px;
  font-size: 1em;
  margin: 10px 0;
  border: none;
  background-color: white;
  color: black;
}

.post-button {
  background-color: #FF9900;
  color: white;
  padding: 8px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.post-button:hover {
  background-color: #E68A00;
}

.posts-container {
  flex-grow: 1;
  width: 100%;
  max-width: 800px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
}

.message-box {
  background-color: #17003C;
  color: white;
  border-radius: 15px;
  padding: 15px;
  margin-bottom: 10px;
  width: 90%;
  max-width: 600px;
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: gray;
  margin-right: 10px;
}

.username {
  font-weight: bold;
  color: #FF9900;
}

.message-area {
  background-color: white;
  color: black;
  padding: 10px;
  border-radius: 10px;
  font-size: 1em;
  margin-top: 10px;
}

.message-image {
  max-width: 50%;
  border-radius: 10px;
  margin-top: 10px;
}

.message-actions {
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
}

.message-actions button {
  background: none;
  border: none;
  color: #FF9900;
  cursor: pointer;
  font-size: 1em;
}

.message-actions button:hover {
  color: #E68A00;
}

.comments-section {
  margin-top: 10px;
  padding: 10px;
  background-color: #2A1E54;
  border-radius: 10px;
}

.comment {
  margin-bottom: 5px;
  padding: 10px;
}

.comment .username {
  font-weight: bold;
  color: #FF9900;
}
.comment-username{
  color: yellow;
  margin-top: 5px;
  background-color: white;
  border-radius: 8px;
  padding: 10px;
}

.comment-text {
  margin-top: 5px;
  background-color: white;
  color: black;
  border-radius: 8px;
  padding: 10px;
}
.comment-username{
  color: #FF9900;
}
.new-comment-box input,button{
  padding: 10px;
}
.new-comment-box button{
  padding: 3px;
  border-radius: 5px;
}
.leave-button {
  background-color: #E74C3C;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
}

.leave-button:hover {
  background-color: #C0392B;
}

</style>
