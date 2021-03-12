import Vue from 'vue';
import Vuex from 'vuex';

import assignment from './assignment';
import course from './course';
import document from './document';
import exam from './exam';
import question from './question';
import school from './school';
import student from './student';
import user from './user';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    assignment,
    course,
    document,
    exam,
    question,
    school,
    student,
    user
  }
});
