// src/adapters/PartyAdapter.js
import axios from 'axios';

import BBB from '../assets/party/bbb.png';
import Bij1 from '../assets/party/bij1.png';
import BVNL from '../assets/party/bvnl.png';
import CDA from '../assets/party/cda.png';
import CU from '../assets/party/cu.png';
import D66 from '../assets/party/d66.png';
import Denk from '../assets/party/denk.png';
import FVD from '../assets/party/fvd.png';
import GLPVDA from '../assets/party/glpvda.png';
import GroenLinks from '../assets/party/groenLinks.png';
import JA21 from '../assets/party/ja21.png';
import LEF from '../assets/party/lef.png';
import LP from '../assets/party/lp.png';
import NLPLAN from '../assets/party/nlplan.webp';
import NSC from '../assets/party/nsc.png';
import OPNL from '../assets/party/opnl.png';
import PartijvdSport from '../assets/party/PartijvdSport.png';
import Piraten from '../assets/party/piraten.png';
import PPvB from '../assets/party/ppvb.png';
import PvdA from '../assets/party/pvda.png';
import PvdD from '../assets/party/pvdd.png';
import PVV from '../assets/party/pvv.png';
import SGP from '../assets/party/sgp.png';
import SP from '../assets/party/sp.png';
import Splinter from '../assets/party/splinter.png';
import SVN from '../assets/party/svn.png';
import VijftigPlus from '../assets/party/50plus.png';
import Volt from '../assets/party/volt.png';
import VVD from '../assets/party/vvd.png';
import {API_URL} from "@/config";
const imageMap = {
    BBB,
    Bij1,
    BVNL,
    CDA,
    CU,
    D66,
    Denk,
    FVD,
    GLPVDA,
    GroenLinks,
    JA21,
    LEF,
    LP,
    NLPLAN,
    NSC,
    OPNL,
    PartijvdSport,
    Piraten,
    PPvB,
    PvdA,
    PvdD,
    PVV,
    SGP,
    SP,
    Splinter,
    SVN,
    VijftigPlus,
    Volt,
    VVD,
};

class PartyAdapter {
    constructor(baseURL) {
        this.api = axios.create({
            baseURL,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    async getParties(page, size) {
        try {
            const response = await this.api.get(`${API_URL}/api/v1/parties`, {
                params: { page, size },
            });
            const { parties, totalPages } = response.data;
            const partyWithImage = this.matchImageToParty(parties);
            return { parties: partyWithImage, totalPages};
        } catch (error) {
            console.error('Error fetching parties:', error);
            throw new Error('Failed to fetch party data');
        }
    }

    matchImageToParty(rawData){
        return rawData.map(party => ({
            ...party,
            image: imageMap[party.abbreviation] || null,
        }));
    }
}

export default PartyAdapter;
