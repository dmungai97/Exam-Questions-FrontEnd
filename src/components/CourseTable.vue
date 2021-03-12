<template>
  <b-container fluid>
    <b-alert class="mt-1" :show="showAlert" dismissible variant="warning">{{ alertMessage }}</b-alert>
    <b-row class="mt-1">
      <b-col>
        <h2>{{ $t('courseTable.title') }}</h2>
      </b-col>
      <b-col>
        <div class="text-right">
          <b-button variant="secondary-outline" :title="$t('courseTable.buttons.addCourse')" @click="addCourse">
            <b-icon icon="calendar-plus"></b-icon>
          </b-button>
        </div>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-table :items="courses" :fields="courseFields" :per-page="perPage" :current-page="currentPage" fixed responsive="sm">
          <template v-slot:table-colgroup>
            <col :style="{ width: '10%' }" />
            <col :style="{ width: '10%' }" />
            <col :style="{ width: '65%' }" />
            <col :style="{ width: '15%' }" />
          </template>

          <template v-slot:cell(details)="row">
            <b-button-toolbar>
              <b-button-group>
                <TableButton iconName="file-earmark" :title="$t('courseTable.buttons.exams')" :clickHandler="row.toggleDetails"></TableButton>
                <TableButton
                  iconName="people"
                  :title="$t('courseTable.buttons.students')"
                  :clickHandler="showStudents"
                  :clickParam="row.item.id"
                ></TableButton>
                <TableButton iconName="pencil" :title="$t('courseTable.buttons.edit')" :clickHandler="editCourse" :clickParam="row.item.id">
                </TableButton>
                <TableButton iconName="trash" :title="$t('courseTable.buttons.delete')" :clickHandler="delCourse" :clickParam="row.item.id">
                </TableButton>
              </b-button-group>
            </b-button-toolbar>
          </template>

          <template v-slot:row-details="row">
            <ExamTable :courseId="row.item.id"></ExamTable>
          </template>
        </b-table>
        <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage"></b-pagination>
      </b-col>
    </b-row>
    <StudentTable :courseId="courseId" :show="showStudentDialog" @close="showStudentDialog = false"></StudentTable>
    <CourseEntry :show="showCourseEntry" v-model="selectedCourse" @close="handleCourseUpdate"></CourseEntry>
  </b-container>
</template>

<script>
/* eslint-disable no-debugger */
import StudentTable from './StudentTable.vue';
import ExamTable from './ExamTable.vue';
import CourseEntry from './CourseEntry.vue';
import TableButton from './TableButton.vue';
import { mapActions, mapState } from 'vuex';
import { basicObjectToState, InputState, stateToBasicObject } from '../helpers/inputState';

export default {
  name: 'CourseTable',
  components: {
    StudentTable,
    ExamTable,
    CourseEntry,
    TableButton
  },
  data() {
    return {
      showAlert: false,
      alertMessage: '',
      perPage: 10,
      currentPage: 1,
      courseFields: [
        { key: 'year', sortable: false, label: this.$t('courseTable.columns.year') },
        {
          key: 'semester',
          sortable: false,
          label: this.$t('courseTable.columns.semester'),
          formatter: (value, key, item) => this.$t(`courseEntry.semester.${item.semester.toLowerCase()}`)
        },
        { key: 'name', sortable: false, label: this.$t('courseTable.columns.name') },
        { key: 'details', sortable: false, label: '' }
      ],
      courseId: undefined,
      showStudentDialog: false,
      showCourseEntry: false,
      selectedCourse: {
        id: 0,
        name: new InputState(),
        year: new InputState(),
        semester: new InputState()
      }
    };
  },
  computed: {
    ...mapState('course', ['courses']),
    rows() {
      return this.courses.length;
    }
  },
  async mounted() {
    try {
      const c = this.fetchCourses();
      const e = this.fetchExams();
      const q = this.fetchQuestions();
      const d = this.fetchDocuments();
      await Promise.all([c, e, q, d]);
    } catch (err) {
      this.alertMessage = err.message;
      this.showAlert = true;
    }
  },
  methods: {
    ...mapActions('exam', ['fetchExams']),
    ...mapActions('question', ['fetchQuestions']),
    ...mapActions('document', ['fetchDocuments']),
    ...mapActions('course', ['fetchCourses', 'updateCourse', 'deleteCourse']),
    showStudents(id) {
      this.courseId = id;
      this.showStudentDialog = true;
    },
    editCourse(id) {
      const course = this.courses.find(c => c.id == id);
      basicObjectToState(course, this.selectedCourse);
      this.showCourseEntry = true;
    },
    async delCourse(id) {
      try {
        await this.deleteCourse(id);
      } catch (err) {
        this.alertMessage = err.message;
        this.showAlert = true;
      }
    },
    addCourse() {
      basicObjectToState({ id: 0 }, this.selectedCourse);
      this.showCourseEntry = true;
    },
    async handleCourseUpdate(save) {
      this.showCourseEntry = false;
      if (save) {
        try {
          await this.updateCourse(stateToBasicObject(this.selectedCourse));
        } catch (err) {
          this.alertMessage = err.message;
          this.showAlert = true;
        }
      }
    }
  }
};
</script>
