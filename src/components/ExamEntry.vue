<template>
  <b-modal v-model="modalShow" @cancel="handleCancel">
    <template v-slot:modal-header>
      <h5>{{ $t('examEntry.title') }}</h5>
    </template>
    <template v-slot:default>
      <b-alert :show="isOldDate">{{ $t('examEntry.messages.oldDateWarning') }}</b-alert>
      <TextInput v-model="value.name" :label="$t('examEntry.name.label')" :placeholder="$t('examEntry.name.placeholder')" type="text"></TextInput>
      <b-form-group :label="$t('examEntry.date.label')">
        <b-form-datepicker v-model="startDate" :min="minDate" :state="startTime.state()"></b-form-datepicker>
      </b-form-group>
      <TextInput
        v-model="startTime"
        :label="$t('examEntry.startTime.label')"
        :placeholder="$t('examEntry.startTime.placeholder')"
        type="text"
        @blur="formatTime"
      >
        <b-input-group-append>
          <b-form-timepicker v-model="startTime.text" button-only right></b-form-timepicker>
        </b-input-group-append>
      </TextInput>
      <TextInput
        v-model="value.durationMinutes"
        :label="$t('examEntry.durationMinutes.label')"
        :placeholder="$t('examEntry.durationMinutes.placeholder')"
        :min="minTime"
        type="number"
      ></TextInput>
      <TextInput v-model="value.authenticationCode" :label="$t('examEntry.authenticationCode.label')" type="text">
        <b-input-group-append>
          <b-button @click="handleAutoAuthCode"><b-icon icon="arrow-repeat"></b-icon></b-button>
        </b-input-group-append>
      </TextInput>
      <b-form-checkbox v-model="value.isLimitedAccess">{{ $t('examEntry.limitedAccess.label') }}</b-form-checkbox>
    </template>
    <template v-slot:modal-footer="{ cancel }">
      <b-button size="sm" variant="secondary-outline" @click="ok()">
        {{ $t('examEntry.buttons.save') }}
      </b-button>
      <b-button size="sm" variant="secondary-outline" @click="cancel()">
        {{ $t('examEntry.buttons.cancel') }}
      </b-button>
    </template>
  </b-modal>
</template>

<script>
import moment from 'moment';
import generator from 'generate-password';
import TextInput from './TextInput';
import { isAllStateValid, setAllStateDirty, clearAllStateDirty, InputState } from '../helpers/inputState';

const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;

/* eslint-disable no-debugger */
export default {
  name: 'ExamEntry',
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
      immediate: true,
      handler(newVal) {
        if (!newVal && this.emitMessage) this.$emit('close', false);
      }
    },
    value: {
      immediate: true,
      deep: true,
      handler(newVal) {
        if (newVal && newVal.start) {
          this.startDate = newVal.start.toISOString();
          this.formatTime();
        }
      }
    }
  },
  computed: {
    isOldDate() {
      return this.calcDateTime().isBefore(moment());
    },
    minTime() {
      return 1;
    }
  },
  data() {
    return {
      modalShow: false,
      emitMessage: true,
      startDate: new Date().toISOString(),
      startTime: new InputState(this.isDateTimeValid),
      minDate: new Date()
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
    handleAutoAuthCode() {
      this.value.authenticationCode.text = generator.generate({
        length: 8,
        numbers: true,
        excludeSimilarCharacters: true
      });
    },
    handleCancel() {
      this.startTime.clearDirty();
      clearAllStateDirty(this.value);
    },
    calcDateTime() {
      let hours = 0;
      let minutes = 0;
      if (this.startTime.text && this.startTime.text.length > 0) {
        const timeParts = this.startTime.text.split(':');
        if (timeParts.length > 0) {
          const h = parseInt(timeParts[0]);
          if (!isNaN(h) && h >= 0 && h < HOURS_IN_DAY) {
            hours = h;
          }
        }
        if (timeParts.length > 1) {
          const m = parseInt(timeParts[1]);
          if (!isNaN(m) && m >= 0 && m < MINUTES_IN_HOUR) {
            minutes = m;
          }
        }
      }
      const start = moment(this.startDate)
        .hours(hours)
        .minutes(minutes);

      //update this so it doesn't get overwritten by our watch
      this.value.start = start.toDate();

      return start;
    },
    formatTime() {
      const hours = this.value.start.getHours();
      const minutes = this.value.start.getMinutes();
      const newTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      this.startTime.text = newTime;
    },
    isDateTimeValid() {
      return this.calcDateTime().isAfter(moment());
    }
  }
};
</script>
