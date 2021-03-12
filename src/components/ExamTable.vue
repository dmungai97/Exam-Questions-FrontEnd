<template>
  <div>
    <b-card>
      <b-alert class="mt-1" :show="showAlert" dismissible variant="warning">{{ alertMessage }}</b-alert>
      <b-row class="mb-2">
        <b-col>
          <b-table :fields="examFields" :items="exams">
            <template v-slot:table-colgroup>
              <col :style="{ width: '30%' }" />
              <col :style="{ width: '30%' }" />
              <col :style="{ width: '10%' }" />
              <col :style="{ width: '20%' }" />
              <col :style="{ width: '10%' }" />
            </template>
            <template v-slot:cell(details)="row">
              <b-button-toolbar>
                <b-button-group>
                  <TableButton iconName="question" :title="$t('examTable.buttons.questions')" :clickHandler="row.toggleDetails"> </TableButton>
                  <TableButton
                    iconName="people"
                    :title="$t('examTable.buttons.assignments')"
                    :clickHandler="showAssignments"
                    :clickParam="row.item.id"
                  >
                  </TableButton>
                  <TableButton iconName="pencil" :title="$t('examTable.buttons.edit')" :clickHandler="editExam" :clickParam="row.item.id">
                  </TableButton>
                  <TableButton iconName="trash" :title="$t('examTable.buttons.delete')" :clickHandler="delExam" :clickParam="row.item.id">
                  </TableButton>
                </b-button-group>
              </b-button-toolbar>
            </template>
            <template v-slot:row-details="row">
              <QuestionTable :examId="row.item.id"></QuestionTable>
            </template>
          </b-table>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-button variant="secondary-outline" size="sm" @click="addExam()"><b-icon icon="file-earmark-plus"></b-icon></b-button>
        </b-col>
      </b-row>
    </b-card>
    <ExamEntry :show="showExamEntry" v-model="selectedExam" @close="handleExamUpdate"></ExamEntry>
    <AssignmentTable :show="showAssignmentTable" :courseId="courseId" :examId="selectedExamId" @close="showAssignmentTable = false"></AssignmentTable>
  </div>
</template>
<script>
import ExamEntry from './ExamEntry.vue';
import QuestionTable from './QuestionTable.vue';
import AssignmentTable from './AssignmentTable.vue';
import TableButton from './TableButton.vue';
import { mapGetters, mapActions } from 'vuex';
import dateTimeFormatter from '../helpers/format';
import { basicObjectToState, InputState, stateToBasicObject } from '../helpers/inputState';

/* eslint-disable no-debugger */
export default {
  name: 'ExamTable',
  components: {
    ExamEntry,
    QuestionTable,
    AssignmentTable,
    TableButton
  },
  props: ['courseId'],
  data() {
    return {
      showAlert: false,
      alertMessage: '',
      examFields: [
        { key: 'name', sortable: false, label: this.$t('examTable.columns.name') },
        {
          key: 'start',
          sortable: false,
          label: this.$t('examTable.columns.startTime'),
          formatter: (value, key, item) => dateTimeFormatter.format(item.start)
        },
        {
          key: 'durationMinutes',
          sortable: false,
          label: this.$t('examTable.columns.duration')
        },
        { key: 'authenticationCode', sortable: false, label: this.$t('examTable.columns.code') },
        { key: 'details', sortable: false, label: '' }
      ],
      showExamEntry: false,
      selectedExam: {
        id: 0,
        name: new InputState(),
        durationMinutes: new InputState(this.isValidDuration),
        authenticationCode: new InputState(),
        start: new Date(),
        isLimitedAccess: false,
        courseId: 0
      },
      selectedExamId: 0,
      showAssignmentTable: false
    };
  },
  computed: {
    ...mapGetters('exam', ['getExams']),
    exams() {
      return this.getExams(this.courseId);
    }
  },
  async mounted() {},
  methods: {
    ...mapActions('exam', ['updateExam', 'deleteExam']),
    showAssignments(id) {
      this.selectedExamId = id;
      this.showAssignmentTable = true;
    },
    addExam() {
      basicObjectToState(
        {
          id: 0,
          courseId: this.courseId,
          start: new Date(),
          durationMinutes: 120,
          isLimitedAccess: false
        },
        this.selectedExam
      );
      this.showExamEntry = true;
    },
    editExam(id) {
      const exam = this.exams.find(e => e.id == id);
      basicObjectToState(exam, this.selectedExam);
      this.showExamEntry = true;
    },
    async delExam(id) {
      try {
        await this.deleteExam(id);
      } catch (err) {
        this.alertMessage = err.message;
        this.showAlert = true;
      }
    },
    async handleExamUpdate(save) {
      this.showExamEntry = false;
      if (save) {
        try {
          await this.updateExam(stateToBasicObject(this.selectedExam));
        } catch (err) {
          this.alertMessage = err.message;
          this.showAlert = true;
        }
      }
    },
    isValidDuration(duration) {
      return duration > 0;
    }
  }
};
</script>
