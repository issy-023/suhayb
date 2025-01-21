<template>
  <div id="stemgids" class="book-container">
    <div v-if="currentPage === 'cover'" class="cover">
      <h1>The Vote Guide</h1>
      <p>
        Hello there! My name is Votee, nice to meet you!<br>
        First-time voting can be very exciting and sometimes even scary...<br>
        Don't worry, I got you! <br>
        From now on, I will accompany you through your first time voting!
      </p>
      <img src="@/assets/stemmi-removebg-preview.png" alt="Mascotte" class="mascotte2" />
      <button @click="openBook" class="start-button">Start</button>
    </div>

    <div v-else class="book" :class="{ open: isBookOpen }">
      <div class="page">
        <h2 v-if="currentStep === 0">Step 1: Check Your Mail: Your Voting Pass Has Arrived!</h2>
        <h2 v-if="currentStep === 1">Step 2: Look at the Candidate List</h2>
        <h2 v-if="currentStep === 2">Step 3: Be Prepared</h2>
        <h2 v-if="currentStep === 3">Step 4: Head to the Polling Station</h2>
        <h2 v-if="currentStep === 4">Step 5: In the Voting Booth</h2>
        <h2 v-if="currentStep === 5">Step 6: Submit Your Vote</h2>
        <h2 v-if="currentStep === 6">Some Handy Tips</h2>

        <img v-if="currentStep === 0" src="@/assets/brievenbus.png" alt="Step 1 image" class="step-image" />
        <img v-if="currentStep === 1" src="@/assets/stembrief.png" alt="Step 2 image" class="step-image" />
        <img v-if="currentStep === 2" src="@/assets/checklist.png" alt="Step 3 image" class="step-image" />
        <img v-if="currentStep === 3" src="@/assets/medewerker.png" alt="Step 4 image" class="step-image" />
        <img v-if="currentStep === 4" src="@/assets/keuze-maken.png" alt="Step 5 image" class="step-image" />
        <img v-if="currentStep === 5" src="@/assets/stembox.png" alt="Step 6 image" class="step-image" />


        <p v-if="currentStep === 0">
          A few weeks before the election, you’ll receive a voting pass in the mail. This pass is essential because it’s your ticket to vote. Without it, you won’t be able to participate.
          Your voting pass will have your name, personal details, and information about where you can vote. Typically, you can vote at any polling station in your municipality, but double-check to be sure! <br>
          <h3>Important:</h3> Keep this pass safe and accessible. Misplacing it might prevent you from voting unless you request a replacement in time.
        </p>
        <p v-if="currentStep === 1">
          Shortly after receiving your voting pass, you’ll also get a list of all the political parties and their candidates. This document is a handy overview of your options.
          Take your time to review the parties and candidates. If you’re unsure who to vote for, use online tools like voting guides to help you compare platforms and values. These tools ask you questions about your opinions on key issues and recommend the parties that align with your views.<br>
          <h3>Tip:</h3> Visit the social media pages or official websites of parties and candidates. They often share detailed plans and updates that can help you make an informed choice.
        </p>
        <p v-if="currentStep === 2">
          Preparation is key to a smooth voting experience. Here’s what you need:<br>
          - Your voting pass: Ensure it’s in good condition and readily available.<br>
          - A valid ID: Accepted forms include a passport, ID card, or driver’s license. It can even be up to 5 years expired, so don’t worry if it’s not brand new.<br>
          Think ahead about which polling station you’ll visit. Choose one that’s convenient, whether it’s near your home, workplace, or school. Check the opening hours and plan your visit to avoid peak times if possible.
        </p>
        <p v-if="currentStep === 3">
          On election day, it’s time to head to the polling station. Remember, you can only vote on the date specified on your voting pass.
          Here’s what happens when you arrive:<br>
          - A friendly staff member will greet you and ask for your voting pass and ID. They’ll verify your details to ensure everything is in order.<br>
          - Once approved, you’ll receive a ballot. Take a moment to review it before heading to the voting booth.
        </p>
        <p v-if="currentStep === 4">
          This is the moment you’ve been waiting for—casting your vote!<br>
          - Enter an available voting booth. Don’t rush; take your time to make your decision.<br>
          - Use the red pencil provided to mark one box next to the candidate of your choice. Remember, you can only choose one candidate. Marking multiple boxes will invalidate your vote.<br>
          - Fold your ballot carefully to ensure your vote remains private. Privacy is a fundamental part of the voting process.
        </p>
        <p v-if="currentStep === 5">
          After voting, you’ll need to submit your ballot to officially complete the process.<br>
          - Locate the ballot box near the exit of the polling station. Drop your folded ballot inside.<br>
          - That’s it! You’ve successfully voted and played your part in shaping the future. Congratulations on making your voice heard! 🎉
        </p>
        <p v-if="currentStep === 6">
          Voting is a powerful way to influence decisions that affect you and your community. Here are some additional tips:<br>
          - If you’re unsure about any step, ask the polling station staff. They’re there to help but won’t influence your choice.<br>
          - Can’t vote in person? Authorize someone you trust to vote on your behalf. You can do this by filling out the back of your voting pass.<br>
          - Stay informed about the key issues and proposals that matter to you. This makes your vote even more impactful.
        </p>

        <div class="navigation">
          <button v-if="currentStep > 0" @click="prevStep" class="nav-button">⬅ Back</button>
          <button v-if="currentStep < 6" @click="nextStep" class="nav-button">➡ Next</button>
          <button v-else @click="closeBook" class="nav-button">📕 Close</button>
        </div>

        <img src="@/assets/stemmi-removebg-preview.png" alt="Mascotte" class="mascotte" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentPage: "cover",
      isBookOpen: false,
      currentStep: 0,
    };
  },
  methods: {
    openBook() {
      this.isBookOpen = true;
      this.currentPage = "book";
    },
    closeBook() {
      this.isBookOpen = false;
      this.currentPage = "cover";
      this.currentStep = 0;
    },
    nextStep() {
      if (this.currentStep < 6) {
        this.currentStep++;
      }
    },
    prevStep() {
      if (this.currentStep > 0) {
        this.currentStep--;
      }
    },
  },
};
</script>

<style scoped>
.book-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f4f4f4;
  font-family: Arial, sans-serif;
}

.cover {
  text-align: center;
  border: 5px solid #333;
  padding: 20px;
  background-color: #fdf3e6;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  width: 50%;
  max-width: 600px;
  height: 80%;
  max-height: 800px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
}

.start-button {
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 18px;
  background-color: #FF9900;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.start-button:hover {
  background-color: #17003C;
}

.book {
  width: 50%;
  max-width: 600px;
  height: 80%;
  max-height: 800px;
  background-color: #fff;
  border: 5px solid #333;
  padding: 20px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
}

.page {
  flex: 1;
  text-align: center;
  background-color: #fefefe;
  padding: 20px;
  border-radius: 10px;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.1);
}

.step-image {
  max-width: 70%;
  max-height: 40%;
  margin: 20px auto;
  object-fit: cover;
}

.navigation {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

.nav-button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #FF9900;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.nav-button:hover {
  background-color: #17003C;
}

.mascotte {
  position: absolute;
  bottom: 10px;
  right: 10px;
  max-width: 120px;
}

.mascotte2 {
  width: 300px;
}

/* Media Queries voor schermen kleiner dan 768px */
@media (max-width: 768px) {
  .cover,
  .book {
    width: 90%; /* Gebruik bijna de volledige breedte */
    max-width: none; /* Beperk max-breedte niet */
    padding: 15px; /* Verminder padding */
  }

  .start-button,
  .nav-button {
    font-size: 14px; /* Kleiner lettertype voor knoppen */
    padding: 8px 16px; /* Iets minder padding op knoppen */
  }

  .page {
    padding: 15px; /* Minder padding in de pagina */
  }

  .step-image {
    max-width: 100%; /* Zorg dat afbeeldingen volledig zichtbaar blijven */
    height: auto; /* Verhoudingen behouden */
    margin: 15px auto; /* Minder ruimte rondom afbeeldingen */
  }

  .mascotte {
    max-width: 80px; /* Verklein mascotte */
  }

  .mascotte2 {
    width: 70%; /* Pas grootte van mascotte2 aan */
  }
}

/* Media Queries voor schermen kleiner dan 480px */
@media (max-width: 480px) {
  .cover,
  .book {
    width: 100%; /* Gebruik de volledige breedte van het scherm */
    padding: 10px; /* Nog minder padding */
  }

  .start-button,
  .nav-button {
    font-size: 12px; /* Nog kleiner lettertype voor knoppen */
    padding: 6px 12px; /* Compactere knoppen */
  }

  .page {
    padding: 10px; /* Minimaliseer padding in de pagina */
  }

  .step-image {
    max-width: 100%; /* Volledige breedte voor afbeeldingen */
    height: auto; /* Houd verhoudingen */
  }

  .navigation {
    flex-wrap: wrap; /* Knoppen naar een nieuwe regel laten gaan indien nodig */
    gap: 5px; /* Minder ruimte tussen knoppen */
  }

  .mascotte {
    display: none; /* Verberg mascotte als het scherm erg klein is */
  }

  .mascotte2 {
    width: 60%; /* Kleinere mascotte2 */
  }
}

</style>
