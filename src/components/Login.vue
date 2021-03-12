<template>
  <b-modal id="modal-scoped" v-model="showDialog">
    <template v-slot:modal-header>
      <h5>{{ $t('login.title') }}</h5>
    </template>
    <template v-slot:default>
      <b-alert class="mt-1" :show="showAlert" dismissible variant="warning">{{ alertMessage }}</b-alert>
      <TextInput
        v-model="inputs.email"
        :label="$t('login.email.label')"
        :placeholder="$t('login.email.placeholder')"
        type="text"
        @enterKey="handleLogin"
      ></TextInput>
      <TextInput
        v-model="inputs.password"
        :label="$t('login.password.label')"
        :placeholder="$t('login.password.placeholder')"
        type="password"
        @enterKey="handleLogin"
      ></TextInput>
    </template>
    <template v-slot:modal-footer="{ cancel }">
      <b-button size="sm" variant="secondary-outline" @click="handleRegister">
        {{ $t('login.buttons.register') }}
      </b-button>
      <b-button size="sm" variant="secondary-outline" @click="handleLogin">
        {{ $t('login.buttons.logIn') }}
      </b-button>
      <b-button size="sm" variant="secondary-outline" @click="cancel()">
        {{ $t('login.buttons.cancel') }}
      </b-button>
    </template>
  </b-modal>
</template>
<script>
/* eslint-disable no-debugger */
import { mapActions, mapState, mapMutations } from 'vuex';
import TextInput from './TextInput';
import { InputState, isAllStateValid, setAllStateDirty, resetAllState } from '../helpers/inputState';

export default {
  name: 'Login',
  props: ['show'],
  components: {
    TextInput
  },
  data() {
    return {
      showAlert: false,
      alertMessage: '',
      isEmailDirty: false,
      showDialog: false,
      inputs: {
        password: new InputState(),
        email: new InputState(this.isEmailValid)
      }
    };
  },
  watch: {
    show: {
      handler(newVal) {
        this.showDialog = newVal;
      }
    },
    showDialog: {
      handler(newVal) {
        if (!newVal) {
          resetAllState(this.inputs);
          this.$emit('close');
        }
      }
    }
  },
  computed: {
    ...mapState('user', ['isLoggedIn', 'user'])
  },
  methods: {
    ...mapMutations('course', ['resetCourse']),
    ...mapMutations('document', ['resetDocument']),
    ...mapMutations('exam', ['resetExam']),
    ...mapMutations('question', ['resetQuestion']),
    ...mapMutations('school', ['resetSchool']),
    ...mapMutations('user', ['resetUser']),
    ...mapActions('user', ['login', 'register', 'fetchUser']),
    async handleRegister() {
      if (isAllStateValid(this.inputs)) {
        try {
          await this.register({
            email: this.inputs.email.text,
            password: this.inputs.password.text
          });
        } catch (err) {
          this.setAlert(err.message);
        }
      }
      await this.updateUI();
    },
    async handleLogin() {
      //clear out the caches, otherwise, what got loaded in the not logged in state
      //will still be there and we won't get to see everything
      this.clearState();

      if (isAllStateValid(this.inputs)) {
        try {
          await this.login({
            email: this.inputs.email.text,
            password: this.inputs.password.text
          });
        } catch (err) {
          this.setAlert(err.message);
        }
      }
      await this.updateUI();
    },
    setAlert(msg) {
      this.alertMessage = msg;
      this.showAlert = true;
    },
    clearState() {
      this.resetCourse();
      this.resetDocument();
      this.resetExam();
      this.resetQuestion();
      this.resetSchool();
      this.resetUser();
    },
    async updateUI() {
      if (this.isLoggedIn) {
        resetAllState(this.inputs);
        try {
          await this.fetchUser();
          await this.$socket.invoke('NotifyPresence', this.user.id);
        } catch (err) {
          this.setAlert(err.message);
        }
        this.$emit('close');
      } else {
        setAllStateDirty(this.inputs);
      }
    },
    isEmailValid(email) {
      // see https://stackoverflow.com/questions/201323/how-to-validate-an-email-address-using-a-regular-expression for the source of this regex
      // eslint-disable-next-line no-control-regex
      const regex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
      return regex.test(email);
    }
  }
};
</script>
