<template>
  <b-form-group :label="label" :label-for="$id('form-input')">
    <b-input-group>
      <b-form-input
        :id="$id('form-input')"
        v-model="data.text"
        trim
        :min="min"
        :type="type"
        :state="data.state()"
        :placeholder="placeholder"
        @blur="handleBlur"
        @keyup.enter="handleEnter"
      ></b-form-input>
      <slot></slot>
    </b-input-group>
  </b-form-group>
</template>
<script>
import { InputState } from '../helpers/inputState';

/* eslint-disable no-debugger */
export default {
  name: 'TextInput',
  props: {
    value: {
      type: InputState
    },
    label: {
      type: String
    },
    type: {
      type: String
    },
    placeholder: {
      type: String
    },
    min: {
      type: Number
    }
  },
  data() {
    return {
      data: new InputState()
    };
  },
  watch: {
    value: {
      immediate: true,
      deep: true,
      handler(newVal) {
        this.data = newVal;
      }
    }
  },
  methods: {
    handleEnter() {
      this.$emit('enterKey');
    },
    handleInput() {
      this.$emit('input', this.data);
    },
    handleBlur() {
      this.data.setDirty();
      this.$emit('blur');
    }
  }
};
</script>
