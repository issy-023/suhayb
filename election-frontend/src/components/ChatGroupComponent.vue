<template>
  <div class="main-container">
    <div class="filter-container">
      <h2>Filter by Party</h2>

      <div class="party-filter" @click="filterAllParties">
        <p>All Parties</p>
      </div>

      <div v-for="party in parties" :key="party" class="party-filter" @click="filterByParty(party)">
        <p>{{ party }}</p>
      </div>
    </div>

    <div class="chat-container">
      <h2>Chats Overview</h2>

      <div class="chat-list">
        <div v-for="(chat, index) in filteredChats" :key="index" class="chat-item" @click="openChat(chat)">
          <div class="chat-item-container">
            <h3>{{ chat.name }} - {{ chat.party }}</h3>
            <p>{{ chat.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="new-chat-container">
      <h2>Create a New Chat</h2>
      <input
          type="text"
          v-model="newChatName"
          placeholder="Enter chat name"
          class="chat-input"
      />
      <textarea
          v-model="newChatDescription"
          placeholder="Enter chat description"
          class="chat-input"
          rows="3"
      ></textarea>
      <label for="party">Select party:</label>
      <select v-model="newChatParty" class="chat-input">
        <option value="" disabled>Select a party</option>
        <option v-for="party in parties" :key="party" :value="party">{{ party }}</option>
      </select>
      <button @click="openNewChat">Open new chat</button>
    </div>

    <div v-if="showPopup" class="modal-overlay">
      <div class="modal">
        <p>{{ popupMessage }}</p>
        <button @click="closePopup">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ChatGroupComponent",
  data() {
    return {
      chats: [
        { id: 1, name: "Chat 1", description: "This is the first chat", party: "VVD", messages: [] },
        { id: 2, name: "Chat 2", description: "This is the second chat", party: "D66", messages: [] },
        { id: 3, name: "Chat 3", description: "This is the third chat", party: "GroenLinks / PvdA", messages: [] },
        { id: 4, name: "Chat 4", description: "This is the fourth chat", party: "PVV", messages: [] }
      ],
      newChatName: "",
      newChatDescription: "",
      newChatParty: "",
      selectedParty: "",
      filteredChats: [],
      showPopup: false,
      popupMessage: "",
      parties: [
        "VVD",
        "D66",
        "GROENLINKS / Partij van de Arbeid (PvdA)",
        "PVV (Partij voor de Vrijheid)",
        "CDA",
        "SP (Socialistische Partij)",
        "Forum voor Democratie",
        "Partij voor de Dieren",
        "ChristenUnie",
        "Volt",
        "JA21",
        "Staatkundig Gereformeerde Partij (SGP)",
        "DENK",
        "50PLUS",
        "BBB",
        "BIJ1",
        "Piratenpartij – De Groenen",
        "BVNL / Groep Van Haga",
        "Nieuw Sociaal Contract",
        "Splinter",
        "LP (Libertaire Partij)",
        "LEF – Voor de Nieuwe Generatie",
        "Samen voor Nederland",
        "Nederland met een PLAN",
        "PartijvdSport",
        "Politieke Partij voor Basisinkomen"
      ]
    };
  },
  mounted() {
    this.filteredChats = this.chats;
  },
  methods: {
    openNewChat() {
      if (this.newChatName.trim() === "" || this.newChatParty === "") {
        this.showPopupMessage("Please enter a name and select a party for the new chat.");
        return;
      }
      if (this.newChatDescription.trim() === "") {
        this.showPopupMessage("Please add a description for the new chat.");
        return;
      }

      const newChat = {
        id: this.chats.length + 1,
        name: this.newChatName,
        description: this.newChatDescription,
        party: this.newChatParty,
        messages: []
      };
      this.chats.unshift(newChat);
      this.newChatName = "";
      this.newChatDescription = "";
      this.newChatParty = "";
      this.filterChats();
      this.showPopupMessage("New chat created successfully!");
    },
    openChat(chat) {
      this.$router.push({ name: 'ChatView', params: { chatId: chat.id } });
    },
    filterChats() {
      if (this.selectedParty === "") {
        this.filteredChats = this.chats;
      } else {
        this.filteredChats = this.chats.filter(chat => chat.party === this.selectedParty);
      }
    },
    filterByParty(party) {
      this.filteredChats = this.chats.filter(chat => chat.party === party);
    },
    filterAllParties() {
      this.filteredChats = this.chats;
    },
    showPopupMessage(message) {
      this.popupMessage = message;
      this.showPopup = true;
    },
    closePopup() {
      this.showPopup = false;
    }
  }
};
</script>

<style scoped>
.main-container {
  display: flex;
  justify-content: space-between;
  padding: 20px;
}

.filter-container {
  width: 20%;
  padding: 20px;
  background-color: #f1f1f1;
  border-radius: 8px;
}

.party-filter {
  padding: 10px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-bottom: 10px;
  cursor: pointer;
  text-align: center;
}

.party-filter:hover {
  background-color: #f0f0f0;
}

.chat-container {
  width: 60%;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.new-chat-container {
  width: 20%;
  height: 10%;
  padding: 15px;
  background-color: #f0f0f0;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.chat-input {
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 100%;
}

.chat-item-container {
  padding: 15px;
  background-color: white;
  border-radius: 8px;
  border: 1px solid #ddd;
  margin-bottom: 10px;
  cursor: pointer;
}

button {
  padding: 10px 20px;
  background-color: #ff9933;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #e68a00;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.modal button {
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
