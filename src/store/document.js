import { get, update, del } from '../helpers/api';

const getDefaultState = () => ({ documents: [] });

const documentComparer = (a, b) => {
  return a.publicFileName.toLowerCase().localeCompare(b.publicFileName.toLowerCase());
};

const document = {
  namespaced: true,
  state: getDefaultState(),
  mutations: {
    setDocuments(state, documents) {
      state.documents = documents.sort(documentComparer);
    },
    updateDocument(state, document) {
      state.documents = [...state.documents.filter(q => q.id != document.id), document].sort(documentComparer);
    },
    removeDocument(state, id) {
      state.documents = [...state.documents.filter(d => d.id != id)];
    },
    resetDocument(state) {
      Object.assign(state, getDefaultState());
    }
  },
  getters: {
    getDocuments: state => questionId => {
      return state.documents.filter(e => e.questionId == questionId);
    }
  },
  actions: {
    async fetchDocuments({ state, commit }) {
      if (state.documents.length == 0) {
        await get('document', 'setDocuments', commit);
      }
    },
    async updateDocument({ commit }, newDocument) {
      await update('document', newDocument, 'updateDocument', commit);
    },
    async deleteDocument({ commit }, id) {
      await del('document', id, 'removeDocument', commit);
    }
  }
};

export default document;
