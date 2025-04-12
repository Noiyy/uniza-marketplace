<template>
    <label class="checkbox-cont">
        {{ text }}
        <input type="checkbox" v-model="localIsChecked" @change="changedCheckbox($event)">
        <span class="checkmark"></span>
    </label>
</template>

<script>

export default {
    name: 'Checkbox',

    inject: ['emitter'],
    emits: ['update:is-checked'],

    props: {
        text: {
            type: String,
            default: "lorem"
        },

        isChecked: {
            type: Boolean,
            default: false
        },
    },

    components: {

    },

    data() {
        return {
            localIsChecked: false
        }
    },

    methods: {
        changedCheckbox(event) {
            this.$emit("update:is-checked", this.localIsChecked);
        }
    },

    mounted() {
        this.localIsChecked = this.isChecked;
    }
}
</script>

<style scoped>
.checkbox-cont {
  display: block;
  position: relative;
  padding-left: 32px;
  margin-bottom: 8px;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  line-height: 100%;
  font-weight: 300;
}

.checkbox-cont input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: -2px;
  left: 0;
  height: 20px;
  width: 20px;
  background-color: var(--black);
  border: 1px solid var(--primary);
  border-radius: 4px;
  transition: all 0.15s ease-in-out;
}

.checkbox-cont:hover input ~ .checkmark {
  background-color: rgb(250, 208, 196, 0.2);
}

.checkbox-cont input:checked ~ .checkmark {
  background: var(--gradient-angle);
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.checkbox-cont input:checked ~ .checkmark:after {
  display: block;
}

.checkbox-cont .checkmark:after {
  left: 7px;
  top: 4px;
  width: 5px;
  height: 10px;
  border: solid var(--black);
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}
</style>