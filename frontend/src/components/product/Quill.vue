<template>
    <div class="quill-wrapper">
        <div ref="editorContainer"></div>
    </div>
</template>
  
<script>
import Quill from 'quill';
import "quill/dist/quill.core.css";
import 'quill/dist/quill.snow.css';
  
export default {
    name: 'Quill',

    inject: ['emitter'],
    emits: ['update:modelValue'],

    props: {
        modelValue: {
            type: String,
            default: ""
        },

        toolbarOptions: {
            type: Object,
            default: {
                container: [
                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                    ['bold', 'italic', 'underline'],
                    [{ 'color': [
                        'var(--white)', 'var(--white-50a)', 'var(--white-33a)', 'var(--primary)', 'var(--secondary)', 'var(--accent)', 
                        'var(--red)', 'var(--green)' , 'var(--blue)',
                        
                    ] }],
                    [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    ['link'],
                ]
            },
        }
    },

    data() {
        return {
            quillInstance: null,
        };
    },

    methods: {
      initQuill() {

        const quillOptions = {
            // debug: 'info',
            modules: {
                toolbar: this.toolbarOptions,
            },
            placeholder: 'One ring to rule them all, one ring to find them, One ring to bring them all, and in the darkness bind them; In the Land of Mordor where the shadows lie.',
            theme: 'snow'
        };

        this.quillInstance = new Quill(this.$refs.editorContainer, quillOptions);
  
        if (this.modelValue) {
            const delta = this.quillInstance.clipboard.convert(this.modelValue);

            // this.quillInstance.setContents(delta);
            this.quillInstance.root.innerHTML = this.modelValue;
        }
  
        this.quillInstance.on('text-change', (delta, oldDelta, source) => {
            if (source === 'user') {
                this.$emit('update:modelValue', this.quillInstance.root.innerHTML);
            }
        });
      },
    },

    created() {

    },

    mounted() {
        this.initQuill();
    },

    watch: {
        modelValue(newValue) {
            if (newValue !== this.quillInstance.root.innerHTML) {
            this.quillInstance.setText(newValue);
            }
        }
    }
  }
</script>
  
<style>
.quill-wrapper {
    border: 1px solid var(--primary);
    border-radius: 8px;
}

.ql-container {
    font-family: "Source Sans 3", sans-serif;
}

.ql-toolbar.ql-snow {
    font-family: "Montserrat", serif;
    padding-top: 20px;
}

.ql-toolbar, .ql-toolbar.ql-snow, .ql-container, .ql-container.ql-snow {
    border: none;
}

.ql-toolbar {
    position: relative;
}

.ql-toolbar::after {
    content: "";
    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translateX(-50%);
    width: 95%;
    height: 1px;
    background-color: var(--white-10a);
}

.ql-editor.ql-blank::before {
    color: rgba(255, 255, 255, 0.33);
}

.ql-toolbar.ql-snow .ql-formats {
    display: inline-flex;
    column-gap: 8px;
}

.ql-toolbar.ql-snow .ql-formats button {
    border-radius: 4px;
}
.ql-toolbar.ql-snow .ql-formats button:hover {
    background: rgb(255, 154, 158, 0.15);
}

.ql-toolbar .ql-formats button .ql-stroke {
    stroke: var(--secondary);
}
.ql-toolbar .ql-formats button .ql-fill {
    fill: var(--secondary);
}

.ql-toolbar .ql-formats button, .ql-formats .ql-fill, .ql-format .ql-stroke {
    transition: all 0.15s ease-in-out;
}

.ql-toolbar .ql-formats button {
    color: var(--white);
    background: var(--black);
}

.ql-toolbar .ql-formats button:hover .ql-stroke,
.ql-toolbar .ql-formats button:focus .ql-stroke {
    stroke: var(--primary);
}

.ql-toolbar .ql-formats button:hover .ql-fill,
.ql-toolbar .ql-formats button:focus .ql-fill {
    fill: var(--primary);
}

.ql-snow.ql-toolbar button.ql-active .ql-stroke {
    stroke: initial;
}

.ql-snow.ql-toolbar button.ql-active .ql-fill {
    fill: initial;
}

.ql-snow.ql-toolbar button.ql-active .ql-stroke {
    stroke: var(--black);
}

.ql-snow.ql-toolbar button.ql-active .ql-fill {
    fill: var(--black);
}

.ql-toolbar .ql-formats .ql-active {
    background: var(--gradient-angle);
    color: var(--black);
}

.ql-toolbar .ql-picker {
    color: var(--white);
}

.ql-toolbar .ql-picker-label .ql-picker-options {
    color: var(--white);
}

.ql-toolbar .ql-picker-label, .ql-toolbar .ql-picker-label .ql-stroke {
    transition: all 0.15s ease-in-out;
}


.ql-toolbar .ql-picker-label .ql-stroke,
.ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke,
.ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke {
    stroke: rgba(255, 255, 255, 0.33);
}

.ql-snow.ql-toolbar .ql-picker-label:hover,
.ql-snow.ql-toolbar .ql-picker-item.ql-selected {
    color: var(--primary);
}

.ql-snow .ql-picker-options {
    background: rgba(0, 0, 0, 0.75);
}

.ql-toolbar.ql-snow .ql-picker-label {
    border: none;
}

.ql-toolbar.ql-snow .ql-picker.ql-expanded .ql-picker-options {
    border-color: rgba(0, 0, 0, 0.75);
}

.ql-snow.ql-toolbar .ql-picker-item:hover {
    color: var(--secondary);
}

.ql-snow.ql-toolbar .ql-picker-label.ql-active {
    color: var(--white);
    font-weight: 600;
    background: none;
}

.ql-toolbar .ql-color .ql-picker-label .ql-stroke {
    stroke: var(--secondary);
}

.ql-toolbar .ql-color .ql-picker-label:hover .ql-stroke {
    stroke: var(--primary);
}

.ql-toolbar .ql-color .ql-picker-label.ql-active {
    background: rgb(255, 154, 158, 0.15);
}

.ql-toolbar .ql-color .ql-picker-label.ql-active .ql-stroke {
    stroke: var(--primary);
}

.ql-toolbar .ql-color .ql-picker-label.ql-active .ql-color-label {
    stroke-width: 4;
    opacity: 1;
}
</style>