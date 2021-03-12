import moment from 'moment';
import { get } from '../helpers/api';

const mapAssignment = data => {
  let assignments = [];
  for (const d of data) {
    d.downloaded = moment.utc(d.downloaded).toDate();
    assignments.push(d);
  }
  return assignments;
};

const assignment = {
  namespaced: true,
  state: () => ({ assignments: [], currentExam: 0 }),
  mutations: {
    setAssignments(state, assignments) {
      state.assignments = assignments;
    },
    currentExam(state, examId) {
      state.currentExam = examId;
    }
  },
  actions: {
    async fetchAssignments({ commit }, examId) {
      commit('currentExam', examId);
      await get(`assignment/exam/${examId}`, 'setAssignments', commit, mapAssignment);
    }
  }
};

export default assignment;
