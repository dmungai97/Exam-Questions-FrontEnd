<template>
  <b-modal v-model="modalShow">
    {{ message }}
    <template v-slot:modal-footer="{ cancel }">
      <b-button size="sm" variant="secondary-outline" @click="ok()">
        {{ positiveText }}
      </b-button>
      <b-button size="sm" variant="secondary-outline" @click="cancel()">
        {{ negativeText }}
      </b-button>
    </template>
  </b-modal>
</template>

<script>
export default {
  name: 'MessageModal',
  props: ['show', 'message', 'positiveText', 'negativeText'],
  watch: {
    show: {
      handler(newVal) {
        this.modalShow = newVal;
      }
    },
    modalShow: {
      handler(newVal) {
        if (!newVal && this.emitMessage) this.$emit('close', false);
      }
    }
  },
  data() {
    return {
      modalShow: false,
      emitMessage: true
    };
  },
  methods: {
    ok() {
      this.$emit('close', true);
      this.emitMessage = false;
      this.modalShow = false;
    }
  }
};
</script>
