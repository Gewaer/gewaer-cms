<template>
    <div v-if="!isEditing || post.id">
        <post-category-modal />
        <post-tag-modal />
        <post-type-modal />

        <form class="resource-form" @submit.prevent="submitForm">
            <div class="row">
                <div class="col">
                    <h3 class="title">Post Content</h3>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <div :class="{ 'border-danger': errors.has('title') }" class="form-group form-group-default">
                        <label :class="{'text-danger': errors.has('title') }">
                            Title
                            <span v-if="errors.has('title')">(required)</span>
                        </label>
                        <input
                            v-validate="'required'"
                            v-model="postTitle"
                            class="form-control"
                            type="text"
                            data-vv-name="title"
                            data-vv-validate-on="blur"
                        >
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <div :class="{ 'border-danger': errors.has('slug') }" class="form-group form-group-default">
                        <label :class="{'text-danger': errors.has('slug') }">
                            Slug
                            <span v-if="errors.has('slug')"> (required) </span>
                        </label>
                        <input
                            v-validate="'required'"
                            v-model.trim.lazy="postSlug"
                            class="form-control"
                            type="text"
                            data-vv-name="slug"
                            data-vv-as="Slug"
                            data-vv-validate-on="blur"
                        >
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12 col-md">
                    <div class="form-group-multiselect">
                        <label :class="{'text-danger': errors.has('game') }">
                            Game
                            <span v-if="errors.has('game')">(required)</span>
                        </label>
                        <multiselect-wrapper
                            v-validate="'required'"
                            v-model="postGame"
                            :endpoint="gameFieldProps.endpoint"
                            :multiselect-props="gameFieldProps.multiselectProps"
                            :class="{'border-danger': errors.has('game')}"
                            field="name"
                            name="game"
                        />
                    </div>
                </div>
                <div class="col-12 col-md">
                    <div class="form-group-multiselect">
                        <label :class="{'text-danger': errors.has('author') }">
                            Author
                            <span v-if="errors.has('author')">(required)</span>
                        </label>
                        <multiselect-wrapper
                            v-validate="'required'"
                            v-model="postAuthor"
                            :endpoint="userFieldProps.endpoint"
                            :multiselect-props="userFieldProps.multiselectProps"
                            :class="{'border-danger': errors.has('author')}"
                            field="firstname"
                            data-vv-as="Author"
                            data-vv-name="author"
                        >
                            <template v-if="!isEmpty(postAuthor)" slot="singleLabel">
                                {{ postAuthor.firstname }} {{ postAuthor.lastname }}
                            </template>
                            <template
                                slot="option"
                                slot-scope="scopedProps"
                            >
                                <div v-if="!isEmpty(scopedProps)" class="option__desc">
                                    <span class="option__title">{{ scopedProps.props.option.firstname }} {{ scopedProps.props.option.lastname }}</span>
                                </div>
                            </template>
                        </multiselect-wrapper>
                    </div>
                </div>
                <div class="col-12 col-md">
                    <div class="form-group-multiselect">
                        <label :class="{'text-danger': errors.has('collaborator') }">
                            Collaborator
                            <span v-if="errors.has('collaborator')">(required)</span>
                        </label>
                        <multiselect-wrapper
                            v-validate="'required'"
                            v-model="postCollaborator"
                            :endpoint="userFieldProps.endpoint"
                            :multiselect-props="userFieldProps.multiselectProps"
                            :class="{'border-danger': errors.has('collaborator')}"
                            field="firstname"
                            data-vv-as="Collaborator"
                            data-vv-name="collaborator"
                        >
                            <template v-if="!isEmpty(postCollaborator)" slot="singleLabel">
                                {{ postCollaborator.firstname }} {{ postCollaborator.lastname }}
                            </template>
                            <template

                                slot="option"
                                slot-scope="props"
                            >
                                <div v-if="!isEmpty(props)" class="option__desc">
                                    <span class="option__title">{{ props.props.option.firstname }} {{ props.props.option.lastname }}</span>
                                </div>
                            </template>
                        </multiselect-wrapper>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <div class="form-group">
                        <label :class="{ 'text-danger': errors.has('summary') }">
                            Summary
                            <span v-if="errors.has('summary')">(required)</span>
                        </label>
                        <quill-wrapper
                            v-validate="'required'"
                            :class="{ 'border-danger': errors.has('summary') }"
                            v-model="postSummary"
                            :configuration="quillConfiguration"
                            data-vv-name="summary"
                            name="summary"
                            data-vv-as="Body"
                        />
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <div class="form-group">
                        <label :class="{ 'text-danger': errors.has('content') }">
                            Content
                            <span v-if="errors.has('content')">(required)</span>
                        </label>
                        <quill-wrapper
                            v-validate="'required'"
                            :class="{ 'border-danger': errors.has('content') }"
                            v-model="postContent"
                            :configuration="quillConfiguration"
                            class="post-content"
                            data-vv-name="content"
                            name="content"
                            data-vv-as="Body"
                        />
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <div :class="{ 'border-danger': errors.has('media-url') }" class="form-group form-group-default">
                        <label :class="{'text-danger': errors.has('media-url') }">
                            Media Url
                            <span v-if="errors.has('media-url')"> ({{ errors.first('media-url') }})</span>
                        </label>
                        <input
                            v-validate="'required'"
                            v-model.trim.lazy="postMediaUrl"
                            type="url"
                            placeholder="https://www.mordor.com"
                            pattern="https?://.*"
                            size="30"
                            class="form-control"
                            data-vv-name="media-url"
                            data-vv-as="Media Url"
                            data-vv-validate-on="blur"
                        >
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12 col-md">
                    <div class="form-group-multiselect">
                        <label :class="{'text-danger': errors.has('category') }">
                            Category
                            <span v-if="errors.has('category')">(required)</span>
                        </label>
                        <multiselect-wrapper
                            v-validate="'required'"
                            v-model="postCategory"
                            :endpoint="categoryFieldProps.endpoint"
                            :multiselect-props="categoryFieldProps.multiselectProps"
                            :class="{'border-danger': errors.has('category')}"
                            field="title"
                            data-vv-as="Category"
                            data-vv-name="category"
                        >
                            <template slot="beforeList" >
                                <div class="add-author-button option__desc" @click="$modal.show('post-category-modal', { action: '' })">
                                    <i class="fa fa-plus" />Add Category
                                </div>
                            </template>
                        </multiselect-wrapper>
                    </div>
                </div>
                <div class="col-12 col-md">
                    <div class="form-group-multiselect">
                        <label :class="{'text-danger': errors.has('type') }">
                            Type
                            <span v-if="errors.has('type')">(required)</span>
                        </label>
                        <multiselect-wrapper
                            v-validate="'required'"
                            v-model.lazy="postType"
                            :endpoint="postTypeField.endpoint"
                            :multiselect-props="postTypeField.multiselectProps"
                            :class="{'border-danger': errors.has('type')}"
                            field="title"
                            data-vv-as="Type"
                            data-vv-name="type"
                        >
                            <template slot="beforeList" >
                                <div class="add-author-button option__desc" @click="$modal.show('post-type-modal', { action: '' })">
                                    <i class="fa fa-plus" />Add Type
                                </div>
                            </template>
                    </multiselect-wrapper></div>
                </div>
                <div class="col-12 col-md">
                    <div class="form-group-multiselect">
                        <label :class="{'text-danger': errors.has('tags') }">
                            Tags
                            <span v-if="errors.has('tags')">(required)</span>
                        </label>
                        <multiselect-wrapper
                            v-validate="'required'"
                            v-model.lazy="postTags"
                            :endpoint="postTagsField.endpoint"
                            :multiselect-props="postTagsField.multiselectProps"
                            :class="{'border-danger': errors.has('tags')}"
                            field="title"
                            data-vv-as="Tags"
                            data-vv-name="tags"
                        >
                            <template slot="beforeList" >
                                <div class="add-author-button option__desc" @click="$modal.show('post-tag-modal', { action: '' })">
                                    <i class="fa fa-plus" />Add Tag
                                </div>
                            </template>
                        </multiselect-wrapper>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <h3 class="title">Media Content</h3>
                </div>
            </div>
            <!-- TODO: dawin should fix all this crap later. hehe :P -->
            <div class="row mb-4">
                <div
                    v-for="(image, index) in postImages"
                    :key="image.id"
                    class="col-auto d-flex justify-content-center align-item-center post-images"
                >
                    <span
                        v-if="postImages.length > index"
                        title="Remove picture"
                        class="close-icon"
                        @click="removePicture(index)">&times;</span>
                    <img :src="image.url">
                </div>
                <div
                    class="add-picture-icon col-auto d-flex justify-content-center align-item-center audio-upload"
                    title="Add picture"
                >
                    <dashboard-file-uploader
                        ref="fileUploader"
                        :xhr-config="uppyXhrConfig"
                        :uppy-config="uppyConfig"
                        :show-label="false"
                        class="audio-uploader"
                        modal-button
                        @uploaded="uploaded"
                        @uploaderror="onError"
                    />
                    +
                </div>
            </div>

            <div class="row">
                <div class="col">
                    <h3 class="title">Publishing Options</h3>
                </div>
            </div>
            <post-publishing-options featured-label="Featured" store-name="Post"/>

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
                        :to="{ name: 'browse', params: { resource: 'posts'} }"
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
import validationMixins from "@/mixins/validationMixins";
import cloneDeep from "lodash/cloneDeep";
import _isEmpty from "lodash/isEmpty";

export default {
    components: {
        quillWrapper: () => import(/* webpackChunkName: "quill-wrapper" */ "@c/quill-wrapper/quill-wrapper"),
        multiselectWrapper: () => import(/* webpackChunkName: "multiselect-wrapper" */ "@c/multiselect-wrapper/multiselect-wrapper"),
        postCategoryModal: () => import(/* webpackChunkName: "category-modal" */ "@c/modals/posts/category-modal"),
        postTagModal: () => import(/* webpackChunkName: "tag-modal" */ "@c/modals/posts/tag-modal"),
        postTypeModal: () => import(/* webpackChunkName: "tag-modal" */ "@c/modals/posts/type-modal"),
        postPublishingOptions: () => import(/* webpackChunkName: "post-publishing-options" */ "@c/forms/publishing-options.vue"),
        dashboardFileUploader: () => import(/* webpackChunkName: "dashboard-file-uploader" */ "@c/dashboard-file-uploader/dashboard-file-uploader")
    },
    mixins: [validationMixins],
    data() {
        return {
            postsEndpoint: "posts",
            fileSystemEndpoint: "filesystem",
            categoryFieldProps: {
                endpoint: "categories",
                multiselectProps: {
                    "single": true,
                    "label": "title"
                }
            },
            postTypeField: {
                endpoint: "posts-types",
                multiselectProps: {
                    "single": true,
                    "label": "title"
                }
            },
            postTagsField: {
                endpoint: "tags",
                multiselectProps: {
                    "multiple": true,
                    "label": "title"
                }
            },
            userFieldProps: {
                endpoint: "/users",
                multiselectProps: {
                    label: "firstname"
                }
            },
            gameFieldProps: {
                endpoint: "games",
                multiselectProps: {
                    "label": "name"
                }
            },
            quillConfiguration: {
                modules: {
                    toolbar: {
                        container: [
                            [{ "size": ["small", false, "large", "huge"] }, { header: [1, 2, 3, 4, 5, 6, true] }, { font: [] }],
                            ["bold", "italic", "underline", "strike", { "header": 1 }, { "header": 2 }],
                            ["link", "image"],
                            [{ align: [] }, { "direction": "rtl" }],
                            [
                                {
                                    lineheight: [
                                        "1.0",
                                        "1.5",
                                        "2.0",
                                        "2.5",
                                        "3.0"
                                    ]
                                }
                            ],
                            [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }]
                        ],
                        handlers: {
                            "image": function() {
                                const input = document.createElement("input")
                                input.setAttribute("type", "file");
                                input.setAttribute("accept", "image/*");
                                input.click();
                                input.onchange = async function onchange() {
                                    const file = input.files[0];
                                    const range = this.quill.getSelection();

                                    const formData = new FormData();
                                    formData.append("files", file);
                                    formData.append("name", file.name);
                                    formData.append("type", file.type);
                                    const { data: files } = await axios.post("/filesystem", formData);
                                    const imageUrl = files[0].url;

                                    this.quill.insertEmbed(range.index, "image", imageUrl);
                                }.bind(this);
                            }
                        }
                    }
                },
                theme: "snow"
            },
            uppyConfig: {
                debug: process.env.NODE_ENV !== "production",
                restrictions: {
                    maxNumberOfFiles: 100,
                    allowedFileTypes: ["image/*"]
                }
            }
        }
    },
    computed: {
        ...mapState({
            isLoading: state => state.Application.isLoading,
            post: state => state.Post.data,
            tags: state => state.Tags.data,
            categories: state => state.Categories.data,
            postTypes: state => state.PostTypes.data,
            userToken: state => state.User.token,
            postImages: state => state.Post.data.files
        }),
        postTitle: {
            get() {
                return this.$store.state.Post.data.title;
            },
            set(title) {
                this.$store.commit("Post/SET_TITLE", title);
                this.$store.dispatch("Post/saveSluggedTitle", title);
            }
        },
        postSlug: {
            get() {
                return this.$store.state.Post.data.slug;
            },
            set(slug) {
                this.$store.dispatch("Post/saveSluggedTitle", slug);
            }
        },
        postMediaUrl: {
            get() {
                return this.$store.state.Post.data.media_url;
            },
            set(url) {
                this.$store.commit("Post/SET_MEDIA_URL", url);
            }
        },
        postSummary: {
            get() {
                return this.$store.state.Post.data.summary;
            },
            set(summary) {
                this.$store.commit("Post/SET_SUMMARY", summary);
            }
        },
        postContent: {
            get() {
                return this.$store.state.Post.data.content;
            },
            set(content) {
                this.$store.commit("Post/SET_CONTENT", content);
            }
        },
        postCategory: {
            get() {
                return this.$store.state.Post.data.category;
            },
            set(category) {
                this.$store.commit("Post/SET_CATEGORY", category);
            }
        },
        postType: {
            get() {
                return this.$store.state.Post.data.type;
            },
            set(postType) {
                this.$store.commit("Post/SET_POST_TYPE", postType);
            }
        },
        postTags: {
            get() {
                return this.$store.state.Post.data.tags;
            },
            set(tags) {
                this.$store.commit("Post/SET_POST_TAGS", tags);
            }
        },
        postAuthor: {
            get() {
                return this.$store.state.Post.data.author;
            },
            set(author) {
                this.$store.commit("Post/SET_POST_AUTHOR_NAME", author);
            }
        },
        postCollaborator: {
            get() {
                return this.$store.state.Post.data.collaborator;
            },
            set(collaborator) {
                this.$store.commit("Post/SET_POST_COLLABORATOR", collaborator);
            }
        },
        postGame: {
            get() {
                return this.$store.state.Post.data.game;
            },
            set(game) {
                this.$store.commit("Post/SET_POST_GAME", game);
            }
        },
        uppyXhrConfig() {
            return {
                formData: true,
                fieldName: "files",
                endpoint: `${axios.defaults.baseURL}/${this.fileSystemEndpoint}`,
                headers: {
                    Authorization: this.userToken
                }
            };
        },
        isEditing() {
            return this.$route.params.id;
        }
    },
    created() {
        this.$store.dispatch("Post/updateData", this.$route.params.id);
    },
    beforeDestroy() {
        this.$store.dispatch("Post/cleanUp");
    },
    methods: {
        async submitForm() {
            const isFormValid = await this.validateFields();
            if (isFormValid) {
                this.$store.commit("Application/SET_IS_LOADING", true);
                const url = this.isEditing ? `${this.postsEndpoint}/${this.$route.params.id}` : this.postsEndpoint;
                const method = this.isEditing ? "PUT" : "POST";

                const clonedPost = cloneDeep(this.post);
                clonedPost.category = clonedPost.category.id;

                clonedPost.category_id = clonedPost.category;
                clonedPost.tags = clonedPost.tags.map(tag => tag.id);
                clonedPost.post_types_id = clonedPost.type.id;
                clonedPost.collaborator_id = clonedPost.collaborator.id;
                clonedPost.author_id = clonedPost.author.id;
                clonedPost.games_id = clonedPost.game.id;

                axios({
                    url,
                    method,
                    data: clonedPost
                }).then(() => {
                    this.$notify({
                        text: "Post saved successfully",
                        type: "success"
                    });
                    this.$router.push({ name: "browse", params: { resource: "posts" } });
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
        removePicture(index) {
            this.$store.dispatch("Post/spliceFilesByIndex", index);
        },
        async validateFields() {
            const isValid = await this.$validator.validateAll();
            if (!isValid) {
                return false;
            }
            return true;
        },
        uploaded(files) {
            this.$store.dispatch("Post/addFiles", files);
        },
        onError(error) {
            this.$notify({
                title: "Error:",
                text: error,
                type: "error"
            });
        },
        isEmpty: _isEmpty
    }
}
</script>

<style lang="scss">
.post-images {

    overflow: hidden;
    position: relative;

    .close-icon {
        display: none;
        position: absolute;
        right: 10px;
        top: 10px;
        background-color: red;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 16px;
        border-radius: 100%;
        width: 30px;
        height: 30px;
        cursor: pointer;
    }

    img {
        margin-top: 5px;
        border: solid gray 1px;
        width: 300px;
        height: 200px;
        object-fit: cover;
    }

    &:hover {
        .close-icon {
            display: flex;
        }
    }
}

.audio-upload  {
    height: 54px;

    .audio-uploader {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;

        button, button:hover, button:active {
            width: 100%;
            height: 100%;
            background-color: transparent !important;
            border-color: transparent !important;
            color: black;
            text-align: left;
            padding: 10px;
            line-height: 52px;
        }
    }
}

.add-picture-icon {
    width: 300px;
    height: 200px;
    align-items: center;
    font-size: 84px;
    border: 4px dashed gray;
    margin-top: 5px;
    margin-left: 5px;
    cursor: pointer;
}
</style>
