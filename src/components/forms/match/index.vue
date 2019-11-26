<template>
    <div>
        <form class="resource-form" @submit.prevent="submitForm()">
            <general-info-form />
            <transition name="fade">
                <teams-form v-if="match.game !== null" />
            </transition>
            <dates-form />

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
                        :to="{ name: 'browse', params: { resource: 'tournaments-matches'} }"
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

import { mapState } from "vuex";
import cloneDeep from "lodash/cloneDeep";

export default {
    name: "MatchForm",
    components: {
        generalInfoForm: () => import(/* webpackChunkName: "general-info-form" */ "@c/forms/match/general-info-form"),
        teamsForm: () => import(/* webpackChunkName: "teams-form" */ "@c/forms/match/teams-form"),
        datesForm: () => import(/* webpackChunkName: "dates-form" */ "@c/forms/match/dates-form")
    },
    computed: {
        ...mapState({
            isLoading: state => state.Application.isLoading,
            match: state => state.Match.data
        }),
        isEditing() {
            return Boolean(this.$route.params.id);
        }
    },
    created() {
        this.$store.dispatch("Match/updateCurrent", this.$route.params.id);
    },
    destroyed() {
        this.$store.dispatch("Match/cleanData");
    },
    methods: {
        async submitForm() {
            const isFormValid = await this.validateFields();
            if (!isFormValid) {
                return;
            }

            this.$store.commit("Application/SET_IS_LOADING", true);
            const method = this.isEditing ? "PUT" : "POST";
            const url = this.isEditing ? `/tournaments-matches/${this.$route.params.id}` : `/tournaments-matches`;

            const clonedMatch = cloneDeep(this.match);
            clonedMatch.team_a = this.match.team_a.id;
            clonedMatch.team_b = this.match.team_b.id;
            clonedMatch.winning_team = this.match.winning_team.id;

            this.$store.dispatch("Application/showLoader", true);
            axios({
                url,
                method,
                data: clonedMatch
            }).then(() => {
                this.$notify({
                    text: "Match saved successfully",
                    type: "success"
                });
                this.$router.push({ name: "browse", params: { resource: "tournaments-matches" } });
            }).catch((error) => {
                this.$notify({
                    text: error.response.data.errors.message,
                    type: "error"
                });
            }).finally(() => {
                this.$store.commit("Application/SET_IS_LOADING", false);
                this.$store.dispatch("Application/showLoader", false);
            });

        },
        async validateFields() {
            this.$validator.errors.clear();
            const validations = [];
            this.$children.forEach((vm) => {
                validations.push(vm.$validator.validateAll());
            });

            return Promise.all(validations).then(validationsResults => {
                return !validationsResults.includes(false);
            });
        }
    }
}
</script>
<style>
.fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
}
</style>
