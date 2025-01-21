import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LoginComponent from '../../src/components/LoginComponent.vue';
import {API_URL} from "@/config";

global.fetch = vi.fn();

describe('LoginComponent', () => {
    let mockRouter;

    beforeEach(() => {
        mockRouter = {
            push: vi.fn(),
        };
    });

    const factory = (overrides = {}) => {
        return mount(LoginComponent, {
            data() {
                return {
                    username: '',
                    password: '',
                };
            },
            global: {
                mocks: {
                    $router: mockRouter,
                },
                stubs: {
                    'router-link': true,
                },
                ...overrides,
            },
        });
    };

    it('renders login form correctly', () => {
        const wrapper = factory();

        expect(wrapper.find('h1').text()).toBe('Login');
        expect(wrapper.find('label[for="username"]').text()).toBe('Username:');
        expect(wrapper.find('label[for="password"]').text()).toBe('Password:');
        expect(wrapper.find('button[type="submit"]').exists()).toBe(true);
    });

    it('shows error message if username or password is missing', async () => {
        const wrapper = factory();

        await wrapper.find('form').trigger('submit.prevent');

        expect(wrapper.vm.errorMessage).toBe('Username and password are required.');
        expect(wrapper.find('.error').text()).toBe('Username and password are required.');
    });

    it('calls the login method with correct data', async () => {
        const wrapper = factory();

        const mockResponse = { token: 'testtoken', username: 'testuser' };
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
        });

        wrapper.setData({
            username: 'testuser',
            password: 'testpassword',
        });

        await wrapper.find('form').trigger('submit.prevent');

        expect(fetch).toHaveBeenCalledWith(`${API_URL}/api/v1/User/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: 'testuser',
                password: 'testpassword',
            }),
        });

        expect(localStorage.getItem('token')).toBe('testtoken');
        expect(mockRouter.push).toHaveBeenCalledWith('/HomePage');
    });

    it('shows error message if login fails', async () => {
        const wrapper = factory();

        fetch.mockResolvedValueOnce({
            ok: false,
            status: 401,
        });

        wrapper.setData({
            username: 'wronguser',
            password: 'wrongpassword',
        });

        await wrapper.find('form').trigger('submit.prevent');

        expect(wrapper.vm.errorMessage).toBe('Invalid username or password.');
        expect(wrapper.find('.error').text()).toBe('Invalid username or password.');
    });
});
