import axios from "axios";
import {API_URL} from "@/config";

class VotesAdapter {
    constructor(baseURL) {
        this.api = axios.create({
            baseURL,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    async fetchVotesPerParty(constituencyName) {
        try {
            const response = await this.api.get(`${API_URL}/api/election-results/votes-per-party/constituency`, {
                params: {constituencyName}
            });
            if (Array.isArray(response.data)) {
                return response.data.map(party => ({
                    name: party.name,
                    totalVotes: party.totalVotes
                })).sort((a, b) => b.totalVotes - a.totalVotes);
            }
        } catch (error) {
            console.error("Error fetching votes per party:", error);
            throw error;
        }
    }
}
export default VotesAdapter;