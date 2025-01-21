<template>
  <div class="party-overview">
    <h1>Party Overview</h1>
    <div class="party-grid">
      <div class="party-card" v-for="party in parties" :key="party.id">
        <img
            v-if="getPartyLogo(party.abbreviation)"
            :src="getPartyLogo(party.abbreviation)"
            alt="Party Logo"
            class="party-logo"
        />
        <h2>{{ party.name }}</h2>
        <router-link :to="{ name: 'PartyDetail', params: { partyId: party.id } }" class="details-button">
          View Details
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import {API_URL} from "@/config";

export default {
  name: "PartyOverviewComponent",
  data() {
    return {
      parties: []
    };
  },
  mounted() {
    this.fetchParties();
  },
  methods: {
    async fetchParties() {
      try {
        const response = await fetch(`${API_URL}/api/v1/parties/all`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        this.parties = await response.json();
      } catch (error) {
        console.error("Error fetching parties:", error);
      }
    },
    getPartyLogo(abbreviation) {
      const logos = {
        VVD: require("@/assets/party/vvd.png"),
        D66: require("@/assets/party/d66.png"),
        GLPvdA: require("@/assets/party/glpvda.png"),
        PVV: require("@/assets/party/pvv.png"),
        CDA: require("@/assets/party/cda.png"),
        SP: require("@/assets/party/sp.png"),
        PvdD: require("@/assets/party/pvdd.png"),
        CU: require("@/assets/party/cu.png"),
        VOLT: require("@/assets/party/volt.png"),
        BBB: require("@/assets/party/bbb.png"),
        JA21: require("@/assets/party/ja21.png"),
        DENK: require("@/assets/party/denk.png"),
        OPNL: require("@/assets/party/opnl.png"),
        NSC: require("@/assets/party/nsc.png"),
        SGP: require("@/assets/party/sgp.png"),
        "50Plus": require("@/assets/party/50plus.png")
      };

      return logos[abbreviation] || null;
    }
  }
};
</script>

<style scoped>
.party-overview {
  text-align: center;
  padding: 20px;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: #333;
}

.party-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  padding: 20px;
}

.party-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  padding: 20px;
  height: 250px; /* Verminder de hoogte */
  transition: transform 0.3s, box-shadow 0.3s;
}

.party-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

.party-logo {
  width: 100px;
  height: 100px;
  object-fit: contain;
  margin-bottom: 10px;
}

h2 {
  font-size: 1.2rem;
  margin: 10px 0;
  color: #444;
  text-align: center;
}

.details-button {
  display: inline-block;
  padding: 8px 12px;
  background-color: #ec7700;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-size: 0.9rem;
  transition: background-color 0.3s;
}

.details-button:hover {
  background-color: #c26200;
}
</style>
