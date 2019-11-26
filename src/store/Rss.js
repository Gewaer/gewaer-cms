const state = {
    data: {
        site: "",
        url: "",
        rss_url: ""
    }
}

const mutations = {
    SET_DATA(state, data) {
        state.data = data;
    },
    SET_SITE_NAME(state, siteName) {
        state.data.site = siteName;
    },
    SET_PODCAST_URL(state, podcastUrl) {
        state.data.url = podcastUrl;
    },
    SET_URL(state, rssUrl) {
        state.data.rss_url = rssUrl;
    }
}

const actions = {
    getData(_, id) {
        return axios({ url: `/rss/${id}` });
    },
    updateCurrent({ commit, dispatch }, podcastId) {
        if (!podcastId) {
            return;
        }
        dispatch("Application/showLoader", true, { root: true });
        dispatch("getData", podcastId).then(({ data: podcastData }) => {
            commit("SET_DATA", podcastData);
        }).finally(() => {
            dispatch("Application/showLoader", false, { root: true });
        });
    },
    cleanData({ commit }) {
        const rssData = {
            site: "",
            url: "",
            rss_url: ""
        }
        commit("SET_DATA", rssData);
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
