<template>
  <div class="container">
    <h1 :class="title">Choose Your Political Party for More Information</h1>
    <div class="intro">
      <h2 class="text">Welcome! On this page, you can easily learn more about the
        different political parties in our country. Whether you're
        interested in their policies, vision, or election programs,
        we've gathered everything for you.</h2>
      <h2 class="text">
        Already have a party in mind? Discover everything about
        their policies and plans by simply clicking on the party
        of your choice!
      </h2>
    </div>
    <div class="party-container">
      <div v-for="party in parties" :key="party.id" class="party-box">
        <img class="image" :src="party.image" :alt="party.name"/>
        <div class="button" @click="redirectToPartyDetail(party)">More Info</div>
      </div>
    </div>
    <div class="navigation">
      <div @click="previousPage" class="button" :class="{ disabled: currentPage === 0 }">
        Previous page
      </div>
      <div v-for="page in totalPages" :key="page" class="page-number"
           :class="{ active: page - 1 === currentPage }"
           @click="goToPage(page - 1)">
        {{ page }}
      </div>
      <div @click="nextPage" class="button"
           :class="{ disabled: (currentPage + 1) * partiesPerPage >= parties.length }">
        Next page
      </div>
    </div>
  </div>
</template>

<script>
import PartyAdapter from '../adapters/PartyAdapter.js';

export default {
  name: "AllPartiesComponent",
  data() {
    return {
      title: 'title',
      currentPage: 0,
      partiesPerPage: 9,
      parties: [],
      totalPages: 0,
      url: "http://167.71.15.21/:8084",
    };
  },
  methods: {
    redirectToPartyDetail(party) {
      this.$router.push({
        name: 'PartyDetail',
        params: {partyId: party.id},
        query: {description: party.description, importantPoints: JSON.stringify(party.importantPoints)},
      });
    },
    async goToPage(page) {
      if (page >= 0 && page < this.totalPages) {
        this.currentPage = page;
        await this.loadParties();
      }
    },
    async nextPage() {
      if (this.currentPage + 1 < this.totalPages) {
        this.currentPage++;
        await this.loadParties();
      }

    },
    async previousPage() {
      if (this.currentPage > 0) {
        this.currentPage--;
        await this.loadParties();
      }
    },

    async loadParties() {
      const adapter = new PartyAdapter(this.url);
      const response = await adapter.getParties(this.currentPage, this.partiesPerPage);
      this.parties = response.parties;
      this.totalPages = response.totalPages;

    },
  },
  async mounted() {
    await this.loadParties();
  },
};
</script>
<style scoped>

.container {
  display: flex;
  align-items: center;
  flex-direction: column;
  margin: 10% auto;
  width: 50%;
  height: 100%;

}

.intro {
  display: flex;
  flex-direction: column;
  color: #17003C;
  width: 80%;
}


.text {
  display: flex;
  margin-top: 1%;
  color: #17003C;
  font-size: 2vh;
}

.party-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
}

.party-box {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: center;
  border-radius: 8%;
  height: 26vh;
  width: 20vh;
  margin: 3%;
  background-color: #efefef;
  color: white;
  border: solid #afafaf .2rem;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;


}

.button {
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  background-color: #FF9900;
  border: 0.3vh #9F6000 solid;
  border-radius: 25px;
  height: 12%;
  width: 70%;
  font-size: 1.5vh;
  font-weight: 500;
  text-transform: uppercase;
  transition: background-color 0.3s ease, border-color 0.3s ease;
  cursor: pointer;
}

.button:hover {
  background-color: #9F6000;
  border: 0.3vh #FF9900 solid;
}

.image {
  height: 7vh;
  width: 100%;
  margin-top: 30%;
  margin-bottom: 30%;
  object-fit: contain;
}

.navigation {
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 20vw;
  height: 30vh;
}

.page-number {
  margin: 5px 5px;
  cursor: pointer;
  transition: color 0.3s, color 0.3s;
}

.page-number:hover {
  color: #FF9900;
}

.page-number.active {
  color: #000000;
  font-weight: bold;
}

* {
  font-family: "Outfit", sans-serif;
  font-optical-sizing: auto;
  font-style: normal;
}
</style>