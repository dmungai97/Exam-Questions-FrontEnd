import { get, update, del } from '../helpers/api';

const getDefaultState = () => ({ questions: [] });

const questionComparer = (a, b) => {
  return a.description.toLowerCase().localeCompare(b.description.toLowerCase());
};

const question = {
  namespaced: true,
  state: getDefaultState(),
  mutations: {
    setQuestions(state, questions) {
      state.questions = questions.sort(questionComparer);
    },
    updateQuestion(state, question) {
      state.questions = [...state.questions.filter(q => q.id != question.id), question].sort(questionComparer);
    },
    removeQuestion(state, id) {
      state.questions = [...state.questions.filter(q => q.id != id)];
    },
    resetQuestion(state) {
      Object.assign(state, getDefaultState());
    }
  },
  getters: {
    getQuestions: state => examId => {
      return state.questions.filter(q => q.examId == examId);
    }
  },
  actions: {
    async fetchQuestions({ state, commit }) {
      if (state.questions.length == 0) {
        await get('question', 'setQuestions', commit);
      }
    },
    async updateQuestion({ commit }, newQuestion) {
      await update('question', newQuestion, 'updateQuestion', commit);
    },
    async deleteQuestion({ commit }, id) {
      await del('question', id, 'removeQuestion', commit);
    }
  }
};

export default question;
