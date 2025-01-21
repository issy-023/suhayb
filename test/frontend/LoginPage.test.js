import { describe, it, expect, beforeEach, vi } from "vitest";
import { shallowMount, RouterLinkStub } from "@vue/test-utils";
import LoginComponent from "../../election-frontend/src/components/LoginComponent.vue";

// Mock de fetch API
global.fetch = vi.fn();

// Mock Vue Router
vi.mock("vue-router", () => ({
    useRouter: () => ({
        push: vi.fn(),
    }),
}));

// Mock authState
vi.mock('../../authState', () => ({
    authState: {
        isLoggedIn: false,
    },
}));


describe("LoginComponent.vue", () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(LoginComponent, {
            global: {
                stubs: {
                    RouterLink: RouterLinkStub, // Gebruik RouterLinkStub om router-link te mocken
                },
            },
        });
        fetch.mockReset(); // Reset de fetch mocks voor elke test
        localStorage.clear(); // Reset localStorage
    });

    it("renders the login form correctly", () => {
        expect(wrapper.find("h1").text()).toBe("Login");
        expect(wrapper.find("input#username").exists()).toBe(true);
        expect(wrapper.find("input#password").exists()).toBe(true);
        expect(wrapper.find("button").text()).toBe("Login");
    });

    it("validates empty input fields", async () => {
        await wrapper.find("form").trigger("submit.prevent");
        expect(wrapper.vm.errorMessage).toBe("Username and password are required.");
    });

    it("shows error message on invalid login credentials", async () => {
        // Mock een 401 Unauthorized response
        fetch.mockResolvedValue({
            ok: false,
            status: 401,
        });

        wrapper.setData({ username: "invaliduser", password: "wrongpass" });

        await wrapper.find("form").trigger("submit.prevent");

        expect(fetch).toHaveBeenCalledWith(
            "http://A/api/v1/User/login",
            expect.any(Object)
        );
        expect(wrapper.vm.errorMessage).toBe("Invalid username or password.");
    });

    it("redirects on successful login", async () => {
        const mockRouterPush = vi.fn();
        wrapper.vm.$router = { push: mockRouterPush };

        // Mock een succesvolle login
        fetch.mockResolvedValue({
            ok: true,
            json: () =>
                Promise.resolve({ token: "mockToken", username: "validuser" }),
        });

        wrapper.setData({ username: "validuser", password: "correctpass" });

        await wrapper.find("form").trigger("submit.prevent");

        expect(fetch).toHaveBeenCalled();
        expect(localStorage.getItem("token")).toBe("mockToken");
        expect(mockRouterPush).toHaveBeenCalledWith("/HomePage");
    });

    it("handles unexpected response format", async () => {
        // Mock een ongeldige response zonder token
        fetch.mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({}),
        });

        wrapper.setData({ username: "testuser", password: "testpass" });

        await wrapper.find("form").trigger("submit.prevent");

        expect(wrapper.vm.errorMessage).toBe("Unexpected response format.");
    });
});
