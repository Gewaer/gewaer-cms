<template>
    <div v-if="!isEditing || game.id">
        <form class="resource-form" @submit.prevent="submitForm">
            <div class="row">
                <div class="col">
                    <h3 class="title">Basic Info</h3>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <div :class="{ 'border-danger': errors.has('title') }" class="form-group form-group-default">
                        <label :class="{'text-danger': errors.has('title') }">
                            Title
                            <span v-if="errors.has('title')">({{ errors.first('title') }})</span>
                        </label>
                        <input
                            v-validate="'required'"
                            v-model.trim="gameTitle"
                            class="form-control"
                            type="text"
                            name="title"
                            data-vv-validate-on="blur"
                        >
                    </div>
                </div>
                <div class="col">
                    <div :class="{ 'border-danger': errors.has('name') }" class="form-group form-group-default">
                        <label :class="{'text-danger': errors.has('name') }">
                            Name
                            <span v-if="errors.has('name')">({{ errors.first('name') }})</span>
                        </label>
                        <input
                            v-validate="'required'"
                            v-model.trim="game.name"
                            class="form-control"
                            type="text"
                            name="name"
                            data-vv-validate-on="blur"
                        >
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-6">
                    <div :class="{ 'border-danger': errors.has('slug') }" class="form-group form-group-default">
                        <label :class="{'text-danger': errors.has('slug') }">
                            Slug
                            <span v-if="errors.has('slug')">({{ errors.first('slug') }})</span>
                        </label>
                        <input
                            v-validate="'required'"
                            v-model.trim="gameSlug"
                            class="form-control"
                            type="text"
                            name="slug"
                            data-vv-validate-on="blur"
                        >
                    </div>
                </div>

                <div class="col-6">
                    <label :class="{ 'text-danger': errors.has('game-release-date') }" class="mb-0 mr-2">
                        Release Date
                        <span v-if="errors.has('game-release-date')">({{ errors.first('game-release-date') }})</span>
                    </label>
                    <div class="form-group-multiselect">
                        <el-date-picker
                            v-validate="'required'"
                            v-model.lazy="releaseDate"
                            :class="{'border-danger': errors.has('game-release-date')}"
                            :clearable="false"
                            :format="'yyyy-MM-dd'"
                            :value-format="'yyyy-MM-dd'"
                            class="datetime-picker display-block"
                            size="small"
                            type="date"
                            placeholder="Select a date and time"
                            name="game-release-date"
                            data-vv-as="Release Date"
                            data-vv-name="game-release-date"
                            data-vv-validate-on="blur"
                        />
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col">
                    <h3 class="title">Media</h3>
                </div>
            </div>

            <div class="row">
                <div class="col">
                    <div :class="{ 'border-danger': errors.has('logo-url') }" class="form-group form-group-default">
                        <label :class="{'text-danger': errors.has('logo-url') }">
                            Logo Url
                            <span v-if="errors.has('logo-url')">({{ errors.first('logo-url') }})</span>
                        </label>
                        <input
                            v-validate="'required'"
                            v-model.trim.lazy="game.logo"
                            type="url"
                            placeholder="https://www.example.com"
                            pattern="https?://.*"
                            size="30"
                            class="form-control"
                            data-vv-name="logo-url"
                            data-vv-as="Logo Url"
                            data-vv-validate-on="blur"
                        >
                    </div>
                </div>
                <div class="col">
                    <div :class="{ 'border-danger': errors.has('icon-url') }" class="form-group form-group-default">
                        <label :class="{'text-danger': errors.has('icon-url') }">
                            Icon Url
                            <span v-if="errors.has('icon-url')">({{ errors.first('icon-url') }})</span>
                        </label>
                        <input
                            v-validate="'required'"
                            v-model.trim.lazy="game.icon"
                            type="url"
                            placeholder="https://www.example.com"
                            pattern="https?://.*"
                            size="30"
                            class="form-control"
                            data-vv-name="icon-url"
                            data-vv-as="Icon Url"
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
                        :to="{ name: 'browse', params: { resource: 'games'} }"
                        :disabled="isLoading"
                        :title="isLoading ? 'Processing, wait a moment...' : 'Cancel'"
                        class="btn m-1 btn-danger float-right"
                    >
                        Cancel
                    </router-link>
                </div>
            </div>
        </form>
    </div>
</template>
<script>


import moment from "moment";
import "moment-timezone";
import { mapState } from "vuex";
import { dateFormats } from "@/utils/helpers";
const slugify = require("@sindresorhus/slugify");

export default {
    name: "GamesForm",
    data() {
        return {
            game: {
                title: "",
                name: "",
                slug: "",
                release_date: "",
                logo: "",
                icon: ""
            },
            isLoading: false,
            gamesEndpoint: "games",
            isEditing: this.$route.params.id
        }
    },
    computed: {
        ...mapState({
            timezone: state => state.User.data.timezone
        }),
        gameTitle: {
            get() {
                return this.game.title;
            },
            set(title) {
                this.game.slug = slugify(title);
                this.game.title = title;
            }
        },
        releaseDate: {
            get() {
                const releaseDate = this.game.release_date;
                if (!releaseDate) {
                    return null;
                }
                return moment(releaseDate).tz(this.timezone).toDate();
            },
            set(date) {
                const releaseDate = date ? moment.utc(date).format(dateFormats.dateTimeStamp) : null;
                this.game.release_date = releaseDate;
            }
        },
        gameSlug: {
            get() {
                return this.game.slug;
            },
            set(value) {
                this.game.slug = slugify(value);
            }
        }
    },
    created() {
        this.fetchGame();
    },
    methods: {
        async submitForm() {
            const isFormValid = await this.$validator.validateAll();
            if (isFormValid) {
                this.$store.commit("Application/SET_IS_LOADING", true);

                const url = this.isEditing ? `${this.gamesEndpoint}/${this.$route.params.id}` : this.gamesEndpoint;
                const method = this.isEditing ? "PUT" : "POST";

                axios({
                    url,
                    method,
                    data: this.game
                }).then(() => {
                    this.$notify({
                        text: "Game saved successfully",
                        type: "success"
                    });
                    this.$router.push({ name: "browse", params: { resource: "games" } });
                }).catch(error => {
                    this.$notify({
                        text: error.response.data.errors.message,
                        type: "error"
                    });
                }).finally(() => {
                    this.$store.commit("Application/SET_IS_LOADING", false);
                });
            }
        },
        fetchGame() {
            if (!this.isEditing) {
                return;
            }

            this.$store.commit("Application/SHOW_LOADER", true);
            axios({
                url: `/games/${this.$route.params.id}`
            }).then(({ data: game }) => {
                this.game = game;
            }).catch(error => {
                this.$notify({
                    text: error.response.data.errors.message,
                    type: "error"
                });
            }).finally(() => {
                this.$store.commit("Application/SHOW_LOADER", false);
            });
        }
    }
}
</script>
<style lang="scss" scoped>
.resource-form {
    .datetime-picker {
        width: initial;
    }

    .display-block {
        display: block;
    }
}
</style>
