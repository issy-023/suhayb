import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import ForgotPasswordComponent from '../../src/components/ForgotPasswordComponent.vue';

describe('ForgotPasswordComponent', () => {
    const factory = () => {
        return mount(ForgotPasswordComponent, {
            global: {
                stubs: {
                    'router-link': true, // Stub de router-link
                },
            },
        });
    };

    it('renders the forgot password form correctly', () => {
        const wrapper = factory();

        expect(wrapper.find('h1').text()).toBe('Forgot Password');
        expect(wrapper.find('input#email').exists()).toBe(true);
        expect(wrapper.find('button[type="submit"]').exists()).toBe(true);
        expect(wrapper.find('.back-to-login').exists()).toBe(true);
    });

    it('shows an error if the email field is empty', async () => {
        const wrapper = factory();

        await wrapper.find('form').trigger('submit.prevent');
        expect(wrapper.vm.errorMessage).toBe('Please enter a valid email address.');
        expect(wrapper.vm.message).toBe('');
        expect(wrapper.find('.error').text()).toBe('Please enter a valid email address.');
    });


});
