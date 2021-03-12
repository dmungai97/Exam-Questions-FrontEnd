<template>
  <div>
    <b-alert class="mt-1" :show="showAlert" dismissible variant="warning">{{ alertMessage }}</b-alert>
    <b-row class="mt-4">
      <b-col sm="4">
        <h2 style="text-align:right">{{ $t('allocation.school') }}</h2>
      </b-col>
      <b-col sm="5">
        <b-form-select v-model="selectedSchool" :options="schoolOptions"></b-form-select>
      </b-col>
    </b-row>
    <b-row class="mt-4" v-if="selectedSchool">
      <b-col sm="4">
        <h2 style="text-align:right">{{ $t('allocation.professor') }}</h2>
      </b-col>
      <b-col sm="5">
        <b-form-select v-model="selectedProfessor" :options="profOptions"></b-form-select>
      </b-col>
    </b-row>
    <b-row class="mt-4" v-if="selectedProfessor">
      <b-col sm="4">
        <h2 style="text-align:right">{{ $t('allocation.course') }}</h2>
      </b-col>
      <b-col sm="5">
        <b-form-select v-model="selectedCourse" :options="courseOptions"></b-form-select>
      </b-col>
    </b-row>
    <b-row class="mt-4" v-if="selectedCourse">
      <b-col sm="4">
        <h2 style="text-align:right">{{ $t('allocation.exam') }}</h2>
      </b-col>
      <b-col sm="5">
        <b-form-select v-model="selectedExam" :options="examOptions"></b-form-select>
      </b-col>
    </b-row>
    <b-row class="mt-4" v-if="selectedExam">
      <b-col sm="4">
        <h2 style="text-align:right">{{ $t('allocation.student') }}</h2>
      </b-col>
      <b-col sm="5">
        <b-form-select v-model="selectedStudent" :options="studentOptions"></b-form-select>
      </b-col>
    </b-row>
    <b-row class="mt-4" v-if="selectedStudent">
      <b-col sm="4">
        <h2 style="text-align:right">{{ $t('allocation.credentials') }}</h2>
      </b-col>
    </b-row>
    <b-row v-if="selectedStudent">
      <b-col sm="3" offset-sm="3">
        <TextInput
          v-model="form.studentNumber"
          :label="$t('allocation.studentNumber.label')"
          :placeholder="$t('allocation.studentNumber.placeholder')"
          type="text"
        ></TextInput>
      </b-col>
      <b-col sm="3">
        <TextInput
          v-model="form.authenticationCode"
          :label="$t('allocation.authenticationCode.label')"
          :placeholder="$t('allocation.authenticationCode.placeholder')"
          type="text"
        ></TextInput>
      </b-col>
    </b-row>
    <div class="mt-5" style="display:flex; justify-content:center" v-if="selectedStudent">
      <b-button @click="handleDownload">{{ $t('allocation.downloadButton') }}</b-button>
    </div>
  </div>
</template>
<script>
/* eslint-disable no-debugger */
import { mapActions, mapState } from 'vuex';
import { fetchAssignmentZip } from '../helpers/api';
import TextInput from './TextInput';
import { InputState, isAllStateValid, setAllStateDirty, stateToBasicObject } from '../helpers/inputState';

export default {
  name: 'Allocation',
  components: {
    TextInput
  },
  data() {
    return {
      showAlert: false,
      alertMessage: '',
      selectedSchool: null,
      selectedProfessor: null,
      selectedCourse: null,
      selectedExam: null,
      selectedStudent: null,
      form: {
        studentId: 0,
        examId: 0,
        studentNumber: new InputState(),
        authenticationCode: new InputState()
      }
    };
  },
  computed: {
    ...mapState('school', ['schools']),
    ...mapState('user', ['users']),
    ...mapState('course', ['courses']),
    ...mapState('exam', ['exams']),
    ...mapState('student', ['students']),
    schoolOptions() {
      return this.schools.map(s => {
        return {
          value: s.id,
          text: s.name
        };
      });
    },
    profOptions() {
      return this.users.map(p => {
        return {
          value: p.id,
          text: p.name
        };
      });
    },
    courseOptions() {
      return this.courses.map(c => {
        return {
          value: c.id,
          text: `${c.year} ${c.semester.substring(0, 1)} ${c.name}`
        };
      });
    },
    examOptions() {
      return this.exams.map(e => {
        return {
          value: e.id,
          text: e.name
        };
      });
    },
    studentOptions() {
      return this.students.map(s => {
        return {
          value: s.id,
          text: s.name
        };
      });
    }
  },
  watch: {
    async selectedSchool(newSchool) {
      try {
        await this.fetchUsers(newSchool);
        this.clearProfessor();
      } catch (err) {
        this.alertMessage = err.message;
        this.showAlert = true;
      }
    },
    async selectedProfessor(newProf) {
      try {
        await this.fetchCourses(newProf);
        this.clearCourse();
      } catch (err) {
        this.alertMessage = err.message;
        this.showAlert = true;
      }
    },
    async selectedCourse(newCourse) {
      try {
        await this.fetchExams(newCourse);
        this.clearExam();
      } catch (err) {
        this.alertMessage = err.message;
        this.showAlert = true;
      }
    },
    async selectedExam() {
      try {
        await this.fetchStudents(this.selectedCourse);
        this.clearStudent();
      } catch (err) {
        this.alertMessage = err.message;
        this.showAlert = true;
      }
    }
  },
  async mounted() {
    try {
      await this.fetchSchools();
    } catch (err) {
      this.alertMessage = err.message;
      this.showAlert = true;
    }
  },
  methods: {
    ...mapActions('school', ['fetchSchools']),
    ...mapActions('user', ['fetchUsers']),
    ...mapActions('course', ['fetchCourses']),
    ...mapActions('exam', ['fetchExams']),
    ...mapActions('student', ['fetchStudents']),
    async handleDownload() {
      if (isAllStateValid(this.form)) {
        try {
          this.form.studentId = this.selectedStudent;
          this.form.examId = this.selectedExam;
          await fetchAssignmentZip(stateToBasicObject(this.form));
        } catch (err) {
          this.alertMessage = err.message;
          this.showAlert = true;
        }
      } else setAllStateDirty(this.form);
    },
    clearStudent() {
      this.selectedStudent = null;
      this.form.studentNumber.text = '';
      this.form.authenticationCode.text = '';
    },
    clearExam() {
      this.selectedExam = null;
      this.clearStudent();
    },
    clearCourse() {
      this.selectedCourse = null;
      this.clearExam();
    },
    clearProfessor() {
      this.selectedProfessor = null;
      this.clearCourse();
    }
  }
};
</script>
