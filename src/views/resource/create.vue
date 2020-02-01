<template>
    <div class="create-resource">
        <h4 class="section-title p-l-10"> {{ resourceTitle }}</h4>
        <div class="card">
            <div class="card-block">
                <component :is="$route.params.resource"/>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";

export default {
    name: "CreateResource",
    components: {
        posts: () => import(/* webpackChunkName: "posts" */ "@c/forms/posts/posts"),
        tournamentsMatches: () => import(/* webpackChunkName: "tournaments-matches" */ "@c/forms/match/"),
        rss: () => import(/* webpackChunkName: "rss" */ "@c/forms/rss/"),
        games: () => import(/* webpackChunkName: "games" */ "@c/forms/games/"),
        postsTypes: () => import(/* webpackChunkName: "types" */ "@c/forms/posts/type-form/"),
        tags: () => import(/* webpackChunkName: "post-tag-form" */ "@c/forms/posts/tag-form"),
        categories: () => import(/* webpackChunkName: "categories-form" */ "@c/forms/posts/category-form")
    },
    data() {
        return {
            currentResource: {}
        };
    },
    computed: {
        ...mapState({
            applicationResources: state => state.Application.resources
        }),
        isEditing() {
            return this.$route.params.id;
        },
        resourceTitle() {
            return this.isEditing ? "Edit" : "Create";
        }
    },
    created() {
        this.setResource(this.$route.params.resource);
    },
    methods: {
        setResource(resourceName) {
            const resourceIndex = this.applicationResources.findIndex(resource => {
                return resource.name.toLowerCase() == resourceName;
            });
            this.currentResource = this.applicationResources[resourceIndex];
        }
    }
}
</script>

<style lang="scss">
.border-danger {
    border: 1px solid;
}

.create-resource {
    .resource-form {
        padding: 25px;

        .row > [class*=col] {
            padding-left: 5px !important;
            padding-right: 5px !important;
        }

        .title {
            font-size: 22px;
            margin-top: 0;
            border-bottom: 1px solid  var(--base-color);
            margin-bottom: 20px;
            padding-bottom: 10px;
            color:  var(--base-color);
            font-weight: normal;
        }

        label {
            text-transform: capitalize;
            font-size: 13px;
        }

        .cover-upload {
            position: relative;
            width: 133px;
            height: 133px;
            margin-bottom: 25px;
            display: flex;
            object-fit: cover;
            overflow: hidden;
            align-items: center;
            justify-content: center;

            input {
                position: absolute;
                cursor: pointer;
                left: 0;
                top: 0;
                right: 0;
                bottom: 0;
                opacity: 0;
                width: 100%;
            }
        }

        .add-author {
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid var(--base-color);
            min-height: 50px;
            height: calc(100% - 25px);
            cursor: pointer;
            margin-bottom: 25px;
            font-size: 16px;
            color: var(--base-color);

            i {
                font-size: 20px;
                margin-left: 5px;
            }
        }

        .form-group, .form-group-multiselect {
            margin-bottom: 25px;
        }

        .form-group-multiselect {
            .remove-author {
                position: absolute;
                cursor: pointer;
                right: 10px;
                top: 3px;
                opacity: .5;
                color: red;
            }
        }

        .form-group-time {
            margin-bottom: 25px;

            label {
                margin-bottom: 0;
            }

            .time-picker {
                width: 100%;

                input {
                    width: 100%;
                    height: 33px;
                    border: 1px solid #e8e8e8;
                }
            }
        }

        .theme, .comment {
            border: 1px dashed rgba(0,0,0,.07);
            padding: 20px;

            h3 {
                font-size: 20px;
                font-weight: normal;
                opacity: .7;
                margin-top: 0;
                display: flex;
                align-items: center;
                justify-content: space-between;

                i {
                    cursor: pointer;
                    opacity: .5;
                    color: red;
                }
            }

            .quill-editor {
                background-color: white;
            }

            &:nth-child(odd) {
                background-color: rgba(185, 185, 185, 0.07);
            }
        }

        .comment {
            margin-bottom: 20px;
        }
    }
}
</style>
