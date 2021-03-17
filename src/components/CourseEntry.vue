<template>
  <b-modal v-model="modalShow" @cancel="handleCancel">
    <template v-slot:modal-header>
      <h5>{{ $t('courseEntry.title') }}</h5>
    </template>
    <template v-slot:default>
      <TextInput v-model="value.name" :label="$t('courseEntry.name.label')" :placeholder="$t('courseEntry.name.placeholder')" type="text"></TextInput>
      <TextInput
        v-model="value.year"
        :label="$t('courseEntry.year.label')"
        :placeholder="$t('courseEntry.year.placeholder')"
        :min="minYear"
        type="number"
      ></TextInput>
      <SelectInput v-model="value.semester" :label="$t('courseEntry.semester.label')" :options="semesterOptions"></SelectInput>
    </template>
    <template v-slot:modal-footer="{ cancel }">
      <b-button size="sm" variant="secondary-outline" @click="ok()">
        {{ $t('courseEntry.button.save') }}
      </b-button>
      <b-button size="sm" variant="secondary-outline" @click="cancel()">
        {{ $t('courseEntry.button.cancel') }}
      </b-button>
    </template>
  </b-modal>
</template>

<script>
import TextInput from './TextInput';
import SelectInput from './SelectInput';
import { isAllStateValid, setAllStateDirty, clearAllStateDirty } from '../helpers/inputState';

/* eslint-disable no-debugger */
export default {
  name: 'CourseEntry',
  components: {
    TextInput,
    SelectInput
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
  computed: {
    minYear() {
      return new Date().getFullYear();
    }
  },
  data() {
    return {
      modalShow: false,
      emitMessage: true,
      semesterOptions: [
        { text: '', value: '' },
        { text: this.$t('courseEntry.semester.fall'), value: 'Fall' },
        { text: this.$t('courseEntry.semester.winter'), value: 'Winter' },
        { text: this.$t('courseEntry.semester.spring'), value: 'Spring' }
      ]
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
