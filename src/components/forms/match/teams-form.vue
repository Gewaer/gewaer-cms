<template>
    <div>
        <div class="row">
            <div class="col">
                <h3 class="title">Teams</h3>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-4 col-md-4 col-sm-12">
                <div class="form-group-multiselect">
                    <label :class="{'text-danger': errors.has('team-a') }">
                        Team A
                        <span v-if="errors.has('team-a')">(required)</span>
                    </label>
                    <multiselect-wrapper
                        v-validate="'required'"
                        v-model="matchTeamA"
                        :endpoint="teamsEndpoint"
                        :multiselect-props="teamsMultiselectCustomProps"
                        :class="{'border-danger': errors.has('team-a')}"
                        title="Select match team A"
                        field="name"
                        data-vv-as="Team A"
                        name="team-a"
                    />
                </div>
            </div>
            <div class="col-lg-4 col-md-4 col-sm-12">
                <div class="form-group-multiselect">
                    <label :class="{'text-danger': errors.has('team-b') }">
                        Team B
                        <span v-if="errors.has('team-b')">(required)</span>
                    </label>
                    <multiselect-wrapper
                        v-validate="'required'"
                        v-model="matchTeamB"
                        :multiselect-props="teamsMultiselectCustomProps"
                        :endpoint="teamsEndpoint"
                        :class="{'border-danger': errors.has('team-b')}"
                        title="Select match team B"
                        field="name"
                        data-vv-as="Team B"
                        name="team-b"
                    />
                </div>
            </div>
            <div class="col-lg-4 col-md-4 col-sm-12">
                <div class="form-group-multiselect">
                    <label>
                        Winning Team
                    </label>
                    <multiselect-wrapper
                        v-model="winningTeam"
                        :multiselect-props="teamsMultiselectCustomProps"
                        :endpoint="teamsEndpoint"
                        title="Select match winner team"
                        field="name"
                        data-vv-as="Winning Team"
                        name="winning-team"
                    />
                </div>
            </div>
        </div>
    </div>
</template>
<script>

export default {
    name: "TeamsForm",
    components: {
        multiselectWrapper: () => import(/* webpackChunkName: "multiselect-wrapper" */ "@c/multiselect-wrapper/multiselect-wrapper")
    },
    data() {
        return {
            teamsEndpoint: "/teams",
            teamsMultiselectCustomProps: {
                "label": "name",
                "single": true
            }
        }
    },
    computed: {
        matchTeamA: {
            get() {
                return this.$store.state.Match.data.team_a;
            },
            set(teamA) {
                this.$store.commit("Match/SET_TEAM_A", teamA);
            }
        },
        matchTeamB: {
            get() {
                return this.$store.state.Match.data.team_b;
            },
            set(teamB) {
                this.$store.commit("Match/SET_TEAM_B", teamB);
            }
        },
        winningTeam: {
            get() {
                return this.$store.state.Match.data.winning_team;
            },
            set(team) {
                this.$store.commit("Match/SET_WINNING_TEAM", team);
            }
        }
    }
}
</script>
