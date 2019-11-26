<template>
    <div>
        <div class="row">
            <div class="col">
                <h3 class="title">General</h3>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-12 col-md-4 col-lg-4">
                <div :class="{ 'border-danger': errors.has('third-party-id') }" class="form-group form-group-default">
                    <label :class="{'text-danger': errors.has('third-party-id') }">
                        Third Party Id
                        <span v-if="errors.has('third-party-id')">({{ errors.first('third-party-id') }})</span>
                    </label>
                    <input
                        v-validate="'required|integer|min_value:1'"
                        v-model="thirdPartyId"
                        class="form-control"
                        type="number"
                        name="third-party-id"
                        data-vv-as="Third Party Id"
                        data-vv-validate-on="change"
                    >
                </div>
            </div>
            <div class="col-sm-12 col-md-4 col-lg-4">
                <div class="form-group-multiselect">
                    <label :class="{'text-danger': errors.has('game') }">
                        Game
                        <span v-if="errors.has('game')">(required)</span>
                    </label>
                    <multiselect-wrapper
                        v-validate="'required'"
                        v-model="matchGame"
                        :endpoint="gameFieldProps.endpoint"
                        :multiselect-props="gameFieldProps.multiselectProps"
                        :class="{'border-danger': errors.has('game')}"
                        field="name"
                        name="game"
                        data-vv-as="some id"
                    />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "GeneralInfo",
    components: {
        multiselectWrapper: () => import(/* webpackChunkName: "multiselect-wrapper" */ "@c/multiselect-wrapper/multiselect-wrapper")
    },
    data() {
        return {
            gameFieldProps: {
                endpoint: "games",
                multiselectProps: {
                    "label": "name"
                }
            }
        }
    },
    computed: {
        thirdPartyId: {
            get() {
                return this.$store.state.Match.data.third_party_id;
            },
            set(value) {
                this.$store.commit("Match/SET_THIRD_PARTY_ID", value);
            }
        },
        matchGame: {
            get() {
                return this.$store.state.Match.data.game;
            },
            set(game) {
                this.$store.commit("Match/SET_GAME", game);
            }
        }
    }
}
</script>

<style lang="scss">

</style>
