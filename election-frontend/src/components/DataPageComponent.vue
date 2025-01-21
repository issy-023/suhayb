<template>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&family=Roboto:wght@400;700&display=swap"
        rel="stylesheet">
  <div>
    <h1>Election Results</h1>

    <div class="button-container">
      <button @click="showCurrentResults" class="switch-button">Huidige Verkiezingsuitslagen</button>
      <button @click="showCandidateResults" class="switch-button">Stemmen per Kandidaat</button>
      <button @click="showConstituencyResults" class="switch-button">Uitslagen per Kiesdistrict</button>
    </div>

    <div v-if="currentView === 'candidateResults'" class="winner-list">
      <h2>Stemmen per Kandidaat</h2>
      <ul class="winner-list-container">
        <li v-for="(candidate, index) in candidateResults" :key="candidate.naam" class="winner-item">
          <div @click="toggleDetails(index)" class="winner-details">
            <strong>{{ candidate.naam }}</strong>
            <span>{{ candidate.partij }} - {{ candidate.stemmen }} stemmen</span>
          </div>

          <div v-if="candidate.showDetails" class="extra-info">
            <p>{{ candidate.extraInfo }}</p>
          </div>
        </li>
      </ul>
    </div>


    <div v-else-if="currentView === 'currentResults'" class="chart-container">
      <h2>Huidige Verkiezingsuitslagen - Zetels per Partij</h2>
      <canvas ref="currentResultsChart"></canvas>
    </div>

    <div v-else-if="currentView === 'constituencyResults'" class="chart-container">
      <h2>Uitslagen per Kiesdistrict</h2>

      <!-- Dropdown menu for selecting a district -->
      <div class="dropdown-container">
        <label for="districtSelect">Selecteer een kiesdistrict:</label>
        <select v-model="selectedDistrict" @change="renderConstituencyChart">
          <option v-for="(district, index) in districts" :key="index" :value="district">
            {{ district.name }}
          </option>
        </select>
      </div>

      <!-- Chart is displayed only after a district is selected -->
      <canvas v-if="selectedDistrict" ref="constituencyResultsChart"></canvas>
    </div>
  </div>
</template>

<script>
import {Chart, registerables} from 'chart.js';
import {nextTick} from 'vue';

Chart.register(...registerables);

export default {
  name: 'DataPage',
  data() {
    return {
      currentView: 'currentResults',
      chartInstance: null,
      selectedDistrict: null,  // Track selected district
      candidateResults: [
        {
          naam: 'Geert Wilders',
          partij: 'PVV',
          stemmen: 1100000, // Change zetels to stemmen
          extraInfo: 'Geert Wilders won met overtuiging met 1.1 miljoen stemmen in 2023.',
          showDetails: false,
        },
        {
          naam: 'Jesse Klaver',
          partij: 'GroenLinks-PvdA',
          stemmen: 800000,
          extraInfo: 'Jesse Klaver leidde de gezamenlijke lijst naar 800.000 stemmen.',
          showDetails: false,
        },
        {
          naam: 'Mark Rutte',
          partij: 'VVD',
          stemmen: 750000,
          extraInfo: 'Mark Rutte behaalde 750.000 stemmen voor de VVD.',
          showDetails: false,
        },
        {
          naam: 'Pieter Omtzigt',
          partij: 'Nieuw Sociaal Contract',
          stemmen: 600000,
          extraInfo: 'Nieuwkomer Pieter Omtzigt behaalde 600.000 stemmen.',
          showDetails: false,
        },
        {
          naam: 'Sigrid Kaag',
          partij: 'D66',
          stemmen: 300000,
          extraInfo: 'D66 onder leiding van Sigrid Kaag behaalde 300.000 stemmen.',
          showDetails: false,
        },
        {
          naam: 'Caroline van der Plas',
          partij: 'BBB',
          stemmen: 250000,
          extraInfo: 'Caroline van der Plas behaalde 250.000 stemmen voor de BBB.',
          showDetails: false,
        },
      ],

      districts: [
        {
          name: 'Amsterdam',
          results: { PVV: 20, 'GroenLinks-PvdA': 25, VVD: 15, 'Nieuw Sociaal Contract': 12, D66: 10 }
        },
        {
          name: 'Rotterdam',
          results: { PVV: 18, 'GroenLinks-PvdA': 20, VVD: 17, 'Nieuw Sociaal Contract': 13, D66: 11 }
        },
        {
          name: 'Den Haag',
          results: { PVV: 17, 'GroenLinks-PvdA': 19, VVD: 16, 'Nieuw Sociaal Contract': 14, D66: 12 }
        },
        {
          name: 'Utrecht',
          results: { PVV: 15, 'GroenLinks-PvdA': 17, VVD: 14, 'Nieuw Sociaal Contract': 13, D66: 11 }
        },
        {
          name: 'Eindhoven',
          results: { PVV: 12, 'GroenLinks-PvdA': 14, VVD: 13, 'Nieuw Sociaal Contract': 10, D66: 9 }
        },
        {
          name: 'Maastricht',
          results: { PVV: 9, 'GroenLinks-PvdA': 10, VVD: 12, 'Nieuw Sociaal Contract': 9, D66: 8 }
        }
      ]
    };
  },
  mounted() {
    this.renderChart();
  },
  watch: {
    currentView() {
      this.renderChart();
    }
  },
  methods: {
    renderChart() {
      nextTick(() => {
        if (this.currentView === 'currentResults') {
          const ctx = this.$refs.currentResultsChart?.getContext('2d');
          if (this.chartInstance) {
            this.chartInstance.destroy();
          }
          if (ctx) {
            this.chartInstance = new Chart(ctx, {
              type: 'bar',
              data: {
                labels: [
                  'PVV', 'GroenLinks-PvdA', 'VVD', 'Nieuw Sociaal Contract', 'D66',
                  'BBB', 'CDA', 'SP', 'FvD', 'PvdD', 'CU', 'SGP', 'DENK', 'Volt', 'JA21'
                ],
                datasets: [{
                  label: 'Aantal Zetels',
                  data: [37, 25, 24, 20, 9, 7, 5, 5, 3, 3, 3, 3, 3, 2, 1],
                  backgroundColor: [
                    '#003f7f', '#00a85a', '#ffcc00', '#8a2be2', '#f1c232',
                    '#228b22', '#0066ff', '#e30513', '#800000', '#ff69b4',
                    '#4b5320', '#b8860b', '#1c1c1c', '#660066', '#cc0000'
                  ],
                  borderColor: '#ffffff',
                  borderWidth: 2
                }]
              },
              options: {
                plugins: {
                  legend: {
                    labels: {
                      color: '#ffffff'
                    }
                  }
                },
                scales: {
                  x: {
                    ticks: {
                      color: '#ffffff'
                    }
                  },
                  y: {
                    ticks: {
                      color: '#ffffff' // Witte tekst voor y-as
                    }
                  }
                }
              }
            });
          }
        }
      });
    },
    renderConstituencyChart() {
      nextTick(() => {
        const ctx = this.$refs.constituencyResultsChart?.getContext('2d');
        if (this.chartInstance) {
          this.chartInstance.destroy(); // Vernietig de vorige grafiek indien aanwezig
        }
        if (ctx && this.selectedDistrict) {
          const districtResults = this.selectedDistrict.results;
          this.chartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: Object.keys(districtResults),
              datasets: [
                {
                  label: 'Aantal Zetels',
                  data: Object.values(districtResults),
                  backgroundColor: ['#003f7f', '#00a85a', '#ffcc00', '#8a2be2', '#f1c232'],
                  borderColor: '#ffffff',
                  borderWidth: 2
                }
              ]
            },
            options: {
              plugins: {
                legend: {
                  labels: {
                    color: '#ffffff' // Witte tekst voor labels
                  }
                }
              },
              scales: {
                x: {
                  ticks: {
                    color: '#ffffff' // Witte tekst voor x-as
                  }
                },
                y: {
                  ticks: {
                    color: '#ffffff' // Witte tekst voor y-as
                  }
                }
              }
            }
          });
        }
      });
    },
    toggleDetails(index) {
      // Wissel de waarde van showDetails om voor het geselecteerde item
      this.candidateResults[index].showDetails = !this.candidateResults[index].showDetails;
    },
    showCurrentResults() {
      this.currentView = 'currentResults';
    },
    showCandidateResults() {
      this.currentView = 'candidateResults';
    },
    showConstituencyResults() {
      this.currentView = 'constituencyResults';
    }
  }
}
</script>

<style scoped>
* {
  font-family: "Outfit", sans-serif;
  font-optical-sizing: auto;
  font-style: normal;
}

.chart-container, .winner-list {
  width: 90%;
  max-width: 930px;
  background-color: #17003C;
  padding: 20px;
  border-radius: 15px;
  border: 5px solid #FF9900;
  margin: 30px auto 120px auto;
}

h1 {
  text-align: center;
  margin: 150px 0 40px 0;
  color: #17003C;
}

.button-container {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 50px;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #ffffff;
}

.winner-list-container {
  padding: 0;
}

.winner-item {
  background-color: transparent;
  border: 3px solid #ffffff;
  padding: 15px;
  margin: 10px 0;
  border-radius: 8px;
  transition: background-color 0.3s ease;
  cursor: pointer;
  color: #ffffff;
}

.winner-item:hover {
  background-color: #FF9900;
  border: 3px solid #ffffff;
}

.winner-details {
  display: flex;
  justify-content: space-between;
  width: 100%;
  color: #ffffff;
}

.extra-info {
  padding: 10px 0;
  color: #ffffff;
  font-style: italic;
}

.switch-button {
  padding: 20px 40px;
  background-color: #17003C;
  color: white;
  border: 5px solid #FF9900;
  border-radius: 50px;
  cursor: pointer;
  font-size: 1.2em;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.switch-button:hover {
  background-color: #FF9900;
  border-color: #17003C;
  transform: scale(1.05);
}

.dropdown-container {
  margin: 20px auto;
  text-align: center;
  color:white;
}

select {
  padding: 10px;
  font-size: 1.2em;
  border-radius: 5px;
}
</style>