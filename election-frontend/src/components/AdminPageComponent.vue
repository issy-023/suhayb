<template>
  <div class="parent">
    <!-- NAVIGATION BAR / HEADER -->
    <div id="nav">
      <h1>Admin</h1>
      <h2>Dashboard</h2>
      <div class="profileBtn" v-if="isLoggedIn()">
        <div class="dropdown">
          <button class="dropbtn">Profile</button>
          <div class="dropdown-content">
            <a @click="$router.push('/profile')">Profile</a>
            <a v-if="isAdmin()" @click="$router.push('/admin')">Admin</a>
            <a @click="logOut()">Logout</a>
          </div>
        </div>
      </div>
    </div>

    <!-- BODY -->
    <div id="body">
      <!-- USER LIST -->
      <div class="header-container">
        <h1>Userlist</h1>
        <input
            v-model="searchTerm"
            type="text"
            placeholder="Search users by email..."
            class="search-input"
        />
      </div>

      <div class="table__body">
        <table>
          <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Email</th>
            <th>Account status</th>
            <th>Role</th>
          </tr>
          </thead>
          <tbody>
          <!-- GEBRUIKERS TONEN -->
          <tr v-for="user in filteredUsers" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.email }}</td>
            <td>
              <button
                  :id="'button-' + user.id"
                  :class="{'active-btn': user.active, 'inactive-btn': !user.active}"
                  @click="toggleUserStatus(user.id, user.active)"
              >
                {{ user.active ? 'Active' : 'Inactive' }}
              </button>
              <button @click="deleteUser(user.id)" class="delete-btn">
                Delete
              </button>
            </td>
            <td>
              <button
                  :id="'button-role-' + user.id"
                  :class="{'active-btn': user.admin, 'inactive-btn': !user.admin}"
                  @click="updateUserRole(user.id, user.admin)"
              >
                {{ user.admin ? 'Admin' : 'User' }}
              </button>
            </td>
          </tr>

          <!-- GEEN GEBRUIKERS GEVONDEN? -->
          <tr v-if="filteredUsers.length === 0">
            <td colspan="5" style="text-align: center;">No users found</td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- Gerapporteerde Posts -->
      <div class="header-container" style="margin-top: 2rem;">
        <h1>Reported Posts</h1>
      </div>
      <div class="table__body">
        <table>
          <thead>
          <tr>
            <th>Post ID</th>
            <th>Content</th>
            <th>Reported</th>
            <th>User</th>
            <th>Remove</th>
            <th>Delete</th>
          </tr>
          </thead>
          <tbody>
          <!-- ALS reportedPosts LEEG IS, TOON "No reported posts" -->
          <tr v-if="reportedPosts.length === 0">
            <td colspan="4" style="text-align: center;">No reported posts</td>
          </tr>
          <!-- LOOP OVER DE GEVONDEN GERAPPORTEERDE POSTS -->
          <tr v-for="post in reportedPosts" :key="post.id">
            <td>{{ post.id }}</td>
            <td>{{ post.content }}</td>
            <td>{{ post.reported ? 'Yes' : 'No' }}</td>
            <td>{{ post.user ? post.user.username : 'Unknown' }}</td>
            <td>
              <button class="delete-btn" @click="removeReport(post.id)">Remove Report</button> </td>
            <td>  <button class="delete-btn" @click="deletePost(post.id)">Delete Post</button></td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { API_URL } from '@/config';

export default {
  name: 'AdminPage',
  data() {
    return {
      users: [],
      searchTerm: '',
      reportedPosts: [] // <-- Hier slaan we de gerapporteerde posts in op
    };
  },
  computed: {
    /**
     * Filter de users op basis van de searchTerm in hun email.
     */
    filteredUsers() {
      return this.users.filter((user) =>
          user.email.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    },
  },
  methods: {
    /**
     * Check of de gebruiker ingelogd is.
     */
    isLoggedIn() {
      return !!localStorage.getItem('token');
    },

    /**
     * Check of de gebruiker admin is.
     */
    isAdmin() {
      return !!localStorage.getItem('isAdmin');
    },

    /**
     * Log de gebruiker uit, verwijder token en admin-status uit localStorage.
     */
    logOut() {
      localStorage.removeItem('token');
      localStorage.removeItem('isAdmin');
      this.$router.push('/');
    },

    /**
     * Haal alle gebruikers op voor de admin.
     */
    async fetchUsers() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/admin/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.users = response.data;
      } catch (error) {
        if (error.response && error.response.status === 401) {
          this.logOut();
          window.alert('Unauthorized access, please log in again.');
        } else {
          console.error('Error fetching users:', error);
        }
      }
    },

    /**
     * Activeer/deactiveer de gebruiker.
     */
    async toggleUserStatus(userId, isActive) {
      const token = localStorage.getItem('token');
      try {
        await axios.put(
            `${API_URL}/admin/user/${userId}/status`,
            null,
            {
              params: { isActive: !isActive },
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            }
        );
        // Updaten in de lokale lijst
        const user = this.users.find((u) => u.id === userId);
        if (user) {
          user.active = !isActive;
        }
      } catch (error) {
        if (error.response && error.response.status === 403) {
          window.alert('You cannot deactivate your own account.');
        } else if (error.response && error.response.status === 401) {
          this.logOut();
          window.alert('Unauthorized access, please log in again.');
        } else {
          console.error('Error updating user status:', error);
        }
      }
    },

    /**
     * Verwijder een gebruiker (DELETE).
     */
    async deleteUser(id) {
      const token = localStorage.getItem('token');
      try {
        await axios.delete(`${API_URL}/admin/user/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Verwijder de user uit de lokale lijst
        this.users = this.users.filter((user) => user.id !== id);
      } catch (error) {
        console.error('Error deleting user:', error);
        window.alert('An error occurred while trying to delete the user.');
      }
    },

    /**
     * Verander de role van de gebruiker (User <-> Admin).
     */
    async updateUserRole(userId, isAdmin) {
      const token = localStorage.getItem('token');
      try {
        await axios.put(
            `${API_URL}/admin/user/${userId}/role`,
            null,
            {
              params: { isAdmin: !isAdmin },
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
        );
        // In de lokale lijst admin flippen
        const user = this.users.find((u) => u.id === userId);
        if (user) {
          user.admin = !isAdmin; // 'role' of 'admin' aanpassen, afhankelijk van je back-end
        }
      } catch (error) {
        console.error('Error updating user role:', error);
        window.alert('An error occurred while trying to update the user role.');
      }
    },

    /**
     * Haal alle gerapporteerde posts op (reported = true).
     */
    async fetchReportedPosts() {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`${API_URL}/admin/posts/reported`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Sla de gerapporteerde posts lokaal op
        this.reportedPosts = response.data;
      } catch (error) {
        if (error.response && error.response.status === 401) {
          this.logOut();
          window.alert('Unauthorized access, please log in again.');
        } else {
          console.error('Error fetching reported posts:', error);
        }
      }
    },
  },

  /**
   * Zodra de component gemount is, checken we of de user is ingelogd.
   * Daarna halen we users & reportedPosts op.
   */
  mounted() {
    if (!this.isLoggedIn()) {
      this.$router.push('/');
      window.alert('Please log in to access the admin page.');
    } else {
      this.fetchUsers();
      this.fetchReportedPosts();
    }
  },
};
</script>

<style scoped>
/* --- LAYOUT CONTAINER --- */
.parent {
  display: grid;
  grid-template-rows: 0.2fr 1fr;
  grid-template-columns: 1fr; /* Eén kolom voor eenvoud */
  height: 100vh;
  //background-color: #f1f1f1;
}

/* --- TITELS EN TEKST --- */
h1 ,h2{
  color: #17003C;
  font-size: 1.8rem;
  margin: 0;
}

/* --- NAVIGATION / HEADER --- */
#nav {
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  color: white; /* Tekst wordt wit als achtergrond gekleurd is */
}

.profileBtn {
  display: flex;
  align-items: center;
}

/* --- BODY CONTAINER --- */
#body {
  padding: 2rem;
  margin: 0 auto;
  width: 90%;
  background-color: #f1f1f1;
}

/* --- SEARCH BAR & HEADER --- */
.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.search-input {
  max-width: 30%;
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

/* --- TABLE STYLES --- */
.table__body {
  width: 100%;
  background-color: #ffffff;
  border-radius: 8px;
  overflow-y: auto;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem; /* Ruimte onder elke tabel */
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead th {
  background-color: #d5d1defe;
  padding: 1.2rem;
  font-size: 1.1rem;
  font-weight: bold;
  text-align: left;
  position: sticky; /* Sticky header */
  top: 0;
  z-index: 1;
}

tbody tr {
  transition: background-color 0.3s ease;
}

tbody tr:nth-child(even) {
  background-color: #f9f9f9; /* Alternating row color */
}

tbody tr:hover {
  background-color: #f1f1f1; /* Row hover effect */
}

th, td {
  padding: 1.5rem;
  font-size: 1rem;
}

/* --- BUTTONS --- */
.active-btn,
.inactive-btn,
.delete-btn {
  padding: 8px 15px;
  font-size: 0.9rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  border: none;
}

/* Active vs Inactive styling */
.active-btn {
  background-color: #007bff;
  color: white;
}

.inactive-btn {
  background-color: #6c757d;
  color: white;
}

/* Delete button styling */
.delete-btn {
  background-color: #dc3545;
  color: white;
  margin-left: 0.5rem; /* beetje speling naast de status-knop */
}

.delete-btn:hover {
  background-color: #c82333;
}

/* --- DROPDOWN MENU --- */
.dropdown {
  position: relative;
  display: inline-block;
}

.dropbtn {
  background-color: #007bff;
  color: white;
  padding: 0.6rem 1rem;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: white;
  min-width: 160px;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  z-index: 1;
}

.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  font-size: 1rem;
}

.dropdown-content a:hover {
  background-color: #007bff;
  color: white;
}

.dropdown:hover .dropdown-content {
  display: block;
}
</style>
