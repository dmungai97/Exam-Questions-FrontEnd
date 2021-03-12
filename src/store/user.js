import { get, update, del } from '../helpers/api';
import CustomError from '../helpers/exception';

const getDefaultState = () => ({
  isLoggedIn: false,
  user: undefined,
  users: []
});

const user = {
  namespaced: true,
  state: getDefaultState(),
  mutations: {
    setUsers(state, users) {
      state.users = users.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
    },
    isLoggedIn(state, isLoggedIn) {
      state.isLoggedIn = isLoggedIn;
    },
    user(state, user) {
      state.user = user;
    },
    resetUser(state) {
      Object.assign(state, getDefaultState());
    }
  },
  actions: {
    async fetchUsers({ commit }, schoolId) {
      await get(`user/${schoolId}`, 'setUsers', commit);
    },
    async fetchUser({ commit }) {
      const user = await get(`account/user`);
      if (user) {
        commit('user', user);
        commit('isLoggedIn', true);
      }
    },
    async updateUser({ commit }, newUser) {
      await update(`account/user`, newUser, 'user', commit);
    },
    // even though this is technically not an action since it does nothing to the
    // vuex state, this is where I would look for it in the future, so here it sits
    // eslint-disable-next-line no-unused-vars
    async updateUserPassword({ commit }, passwordRequest) {
      await update('account/password', passwordRequest);
    },
    async register({ commit }, registerData) {
      const resp = await update('account/register', registerData);
      if (resp.id > 0) {
        commit('isLoggedIn', true);
      } else {
        throw new CustomError(resp.message || 'Something went wrong');
      }
    },
    async login({ commit }, loginData) {
      const resp = await update('account/login', loginData);
      if (resp.id > 0) {
        commit('isLoggedIn', true);
      } else {
        throw new CustomError(resp.message || 'Something went wrong');
      }
    },
    async logout({ commit }) {
      try {
        await del('account/logout');
      } finally {
        commit('isLoggedIn', false);
      }
    }
  }
};

export default user;
