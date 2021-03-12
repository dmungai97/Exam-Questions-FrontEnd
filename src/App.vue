<template>
  <div>
    <NavMenu></NavMenu>
    <router-view />
  </div>
</template>
<script>
/* eslint-disable no-debugger */
import NavMenu from './components/NavMenu.vue';
import { mapActions, mapState } from 'vuex';

export default {
  name: 'App',
  components: {
    NavMenu
  },
  computed: {
    ...mapState('assignment', ['currentExam']),
    ...mapState('user', ['isLoggedIn', 'user'])
  },
  created() {
    this.$socket.start({ log: true });
  },
  async mounted() {
    await this.fetchUser();
    if (this.isLoggedIn) await this.$socket.invoke('NotifyPresence', this.user.id);
  },
  sockets: {
    async DocumentsAllocated(ar) {
      if (this.currentExam == ar.examId) await this.fetchAssignments(ar.examId);

      this.$bvToast.toast(`${ar.studentName}: ${ar.documentNames}`, {
        title: `${ar.courseName} ${ar.examName} (${ar.numDownloads})`,
        autoHideDelay: 3000
      });
    }
  },
  methods: {
    ...mapActions('assignment', ['fetchAssignments']),
    ...mapActions('user', ['fetchUser'])
  }
};
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
