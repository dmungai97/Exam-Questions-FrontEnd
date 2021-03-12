import { get, update, del } from '../helpers/api';

const getDefaultState = () => ({ courses: [] });

const courseComparer = (a, b) => {
  let ret = b.year - a.year;
  if (ret == 0) ret = a.semester.localeCompare(b.semester);
  if (ret == 0) ret = a.name.toLowerCase().localeCompare(b.name.toLowerCase());
  return ret;
};

const course = {
  namespaced: true,
  state: getDefaultState(),
  mutations: {
    setCourses(state, courses) {
      state.courses = courses.sort(courseComparer);
    },
    updateCourse(state, course) {
      state.courses = [...state.courses.filter(c => c.id != course.id), course].sort(courseComparer);
    },
    removeCourse(state, id) {
      state.courses = [...state.courses.filter(c => c.id != id)];
    },
    resetCourse(state) {
      Object.assign(state, getDefaultState());
    }
  },
  actions: {
    async fetchCourses({ state, commit, rootState }, profId) {
      if (rootState.user.isLoggedIn) {
        if (state.courses.length == 0) {
          await get('course', 'setCourses', commit);
        }
      } else {
        await get(`course/user/${profId}`, 'setCourses', commit);
      }
    },
    async updateCourse({ commit }, newCourse) {
      await update('course', newCourse, 'updateCourse', commit);
    },
    async deleteCourse({ commit }, id) {
      await del('course', id, 'removeCourse', commit);
    }
  }
};

export default course;
