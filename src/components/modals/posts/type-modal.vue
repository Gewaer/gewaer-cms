<template>
    <modal
        name="post-type-modal"
        height="auto"
        @before-open="(event) => action = event.params.action"
    >
        <div class="post-type-modal">
            <h3>Add Type</h3>
            <post-type-form
                :opened-in-modal="true"
                @form-cancelled="onFormCancelled"
                @form-saved="onFormSaved"
            />
        </div>
    </modal>
</template>

<script>
export default {
    name: "TagModal",
    components: {
        postTypeForm: () => import(/* webpackChunkName: "post-type-form" */ "@c/forms/posts/type-form")
    },
    data() {
        return {
            action: ""
        }
    },
    methods: {
        onFormSaved(tag) {
            if (this.action) {
                this.$store.dispatch(this.action, tag);
            }
            this.$modal.hide("post-type-modal");
        },
        onFormCancelled() {
            this.$modal.hide("post-type-modal");
        }
    }
}
</script>
<style lang="scss">
.post-type-modal {
    h3 {
        padding: 0 25px;
        margin: 0;
        padding-top: 20px;
    }
}
</style>
