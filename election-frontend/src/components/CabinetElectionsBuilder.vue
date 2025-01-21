<template>
  <div class="cabinet-builder">
    <h2>Verkiezingen 2023 - Kabinet Bouwer</h2>

    <div class="content">
      <!-- Cabinet Seating Layout -->
      <div class="seating-chart">
        <h3>Kabinet Zittingsopstelling</h3>
        <div class="seats-container">
          <div
              v-for="(seat, index) in totalSeats"
              :key="index"
              :style="{ backgroundColor: getSeatColor(index) }"
              class="seat"
          ></div>
        </div>
      </div>

      <!-- Cabinet Controls -->
      <div class="controls">
        <h3>Cabinet Samenstellen</h3>
        <div class="party-selector">
          <label>Selecteer een partij:</label>
          <select v-model="selectedParty">
            <option v-for="party in parties" :key="party.name" :value="party.name">{{ party.name }}</option>
          </select>
          <button @click="addToCabinet">Voeg toe aan kabinet</button>
        </div>

        <h3>Cabinet Lijst</h3>
        <ul class="cabinet-list">
          <li v-for="party in cabinet" :key="party.name">
            {{ party.name }} - {{ party.seats }} zetels
            <button @click="removeFromCabinet(party)">Verwijder</button>
          </li>
        </ul>

        <h4>Totaal aantal zetels in het kabinet: {{ currentSeats }}</h4>
        <p v-if="currentSeats >= 76" class="majority">Meerderheid bereikt!</p>
        <p v-if="currentSeats > seatLimit" class="error">Maximum aantal zetels overschreden!</p>

        <!-- Reset Button -->
        <button @click="resetCabinet" class="reset-button">Reset Kabinet</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CabinetBuilder',
  data() {
    return {
      parties: [
        { name: 'VVD', seats: 34, color: '#ff6384' },
        { name: 'D66', seats: 24, color: '#36a2eb' },
        { name: 'PvdA', seats: 15, color: '#ffce56' },
        { name: 'GroenLinks', seats: 14, color: '#4bc0c0' },
        { name: 'PVV', seats: 20, color: '#9966ff' },
        { name: 'FvD', seats: 10, color: '#ff9f40' },
        { name: 'SP', seats: 9, color: '#c45850' },
        { name: 'CDA', seats: 14, color: '#8e5ea2' },
        { name: 'ChristenUnie', seats: 8, color: '#3cba9f' },
        { name: 'Partij voor de Dieren', seats: 5, color: '#e8c3b9' },
        { name: 'DENK', seats: 3, color: '#c45850' },
        { name: 'JA21', seats: 3, color: '#ff6384' },
        { name: 'SGP', seats: 3, color: '#36a2eb' },
        { name: 'Volt', seats: 2, color: '#ffce56' }
      ],
      selectedParty: null,
      cabinet: [],
      seatLimit: 150 // Maximum aantal zetels
    };
  },
  computed: {
    currentSeats() {
      return this.cabinet.reduce((total, party) => total + party.seats, 0);
    },
    totalSeats() {
      return 150; // Aantal zetels in de Tweede Kamer
    }
  },
  methods: {
    getSeatColor(index) {
      let seatIndex = 0;
      for (const party of this.cabinet) {
        if (index >= seatIndex && index < seatIndex + party.seats) {
          return party.color;
        }
        seatIndex += party.seats;
      }
      return '#ccc'; // Grijze kleur voor lege stoelen
    },
    addToCabinet() {
      if (this.selectedParty) {
        const party = this.parties.find(p => p.name === this.selectedParty);
        if (!this.cabinet.includes(party) && this.currentSeats + party.seats <= this.seatLimit) {
          this.cabinet.push(party);
        }
      }
    },
    removeFromCabinet(party) {
      this.cabinet = this.cabinet.filter(p => p.name !== party.name);
    },
    resetCabinet() {
      this.cabinet = [];
    }
  }
};
</script>

<style scoped>
html, body {
  height: 100%;
  overflow-y: auto;
}

.cabinet-builder {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 1200px;
  margin: 0 auto;
  margin-top: 10%;
}

.content {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  gap: 40px;
}

.seating-chart {
  width: 500px;
}

.seats-container {
  display: grid;
  grid-template-columns: repeat(15, 1fr); /* Layout in een 15x10 rooster */
  gap: 4px;
  padding: 10px;
  border: 2px solid #ddd;
  border-radius: 10px;
}

.seat {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #ccc; /* Startkleur: grijs */
}

.controls {
  width: 300px;
}

.party-selector {
  margin-bottom: 20px;
}

button {
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #FF9900;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.cabinet-list {
  list-style-type: none;
  padding: 0;
}

.cabinet-list li {
  font-size: 18px;
  margin: 5px 0;
}

.majority {
  color: green;
  font-weight: bold;
  font-size: 20px;
}

.error {
  color: red;
  font-weight: bold;
  font-size: 16px;
}

.reset-button {
  background-color: #ff6347;
}
</style>
