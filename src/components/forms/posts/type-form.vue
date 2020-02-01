<template>
    <form
        class="resource-form"
        novalidate
        @submit.prevent="$_sendResourceForm('/posts-types')">
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
    name: "PostTypeForm",
    mixins: [postFormMixins],
    created() {
        if (this.$_isEditingForm() && !this.openedInModal) {
            this.fetchPostType();
        }
    },
    methods: {
        fetchPostType() {
            axios.get(`/posts-types/${this.$route.params.id}`).then(({ data: type }) => {
                this.resourceData = type;
            });
        }
    }
}
</script>
