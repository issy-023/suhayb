package com.example.electionbackend;

import com.example.electionbackend.controller.UserController;
import com.example.electionbackend.model.User;
import com.example.electionbackend.security.JwtUtil;
import com.example.electionbackend.services.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @MockBean
    private JwtUtil jwtUtil;

    @Autowired
    private ObjectMapper objectMapper;

    private User testUser;

    @BeforeEach
    void setUp() {
        // Maak een testgebruiker
        testUser = new User();
        testUser.setId(1l);
        testUser.setUsername("testuser");
        testUser.setPassword("password123");
        testUser.setAdmin(false);
    }

    @Test
    void shouldRegisterUser() throws Exception {
        when(userService.saveUser(any(User.class))).thenReturn(testUser);

        mockMvc.perform(post("/api/v1/User/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testUser)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("testuser"));
    }

    @Test
    void shouldGetAllUsers() throws Exception {
        when(userService.getUsers()).thenReturn(Collections.singletonList(testUser));

        mockMvc.perform(get("/api/v1/User"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].username").value("testuser"));
    }

    @Test
    void shouldLoginUser() throws Exception {
        when(userService.findByUsername(testUser.getUsername())).thenReturn(testUser);
        when(jwtUtil.generateToken(anyString(), anyLong(), anyBoolean())).thenReturn("mockToken");

        mockMvc.perform(post("/api/v1/User/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testUser)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("mockToken"));
    }

    @Test
    void shouldReturnUnauthorizedOnInvalidLogin() throws Exception {
        when(userService.findByUsername(anyString())).thenReturn(null);

        mockMvc.perform(post("/api/v1/User/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testUser)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void shouldDeleteUser() throws Exception {
        when(jwtUtil.extractId(anyString())).thenReturn(1L);
        when(userService.deleteUser(1L)).thenReturn(true);

        mockMvc.perform(delete("/api/v1/User/delete/1")
                        .header("Authorization", "Bearer mockToken"))
                .andExpect(status().isOk())
                .andExpect(content().string("User deleted successfully."));
    }

    @Test
    void shouldReturnForbiddenOnUnauthorizedDelete() throws Exception {
        when(jwtUtil.extractId(anyString())).thenReturn(2L);

        mockMvc.perform(delete("/api/v1/User/delete/1")
                        .header("Authorization", "Bearer mockToken"))
                .andExpect(status().isForbidden());
    }
}
