import axios from "axios";
import cloneDeep from "lodash/cloneDeep";
import isEmpty from "lodash/isEmpty";
import store from "../store";
const slugify = require("@sindresorhus/slugify");


const state = {
    data: {}
}

const mutations = {
    SET_POST(state, post) {
        state.data = post;
    },
    SET_TITLE(state, title) {
        state.data.title = title;
    },
    SET_SLUG(state, slug) {
        state.data.slug = slug;
    },
    SET_SUMMARY(state, summary) {
        state.data.summary = summary;
    },
    SET_CONTENT(state, content) {
        state.data.content = content;
    },
    SET_CATEGORY(state, category) {
        state.data.category = category;
    },
    SET_POST_TYPE(state, type) {
        state.data.type = type;
    },
    SET_POST_TAGS(state, tags) {
        state.data.tags = tags;
    },
    SET_MEDIA_URL(state, url) {
        state.data.media_url = url;
    },
    SET_FILES(state, files) {
        state.data.files = files;
    },
    SET_PUBLISHED_STATUS(state, status) {
        state.data.status = status;
    },
    SET_PUBLISHED_AT(state, publishedDate) {
        state.data.published_at = publishedDate;
    },
    SET_PREMIUM_STATUS(state, premiumStatus) {
        state.data.premium = premiumStatus;
    },
    SET_FEATURED_STATUS(state, featuredStatus) {
        state.data.featured = featuredStatus;
    }
}

const actions = {
    updateData({ commit, dispatch }, postId) {
        if (postId) {
            dispatch("Application/showLoader", true, { root: true });
            dispatch("getData", postId).then(({ data: post }) => {
                commit("SET_POST", post);
                dispatch("Application/showLoader", false, { root: true });
            });
        }
        dispatch("Tags/updateData", null, { root: true });
        dispatch("Categories/updateData", null, { root: true });
        dispatch("PostTypes/updateData", null, { root: true });
        dispatch("PostStatus/updateData", null, { root: true });
    },
    getData(_, id) {
        return axios({ url: `/posts/${id}` });
    },
    saveSluggedTitle({ commit }, title) {
        const slugifiedTitle = slugify(title);
        commit("SET_SLUG", slugifiedTitle);
    },
    cleanUp({ commit }) {
        commit("SET_POST", {});
    },
    addFiles({ commit, state }, files) {
        if (!files.length) {
            return;
        }

        const currentFiles = state.data.files;
        const newFiles = files.map((file) => {
            return {
                id: null,
                filesystem_id: file.id,
                url: file.url
            }
        });
        const mergedFiles = [...currentFiles, ...newFiles]
        commit("SET_FILES", mergedFiles);
    },
    spliceFilesByIndex({ commit, state }, index) {
        const clonedFiles = cloneDeep(state.data.files);
        clonedFiles.splice(index, 1);
        commit("SET_FILES", clonedFiles);
    }
}

const getters = {
    isScheduled(state) {
        const scheduledStatus = store.getters["PostStatus/scheduledStatus"];
        if (!isEmpty(scheduledStatus)) {
            return state.data.status === scheduledStatus.id;
        }
        return false;
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}
