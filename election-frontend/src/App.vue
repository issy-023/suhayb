<template>
  <div id="app">
    <nav class="navbar">
      <div class="navbar-content">
        <img src="@/assets/Youth-removebg-preview.png" alt="Logo" class="navbar-logo">
        <router-link to="/HomePage" class="navbar-title">YouthVote</router-link>
        <button class="hamburger" @click="toggleMenu">
          ☰
        </button>
        <ul :class="{ active: menuActive }">
          <li><router-link to="/HomePage">Homepage</router-link></li>
          <li><router-link to="/LiveChatPage">Live Chat</router-link></li>
          <li><router-link to="/Communities">Communities</router-link></li>
          <li><router-link to="/CabinetBuilder">Create Your Cabinet</router-link></li>
          <li v-if="isAdmin"><router-link to="/Admin">AdminPage</router-link></li>
          <li><router-link to="/votes-per-party">Election Overview</router-link></li>
          <li><router-link to="/WatAls">The Guide</router-link></li>
          <li v-if="!isLoggedIn"><router-link class="auth-link" to="/registration">Registration</router-link></li>
          <li v-if="!isLoggedIn"><router-link class="auth-link" to="/login">Login</router-link></li>
          <li v-if="isLoggedIn"><router-link to="/profile">Profile</router-link></li>
          <li v-if="isLoggedIn" class="logout"><a href="#" @click="logout">Logout</a></li>
        </ul>
      </div>
    </nav>

    <!-- Hoofdinhoud -->
    <div class="content">
      <div class="homepage-info" v-if="$route.path === '/HomePage'">
        <div class="homepage-banner">
          <h1>Welcome to YouthVote!</h1>
          <p>
            YouthVote is a platform designed for young people who may not know much about politics.
            Here, you can learn about political parties, participate in live chats, and even build your own cabinet.
            Our goal is to make politics accessible and engaging for everyone.
          </p>
        </div>
      </div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { authState } from "@/authState";import jwt_decode from 'jwt-decode';




export default {
  name: "App",
  data() {
    return {
      menuActive: false,
    };
  },
  computed: {
    isLoggedIn() {
      return authState.isLoggedIn;
    },
    isAdmin() {
      const token = localStorage.getItem("token");
      if (!token) return false;

      try {
        const decoded = jwt_decode(token);

        return decoded.isAdmin === true;
      } catch (error) {
        console.error("Error decoding token:", error);
        return false;
      }
    }
    ,
  },
  methods: {
    toggleMenu() {
      this.menuActive = !this.menuActive;
    },
    logout() {
      localStorage.removeItem("token");
      authState.isLoggedIn = false;
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
/* Navbar stijlen */
.navbar {
  background-color: #17003C;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
}

.navbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.navbar-logo {
  height: 60px;
  width: 60px;
}

.navbar-title {
  font-size: 24px;
  color: white;
  text-decoration: none;
  margin-left: 10px;
  font-weight: bold;
  cursor: pointer;
}

.navbar-title:hover {
  color: #FF9900;
}

.hamburger {
  display: none;
  font-size: 24px;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
}

.navbar ul {
  list-style: none;
  display: flex;
  gap: 1.5rem;
}

.navbar ul li {
  display: inline-block;
}

.navbar ul li a {
  text-decoration: none;
  color: white;
  font-size: 18px;
  padding: 0.5rem 1rem;
}

.navbar ul li a:hover {
  background-color: #FF9900;
  color: #f0f0f0;
  border-radius: 5px;
}

/* Login and Registration Specific Styles */
.navbar ul li .auth-link {
  background-color: #FF9900;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 5px;
}

.navbar ul li .auth-link:hover {
  background-color: #b06a00;
}

/* Logout Button Specific Style */
.navbar ul li.logout a {
  background-color: #FF0000; /* Licht rood bij hover */
  color: #f0f0f0;
  border-radius: 5px;
}

.navbar ul li.logout a:hover {
  background-color: #930000; /* Licht rood bij hover */
  color: #f0f0f0;
  border-radius: 5px;
}

/* Hoofdinhoud */
.content {
  margin-top: 100px; /* Hoogte van de navbar */
  padding: 1rem;
}

.homepage-info {
  margin-top: 10px;
  background-color: #f5f5f5;
  padding: 20px;
  text-align: center;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.homepage-info h2 {
  font-size: 2.5rem;
  color: #17003C;
  margin-bottom: 10px;
}

.homepage-info p {
  font-size: 1.5rem;
  color: #17003C;
  line-height: 1.5;
}

/* Mobiele weergave */
@media (max-width: 768px) {
  .hamburger {
    display: block;
  }

  .navbar ul {
    display: none;
    flex-direction: column;
    background-color: #17003C;
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    padding: 1rem 0;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
  }

  .navbar ul.active {
    display: flex;
  }

  .navbar ul li {
    text-align: center;
    margin: 0.5rem 0;
  }
}
</style>