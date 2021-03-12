<template>
  <div>
    <b-modal id="modal-scoped" size="lg" v-model="showDialog">
      <template v-slot:modal-header>
        <h5>{{ $t('assignments.title') }}</h5>
      </template>
      <template v-slot:default>
        <b-alert class="mt-1" :show="showAlert" dismissible variant="warning">{{ alertMessage }}</b-alert>
        <b-table :items="assignmentValues" :fields="fields" sort-by="studentName" :per-page="perPage" :current-page="currentPage" responsive="sm">
        </b-table>
        <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage"></b-pagination>
      </template>
      <template v-slot:modal-footer="{ cancel }">
        <b-button size="sm" variant="secondary-outline" @click="cancel()">
          {{ $t('assignments.buttons.close') }}
        </b-button>
      </template>
    </b-modal>
  </div>
</template>
<script>
/* eslint-disable no-debugger */
import { mapActions, mapState, mapMutations } from 'vuex';
import dateTimeFormatter from '../helpers/format';

export default {
  name: 'AssignmentTable',
  props: ['show', 'examId', 'courseId'],
  data() {
    return {
      showAlert: false,
      alertMessage: '',
      perPage: 10,
      currentPage: 1,
      showDialog: false,
      fields: [
        { key: 'studentName', sortable: true, label: this.$t('assignment.studentColumn') },
        { key: 'documentName', sortable: true, label: this.$t('assignment.documentColumn') },
        { key: 'time', sortable: true, label: this.$t('assignment.timeColumn') },
        { key: 'ip', sortable: true, label: this.$t('assignment.ipAddressColumn') }
      ]
    };
  },
  watch: {
    show: {
      async handler(newVal) {
        this.showDialog = newVal;
        if (newVal) {
          try {
            await this.fetchStudents(this.courseId);
            await this.fetchAssignments(this.examId);
            //all documents are fetched when the home page is loaded
          } catch (err) {
            this.alertMessage = err.message;
            this.showAlert = true;
          }
        }
      }
    },
    examId: {
      async handler(newVal) {
        if (newVal) {
          try {
            await this.fetchAssignments(this.examId);
          } catch (err) {
            this.alertMessage = err.message;
            this.showAlert = true;
          }
        }
      }
    },
    courseId: {
      async handler(newVal) {
        if (newVal) {
          try {
            await this.fetchStudents(this.courseId);
          } catch (err) {
            this.alertMessage = err.message;
            this.showAlert = true;
          }
        }
      }
    },
    showDialog: {
      handler(newVal) {
        if (!newVal) {
          this.setAssignments([]);
          this.setStudents([]);
          this.$emit('close');
        }
      }
    }
  },
  computed: {
    ...mapState('student', ['students']),
    ...mapState('document', ['documents']),
    ...mapState('assignment', ['assignments']),
    rows() {
      return this.assignments ? this.assignments.length : 0;
    },
    assignmentValues() {
      return this.assignments.map(a => {
        const student = this.students.find(s => s.id == a.studentId);
        return {
          studentName: student ? student.name : '',
          documentName: this.documents.find(d => d.id == a.documentId).publicFileName,
          time: dateTimeFormatter.format(a.downloaded),
          ip: a.ip
        };
      });
    }
  },
  methods: {
    ...mapActions('student', ['fetchStudents']),
    ...mapActions('assignment', ['fetchAssignments']),
    ...mapMutations('student', ['setStudents']),
    ...mapMutations('assignment', ['setAssignments'])
  }
};
</script>
