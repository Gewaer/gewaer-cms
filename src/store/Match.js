const state = {
    data: {
        team_a: "",
        team_b: "",
        start_time: null,
        end_time: null,
        third_party_id: null,
        games_id: "1",
        winning_team: null,
        game: null
    }
}

const mutations = {
    SET_DATA(state, data) {
        state.data = data;
    },
    SET_TEAM_A(state, team) {
        state.data.team_a = team;
    },
    SET_TEAM_B(state, team) {
        state.data.team_b = team;
    },
    SET_START_DATE_TIME(state, dateTime) {
        state.data.start_time = dateTime;
    },
    SET_END_DATE_TIME(state, dateTime) {
        state.data.end_time = dateTime;
    },
    SET_MATCH_SCHEDULED_STATUS(state, scheduledStatus) {
        state.data.is_scheduled = scheduledStatus;
    },
    SET_THIRD_PARTY_ID(state, id) {
        state.data.third_party_id = id;
    },
    SET_WINNING_TEAM(state, team) {
        state.data.winning_team = team;
    },
    SET_GAME(state, game) {
        state.data.game = game;
    }
}

const actions = {
    getData(_, id) {
        return axios({ url: `/tournaments-matches/${id}` });
    },
    updateCurrent({ commit, dispatch }, matchId) {
        if (!matchId) {
            return;
        }

        dispatch("Application/showLoader", true, { root: true });
        dispatch("getData", matchId).then(({ data: matchData }) => {
            commit("SET_DATA", matchData);
            dispatch("Application/showLoader", false, { root: true });
        });
    },
    cleanData({ commit }) {
        const data = {
            team_a: "",
            team_b: "",
            start_time: "",
            end_time: "",
            third_party_id: 0,
            games_id: "1",
            winning_team: null,
            game: null
        }
        commit("SET_DATA", data);
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
