import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ChatViewComponent from '../../src/components/ChatViewComponent.vue';

describe('ChatViewComponent', () => {
    beforeEach(() => {
        // Mock localStorage
        vi.spyOn(window.localStorage.__proto__, 'getItem');
        vi.spyOn(window.localStorage.__proto__, 'setItem');

        const mockChats = [
            {
                id: '1',
                name: 'Test Chat',
                messages: ['Hello', 'World'],
            },
        ];

        localStorage.getItem.mockImplementation((key) => {
            if (key === 'chats') {
                return JSON.stringify(mockChats);
            }
            return null;
        });

        localStorage.setItem.mockImplementation(() => {});
    });

    const factory = (options = {}) => {
        return mount(ChatViewComponent, {
            global: {
                mocks: {
                    $route: {
                        params: {
                            chatId: '1', // Simuleer een route met een chat ID
                        },
                    },
                },
            },
            ...options,
        });
    };

    it('loads and displays chat details correctly', async () => {
        const wrapper = factory();

        // Zorg ervoor dat de `loadChat` expliciet wordt aangeroepen
        await wrapper.vm.loadChat();
        await wrapper.vm.$nextTick();

        // Controleer of de chatnaam correct wordt weergegeven
        expect(wrapper.find('h2').text()).toBe('Chat: Test Chat');

        // Controleer of de berichten correct worden weergegeven
        const messages = wrapper.findAll('.message');
        expect(messages).toHaveLength(2);
        expect(messages[0].text()).toBe('Hello');
        expect(messages[1].text()).toBe('World');
    });
});
