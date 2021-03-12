import { get, update } from '../helpers/api';

const getDefaultState = () => ({ schools: [] });

const schoolComparer = (a, b) => {
  return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
};

const school = {
  namespaced: true,
  state: getDefaultState(),
  mutations: {
    setSchools(state, schools) {
      state.schools = schools.sort(schoolComparer);
    },
    updateSchool(state, school) {
      state.schools = [...state.schools.filter(s => s.id != school.id), school].sort(schoolComparer);
    },
    resetSchool(state) {
      Object.assign(state, getDefaultState());
    }
  },
  actions: {
    async fetchSchools({ commit }) {
      await get('school', 'setSchools', commit);
    },
    async updateSchool({ commit }, newSchool) {
      await update('school', newSchool, 'updateSchool', commit);
    }
  }
};

export default school;
