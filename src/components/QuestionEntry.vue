<template>
  <b-modal v-model="modalShow" @cancel="handleCancel">
    <template v-slot:modal-header>
      <h5>{{ $t('questionEntry.title') }}</h5>
    </template>
    <template v-slot:default>
      <TextInput
        v-model="value.description"
        :label="$t('questionEntry.description.label')"
        :placeholder="$t('questionEntry.description.placeholder')"
        type="text"
      ></TextInput>
    </template>
    <template v-slot:modal-footer="{ cancel }">
      <b-button size="sm" variant="secondary-outline" @click="ok()">
        {{ $t('questionEntry.buttons.save') }}
      </b-button>
      <b-button size="sm" variant="secondary-outline" @click="cancel()">
        {{ $t('questionEntry.buttons.cancel') }}
      </b-button>
    </template>
  </b-modal>
</template>

<script>
import TextInput from './TextInput';
import { isAllStateValid, setAllStateDirty, clearAllStateDirty } from '../helpers/inputState';

/* eslint-disable no-debugger */
export default {
  name: 'QuestionEntry',
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
