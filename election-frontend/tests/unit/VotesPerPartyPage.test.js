import { describe, it, expect } from 'vitest';
import VotesPerPartyPage from '@/components/VotesPerPartyPage.vue';

describe('VotesPerPartyPage - updateTopThreeParties', () => {
    it('updates the top three parties correctly', () => {
        const { updateTopThreeParties } = VotesPerPartyPage.methods;

        const context = {
            parties: [
                { name: 'Party A', totalVotes: 1000, seats: 10 },
                { name: 'Party B', totalVotes: 900, seats: 9 },
                { name: 'Party C', totalVotes: 800, seats: 8 },
                { name: 'Party D', totalVotes: 700, seats: 7 },
            ],
            largestParty: {},
            secondLargestParty: {},
            thirdLargestParty: {},
        };

        updateTopThreeParties.call(context);

        expect(context.largestParty.name).toBe('Party A');
        expect(context.secondLargestParty.name).toBe('Party B');
        expect(context.thirdLargestParty.name).toBe('Party C');
    });

    it('handles empty parties array', () => {
        const { updateTopThreeParties } = VotesPerPartyPage.methods;

        const context = {
            parties: [],
            largestParty: {},
            secondLargestParty: {},
            thirdLargestParty: {},
        };

        updateTopThreeParties.call(context);

        expect(context.largestParty).toEqual({ name: '', totalVotes: 0, seats: 0 });
        expect(context.secondLargestParty).toEqual({ name: '', totalVotes: 0, seats: 0 });
        expect(context.thirdLargestParty).toEqual({ name: '', totalVotes: 0, seats: 0 });
    });
});
