import { get, update, del } from '../helpers/api';

const studentComparer = (a, b) => {
  return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
};

const student = {
  namespaced: true,
  state: () => ({ students: [] }),
  mutations: {
    setStudents(state, students) {
      state.students = students.sort(studentComparer);
    },
    removeStudent(state, student) {
      state.students = state.students.filter(s => s.id != student.id);
    },
    updateStudent(state, student) {
      state.students = [...state.students.filter(s => s.id != student.id), student].sort(studentComparer);
    }
  },
  actions: {
    async fetchStudents({ commit }, courseId) {
      await get(`student/course/${courseId}`, 'setStudents', commit);
    },
    async updateStudent({ commit }, student) {
      await update('student', student, 'updateStudent', commit);
    },
    async importStudents(context, data) {
      const resp = update(`student/import/${data.courseId}`, data.formData);

      if (resp && resp.id > 0) {
        await context.dispatch('fetchStudents', data.courseId);
      }
    },
    async deleteStudent({ commit }, studentId) {
      await del('student', studentId, 'removeStudent', commit);
    }
  }
};

export default student;
