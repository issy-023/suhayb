<template>
  <div class="party-detail">
    <h1>{{ party.name }}</h1>
    <p>{{ description }}</p>

    <div class="important-points">
      <h2>Important Points</h2>
      <ul>
        <li v-for="point in importantPoints" :key="point">{{ point }}</li>
      </ul>
    </div>

    <div class="vote-details">
      <h2>Votes and Seats</h2>
      <p><strong>Total Votes:</strong> {{ formatVotes(votes.totalVotes) }}</p>
      <p><strong>Seats:</strong> {{ votes.seats }}</p>
      <p v-if="votes.remainingVotes > 0">
        <strong>Votes Needed for Next Seat:</strong> {{ formatVotes(votes.remainingVotes) }}
      </p>
    </div>

    <div class="candidates">
      <h2>Candidates</h2>
      <div class="filter-buttons">
        <button @click="sortCandidates('votes-desc')">Votes: High to Low</button>
        <button @click="sortCandidates('votes-asc')">Votes: Low to High</button>
      </div>
      <ul>
        <li
            v-for="(candidate) in visibleCandidates"
            :key="candidate.id"
        >
          <div class="candidate-item">
            <span class="candidate-name">{{ candidate.name }}</span>
            <span class="candidate-votes">{{ formatVotes(candidate.totalVotes) }} votes</span>
          </div>
        </li>
      </ul>
      <button v-if="showMoreButton" @click="showAllCandidates" class="load-more-btn">
        More Candidates
      </button>
    </div>

    <button class="view-all-parties-btn" @click="navigateBackToParties">Back to parties</button>
  </div>
</template>

<script>

import {API_URL} from "@/config";

export default {
  name: "PartyDetailComponent",
  props: ["partyId"],
  data() {
    return {
      party: {},
      description: this.$route.query.description || '',
      importantPoints: JSON.parse(this.$route.query.importantPoints || '[]'),
      votes: {
        totalVotes: 0,
        seats: 0,
        remainingVotes: 0,
      },
      candidates: [],
      showAll: false,
    };
  },
  computed: {
    visibleCandidates() {
      return this.showAll ? this.candidates : this.candidates.slice(0, 10);
    },
    showMoreButton() {
      return !this.showAll && this.candidates.length > 10;
    },
  },
  async mounted() {
    if (this.partyId) {
      await this.fetchPartyDetails();
      await this.calculateVotes();
      this.fetchCandidates();
    } else {
      console.error("Party ID is undefined.");
    }
  },
  methods: {

    navigateBackToParties() {
      this.$router.push({ name: "AllPartiesComponent" });
    },

    async fetchPartyDetails() {
      try {
        const response = await fetch(`${API_URL}/api/v1/parties/${this.partyId}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        this.party = await response.json();
      } catch (error) {
        console.error("Error fetching party details:", error);
      }
    },
    async calculateVotes() {
      try {
        const response = await fetch(`${API_URL}/api/election-results/votes-per-party`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        const partyVotes = data.find((party) => party.name === this.party.name);

        if (partyVotes) {
          const totalSeats = 150;
          const kiesdeler = Math.floor(
              data.reduce((sum, party) => sum + party.totalVotes, 0) / totalSeats
          );
          const seats = Math.floor(partyVotes.totalVotes / kiesdeler);
          const remainingVotes = kiesdeler - (partyVotes.totalVotes % kiesdeler);

          this.votes = {
            totalVotes: partyVotes.totalVotes,
            seats,
            remainingVotes: remainingVotes > 0 ? remainingVotes : 0,
          };
        }
      } catch (error) {
        console.error("Error fetching votes data:", error);
      }
    },
    async fetchCandidates() {
      try {
        const response = await fetch(
            `${API_URL}/api/v1/candidates/by-party/${this.partyId}`
        );
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        this.candidates = (await response.json()).sort(
            (a, b) => b.totalVotes - a.totalVotes
        );
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    },
    sortCandidates(order) {
      if (order === "votes-asc") {
        this.candidates.sort((a, b) => a.totalVotes - b.totalVotes);
      } else if (order === "votes-desc") {
        this.candidates.sort((a, b) => b.totalVotes - a.totalVotes);
      }
    },
    showAllCandidates() {
      this.showAll = true;
    },
    formatVotes(votes) {
      return votes.toLocaleString();
    },
  },
};
</script>

<style scoped>
.party-detail {
  text-align: center;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 10px;
  max-width: 800px;
  margin: 20px auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: #333;
}

.vote-details {
  margin-top: 20px;
  text-align: left;
  display: inline-block;
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
}

.vote-details h2 {
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: #444;
}

.vote-details p {
  margin: 5px 0;
  font-size: 1rem;
  color: #666;
}

.candidates {
  margin-top: 20px;
  text-align: left;
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.candidates h2 {
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: #444;
}

.filter-buttons {
  margin-bottom: 20px;
  text-align: center;
}

.filter-buttons button {
  margin: 0 10px;
  padding: 10px 20px;
  background-color: #ec7700;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  font-size: 1rem;
}

.filter-buttons button:hover {
  background-color: #c26200;
}

.candidates ul {
  list-style-type: none;
  padding: 0;
}

.candidate-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #ddd;
}

.candidate-name {
  font-size: 1rem;
  color: #333;
}

.candidate-votes {
  font-size: 1rem;
  color: #555;
}

.load-more-btn {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #ec7700;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  font-size: 1rem;
}

.load-more-btn:hover {
  background-color: #c26200;
}

.view-all-parties-btn {
  display: inline-block;
  margin-top: 20px;
  text-decoration: none;
  color: #f0f0f0;
  background-color: #ec7700;
  font-weight: normal;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
}

.view-all-parties-btn:hover {
  background-color: #c26200;

}
</style>
