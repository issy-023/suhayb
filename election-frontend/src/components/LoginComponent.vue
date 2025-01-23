<template>
  <div class="login-container">
    <div class="login-form">
      <h1>Login</h1>
      <form @submit.prevent="login">
        <div class="form-group full-width">
          <label for="username" class="left-label">Username:</label>
          <input
            type="text"
            id="username"
            v-model="username"
            placeholder="Fill in Username"
            required
          />
        </div>

        <div class="form-group full-width">
          <label for="password" class="left-label">Password:</label>
          <input
            :type="showPassword ? 'text' : 'password'"
            id="password"
            v-model="password"
            placeholder="Fill in Password"
            required
          />
        </div>

        <div class="forgot-password">
          <router-link to="/ForgotPassword"
            >Forgot password? Click here</router-link
          >
        </div>

        <button type="submit">Login</button>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </form>
    </div>
  </div>
</template>
<script>
import { authState } from "../authState";
import { API_URL } from "@/config";

export default {
  name: "LoginComponent",
  data() {
    return {
      username: "",
      password: "",
      showPassword: false,
      errorMessage: "",
    };
  },
  methods: {
    async login() {
      // Validate input
      if (!this.username || !this.password) {
        this.errorMessage = "Username and password are required.";
        return;
      }

      this.loading = true;
      this.errorMessage = ""; // Clear previous errors

      try {
        // Log the outgoing request for debugging (remove in production)
        console.log("Attempting to log in with:", this.username);

        // Send login request to the backend
        const response = await fetch(`${API_URL}/api/v1/User/login`, {
          method: "POST",
          body: JSON.stringify({
            username: this.username,
            password: this.password,
          }),
        });

        // Check if the response is unauthorized
        if (response.status === 401) {
          this.errorMessage = "Invalid username or password.";
          return;
        }

        // Handle non-successful responses
        if (!response.ok) {
          this.errorMessage = "Login failed. Please try again.";
          return;
        }

        // Parse the response
        const user = await response.json();

        // Validate the response structure
        if (user && user.token) {
          // Store the token and username in localStorage
          localStorage.setItem("token", user.token);
          localStorage.setItem("username", user.username);
          authState.isLoggedIn = true;

          // Redirect to profile
          this.$router.push("/HomePage");
        } else {
          this.errorMessage = "Unexpected response format.";
        }
      } catch (error) {
        console.error("Error during login:", error);
        this.errorMessage = "An error occurred. Please try again later.";
      } finally {
        this.loading = false; // Reset loading state
      }
    },

    // Centralized API request function with JWT token handling
    async apiRequest(url, options = {}) {
      const token = localStorage.getItem("token");
      if (token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token}`, // Attach JWT token to the headers
        };
      }
      const response = await fetch(url, options);

      // Handle unauthorized case globally
      if (response.status === 401) {
        this.errorMessage = "Session expired. Please log in again.";
        localStorage.removeItem("token"); // Optionally, clear token on 401 errors
        this.$router.push("/"); // Redirect to login
      }
      return response;
    },
  },
};
</script>
<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Outfit:wght@300..900&display=swap");

* {
  font-family: "Outfit", sans-serif;
  font-optical-sizing: auto;
  font-style: normal;
  font-weight: 300;
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f3f3f3;
}

.login-form {
  width: 400px;
  padding: 30px;
  border: 2px solid #1a123b;
  border-radius: 15px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #1a123b;
  font-weight: 400;
  margin-bottom: 20px;
}

form {
  display: flex;
  flex-direction: column;
}

.full-width {
  width: 100%;
  margin-bottom: 20px;
}

.left-label {
  font-weight: 500;
  margin-bottom: 5px;
  text-align: left;
}

input {
  padding: 10px;
  border: 2px solid #1a123b;
  border-radius: 10px;
  font-size: 16px;
  color: #333;
  width: 100%;
  box-sizing: border-box;
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
  width: 100%;
}

button:hover {
  background-color: #e68a00;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.forgot-password {
  margin-bottom: 20px;
  text-align: left;
}

.forgot-password a {
  color: #1a123b;
  font-weight: 400;
  text-decoration: none;
}

.forgot-password a:hover {
  text-decoration: underline;
}

.error {
  color: red;
  text-align: center;
}
</style>
