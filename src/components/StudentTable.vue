<template>
  <div>
    <b-modal id="modal-scoped" v-model="showDialog">
      <template v-slot:modal-header>
        <h5>{{ $t('studentTable.title') }}</h5>
      </template>
      <template v-slot:default>
        <b-alert :show="showAlert" dismissible variant="warning">{{ alertMessage }}</b-alert>
        <b-table :items="students" :fields="fields" :per-page="perPage" :current-page="currentPage" responsive="sm">
          <template v-slot:table-colgroup>
            <col :style="{ width: '85%' }" />
            <col :style="{ width: '15%' }" />
          </template>
          <template v-slot:cell(edit)="row">
            <b-button-toolbar>
              <b-button-group>
                <TableButton iconName="pencil" :title="$t('studentTable.buttons.edit')" :clickHandler="editStudent" :clickParam="row.item">
                </TableButton>
                <TableButton iconName="trash" :title="$t('studentTable.buttons.delete')" :clickHandler="askDeleteStudent" :clickParam="row.item">
                </TableButton>
              </b-button-group>
            </b-button-toolbar>
          </template>
        </b-table>
        <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage"></b-pagination>
      </template>
      <template v-slot:modal-footer="{ cancel }">
        <b-form-row style="width:100%">
          <b-col sm="8">
            <b-form-file
              id="file-upload"
              accept=".csv, text/csv"
              v-model="file"
              :placeholder="$t('studentTable.upload.placeholder')"
              :drop-placeholder="$t('studentTable.upload.dropPlaceholder')"
              size="sm"
            ></b-form-file>
            <b-tooltip target="file-upload" triggers="hover">
              {{ $t('studentTable.upload.tooltip') }}
            </b-tooltip>
          </b-col>
          <b-col sm="1">
            <b-button :title="$t('studentTable.buttons.import')" style="width:100%" size="sm" variant="secondary-outline" @click="handleImport()">
              <b-icon icon="upload"></b-icon>
            </b-button>
          </b-col>
          <b-col sm="1" offset-sm="1">
            <b-button :title="$t('studentTable.buttons.addStudent')" style="width:100%" size="sm" variant="secondary-outline" @click="addStudent()">
              <b-icon icon="person-plus"></b-icon>
            </b-button>
          </b-col>
          <b-col sm="1">
            <b-button :title="$t('studentTable.buttons.cancel')" style="width:100%" size="sm" variant="secondary-outline" @click="cancel()">
              <b-icon icon="x-circle"></b-icon>
            </b-button>
          </b-col>
        </b-form-row>
      </template>
    </b-modal>
    <MessageModal
      :show="showDeleteConfirm"
      :message="$t('studentTable.deleteConfirm.message')"
      :positiveText="$t('studentTable.deleteConfirm.delete')"
      :negativeText="$t('studentTable.deleteConfirm.cancel')"
      @close="handleDelete"
    ></MessageModal>
    <StudentEntry :show="showStudentEntry" v-model="selectedStudent" @close="handleStudentUpdate"></StudentEntry>
  </div>
</template>
<script>
/* eslint-disable no-debugger */

import MessageModal from './MessageModal.vue';
import StudentEntry from './StudentEntry.vue';
import TableButton from './TableButton.vue';
import { mapActions, mapState } from 'vuex';
import { basicObjectToState, InputState, stateToBasicObject } from '../helpers/inputState';

export default {
  name: 'StudentTable',
  components: {
    MessageModal,
    StudentEntry,
    TableButton
  },
  props: ['show', 'courseId'],
  data() {
    return {
      showAlert: false,
      alertMessage: '',

      perPage: 10,
      currentPage: 1,
      fields: [
        { key: 'name', sortable: false, label: this.$t('studentTable.columns.name') },
        { key: 'edit', sortable: false, label: '' }
      ],

      showDialog: false,
      showDeleteConfirm: false,
      showStudentEntry: false,

      selectedStudent: {
        id: 0,
        name: new InputState(),
        number: new InputState(),
        courseId: 0
      },
      file: null
    };
  },
  watch: {
    show: {
      handler(newVal) {
        this.showDialog = newVal;
      }
    },
    courseId: {
      async handler(newVal) {
        if (newVal) {
          await this.fetchStudents(this.courseId);
        }
      }
    },
    showDialog: {
      handler(newVal) {
        if (!newVal) this.$emit('close');
      }
    }
  },
  computed: {
    ...mapState('student', ['students']),
    rows() {
      return this.students ? this.students.length : 0;
    }
  },
  methods: {
    ...mapActions('student', ['fetchStudents', 'updateStudent', 'importStudents', 'deleteStudent']),
    editStudent(student) {
      basicObjectToState(student, this.selectedStudent);
      this.showStudentEntry = true;
    },
    askDeleteStudent(student) {
      this.selectedStudent = student;
      this.showDeleteConfirm = true;
    },
    addStudent() {
      basicObjectToState({ id: 0, courseId: this.courseId }, this.selectedStudent);
      this.showStudentEntry = true;
    },
    async handleImport() {
      let formData = new FormData();
      formData.append('file', this.file);
      try {
        this.importStudents({
          courseId: this.courseId,
          formData: formData
        });
      } catch (err) {
        this.alertMessage = err.message;
        this.showAlert = true;
      }
    },
    async handleStudentUpdate(save) {
      this.showStudentEntry = false;
      if (save) {
        try {
          await this.updateStudent(stateToBasicObject(this.selectedStudent));
        } catch (err) {
          this.alertMessage = err.message;
          this.showAlert = true;
        }
      }
    },
    async handleDelete(shouldDelete) {
      this.showDeleteConfirm = false;
      if (shouldDelete) {
        try {
          this.deleteStudent(this.selectedStudent.id);
        } catch (err) {
          this.alertMessage = err.message;
          this.showAlert = true;
        }
      }
    }
  }
};
</script>
