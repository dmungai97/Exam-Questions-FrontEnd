<template>
  <b-container fluid>
    <CourseTable v-if="isLoggedIn" />
    <Allocation v-else />
  </b-container>
</template>

<script>
// @ is an alias to /src
import { mapState } from 'vuex';
import CourseTable from '@/components/CourseTable.vue';
import Allocation from '@/components/Allocation.vue';

export default {
  name: 'Home',
  components: {
    CourseTable,
    Allocation
  },
  computed: {
    ...mapState('user', ['isLoggedIn'])
  }
};
</script>
