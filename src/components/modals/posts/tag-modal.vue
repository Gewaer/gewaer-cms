<template>
    <modal
        name="post-tag-modal"
        height="auto"
        @before-open="(event) => action = event.params.action"
    >
        <div class="post-tag-modal">
            <h3>Add Tag</h3>
            <post-tag-form
                :opened-in-modal="true"
                @form-cancelled="onFormCancelled"
                @form-saved="onFormSaved"
            />
        </div>
    </modal>
</template>

<script>
export default {
    name: "PostTagModal",
    components: {
        postTagForm: () => import(/* webpackChunkName: "post-tag-form" */ "@c/forms/posts/tag-form")
    },
    data() {
        return {
            action: ""
        }
    },
    methods: {
        onFormSaved(tag) {
            this.$store.dispatch("Tags/updateData");

            if (this.action) {
                this.$store.dispatch(this.action, tag);
            }
            this.$modal.hide("post-tag-modal");
        },
        onFormCancelled() {
            this.$modal.hide("post-tag-modal");
        }
    }
}
</script>
<style lang="scss">
.post-tag-modal {
    h3 {
        padding: 0 25px;
        margin: 0;
        padding-top: 20px;
    }
}
</style>
