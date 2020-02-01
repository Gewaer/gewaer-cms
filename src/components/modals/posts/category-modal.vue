<template>
    <modal
        name="post-category-modal"
        height="auto"
        @before-open="(event) => action = event.params.action"
    >
        <div class="post-category-modal">
            <h3>Add Category</h3>
            <post-category-form
                :opened-in-modal="true"
                @form-cancelled="onFormCancelled"
                @form-saved="onFormSaved"
            />
        </div>
    </modal>
</template>

<script>
export default {
    name: "PostCategoryModal",
    components: {
        postCategoryForm: () => import(/* webpackChunkName: "post-category-form" */ "@c/forms/posts/category-form")
    },
    data() {
        return {
            action: ""
        }
    },
    methods: {
        onFormSaved(category) {
            if (this.action) {
                this.$store.dispatch(this.action, category);
            }
            this.$modal.hide("post-category-modal");
        },
        onFormCancelled() {
            this.$modal.hide("post-category-modal");
        }
    }
}
</script>
<style lang="scss">
.post-category-modal {
    h3 {
        padding: 0 25px;
        margin: 0;
        padding-top: 20px;
    }
}
</style>
