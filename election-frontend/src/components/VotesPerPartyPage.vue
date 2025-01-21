<template>
  <div class="votes-per-party">
    <!-- Button voor alle partijen bovenaan -->
    <button class="view-all-parties-btn" @click="navigateToParties">View All Parties</button>

    <h1>Votes Per Party</h1>

    <!-- Podium voor top 3 winnaars -->
    <div class="podium">
      <div class="second-place">
        <img v-if="getPartyLogo(secondLargestParty.name)" :src="getPartyLogo(secondLargestParty.name)" alt="2nd Place Logo" class="party-logo" />
        <h3>2nd Place</h3>
        <h2>{{ secondLargestParty.name }}</h2>
        <p>Votes: {{ formatVotes(secondLargestParty.totalVotes) }}</p>
        <p>Seats: {{ secondLargestParty.seats }}</p>
      </div>
      <div class="first-place">
        <img v-if="getPartyLogo(largestParty.name)" :src="getPartyLogo(largestParty.name)" alt="1st Place Logo" class="party-logo" />
        <h3>1st Place</h3>
        <h2>{{ largestParty.name }}</h2>
        <p>Votes: {{ formatVotes(largestParty.totalVotes) }}</p>
        <p>Seats: {{ largestParty.seats }}</p>
        <p class="lead-info">Lead: {{ formatVotes(largestParty.totalVotes - secondLargestParty.totalVotes) }} votes</p>
      </div>
      <div class="third-place">
        <img v-if="getPartyLogo(thirdLargestParty.name)" :src="getPartyLogo(thirdLargestParty.name)" alt="3rd Place Logo" class="party-logo" />
        <h3>3rd Place</h3>
        <h2>{{ thirdLargestParty.name }}</h2>
        <p>Votes: {{ formatVotes(thirdLargestParty.totalVotes) }}</p>
        <p>Seats: {{ thirdLargestParty.seats }}</p>
      </div>
    </div>

    <!-- Grafiek -->
    <div class="chart-wrapper bar-chart">
      <canvas id="votesBarChart"></canvas>
    </div>

    <!-- Diagram -->
    <div class="chart-wrapper doughnut-chart">
      <canvas id="votesDoughnutChart"></canvas>
    </div>
    <button class="view-all-parties-btn" @click="navigateToLocationVotes">View votes for specific locations</button>
  </div>
</template>

<script>
import { Chart } from "chart.js";
import {API_URL} from "@/config";

export default {
  name: "VotesPerPartyPage",
  data() {
    return {
      parties: [],
      largestParty: { name: '', totalVotes: 0, seats: 0 },
      secondLargestParty: { name: '', totalVotes: 0, seats: 0 },
      thirdLargestParty: { name: '', totalVotes: 0, seats: 0 },
      barChart: null,
      doughnutChart: null,
    };
  },

  mounted() {
    this.fetchVotesPerParty();
  },

  methods: {

    navigateToParties() {
      this.$router.push({ name: "AllPartiesComponent" });
    },
    navigateToLocationVotes(){
      this.$router.push({ name: "VotesPerLocation" });
    },

    async fetchVotesPerParty() {
      try {
        const response = await fetch(`${API_URL}/api/election-results/votes-per-party`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        const totalVotes = data.reduce((sum, party) => sum + party.totalVotes, 0);
        const totalSeats = 150;
        const kiesdeler = Math.floor(totalVotes / totalSeats);

        this.parties = data.map((party) => ({
          name: party.name,
          totalVotes: party.totalVotes,
          seats: Math.floor(party.totalVotes / kiesdeler),
        })).sort((a, b) => b.totalVotes - a.totalVotes);

        this.updateTopThreeParties();
        this.$nextTick(() => this.renderCharts());
      } catch (error) {
        console.error("Error fetching votes per party:", error);
      }
    },

    updateTopThreeParties() {
      const sortedParties = [...this.parties];
      this.largestParty = sortedParties[0] || { name: '', totalVotes: 0, seats: 0 };
      this.secondLargestParty = sortedParties[1] || { name: '', totalVotes: 0, seats: 0 };
      this.thirdLargestParty = sortedParties[2] || { name: '', totalVotes: 0, seats: 0 };
    },

    getPartyLogo(partyName) {
      const logos = {
        SP: require("@/assets/party/sp.png"),
      };
      return logos[partyName] || null;
    },

    renderCharts() {
      this.renderBarChart();
      this.renderDoughnutChart();
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
            legend: { display: false },
          },
          scales: {
            y: { beginAtZero: true },
          },
        },
      });
    },

    renderDoughnutChart() {
      const ctx = document.getElementById("votesDoughnutChart").getContext("2d");
      if (this.doughnutChart) this.doughnutChart.destroy();
      this.doughnutChart = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: this.parties.map((party) => party.name),
          datasets: [
            {
              data: this.parties.map((party) => party.totalVotes),
              backgroundColor: this.parties.map(() => `hsl(${Math.random() * 360}, 70%, 50%)`),
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {position: "bottom"},
          },
        },
      });
    },
    formatVotes(votes) {
      return votes.toLocaleString();
    },
  },
};
</script>

<style scoped>
.votes-per-party {
  margin: 20px;
  text-align: center;
}

.view-all-parties-btn {
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

.view-all-parties-btn:hover {
  background-color: #c26200;
}

.podium {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.first-place {
  width: 350px;
  padding: 20px;
  background-color: #FFD700;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.second-place {
  width: 270px;
  height: 130px;
  font-size: 0.8rem;
  padding: 15px;
  background-color: silver;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.third-place {
  width: 250px;
  padding: 10px;
  font-size: 1rem;
  background-color: #cd7f32;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.party-logo {
  width: 80px;
  margin-bottom: 10px;
}

.bar-chart {
  width: 75%;
  max-width: 1500px;
  height: 700px;
  margin: 30px auto;
}

.doughnut-chart {
  width: 100%;
  max-width: 800px;
  height: 400px;
  margin: 30px auto;
}

@media (max-width: 768px) {
  .first-place {
    width: 100%;
    margin-bottom: 20px;
  }

  .second-place, .third-place {
    width: 100%;
  }

  .bar-chart {
    width: 100%;
    max-width: 1500px;
    height: 400px;
    margin: 30px auto;
  }
}
</style>
