<template>
    <form
        class="resource-form"
        novalidate
        @submit.prevent="$_sendResourceForm('/tags')"
    >
        <div class="row">
            <div class="col">
                <div :class="{ 'border-danger': errors.has('title') }" class="form-group form-group-default">
                    <label :class="{'text-danger': errors.has('title') }">
                        Title
                        <span v-if="errors.has('title')">(required)</span>
                    </label>
                    <input
                        v-validate="'required'"
                        v-model="resourceTitle"
                        data-vv-as="Title"
                        data-vv-name="title"
                        autofocus
                        class="form-control"
                        type="text"
                    >
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <div :class="{ 'border-danger': errors.has('slug') }" class="form-group form-group-default">
                    <label :class="{'text-danger': errors.has('slug') }">
                        Slug
                        <span v-if="errors.has('slug')">(required)</span>
                    </label>
                    <input
                        v-validate="'required'"
                        v-model="resourceSlug"
                        data-vv-as="Slug"
                        data-vv-name="slug"
                        autofocus
                        class="form-control"
                        type="text"
                    >
                </div>
            </div>
        </div>
        <div class="row justify-content-end">
            <div class="col-auto">
                <button
                    :disabled="isLoading"
                    :title="isLoading ? 'Processing, wait a moment...' : 'Cancel'"
                    type="button"
                    class="btn btn-danger"
                    @click="$_onFormCancelled"
                >
                    Cancel
                </button>
            </div>
            <div class="col-auto">
                <button class="btn btn-primary">Save</button>
            </div>
        </div>
    </form>
</template>

<script>

import postFormMixins from "@/mixins/postFormMixins";

export default {
    name: "PostTagForm",
    mixins: [postFormMixins],
    created() {
        if (this.$_isEditingForm() && !this.openedInModal) {
            this.fetchTag();
        }
    },
    methods: {
        fetchTag() {
            axios.get(`/tags/${this.$route.params.id}`).then(({ data: tag }) => {
                this.resourceData = tag;
            });
        }
    }

}
</script>
