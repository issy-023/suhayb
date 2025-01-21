<template>
  <div class="community-list">
    <h2>Communities:</h2>
    <div v-if="loading">Loading...</div>
    <div v-if="!loading">
      <div v-for="community in communities" :key="community.id" class="community-card">
        <img class="image" :src="getCommunityImage(community.name)" :alt="community.name" />
        <div class="community-info">
          <h3>{{ community.name }}</h3>
          <p>{{ community.description }}</p>
          <div class="community-footer">
            <span>{{ community.members }} Members</span>
            <button class="join-button" @click="openGuidelines(community.id)">JOIN</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showLoginPrompt" class="modal-overlay">
      <div class="modal-content">
        <p>Please log in to join a community.</p>
        <button @click="redirectToLogin" class="close-button">Log In</button>
      </div>
    </div>

    <div v-if="showGuidelines" class="modal-overlay">
      <div class="modal-content">
        <h3>Community Guidelines</h3>
        <ul>
          <li>Be respectful to all members.</li>
          <li>No spamming or inappropriate content.</li>
          <li>Follow the community's specific rules.</li>
          <li>Any violations may result in being reported or removed.</li>
        </ul>
        <div class="guidelines-actions">
          <button @click="acceptGuidelines" class="accept-button">Accept</button>
          <button @click="closeGuidelines" class="close-button">Decline</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import jwtDecode from 'jwt-decode';
import { API_URL } from '../config.js';
import VVD from '../assets/party/vvd.png';
import D66 from '../assets/party/d66.png';
import PVV from '../assets/party/pvv.png';
import PVDA from '../assets/party/pvda.png';
import SP from '../assets/party/sp.png';
import FVD from '../assets/party/fvd.png';
import CDA from '../assets/party/cda.png';
import Denk from '../assets/party/denk.png';
import GroenLinks from '../assets/party/groenLinks.png';
import VijftigPlus from '../assets/party/VijftigPlus.png';
import BBB from '../assets/party/bbb.png';
import JA21 from '../assets/party/ja21.png';
import NSC from '../assets/party/nsc.png';
import OPNL from '../assets/party/opnl.png';
import PvdD from '../assets/party/pvdd.png';
import SGP from '../assets/party/sgp.png';
import Volt from '../assets/party/volt.png';

export default {
  name: 'CommunitiesComponent',
  data() {
    return {
      showLoginPrompt: false,
      showGuidelines: false,
      communities: [],
      loading: true,
      selectedCommunityId: null,
      joinedCommunityId: null,
      partyImages: {
        'vvd': VVD,
        'd66': D66,
        'pvv': PVV,
        'pvda': PVDA,
        'sp': SP,
        'fvd': FVD,
        'cda': CDA,
        'denk': Denk,
        'groenLinks': GroenLinks,
        '50plus': VijftigPlus,
        'bbb': BBB,
        'ja21': JA21,
        'nsc': NSC,
        'opnl': OPNL,
        'pvdd': PvdD,
        'sgp': SGP,
        'volt': Volt,
      },
    };
  },
  created() {
    this.fetchCommunities();
  },
  methods: {
    fetchCommunities() {
      fetch(`${API_URL}/api/communities`)
          .then((response) => response.json())
          .then((data) => {
            this.communities = data;
            this.loading = false;
          })
          .catch((error) => {
            console.error('Error fetching communities:', error);
            this.loading = false;
          });
    },
    getCommunityImage(communityName) {
      return this.partyImages[communityName.toLowerCase()] || '';
    },
    openGuidelines(communityId) {
      const token = localStorage.getItem('token');
      if (!token) {
        this.showLoginPrompt = true;
      } else {
        this.selectedCommunityId = communityId;
        this.showGuidelines = true;
      }
    },
    closeGuidelines() {
      this.showGuidelines = false;
      this.selectedCommunityId = null;
    },
    acceptGuidelines() {
      this.showGuidelines = false;
      this.attemptJoinCommunity(this.selectedCommunityId);
    },
    attemptJoinCommunity(communityId) {
      const token = localStorage.getItem('token');
      if (token) {
        if (this.joinedCommunityId) {
          alert('You can only join one community chat.');
        } else {
          this.joinCommunityAction(communityId);
        }
      } else {
        this.showLoginPrompt = true;
      }
    },
    async joinCommunityAction(communityId) {
      const token = localStorage.getItem('token');
      if (!token) {
        this.showLoginPrompt = true;
        return;
      }

      try {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;

        const response = await fetch(`${API_URL}/api/communities/${communityId}/join?userId=${userId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to join community chat.');
        }

        this.joinedCommunityId = communityId;
        this.$router.push({ name: 'CommunityChat', params: { communityId } });
      } catch (error) {
        console.error('Error joining community chat:', error);
        alert('An error occurred while trying to join the community.');
      }
    },
    redirectToLogin() {
      this.showLoginPrompt = false;
      this.$router.push({ name: 'Login' });
    },
  },
};
</script>
<style scoped>
html, body {
  overflow-y: auto;
  height: 100%;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 10px;
  width: 500px;
  max-width: 90%;
  position: relative;
}

.chat-messages {
  background-color: #f1f1f1;
  padding: 1rem;
  height: 300px;
  overflow-y: auto;
  border-radius: 10px;
  margin-bottom: 1rem;
}

.chat-message {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.profile-container {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.message-content {
  background-color: #e9ecef;
  padding: 10px;
  border-radius: 10px;
  max-width: 75%;
}

.comments {
  margin-top: 10px;
}

.comment {
  margin-left: 50px;
  margin-top: 5px;
}

input[type='text'] {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 1rem;
}

.close-button {
  background-color: #ff5f5f;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
}

.close-button:hover {
  background-color: #ff1f1f;
}

.navbar {
  background-color: #17003C;
  padding: 1.5rem 0;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  z-index: 100;
  border-bottom-left-radius: 100px;
  border-bottom-right-radius: 100px;
}

.navbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 2rem;
  font-size: 32px;
}

.navbar-logo {
  width: 70px;
  height: 70px;
  padding-left: 2%;
}

.navbar ul {
  display: flex;
  list-style-type: none;
  justify-content: flex-end;
  margin: 0;
  padding-right: 5%;
  flex: 1;
  text-align: center;
  overflow-y: auto;
}

.navbar ul li {
  margin: 0 0.5rem;
  overflow-y: auto;
}

.navbar ul li a {
  color: white;
  text-decoration: none;
  font-size: 24px;
  padding: 0.5rem 1rem;
  display: block;
  transition: color 0.3s ease;
  cursor: pointer;
  overflow-y: auto;
}

.navbar ul li a:hover {
  color: #FF9900;
}

.community-list {
  padding: 2rem;
  background-color: #f8f8f8;
  margin-top: 0px;
  overflow-y: auto;
}

h2 {
  font-size: 24px;
  margin-bottom: 1rem;
  color: #17003C;
}

.community-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #17003C;
  padding: 2rem;
  border-radius: 20px;
  margin-bottom: 1rem;
  color: white;
  width: 90%;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.image {
  height: 15vh;
  object-fit: contain;
}

.community-info {
  flex: 1;
  margin-left: 1rem;
}

.community-info h3 {
  font-size: 20px;
  margin: 0;
}

.community-info p {
  background-color: white;
  color: #17003C;
  padding: 3rem;
  border-radius: 10px;
  margin: 0.5rem 0;
}

.community-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.join-button {
  background-color: #FF9900;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  color: white;
  cursor: pointer;
}
.accept-button {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
}

.accept-button:hover {
  background-color: #218838;
}

.join-button:hover {
  background-color: white;
  color: #FF9900;
  border: 1px solid #FF9900;
}
</style>