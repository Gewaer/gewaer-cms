<template>
    <form class="resource-form" @submit.prevent="submitPodcastForm">
        <div class="row">
            <div class="col">
                <h3 class="title">General</h3>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <div :class="{ 'border-danger': errors.has('site-name') }" class="form-group form-group-default">
                    <label :class="{'text-danger': errors.has('site-name') }">
                        Site Name
                        <span v-if="errors.has('site-name')">(required)</span>
                    </label>
                    <input
                        v-validate="'required'"
                        v-model.trim="siteName"
                        class="form-control"
                        type="text"
                        data-vv-name="site-name"
                        data-vv-as="Site Name"
                        data-vv-validate-on="blur"
                    >
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <div :class="{ 'border-danger': errors.has('podcast-url') }" class="form-group form-group-default">
                    <label :class="{'text-danger': errors.has('podcast-url') }">
                        Url
                        <span v-if="errors.has('podcast-url')"> ({{ errors.first('podcast-url') }})</span>
                    </label>
                    <input
                        v-validate="'required'"
                        v-model.trim.lazy="podcastUrl"
                        type="url"
                        placeholder="https://example.com"
                        pattern="https?://.*"
                        size="30"
                        class="form-control"
                        data-vv-name="podcast-url"
                        data-vv-as="Podcast Url"
                        data-vv-validate-on="blur"
                    >
                </div>
            </div>
            <div class="col">
                <div :class="{ 'border-danger': errors.has('rss-url') }" class="form-group form-group-default">
                    <label :class="{'text-danger': errors.has('rss-url') }">
                        RSS Url
                        <span v-if="errors.has('rss-url')"> ({{ errors.first('rss-url') }})</span>
                    </label>
                    <input
                        v-validate="'required'"
                        v-model.trim.lazy="rssUrl"
                        type="url"
                        placeholder="https://www.mordor.com"
                        pattern="https?://.*"
                        size="30"
                        class="form-control"
                        data-vv-name="rss-url"
                        data-vv-as="Rss Url"
                        data-vv-validate-on="blur"
                    >
                </div>
            </div>
        </div>


        <div class="row float-right">
            <div class="m-2">
                <button
                    :disabled="isLoading"
                    :title="isLoading ? 'Processing, wait a moment...' : 'Save'"
                    :class="{ 'deactivated': isLoading }"
                    class="btn m-1 btn-primary float-right"
                >
                    Save
                </button>
                <router-link
                    :to="{ name: 'browse', params: { resource: 'rss'} }"
                    :disabled="isLoading"
                    :title="isLoading ? 'Processing, wait a moment...' : 'Cancel'"
                    class="btn m-1 btn-danger float-right"
                >
                    Cancel
                </router-link>
            </div>
        </div>
    </form>
</template>
<script>

import { mapState } from "vuex";
import validationMixins from "@/mixins/validationMixins";

export default {
    name: "RssForm",
    mixins: [validationMixins],
    data() {
        return {
            podcastEndpoint: "/rss"
        }
    },
    computed: {
        ...mapState({
            podcastData: state => state.Rss.data,
            isLoading: state => state.Application.isLoading
        }),
        siteName: {
            get() {
                return this.$store.state.Rss.data.site;
            },
            set(siteName) {
                this.$store.commit("Rss/SET_SITE_NAME", siteName);
            }
        },
        podcastUrl: {
            get() {
                return this.$store.state.Rss.data.url;
            },
            set(podcastUrl) {
                this.$store.commit("Rss/SET_PODCAST_URL", podcastUrl);
            }
        },
        rssUrl: {
            get() {
                return this.$store.state.Rss.data.rss_url;
            },
            set(rssUrl) {
                this.$store.commit("Rss/SET_URL", rssUrl);
            }
        }
    },
    created() {
        this.$store.dispatch("Rss/updateCurrent", this.$route.params.id);
    },
    beforeDestroy() {
        this.$store.dispatch("Rss/cleanData");
    },
    methods: {
        async submitPodcastForm() {
            const isFormValid = await this.validateFields();
            if (isFormValid) {
                this.$store.commit("Application/SET_IS_LOADING", true);
                const url = this.isEditing ? `${this.podcastEndpoint}/${this.$route.params.id}` : this.podcastEndpoint;
                const method = this.isEditing ? "PUT" : "POST";

                axios({
                    url,
                    method,
                    data: this.podcastData
                }).then(() => {
                    this.$notify({
                        text: "Podcast saved successfully",
                        type: "success"
                    });
                    this.$router.push({ name: "browse", params: { resource: "rss" } });
                }).catch(error => {
                    this.$notify({
                        text: error.response.data.errors.message,
                        type: "error"
                    });
                }).finally(() => {
                    this.$store.commit("Application/SET_IS_LOADING", false);
                });
            } else {
                this.$_focusOnError();
            }

        },
        async validateFields() {
            const isValid = await this.$validator.validateAll();
            if (!isValid) {
                return false;
            }
            return true;
        }
    }
}
</script>
<style lang="scss" scoped>

</style>
