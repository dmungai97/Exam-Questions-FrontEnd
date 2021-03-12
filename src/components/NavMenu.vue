<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand href="#">{{ $t('navbar.title') }}</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item to="/">{{ $t('navbar.home') }}</b-nav-item>
          <b-nav-item to="/about">{{ $t('navbar.about') }}</b-nav-item>
        </b-navbar-nav>
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-form-select style="background: transparent; color: white; margin-right: 1em" v-model="$root.$i18n.locale">
            <b-select-option style="color:black" v-for="(lang, i) in langs" :key="`lang${i}`" :value="lang">{{ lang }}</b-select-option>
          </b-form-select>
          <b-nav-item-dropdown right v-if="isLoggedIn">
            <!-- Using 'button-content' slot -->
            <template v-slot:button-content>
              <em>{{ userName }}</em>
            </template>
            <b-dropdown-item to="/account">{{ $t('navbar.account') }}</b-dropdown-item>
            <b-dropdown-item-button @click="handleLogout">{{ $t('navbar.logOut') }}</b-dropdown-item-button>
          </b-nav-item-dropdown>
          <b-button @click="showLogin = true" v-else>
            {{ $t('navbar.login') }}
          </b-button>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <Login :show="showLogin" @close="showLogin = false"></Login>
  </div>
</template>

<script>
/* eslint-disable no-debugger */
import Login from './Login.vue';
import { mapActions, mapState } from 'vuex';

export default {
  name: 'NavMenu',
  components: {
    Login
  },
  data() {
    return {
      showLogin: false,
      langs: ['fr', 'en']
    };
  },
  computed: {
    ...mapState('user', ['user', 'isLoggedIn']),
    userName() {
      return this.user ? (this.user.name ? this.user.name : this.user.email) : '';
    }
  },
  methods: {
    ...mapActions('user', ['logout']),
    async handleLogout() {
      await this.logout();
      window.location.reload();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
