<template>
  <div class="chat-view-container">
    <!-- Toon de naam van de chat bovenaan -->
    <h2>Chat: {{ chat.name }}</h2>

    <div class="chat-messages">
      <div v-for="(message, index) in chatMessages" :key="index" class="message">
        {{ message }}
      </div>
    </div>

    <div class="new-message">
      <input v-model="newMessage" placeholder="Type your message..." />
      <button @click="sendMessage">Send</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChatViewComponent',
  data() {
    return {
      chat: {}, // De chat die we openen
      chatMessages: [], // Berichten binnen de chat
      newMessage: ""
    };
  },
  methods: {
    loadChat() {
      const chatId = this.$route.params.chatId; // Haal de chat-ID op uit de URL
      const allChats = JSON.parse(localStorage.getItem('chats')) || []; // Laad chats van localStorage of een andere opslag

      // Zoek de chat met de bijbehorende ID
      const chat = allChats.find(c => c.id == chatId);
      if (chat) {
        this.chat = chat;
        this.chatMessages = chat.messages || []; // Laad de berichten binnen de chat
      } else {
        alert('Chat not found');
      }
    },
    sendMessage() {
      if (this.newMessage.trim()) {
        this.chatMessages.push(this.newMessage); // Voeg bericht toe aan de berichtenlijst
        this.newMessage = ""; // Maak het inputveld leeg
        // Update de berichtenlijst in de opgeslagen chats
        const allChats = JSON.parse(localStorage.getItem('chats')) || [];
        const chatIndex = allChats.findIndex(c => c.id == this.chat.id);
        if (chatIndex !== -1) {
          allChats[chatIndex].messages = this.chatMessages;
          localStorage.setItem('chats', JSON.stringify(allChats)); // Update localStorage
        }
      }
    }
  },
  mounted() {
    this.loadChat(); // Laad de chat wanneer de component wordt gemount
  }
};
</script>

<style scoped>
.chat-view-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.chat-messages {
  height: 300px;
  overflow-y: auto;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  padding: 10px;
  background-color: white;
}

.message {
  padding: 5px;
  border-bottom: 1px solid #ddd;
}

.new-message {
  display: flex;
  justify-content: space-between;
}

input {
  flex: 1;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  margin-right: 10px;
}

button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
