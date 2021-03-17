<template>
  <b-modal v-model="modalShow" @cancel="handleCancel">
    <template v-slot:modal-header>
      <h5>Document</h5>
    </template>
    <template v-slot:default>
      <TextInput
        v-model="value.publicFileName"
        :label="$t('documentEntry.file.label')"
        :placeholder="$t('documentEntry.file.placeholder')"
        type="text"
      ></TextInput>
      <TextInput
        v-model="value.url"
        :label="$t('documentEntry.link.label')"
        :placeholder="$t('documentEntry.link.placeholder')"
        type="text"
      ></TextInput>
    </template>
    <template v-slot:modal-footer="{ cancel }">
      <b-button size="sm" variant="secondary-outline" @click="ok()">
        {{ $t('documentEntry.buttons.save') }}
      </b-button>
      <b-button size="sm" variant="secondary-outline" @click="cancel()">
        {{ $t('documentEntry.buttons.cancel') }}
      </b-button>
    </template>
  </b-modal>
</template>

<script>
/* eslint-disable no-debugger */
import TextInput from './TextInput';
import { isAllStateValid, setAllStateDirty, clearAllStateDirty } from '../helpers/inputState';

export default {
  name: 'DocumentEntry',
  components: {
    TextInput
  },
  props: {
    show: {
      type: Boolean
    },
    value: {
      type: Object
    }
  },
  watch: {
    show: {
      handler(newVal) {
        this.modalShow = newVal;
        if (newVal) this.emitMessage = true;
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
      if (isAllStateValid(this.value)) {
        this.$emit('close', true);
        this.emitMessage = false;
        this.modalShow = false;
        clearAllStateDirty(this.value);
      } else {
        setAllStateDirty(this.value);
      }
    },
    handleCancel() {
      clearAllStateDirty(this.value);
    }
  }
};
</script>
