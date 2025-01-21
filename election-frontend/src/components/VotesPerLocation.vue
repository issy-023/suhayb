<template>
  <div class="votes-per-location">
    <select class="dropdown-container" id="constituency" v-model="selectedConstituency" @change="fetchVotesPerParty">
      <option v-for="constituency in constituencies" :key="constituency" :value="constituency">
        {{ constituency }}
      </option>
    </select>
    <div class="podium">
      <div class="second-place">
        <img v-if="getPartyLogo(secondLargestParty.name)" :src="getPartyLogo(secondLargestParty.name)"
             alt="2nd Place Logo" class="party-logo"/>
        <h3>2nd Place</h3>
        <h2>{{ secondLargestParty.name }}</h2>
        <p>Votes: {{ formatVotes(secondLargestParty.totalVotes) }}</p>
      </div>
      <div class="first-place">
        <img v-if="getPartyLogo(largestParty.name)" :src="getPartyLogo(largestParty.name)" alt="1st Place Logo"
             class="party-logo"/>
        <h3>1st Place</h3>
        <h2>{{ largestParty.name }}</h2>
        <p>Votes: {{ formatVotes(largestParty.totalVotes) }}</p>
        <p class="lead-info">Lead: {{ formatVotes(largestParty.totalVotes - secondLargestParty.totalVotes) }} votes</p>
      </div>
      <div class="third-place">
        <img v-if="getPartyLogo(thirdLargestParty.name)" :src="getPartyLogo(thirdLargestParty.name)"
             alt="3rd Place Logo"
             class="party-logo"/>
        <h3>3rd Place</h3>
        <h2>{{ thirdLargestParty.name }}</h2>
        <p>Votes: {{ formatVotes(thirdLargestParty.totalVotes) }}</p>
      </div>
    </div>

    <!-- Grafiek -->
    <div class="chart-wrapper bar-chart">
      <canvas id="votesBarChart"></canvas>
    </div>
    <button class="navigation-btn" @click="navigateToVotesPerParty">View total votes</button>
  </div>
</template>

<script>
import {Chart} from "chart.js";
import VotesAdapter from "../adapters/VotesAdapter";
import {API_URL} from "@/config";

export default {
  name: "VotesPerLocation",
  data() {
    return {
      constituencies: [],
      selectedConstituency: "",
      parties: [],
      largestParty: {name: '', totalVotes: 0},
      secondLargestParty: {name: '', totalVotes: 0},
      thirdLargestParty: {name: '', totalVotes: 0},
      barChart: null,
      // url: "${API_URL}",
    };
  },

  async mounted() {
    await this.fetchConstituencies();
    if (this.constituencies.length > 0) {
      this.selectedConstituency = this.constituencies[0];
      this.fetchVotesPerParty();
    }
  },
  methods: {
    navigateToVotesPerParty() {
      this.$router.push({name: "VotesPerParty"});
    },

    async fetchVotesPerParty() {
      try {
        const votesAdapter = new VotesAdapter(this.url)
        const parties = await votesAdapter.fetchVotesPerParty(this.selectedConstituency)
        this.parties = parties;
        this.updateTopThreeParties();
        this.renderCharts()
      } catch (error) {
        console.error("Error fetching votes per party:", error);
      }

    },
    async fetchConstituencies() {
      try {
        const response = await fetch(`${API_URL}/api/election-results/constituencies`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        this.constituencies = await response.json();
      } catch (error) {
        console.error("Error fetching constituencies:", error);
      }
    },

    updateTopThreeParties() {
      const sortedParties = [...this.parties];
      this.largestParty = sortedParties[0] || {name: '', totalVotes: 0,};
      this.secondLargestParty = sortedParties[1] || {name: '', totalVotes: 0,};
      this.thirdLargestParty = sortedParties[2] || {name: '', totalVotes: 0,};
    },

    getPartyLogo(partyName) {
      const logos = {
        SP: require("@/assets/party/sp.png"),
      };
      return logos[partyName] || null;
    },

    renderCharts() {
      this.renderBarChart();
    },

    renderBarChart() {
      const ctx = document.getElementById("votesBarChart").getContext("2d");
      if (this.barChart) this.barChart.destroy();
      this.barChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: this.parties.map((party) => party.name),
          datasets: [
            {
              label: "Votes",
              data: this.parties.map((party) => party.totalVotes),
              backgroundColor: this.parties.map(() => `hsl(${Math.random() * 360}, 70%, 50%)`),
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {display: false},
          },
          scales: {
            y: {beginAtZero: true},
          },
        },
      });
    },

    formatVotes(votes) {
      return votes.toLocaleString();
    },
  }
}

</script>

<style scoped>
.votes-per-location {
  margin: 20px;
  text-align: center;
}

.navigation-btn {
  display: block;
  margin: 0 auto 20px;
  padding: 15px 30px;
  background-color: #ec7700;
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 18px;
  cursor: pointer;
  font-weight: bold;
}

.navigation-btn:hover {
  background-color: #c26200;
}

.podium {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 20px;
  margin-bottom: 30px;
}

.first-place {
  width: 25vw;
  padding: 1%;
  background-color: gold;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.second-place {
  width: 20vw;
  padding: 1%;
  background-color: silver;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.third-place {
  width: 15vw;
  padding: 1%;
  background-color: #cd7f32;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}


.bar-chart {
  width: 100%;
  max-width: 1500px;
  height: 800px;
  margin: 30px auto;
}

.dropdown-container {
  margin: 20px auto;
  text-align: center;
  width: 15vw;
  height: 4vh;
  font-size: 180%;
}
</style>