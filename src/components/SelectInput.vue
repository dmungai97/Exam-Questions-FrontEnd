<template>
  <b-form-group :label="label">
    <b-input-group>
      <b-form-select v-model="data.text" :options="options" :state="data.state()" @blur.native="data.setDirty()"> </b-form-select>
      <slot></slot>
    </b-input-group>
  </b-form-group>
</template>
<script>
import { InputState } from '../helpers/inputState';

/* eslint-disable no-debugger */
export default {
  name: 'SelectInput',
  props: {
    value: {
      type: InputState
    },
    label: {
      type: String
    },
    options: {
      type: Array
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
    handleInput() {
      this.$emit('input', this.data);
    }
  }
};
</script>
