<template>
  <div class="forgot-password-container">
    <div class="box">
      <h1>Forgot Password</h1>
      <p>Enter your email address to receive a link to reset your password.</p>

      <form @submit.prevent="sendResetEmail">
        <div class="form-group">
          <label for="email">Email Address:</label>
          <input
              type="email"
              id="email"
              v-model="email"
              placeholder="Enter your email address"
              required
          />
        </div>

        <button type="submit">Send Reset Link</button>
      </form>

      <p v-if="message">{{ message }}</p>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

      <router-link to="/Login" class="back-to-login">Back to Login</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "ForgotPasswordComponent",
  data() {
    return {
      email: "",
      message: "",
      errorMessage: ""
    };
  },
  methods: {
    async sendResetEmail() {
      try {
        if (!this.email) {
          this.errorMessage = "Please enter a valid email address.";
          return;
        }

        this.message = `A reset link has been sent to ${this.email}. Please check your inbox.`;
        this.errorMessage = "";
      } catch (error) {
        this.errorMessage = "Failed to send the reset link. Please try again later.";
        this.message = "";
      }
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');

* {
  font-family: 'Outfit', sans-serif;
}

.forgot-password-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f3f3f3;
  padding: 20px;
}

/* Box styling */
.box {
  width: 400px;
  padding: 30px;
  border: 2px solid #1a123b;
  border-radius: 15px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h1 {
  color: #1a123b;
  font-weight: 400;
  margin-bottom: 20px;
}

p {
  margin-bottom: 20px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

label {
  font-weight: 300;
  font-size: 14px;
  display: block;
  margin-bottom: 5px;
  text-align: left;
}

input {
  width: 100%;
  padding: 10px;
  border: 2px solid #1a123b;
  border-radius: 10px;
  font-size: 16px;
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
  width: 100%;
}

button:hover {
  background-color: #e68a00;
}

.back-to-login {
  margin-top: 20px;
  color: #1a123b;
  font-weight: 300;
  font-size: 14px;
  text-decoration: none;
}

.back-to-login:hover {
  text-decoration: underline;
}

.error {
  color: red;
}
</style>
