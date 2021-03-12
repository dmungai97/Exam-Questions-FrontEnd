import { get, update, del } from '../helpers/api';
import moment from 'moment';

const getDefaultState = () => ({ exams: [] });

const mapExam = data => {
  let exams = [];
  for (const d of data) {
    d.start = moment.utc(d.start).toDate();
    exams.push(d);
  }
  return exams;
};

const examComparer = (a, b) => {
  let ret = moment(a) - moment(b);
  if (ret == 0) ret = a.name.toLowerCase().localeCompare(b.name.toLowerCase());
  return ret;
};

const exam = {
  namespaced: true,
  state: getDefaultState(),
  mutations: {
    setExams(state, exams) {
      state.exams = exams.sort(examComparer);
    },
    updateExam(state, exam) {
      state.exams = [...state.exams.filter(e => e.id != exam.id), exam].sort(examComparer);
    },
    removeExam(state, id) {
      state.exams = [...state.exams.filter(e => e.id != id)];
    },
    resetExam(state) {
      Object.assign(state, getDefaultState());
    }
  },
  getters: {
    getExams: state => courseId => {
      return state.exams.filter(e => e.courseId == courseId);
    }
  },
  actions: {
    async fetchExams({ state, commit, rootState }, courseId) {
      if (rootState.user.isLoggedIn) {
        if (state.exams.length == 0) {
          await get('exam', 'setExams', commit, mapExam);
        }
      } else {
        await get(`exam/course/${courseId}`, 'setExams', commit, mapExam);
      }
    },
    async updateExam({ commit }, newExam) {
      await update('exam', newExam, 'updateExam', commit);
    },
    async deleteExam({ commit }, id) {
      await del('exam', id, 'removeExam', commit);
    }
  }
};

export default exam;
