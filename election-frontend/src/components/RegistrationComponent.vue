<template>
  <div class="page-container">
    <div class="registration-form">
      <h1>Register</h1>
      <form @submit.prevent="register">
        <div class="form-row">
          <div class="form-group half-width">
            <label for="name">Name:</label>
            <input
                type="text"
                id="name"
                v-model="name"
                placeholder="Fill in Name"
                required
            />
          </div>

          <div class="form-group half-width">
            <label for="surname">Surname:</label>
            <input
                type="text"
                id="surname"
                v-model="surname"
                placeholder="Fill in Surname"
                required
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group half-width">
            <label for="dob">Date of Birth:</label>
            <input type="date" id="dob" v-model="dob" required />
          </div>

          <div class="form-group half-width">
            <label for="gender">Gender:</label>
            <select id="gender" v-model="gender" required>
              <option value="" disabled selected>Choose Gender</option>
              <option value="MALE">MALE</option>
              <option value="FEMALE">FEMALE</option>
              <option value="OTHER">OTHER</option>
            </select>
          </div>
        </div>

        <div class="form-group full-width">
          <label for="email">E-mail:</label>
          <input
              type="email"
              id="email"
              v-model="email"
              placeholder="Fill in E-mail"
              required
          />
        </div>

        <div class="form-group full-width">
          <label for="username">Username:</label>
          <input
              type="text"
              id="username"
              v-model="username"
              placeholder="Fill in Username"
              required
          />
        </div>

        <div class="form-group full-width">
          <label for="password">Password:</label>
          <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="password"
              placeholder="Fill in Password"
              required
          />
        </div>

        <div class="form-group full-width">
          <label for="confirmPassword">Repeat Password:</label>
          <input
              :type="showPassword ? 'text' : 'password'"
              id="confirmPassword"
              v-model="confirmPassword"
              placeholder="Repeat Password"
              required
          />
        </div>

        <div class="form-group-inline">
          <input type="checkbox" id="showPassword" v-model="showPassword" />
          <label for="showPassword">Show Password</label>
        </div>

        <div class="password-requirements">
          <li :class="{ valid: passwordValidations.length, invalid: !passwordValidations.length }">
            At least 8 characters
          </li>
          <li :class="{ valid: passwordValidations.uppercase, invalid: !passwordValidations.uppercase }">
            At least one uppercase letter
          </li>
          <li :class="{ valid: passwordValidations.special, invalid: !passwordValidations.special }">
            At least one special character
          </li>
          <li :class="{ valid: passwordValidations.noUsername, invalid: !passwordValidations.noUsername }">
            Must not contain username
          </li>
        </div>

        <div class="checkbox-group-left">
          <input type="checkbox" id="terms" v-model="terms" required />
          <label for="terms">Agree with Terms of Service</label>
        </div>

        <div class="checkbox-group-left">
          <input type="checkbox" id="emails" v-model="emails" />
          <label for="emails">Agree with us sending e-mails</label>
        </div>

        <button type="submit" :disabled="!canRegister">Register</button>
      </form>

      <p v-if="errorMessage">{{ errorMessage }}</p>
    </div>

    <!-- Popup -->
    <div v-if="showSuccessPopup" class="popup-overlay">
      <div class="popup">
        <h3>Registration Successful!</h3>
        <p>You will now be redirected to the login page.</p>
        <button @click="redirectToLogin" class="popup-button">OK</button>
      </div>
    </div>
  </div>
</template>

<script>
import {API_URL} from "@/config";

export default {
  name: "RegistrationComponent",
  data() {
    return {
      name: "",
      surname: "",
      dob: "",
      gender: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      terms: false,
      emails: false,
      showPassword: false,
      errorMessage: "",
      showSuccessPopup: false, // Nieuw: Beheert de popup zichtbaarheid
    };
  },
  computed: {
    passwordValidations() {
      const password = this.password;
      const username = this.username;
      return {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        special: /[!@#$%^&*/,.?":{}|<>]/.test(password),
        noUsername: !password.toLowerCase().includes(username.toLowerCase()),
      };
    },
    isPasswordValid() {
      return (
          this.passwordValidations.length &&
          this.passwordValidations.uppercase &&
          this.passwordValidations.special &&
          this.passwordValidations.noUsername &&
          this.password === this.confirmPassword
      );
    },
    canRegister() {
      return (
          this.terms &&
          this.isPasswordValid &&
          this.name &&
          this.surname &&
          this.dob &&
          this.gender &&
          this.email &&
          this.username &&
          this.password &&
          this.confirmPassword
      );
    },
  },
  methods: {
    async register() {
      if (!this.terms) {
        this.errorMessage = "You must agree with the terms of service.";
      } else if (!this.isPasswordValid) {
        this.errorMessage = "Password does not meet all the requirements.";
      } else {
        this.errorMessage = "";

        const userData = {
          name: this.name,
          surname: this.surname,
          dateOfBirth: this.dob,
          gender: this.gender,
          email: this.email,
          username: this.username,
          password: this.password,
          termsAccepted: this.terms,
          emailsAccepted: this.emails,
        };

        try {
          const response = await fetch(`${API_URL}/api/v1/User/register`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
          });

          if (!response.ok) {
            throw new Error("Failed to register user");
          }

          // Toon popup bij succes
          this.showSuccessPopup = true;
        } catch (error) {
          console.error("Error during registration:", error);
          this.errorMessage = "Registration failed. Please try again later.";
        }
      }
    },
    redirectToLogin() {
      this.showSuccessPopup = false;
      this.$router.push("/login"); // Stuur door naar login pagina
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

.page-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f3f3f3;
}

.registration-form {
  width: 450px;
  padding: 30px;
  border: 2px solid #1a123b;
  border-radius: 15px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #1a123b;
  text-align: center;
  margin-bottom: 20px;
  font-weight: 400;
}

form {
  display: flex;
  flex-direction: column;
}

.form-row {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.half-width {
  width: 48%;
}

.full-width {
  width: 100%;
}

.checkbox-group-left {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  justify-content: flex-start;
}

.checkbox-group-left input {
  margin-right: 10px;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.form-group-inline {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

input, select {
  padding: 10px;
  border: 2px solid #1a123b;
  border-radius: 10px;
  font-size: 16px;
  color: #333;
  margin-left: 5px;
}

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

.password-requirements {
  list-style-type: none;
  padding: 0;
  margin-top: 10px;
  font-size: 12px;
}

.password-requirements li {
  margin-bottom: 5px;
}

.password-requirements .valid {
  color: green;
}

.password-requirements .invalid {
  color: red;
}

p {
  color: green;
  margin-top: 10px;
  text-align: center;
}

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
</style>


