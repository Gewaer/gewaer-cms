import axios from "axios";
import cloneDeep from "lodash/cloneDeep";
import store from "../store";
const slugify = require("@sindresorhus/slugify");


const state = {
    data: {
        "id": 0,
        "users_id": [],
        "sites_id": "1",
        "companies_id": "",
        "type": null,
        "post_types_id": "",
        "category": null,
        "category_id": 0,
        "title": "",
        "slug": "",
        "summary": "",
        "content": "",
        "media_url":"",
        "likes_count": 0,
        "post_parent_id": 0,
        "shares_count": 0,
        "views_count": 0,
        "comment_count": 0,
        "status": "",
        "comment_status": "",
        "is_published": "",
        "featured": "",
        "weight": 0,
        "premium": "",
        "published_at": "",
        "created_at": "",
        "updated_at": "",
        "is_deleted": "",
        "tags": [],
        "files": [],
        "is_live": "",
        "author": null,
        "collaborator": null,
        "user": "",
        game: null
    },
    published_at_backup: null
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
    },
    SET_LIVE_STATUS(state, liveStatus) {
        state.data.is_live = liveStatus;
    },
    SET_POST_AUTHOR_NAME(state, authorName) {
        state.data.author = authorName;
    },
    SET_POST_COLLABORATOR(state, collaborator) {
        state.data.collaborator = collaborator
    },
    SET_PUBLISHED_AT_BACKUP(state, date) {
        state.published_at_backup = date;
    },
    SET_POST_GAME(state, game) {
        state.data.game = game;
    }
}

const actions = {
    updateData({ commit, dispatch }, postId) {
        if (postId) {
            dispatch("Application/showLoader", true, { root: true });
            dispatch("getData", postId).then(({ data: post }) => {
                commit("SET_PUBLISHED_AT_BACKUP", post.published_at);

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
        const data = {
            "id": 0,
            "users_id": [],
            "sites_id": "1",
            "companies_id": "",
            "type": null,
            "post_types_id": "",
            "category": null,
            "category_id": 0,
            "title": "",
            "slug": "",
            "summary": "",
            "content": "",
            "media_url":"",
            "likes_count": 0,
            "post_parent_id": 0,
            "shares_count": 0,
            "views_count": 0,
            "comment_count": 0,
            "status": "",
            "comment_status": "",
            "is_published": "",
            "featured": "",
            "weight": 0,
            "premium": "",
            "published_at": "",
            "created_at": "",
            "updated_at": "",
            "is_deleted": "",
            "tags": [],
            "files": [],
            "is_live": "",
            "author": "",
            "collaborator": 0,
            "user": "",
            game: null
        }
        commit("SET_PUBLISHED_AT_BACKUP", null);
        commit("SET_POST", data);
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
    },
    resetPublishedDate({ commit, state }) {
        const publishedDate = state.published_at_backup ? state.published_at_backup : null;
        commit("SET_PUBLISHED_AT", publishedDate);
    }
}

const getters = {
    isScheduled(state) {
        return state.data.status === store.getters["PostStatus/statusIds"].SCHEDULED;
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}
