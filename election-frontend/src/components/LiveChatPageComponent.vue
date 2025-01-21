<template>
  <div>
    <noscript>
      <h2>Sorry! Your browser doesn't support Javascript</h2>
    </noscript>

    <div class="chat-page">
      <div class="chat-container">
        <div class="chat-header">
          <h3>Welcome to the livechat {{ usernameInput }}</h3>
          <button @click="leaveChat" class="leave-button" v-if="hasJoined">Leave</button>
        </div>
        <div class="connecting" v-show="isConnecting">
          Connecting...
        </div>
        <ul class="message-area" ref="messageArea">
          <li
              v-for="(message, index) in messages"
              :key="index"
              :class="[
    'message-container',
    message.isOwnMessage ? 'own-message-container' : 'other-message-container'
  ]"
          >
            <div :class="message.isOwnMessage ? 'own-message' : 'other-message'">
              <template v-if="message.type === 'CHAT'">
                <i :style="{ backgroundColor: getAvatarColor(message.sender) }">
                  {{ message.sender[0] }}
                </i>
                <span class="sender-name">{{ message.sender }}</span>
              </template>
              <p class="message-content">{{ message.content }}</p>
            </div>
          </li>
        </ul>

        <!-- Formulier om berichten te versturen, alleen zichtbaar na 'Join' -->
        <form @submit.prevent="sendMessage" v-if="hasJoined">
          <div class="form-group">
            <div class="input-group clearfix">
              <input
                  type="text"
                  v-model="messageInput"
                  placeholder="Type a message..."
                  autocomplete="off"
                  class="form-control"
                  @input="checkCharacterLimit"
              />
              <button type="submit" class="primary" :disabled="remainingCharacters < 0">Send</button>
            </div>
            <p class="character-count" :class="{ 'over-limit': remainingCharacters < 0 }">
              Characters left: {{ remainingCharacters }}
            </p>
          </div>
        </form>

        <!-- Join-knop onderaan de chat, alleen zichtbaar als de gebruiker niet gejoined is -->
        <button v-if="!hasJoined" @click="joinChat" class="join-button">
          Join
        </button>
      </div>

      <!-- Popup -->
      <div v-if="showLoginPopup" class="popup-overlay">
        <div class="popup">
          <h3>You need to log in to chat</h3>
          <p>Please log in to participate in the chat.</p>
          <a href="/login" class="login-link">Go to Login Page</a>
          <button @click="closePopup" class="close-button">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>



<script>
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import {API_URL} from "@/config";

export default {
  data() {
    return {
      isConnecting: true,
      usernameInput: "",
      messageInput: "",
      messages: [],
      stompClient: null,
      hasLeft: false,
      hasJoined: false,
      colors: ["#2196F3", "#32c787", "#00BCD4", "#ff5652", "#ffc107", "#ff85af", "#FF9800", "#39bbb0"],
      maxCharacters: 220,
      token: "", // Token van de gebruiker
      showLoginPopup: false, // Nieuw: Beheert de zichtbaarheid van de popup
    };
  },

  computed: {
    remainingCharacters() {
      return this.maxCharacters - this.messageInput.length;
    }
  },
  methods: {
    loadUsername() {
      const token = localStorage.getItem("token");

      if (token) {
        this.token = token;
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.usernameInput = payload.username || `Anonymous${Math.floor(Math.random() * 1000)}`;
      } else {
        this.usernameInput = "You are not logged in";
      }

      localStorage.setItem("username", this.usernameInput);
    },

    async loadRecentMessages() {
      try {
        const token = localStorage.getItem("token");
        const headers = token
            ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
            : { "Content-Type": "application/json" };

        const response = await fetch(`${API_URL}/api/chat/recentMessages`, {
          method: "GET",
          headers,
        });

        if (response.ok) {
          const data = await response.json();
          this.messages = data.map((message) => ({
            ...message,
            isOwnMessage: message.sender === this.usernameInput,
          }));
        } else {
          console.error("Failed to load recent messages.");
        }
      } catch (error) {
        console.error("Error loading recent messages:", error);
      }
    },

    connect() {
      if (this.usernameInput.trim() && !this.stompClient?.active) {
        this.hasLeft = false;

        const socket = new SockJS(`${API_URL}/ws`);
        this.stompClient = Stomp.over(socket);
        this.stompClient.reconnectDelay = 5000;
        this.stompClient.onConnect = this.onConnected;
        this.stompClient.onStompError = this.onError;

        this.stompClient.activate();
      }
    },

    joinChat() {
      if (!this.token) {
        // Toon de popup in plaats van een alert
        this.showLoginPopup = true;
        return;
      }

      if (!this.hasJoined) {
        this.hasJoined = true;

        this.stompClient.send(
            "/app/chat.addUser",
            { Authorization: `Bearer ${this.token}` },
            JSON.stringify({ sender: this.usernameInput, type: "JOIN" })
        );
      }
    },

    sendMessage() {
      const messageContent = this.messageInput.trim();
      if (messageContent && this.remainingCharacters >= 0 && this.stompClient && this.stompClient.active) {
        const chatMessage = {
          sender: this.usernameInput,
          content: messageContent,
          type: "CHAT",
        };

        this.stompClient.send("/app/chat.sendMessage", { Authorization: `Bearer ${this.token}` }, JSON.stringify(chatMessage));
        this.messageInput = "";
      }
    },

    leaveChat() {
      if (this.stompClient && this.stompClient.active && this.hasJoined) {
        this.stompClient.send(
            "/app/chat.addUser",
            {},
            JSON.stringify({ sender: this.usernameInput, type: "LEAVE" })
        );
        this.hasLeft = true;
        this.hasJoined = false;
      }
      this.stompClient.deactivate();
    },

    closePopup() {
      this.showLoginPopup = false;
    },

    onConnected() {
      this.stompClient.subscribe("/topic/public", this.onMessageReceived);
      this.isConnecting = false;
    },

    onError(error) {
      console.error("WebSocket Error:", error);
      this.isConnecting = true;
    },

    onMessageReceived(payload) {
      const message = JSON.parse(payload.body);
      message.isOwnMessage = message.sender === this.usernameInput;

      if (message.type === "JOIN") {
        message.content = `${message.sender} joined!`;
      } else if (message.type === "LEAVE") {
        message.content = `${message.sender} left!`;
      }

      this.messages.push(message);

      if (this.messages.length > 10000) {
        this.messages.shift(); // Verwijder het oudste bericht om alleen de laatste 20 berichten te behouden
      }

      this.$nextTick(() => {
        const messageArea = this.$refs.messageArea;
        if (messageArea) {
          messageArea.scrollTop = messageArea.scrollHeight;
        }
      });
    },

    getAvatarColor(messageSender) {
      let hash = 0;
      for (let i = 0; i < messageSender.length; i++) {
        hash = 31 * hash + messageSender.charCodeAt(i);
      }
      const index = Math.abs(hash % this.colors.length);
      return this.colors[index];
    },

    checkCharacterLimit() {
      if (this.messageInput.length > this.maxCharacters) {
        this.messageInput = this.messageInput.substring(0, this.maxCharacters);
      }
    }
  },
  mounted() {
    this.token = localStorage.getItem("token");
    this.loadUsername();
    this.connect();
    this.loadRecentMessages();
  },
  beforeUnmount() {
    if (this.stompClient && this.stompClient.active) {
      this.leaveChat();
      this.stompClient.deactivate();
    }
  }
};
</script>


<style scoped>
/* Algemene stijlen */
body {
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f4f4f4;
}

/* Chat-container */
.chat-container {
  width: 800px;
  margin: 50px auto;
  background-color: #ffffff;
  border: 2px solid #000;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* Header */
.chat-header {
  background-color: #2d0353;
  color: #fff;
  text-align: center;
  padding: 15px;
  font-size: 24px; /* Vergroot de tekst in de header */
  font-weight: bold;
  border-bottom: 2px solid #000;
}

/* Berichtenlijst */
.message-area {
  padding: 10px;
  height: 400px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* Berichten */
.message-container {
  display: flex;
  align-items: center;
  max-width: 80%;
}

.own-message-container {
  justify-content: flex-end;
  align-self: flex-end;
}

.other-message-container {
  justify-content: flex-start;
  align-self: flex-start;
}

.message-content {
  background-color: #2d0353;
  color: #fff;
  padding: 15px 20px;
  border-radius: 15px;
  font-size: 18px;
  line-height: 1.6;
  max-width: 680px;
  word-wrap: break-word;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.other-message-container .message-content {
  background-color: #f4f4f4;
  color: #000;
  border: 2px solid #000;
}

.own-message-container .message-content {
  border-radius: 15px 15px 0 15px;
}

.other-message-container .message-content {
  border-radius: 15px 15px 15px 0;
}

/* Avatar */
.message-container i {
  width: 30px;
  height: 30px;
  background-color: #aaa;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  margin: 0 10px;
}

/* Inputformulier */
form {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 10px;
  border-top: 2px solid #000;
  background-color: #fff;
}

form input {
  width: 100%;
  padding: 15px;
  border: 2px solid #000;
  border-radius: 15px;
  font-size: 18px;
  margin-bottom: 10px;
}

form button {
  background-color: #ff9933;
  color: #fff;
  border: none;
  padding: 15px 20px;
  border-radius: 15px;
  font-size: 18px;
  cursor: pointer;
  font-weight: bold;
}

form button:hover {
  background-color: #cc7a29;
}

.join-button {
  background-color: #ff9933;
  color: #fff;
  border: none;
  padding: 15px 20px;
  border-radius: 15px;
  font-size: 18px;
  cursor: pointer;
  font-weight: bold;
  text-align: center;
  margin: 10px auto;
  display: block;
}

.join-button:hover {
  background-color: #cc7a29;
}

@media screen and (max-width: 480px) {
  .chat-container {
    width: 90%;
    margin: 20px auto;
  }

  .message-content {
    font-size: 16px;
  }

  form input {
    font-size: 16px;
    padding: 10px;
  }

  form button {
    padding: 10px 15px;
    font-size: 16px;
  }
}

</style>
