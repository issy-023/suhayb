<template>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&family=Roboto:wght@400;700&display=swap" rel="stylesheet">

  <div>


    <div class="cta-section section-one">
      <div class="cta-text">
        <h1>Join the conversation <br> on the elections, your <br> voice matters here!</h1>
        <h3>Chat online with people from around the
          <br> world about different political parties
          <br> and elections. Share opinions, discuss
          <br> policies, and stay informed in real-time
          <br> with a global community!</h3>
        <button class="cta-button1" @click="navigateToVotesChatPage">JOIN THE DISCUSSION</button>
      </div>
      <div class="cta-item">
        <img src="@/assets/Phone-Comment-Text-3--Streamline-Ux.svg" alt="Afbeelding 1">
      </div>
    </div>

    <div class="cta-section section-two">
      <div class="cta-text2">
        <h1>Discover key insights on <br> all participating parties <br> in one place!</h1>
        <h3> View realtime election results along with
          <br> historical data from previous years. Track
          <br> party performance, compare trends, and
          <br> stay informed with up-to-date insights!</h3>
        <button class="cta-button" @click="navigateToEveryParty">LEARN ABOUT THEIR POSITIONS</button>
      </div>
      <div class="cta-item1">
        <img src="@/assets/Spokeperson-5--Streamline-Ux%201.svg" alt="Afbeelding 2">
      </div>
    </div>

    <div class="cta-section section-three">
      <div class="cta-text3">
        <h1>Stay updated with <br> the latest election<br> results, right at your fingertips!</h1>
        <h3> Find detailed information on all
          <br> participating parties, learn about their
          <br> positions, and easily compare them to
          <br> make informed decisions.</h3>
        <button class="cta-button2" @click="navigateToVotesPerParty">COMPARE PARTIES NOW</button>
      </div>
      <div class="cta-item2">
        <img src="@/assets/Podium-Presentation-4--Streamline-Ux.svg" alt="Afbeelding 3">
      </div>
    </div>

  </div>

</template>

<script>
export default {
  name: 'HomePage',

  methods: {
    navigateToVotesPerParty() {
      this.$router.push({ name : "VotesPerParty"})
    },

    navigateToVotesChatPage() {
      this.$router.push({ name : "LiveChatPage"})
    },

    navigateToEveryParty() {
      this.$router.push({ name : "EveryParty"})
    }
  }
}

</script>

<style scoped>
/* Algemene stijlen */
* {
  font-family: "Outfit", sans-serif;
  font-optical-sizing: auto;
  font-style: normal;
}

h1 {
  font-weight: 700;
  font-size: 52px;
  color: #17003C;
}

h3 {
  font-family: Arial;
  font-weight: lighter;
  font-size: 24px;
  color: #17003C;
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
  color: #FF9900;
}

.navbar ul {
  display: flex;
  list-style-type: none;
  justify-content: flex-end;
  margin: 0;
  padding-right: 5%;
  flex: 1;
  text-align: center;
}

.navbar ul li {
  margin: 0 0.5rem;
}

.navbar ul li a {
  color: white;
  text-decoration: none;
  font-size: 24px;
  padding: 0.5rem 1rem;
  display: block;
  transition: color 0.3s ease;
  cursor: pointer;
}

.navbar ul li a:hover {
  color: #FF9900;
}

/* Secties */
.cta-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6rem 2rem 2rem;
  flex-wrap: wrap;
}


.cta-text, .cta-text2, .cta-text3 {
  display: flex;
  flex-direction: column;
  text-align: left;
  margin: 0 50px;
  max-width: 100%;
  margin-top: 20px;
}

.cta-item img, .cta-item1 img, .cta-item2 img {
  width: 100%;
  height: 650px;
  max-width: 650px;
  margin: 0 auto;
  object-fit: cover;
}

/* Knoppen */
.cta-button, .cta-button1, .cta-button2 {
  background-color: #FF9900;
  color: white;
  border: 8px solid #17003C; /* Border iets dikker */
  padding: 1rem 1.5rem; /* Grotere padding zorgt voor grotere knoppen */
  font-size: 1.8rem; /* Vergroot de tekst in de knop */
  cursor: pointer;
  transition: background-color 0.3s ease, border-color 0.3s ease;
  border-radius: 100px;
  font-weight: 550;
  max-width: 350px; /* Vergroot de breedte */
  margin: 5rem auto; /* Zorg voor meer verticale afstand boven/onder */
}



.cta-button:hover, .cta-button1:hover, .cta-button2:hover {
  background-color: #17003C;
  border-color: #FF9900;
}

/* Mediavragen */
@media (max-width: 768px) {
  .navbar-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .navbar ul {
    padding-right: 0;
    flex-direction: column;
  }

  .navbar ul li {
    margin: 0.5rem 0;
  }

  h1 {
    font-size: 36px;
  }

  h3 {
    font-size: 18px;
  }

  .cta-section {
    flex-direction: column;
    text-align: center;
    padding: 3rem 1rem;
  }

  .cta-text, .cta-text2, .cta-text3 {
    margin: 0 auto;
  }

  .cta-item img, .cta-item1 img, .cta-item2 img {
    max-width: 300px;
    margin-bottom: 1rem;
    width: 100%;
    height: 300px;
  }

  .cta-button, .cta-button1, .cta-button2 {
    font-size: 1rem;
    padding: 0.5rem 1rem;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 28px;
  }

  h3 {
    font-size: 16px;
  }

  .cta-button, .cta-button1, .cta-button2 {
    font-size: 0.9rem;
    padding: 0.4rem 0.8rem;
    max-width: 250px;
  }
}


</style>
