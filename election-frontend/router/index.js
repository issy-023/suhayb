import { createRouter, createWebHistory } from 'vue-router'
import HomeComponent from '../src/components/HomePage.vue';
import ProfileComponent from "../src/components/ProfileComponent";
import RegistrationComponent from "../src/components/RegistrationComponent";
import LoginComponent from "@/components/LoginComponent.vue";
import ForgotPasswordComponent from "@/components/ForgotPasswordComponent.vue";
import EveryPartyComponent from "@/components/EveryPartyComponent";
import ChatGroupComponent from "@/components/ChatGroupComponent.vue";
import CommunitiesComponent from "@/components/CommunitiesComponent.vue";
import DataPageComponent from "@/components/DataPageComponent.vue";
import liveChatPageComponent from "@/components/LiveChatPageComponent.vue";
import CommunityChatPage from "@/components/CommunityChatPage.vue";
import AdminPageComponent from "@/components/AdminPageComponent.vue";
import VotesPerPartyPage from "@/components/VotesPerPartyPage.vue";
import ChatViewComponent from "@/components/ChatViewComponent.vue";

import CabinetElectionsBuilder from "@/components/CabinetElectionsBuilder.vue";
import PartyDetailComponent from "@/components/PartyDetailComponent.vue";
import PartyOverviewComponent from "@/components/PartyOverviewComponent.vue";
import VotesPerLocation from "@/components/VotesPerLocation.vue";
import WatAls from "@/components/WatAls.vue";

export const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/HomePage',
            component: HomeComponent,
            name: 'HomePage'
        },
        {
            path: '/profile',
            component: ProfileComponent,
            name: 'Profile'
        },
        {
            path: '/Registration',
            component: RegistrationComponent,
            name: 'Registration'
        },
        {
            path: '/Login',
            component: LoginComponent,
            name: 'Login',
            props: true
        },
        {
            path: '/ForgotPassword',
            component: ForgotPasswordComponent,
            name: 'ForgotPassword'
        },
        {
            path: '/party',
            component: EveryPartyComponent,
            name: 'EveryParty'
        },
        {
            path: '/ChatGroup',
            component: ChatGroupComponent,
            name: 'ChatGroup'
        },
        {
            path: '/chat/:chatId',
            component: ChatViewComponent,
            name: 'ChatView',
            props: true
        },
        {
            path: '/Datapage',
            component: DataPageComponent,
            name: 'DataPage',
            props: true
        },
        {
            path: '/LiveChatPage',
            component: liveChatPageComponent,
            name: 'LiveChatPage'
        },
        {
            path: '/Communities',
            component: CommunitiesComponent,
            name: 'Communities',
            props: true
        },
        {
            path: '/CommunityChat/:communityId',
            component: CommunityChatPage,
            name: 'CommunityChat',
            props: true

        },
        {
            path: '/Admin',
            component: AdminPageComponent
        },
        {
            path: '/votes-per-party',
            component: VotesPerPartyPage,
            name: "VotesPerParty"
        },
        {
            path: '/parties',
            component: PartyOverviewComponent,
            name: 'PartiesOverview'
        },
        {
            path: '/parties/:partyId',
            name: 'PartyDetail',
            component: PartyDetailComponent,
            props: true
        },
        {
            path: '/CabinetBuilder',
            component: CabinetElectionsBuilder

      } ,
        {
            path: '/votes-per-location',
            component: VotesPerLocation,
            name: "VotesPerLocation"
        },
        {
            path: '/WatAls',
            component: WatAls,
            name: "PoliticalSimulationGame"
        },
        {
            path: '/EveryParty',
            component: EveryPartyComponent,
            name: "AllPartiesComponent"
        },
    ]});

