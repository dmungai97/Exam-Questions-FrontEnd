<template>
  <b-container fluid>
    <b-alert class="mt-1" :show="showAlert" dismissible variant="warning">{{ alertMessage }}</b-alert>
    <b-row>
      <b-col>
        <h1>{{ $t('account.title') }}</h1>
      </b-col>
    </b-row>
    <div v-if="isLoggedIn">
      <b-row>
        <b-col sm="5" offset-sm="1">
          <TextInput v-model="newUser.name" :label="$t('account.name.label')" :placeholder="$t('account.name.placeholder')" type="text"></TextInput>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="5" offset-sm="1">
          <TextInput
            v-model="newUser.email"
            :label="$t('account.email.label')"
            :placeholder="$t('account.email.placeholder')"
            type="text"
          ></TextInput>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="5" offset-sm="1">
          <SelectInput v-model="newUser.schoolId" :label="$t('account.school.label')" :options="schoolOptions">
            <b-input-group-append>
              <b-button @click="handleAddSchool"><b-icon icon="plus"></b-icon></b-button>
            </b-input-group-append>
          </SelectInput>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="2" offset-sm="4">
          <b-button class="mt-2" style="width:100%" @click="handleUserSave">{{ $t('account.buttons.save') }}</b-button>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="5" offset-sm="1">
          <hr class="mt-4 mb-4" />
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="5" offset-sm="1">
          <TextInput v-model="password.oldPassword" :label="$t('account.curPassword.label')" type="password"></TextInput>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="5" offset-sm="1">
          <TextInput v-model="password.newPassword" :label="$t('account.newPassword.label')" type="password"></TextInput>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="2" offset-sm="4">
          <b-button class="mt-2" style="width:100%" @click="handlePasswordUpdate">{{ $t('account.buttons.updatePassword') }}</b-button>
        </b-col>
      </b-row>
    </div>
    <b-row v-else>
      <b-col>
        <p>{{ $t('account.noAccessMessage') }}</p>
      </b-col>
    </b-row>
    <SchoolEntry :show="showSchoolEntry" v-model="school" @close="handleSchoolUpdate"></SchoolEntry>
  </b-container>
</template>

<script>
/* eslint-disable no-debugger */
import { mapActions, mapState } from 'vuex';
import SchoolEntry from '@/components/SchoolEntry.vue';
import TextInput from '@/components/TextInput.vue';
import SelectInput from '@/components/SelectInput.vue';
import { basicObjectToState, InputState, stateToBasicObject, isAllStateValid, clearAllStateDirty, setAllStateDirty } from '../helpers/inputState';

export default {
  name: 'Account',
  components: {
    TextInput,
    SelectInput,
    SchoolEntry
  },
  computed: {
    ...mapState('school', ['schools']),
    ...mapState('user', ['isLoggedIn', 'user']),
    schoolOptions() {
      return this.schools.map(s => {
        return {
          value: s.id,
          text: s.name
        };
      });
    }
  },
  watch: {
    isLoggedIn: {
      async handler(newVal) {
        if (newVal) {
          await this.init();
        }
      }
    }
  },
  data() {
    return {
      showAlert: false,
      alertMessage: '',

      showSchoolEntry: false,
      newUser: {
        id: 0,
        name: new InputState(),
        email: new InputState(this.isEmailValid),
        schoolId: new InputState()
      },
      school: {
        id: 0,
        name: new InputState()
      },
      password: {
        id: 0,
        oldPassword: new InputState(),
        newPassword: new InputState()
      }
    };
  },
  async mounted() {
    if (this.isLoggedIn) await this.init();
  },
  unmounted() {
    clearAllStateDirty(this.newUser);
    clearAllStateDirty(this.school);
    clearAllStateDirty(this.password);
  },
  methods: {
    ...mapActions('school', ['updateSchool', 'fetchSchools']),
    ...mapActions('user', ['fetchUser', 'updateUser', 'updateUserPassword']),
    async init() {
      try {
        await this.fetchUser();
        await this.fetchSchools();
        if (this.user) {
          basicObjectToState(this.user, this.newUser);
          this.password.id = this.user.id;
        }
      } catch (err) {
        this.alertMessage = err.message;
        this.showAlert = true;
      }
    },
    handleAddSchool() {
      basicObjectToState({ id: 0 }, this.school);
      this.showSchoolEntry = true;
    },
    async handleSchoolUpdate(save) {
      this.showSchoolEntry = false;
      if (save) {
        try {
          await this.updateSchool(stateToBasicObject(this.school));
          this.schoolId = this.schools.find(s => s.name == this.school.name.text).id;
        } catch (err) {
          this.alertMessage = err.message;
          this.showAlert = true;
        }
      }
    },
    async handleUserSave() {
      this.showAlert = false;
      if (isAllStateValid(this.newUser)) {
        try {
          await this.updateUser(stateToBasicObject(this.newUser));
        } catch (err) {
          this.alertMessage = err.message;
          this.showAlert = true;
        }
      } else {
        setAllStateDirty(this.newUser);
      }
    },
    async handlePasswordUpdate() {
      this.showAlert = false;
      try {
        await this.updateUserPassword(stateToBasicObject(this.password));
      } catch (err) {
        this.alertMessage = err.message;
        this.showAlert = true;
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
