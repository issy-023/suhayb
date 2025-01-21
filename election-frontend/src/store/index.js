import { createStore } from 'vuex';

export default createStore({
    state: {
        userId: null,  // ID of the logged-in user
        joinedCommunityId: null,  // ID of the community the user has joined
    },
    mutations: {
        SET_USER_ID(state, userId) {
            state.userId = userId;
        },
        SET_JOINED_COMMUNITY_ID(state, communityId) {
            state.joinedCommunityId = communityId;
        },
    },
    actions: {
        setUserId({ commit }, userId) {
            commit('SET_USER_ID', userId);
        },
        joinCommunity({ commit }, communityId) {
            commit('SET_JOINED_COMMUNITY_ID', communityId);
        },
        leaveCommunity({ commit }) {
            commit('SET_JOINED_COMMUNITY_ID', null);
        },
        updateJoinedCommunityId({ commit }, communityId) {
            commit('SET_JOINED_COMMUNITY_ID', communityId);
        },
    },
    getters: {
        userId: (state) => state.userId,
        joinedCommunityId: (state) => state.joinedCommunityId,
    },

});
