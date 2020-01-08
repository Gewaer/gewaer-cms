<template>
    <div>
        <div
            :name="$attrs.name"
            :id="editorId"
        />
    </div>
</template>

<script>

import Quill from "quill";

export default {
    name: "QuillWrapper",
    props: {
        value: {
            type: null,
            required: true
        },
        configuration: {
            type: Object,
            default: () => {
                return { theme: "snow" };
            }
        }
    },
    $_veeValidate: {
        name() {
            return this.$attrs.name;
        },
        value() {
            return this.value;
        }
    },
    data() {
        return {
            editorId: Math.random().toString(16).replace("0.", "q"),
            quill: null
        }
    },
    mounted() {
        this.initializeQuill();
    },
    methods: {
        initializeQuill() {
            this.lineHeightSetup();

            this.quill = new Quill(`#${this.editorId}`, this.configuration);

            this.quill.container.firstChild.innerHTML = this.value;

            this.quill.on("text-change", (delta, oldDelta, source) => {
                if (["user", "api"].includes(source)) {
                    const quillContainer = this.quill.container.firstChild;
                    if (quillContainer.innerText || quillContainer.innerHTML.includes("<img")) {
                        this.$emit("input", quillContainer.innerHTML);
                    } else {
                        this.$emit("input", "");
                    }
                }
            });
        },
        lineHeightSetup() {
            const Parchment = Quill.import("parchment");
            const lineHeightConfig = {
                scope: Parchment.Scope.INLINE,
                whitelist: [
                    "1.0",
                    "1.5",
                    "2.0",
                    "2.5",
                    "3.0"
                ]
            };
            const lineHeightClass = new Parchment.Attributor.Class(
                "lineheight",
                "ql-line-height",
                lineHeightConfig
            );
            const lineHeightStyle = new Parchment.Attributor.Style(
                "lineheight",
                "line-height",
                lineHeightConfig
            );
            Parchment.register(lineHeightClass);
            Parchment.register(lineHeightStyle);
        }
    }
}
</script>

<style>
.ql-editor {
    min-height: 100px;
    max-height: 400px;
    color: black;
}

.ql-toolbar, .ql-container {
    border: 1px solid #e8e8e8 !important;
}
.ql-snow .ql-picker.ql-lineheight {
    width: 58px;
}
.ql-snow .ql-picker.ql-lineheight .ql-picker-item[data-value="1.0"]::before {
    content: "1.0";
}
.ql-snow .ql-picker.ql-lineheight .ql-picker-label[data-value="1.0"]::before {
    content: "1.0" !important;
}
.ql-snow .ql-picker.ql-lineheight .ql-picker-item[data-value="1.5"]::before {
    content: "1.5";
}
.ql-snow .ql-picker.ql-lineheight .ql-picker-label[data-value="1.5"]::before {
    content: "1.5" !important;
}
.ql-snow .ql-picker.ql-lineheight .ql-picker-item[data-value="2.0"]::before {
    content: "2.0";
}
.ql-snow .ql-picker.ql-lineheight .ql-picker-label[data-value="2.0"]::before {
    content: "2.0" !important;
}
.ql-snow .ql-picker.ql-lineheight .ql-picker-item[data-value="2.5"]::before {
    content: "2.5";
}
.ql-snow .ql-picker.ql-lineheight .ql-picker-label[data-value="2.5"]::before {
    content: "2.5" !important;
}
.ql-snow .ql-picker.ql-lineheight .ql-picker-item[data-value="3.0"]::before {
    content: "3.0";
}
.ql-snow .ql-picker.ql-lineheight .ql-picker-label[data-value="3.0"]::before {
    content: "3.0" !important;
}

img {
    display: block;
}
</style>
