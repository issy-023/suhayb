import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import RegistrationComponent from '../../src/components/RegistrationComponent.vue';

global.fetch = vi.fn(); // Mock fetch globally

describe('RegistrationComponent', () => {
    let mockRouter;

    beforeEach(() => {
        // Mock router
        mockRouter = {
            push: vi.fn(),
        };
    });

    const factory = (overrides = {}) => {
        return mount(RegistrationComponent, {
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

    it('renders the registration form correctly', () => {
        const wrapper = factory();

        expect(wrapper.find('h1').text()).toBe('Register');
        expect(wrapper.find('input#name').exists()).toBe(true);
        expect(wrapper.find('input#surname').exists()).toBe(true);
        expect(wrapper.find('input#email').exists()).toBe(true);
        expect(wrapper.find('input#username').exists()).toBe(true);
        expect(wrapper.find('button[type="submit"]').exists()).toBe(true);
    });

    it('disables register button if form is invalid', async () => {
        const wrapper = factory();

        const registerButton = wrapper.find('button[type="submit"]');
        expect(registerButton.element.disabled).toBe(true);

        // Fill in form fields
        await wrapper.setData({
            name: 'John',
            surname: 'Doe',
            dob: '2000-01-01',
            gender: 'MALE',
            email: 'john.doe@example.com',
            username: 'johndoe',
            password: 'Password@123',
            confirmPassword: 'Password@123',
            terms: true,
        });

        await wrapper.vm.$nextTick();
        expect(registerButton.element.disabled).toBe(false);
    });

    it('shows error message if registration fails', async () => {
        const wrapper = factory();

        fetch.mockResolvedValueOnce({
            ok: false,
            status: 400,
        });

        // Fill in form fields
        await wrapper.setData({
            name: 'John',
            surname: 'Doe',
            dob: '2000-01-01',
            gender: 'MALE',
            email: 'john.doe@example.com',
            username: 'johndoe',
            password: 'Password@123',
            confirmPassword: 'Password@123',
            terms: true,
        });

        await wrapper.find('form').trigger('submit.prevent');

        expect(wrapper.vm.errorMessage).toBe('Registration failed. Please try again later.');
    });

    it('shows success popup and redirects on successful registration', async () => {
        const wrapper = factory();

        fetch.mockResolvedValueOnce({
            ok: true,
        });

        // Fill in form fields
        await wrapper.setData({
            name: 'John',
            surname: 'Doe',
            dob: '2000-01-01',
            gender: 'MALE',
            email: 'john.doe@example.com',
            username: 'johndoe',
            password: 'Password@123',
            confirmPassword: 'Password@123',
            terms: true,
        });

        await wrapper.find('form').trigger('submit.prevent');

        expect(wrapper.vm.showSuccessPopup).toBe(true);

        // Simuleer klikken op OK in de popup
        await wrapper.find('.popup-button').trigger('click');
        expect(mockRouter.push).toHaveBeenCalledWith('/login');
    });
});
