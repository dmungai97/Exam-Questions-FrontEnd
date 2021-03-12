<template>
  <b-modal v-model="modalShow" @cancel="handleCancel">
    <template v-slot:modal-header>
      <h5>{{ $t('studentEntry.title') }}</h5>
    </template>
    <template v-slot:default>
      <TextInput
        v-model="value.name"
        :label="$t('studentEntry.name.label')"
        :placeholder="$t('studentEntry.name.placeholder')"
        type="text"
      ></TextInput>
      <TextInput
        v-model="value.number"
        :label="$t('studentEntry.number.label')"
        :placeholder="$t('studentEntry.number.placeholder')"
        type="text"
      ></TextInput>
    </template>
    <template v-slot:modal-footer="{ cancel }">
      <b-button size="sm" variant="secondary-outline" @click="ok()">
        {{ $t('studentEntry.buttons.save') }}
      </b-button>
      <b-button size="sm" variant="secondary-outline" @click="cancel()">
        {{ $t('studentEntry.buttons.cancel') }}
      </b-button>
    </template>
  </b-modal>
</template>

<script>
import TextInput from './TextInput';
import { isAllStateValid, setAllStateDirty, clearAllStateDirty } from '../helpers/inputState';

export default {
  name: 'StudentEntry',
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
