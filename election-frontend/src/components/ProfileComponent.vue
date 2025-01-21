<template>
  <div class="page-container">
    <div v-if="loading" class="loading">Loading...</div>
    <div v-else>
      <div class="profile-form">
        <h1>{{ editMode ? 'Edit Profile' : user.username + "'s Profile" }}</h1>
        <form @submit.prevent="editMode ? updateProfile() : null">
          <div class="form-group full-width">
            <label for="username">Username:</label>
            <input type="text" id="username" v-model="user.username" :disabled="!editMode" />
          </div>
          <div class="form-group full-width">
            <label for="email">E-mail:</label>
            <input type="email" id="email" v-model="user.email" :disabled="!editMode" />
          </div>
          <div class="form-group full-width">
            <label for="dob">Date of Birth:</label>
            <input type="date" id="dob" v-model="user.dob" :disabled="!editMode" />
          </div>
          <div class="form-group full-width">
            <label for="gender">Gender:</label>
            <select id="gender" v-model="user.gender" :disabled="!editMode">
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div v-if="editMode" class="form-actions">
            <button type="submit">Save Changes</button>
            <button type="button" @click="cancelEdit">Cancel</button>
          </div>
        </form>
        <div v-if="!editMode" class="profile-actions">
          <button @click="editMode = true">Edit Profile</button>
          <button @click="deleteProfile" class="delete-button">Delete Profile</button>
        </div>

        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </div>
    </div>

    <!-- Popup -->
    <div v-if="showSuccessPopup" class="popup-overlay">
      <div class="popup">
        <h3>Profile Updated!</h3>
        <p>Your profile changes have been saved successfully.</p>
        <button @click="closePopup" class="popup-button">OK</button>
      </div>
    </div>
  </div>
</template>




<script>
import { API_URL } from "@/config";

export default {
  name: "ProfileComponent",
  data() {
    return {
      user: {
        username: "",
        email: "",
        dob: "",
        gender: ""
      },
      originalUser: {}, // To restore original data
      editMode: false,
      loading: true,
      errorMessage: "",
      showSuccessPopup: false, // Show popup for successful profile update
    };
  },
  async mounted() {
    const token = localStorage.getItem("token");
    if (!token) {
      this.errorMessage = "You are not logged in.";
      this.$router.push("/login");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/v1/User/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        this.user = await response.json();
        this.originalUser = JSON.parse(JSON.stringify(this.user)); // Copy original data
      } else {
        this.errorMessage = "Failed to load profile information.";
        if (response.status === 401) {
          this.$router.push("/login");
        }
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      this.errorMessage = "An error occurred while loading your profile.";
    } finally {
      this.loading = false;
    }
  },
  methods: {
    async updateProfile() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/api/v1/User/update`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(this.user)
        });

        if (response.ok) {
          this.showSuccessPopup = true; // Show popup on success
          this.editMode = false;
          this.originalUser = JSON.parse(JSON.stringify(this.user)); // Update original data
        } else {
          this.errorMessage = "Failed to update profile.";
        }
      } catch (error) {
        console.error("Error updating profile:", error);
        this.errorMessage = "An error occurred while updating your profile.";
      }
    },
    async deleteProfile() {
      const confirmed = confirm("Are you sure you want to delete your profile? This action cannot be undone.");
      if (!confirmed) return;

      try {
        const token = localStorage.getItem("token");
        const userId = this.user.id; // Ensure `user.id` is loaded correctly

        if (!userId) {
          this.errorMessage = "User ID is missing.";
          return;
        }

        const response = await fetch(`${API_URL}/api/v1/User/delete/${userId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          alert("Profile deleted successfully.");
          localStorage.removeItem("token");
          this.$router.push("/login");
        }
         else {
          this.errorMessage = "Failed to delete profile.";
        }
      } catch (error) {
        console.error("Error deleting profile:", error);
        this.errorMessage = "An error occurred.";
      }
    },
    cancelEdit() {
      this.user = JSON.parse(JSON.stringify(this.originalUser)); // Restore original data
      this.editMode = false;
    },
    closePopup() {
      this.showSuccessPopup = false;
    },
  },
};
</script>



<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');

* {
  font-family: 'Outfit', sans-serif;
  font-optical-sizing: auto;
  font-style: normal;
}

/* Algemene pagina styling */
.page-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f3f3f3;
}

/* Profielformulier container */
.profile-form {
  width: 500px; /* Breder formulier voor meer ruimte */
  padding: 40px;
  border: 2px solid #1a123b;
  border-radius: 15px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Koptekst styling */
h1 {
  color: #1a123b;
  text-align: center;
  margin-bottom: 30px;
  font-weight: 500;
}

/* Formulier styling */
form {
  display: flex;
  flex-direction: column;
  gap: 25px; /* Consistente ruimte tussen velden */
}

/* Input velden styling */
input,
select {
  width: 100%; /* Zorg ervoor dat alle velden even breed zijn */
  padding: 12px;
  border: 2px solid #1a123b;
  border-radius: 10px;
  font-size: 16px;
  color: #333;
  margin: 0; /* Verwijder onnodige marges */
}

/* Knoppen styling */
button {
  padding: 12px;
  background-color: #ff9933;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 16px;
  text-align: center;
}

button:hover {
  background-color: #e68a00;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

/* Bericht styling */
.error {
  color: red;
  text-align: center;
  margin-top: 15px;
}

.success {
  color: green;
  text-align: center;
  margin-top: 15px;
}

/* Popup styling */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  width: 300px;
}

.popup h3 {
  margin: 0 0 10px;
  font-size: 18px;
}

.popup p {
  margin: 0 0 20px;
  font-size: 16px;
}

.popup-button {
  background: #6db33f;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.popup-button:hover {
  background: #5a9e2c;
}

@media screen and (max-width: 730px) {
  .profile-form {
    width: 90%;
    padding: 20px;
  }
}

@media screen and (max-width: 480px) {
  .profile-form {
    width: 95%;
    padding: 15px;
  }

  h1 {
    font-size: 18px;
    margin-bottom: 20px;
  }

  input, select {
    font-size: 14px;
  }

  button {
    font-size: 14px;
  }
}
</style>