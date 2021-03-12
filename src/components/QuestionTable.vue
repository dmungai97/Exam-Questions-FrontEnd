<template>
  <div>
    <b-card>
      <b-alert class="mt-1" :show="showAlert" dismissible variant="warning">{{ alertMessage }}</b-alert>
      <b-row class="mb-2">
        <b-col>
          <b-table :fields="questionFields" :items="questions">
            <template v-slot:table-colgroup>
              <col :style="{ width: '90%' }" />
              <col :style="{ width: '10%' }" />
            </template>
            <template v-slot:cell(details)="row">
              <b-button-toolbar>
                <b-button-group>
                  <TableButton iconName="files" :title="$t('questionTable.buttons.documents')" :clickHandler="row.toggleDetails"></TableButton>
                  <TableButton iconName="pencil" :title="$t('questionEntry.buttons.edit')" :clickHandler="editQuestion" :clickParam="row.item.id">
                  </TableButton>
                  <TableButton iconName="trash" :title="$t('questionEntry.buttons.delete')" :clickHandler="delQuestion" :clickParam="row.item.id">
                  </TableButton>
                </b-button-group>
              </b-button-toolbar>
            </template>
            <template v-slot:row-details="row">
              <DocumentTable :questionId="row.item.id"> </DocumentTable>
            </template>
          </b-table>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-button variant="secondary-outline" size="sm" @click="addQuestion()">
            <b-iconstack>
              <b-icon stacked icon="question"></b-icon>
              <b-icon stacked scale="0.6" shift-v="-3" shift-h="5" icon="plus"></b-icon>
            </b-iconstack>
          </b-button>
        </b-col>
      </b-row>
    </b-card>
    <QuestionEntry :show="showQuestionEntry" v-model="selectedQuestion" @close="handleQuestionUpdate"></QuestionEntry>
  </div>
</template>
<script>
import QuestionEntry from './QuestionEntry.vue';
import DocumentTable from './DocumentTable.vue';
import TableButton from './TableButton.vue';
import { mapGetters, mapActions } from 'vuex';
import { basicObjectToState, InputState, stateToBasicObject } from '../helpers/inputState';

/* eslint-disable no-debugger */
export default {
  name: 'QuestionTable',
  components: {
    QuestionEntry,
    DocumentTable,
    TableButton
  },
  props: ['examId'],
  data() {
    return {
      showAlert: false,
      alertMessage: '',
      questionFields: [
        { key: 'description', sortable: false, label: this.$t('questionTable.columns.description') },
        { key: 'details', sortable: false, label: '' }
      ],
      showQuestionEntry: false,
      selectedQuestion: {
        id: 0,
        examId: 0,
        description: new InputState()
      }
    };
  },
  computed: {
    ...mapGetters('question', ['getQuestions']),
    questions() {
      return this.getQuestions(this.examId);
    }
  },
  methods: {
    ...mapActions('question', ['updateQuestion', 'deleteQuestion']),
    addQuestion() {
      basicObjectToState({ id: 0, examId: this.examId }, this.selectedQuestion);
      this.showQuestionEntry = true;
    },
    editQuestion(id) {
      const question = this.questions.find(q => q.id == id);
      basicObjectToState(question, this.selectedQuestion);
      this.showQuestionEntry = true;
    },
    async delQuestion(id) {
      try {
        await this.deleteQuestion(id);
      } catch (err) {
        this.alertMessage = err.message;
        this.showAlert = true;
      }
    },
    async handleQuestionUpdate(save) {
      this.showQuestionEntry = false;
      if (save) {
        try {
          await this.updateQuestion(stateToBasicObject(this.selectedQuestion));
        } catch (err) {
          this.alertMessage = err.message;
          this.showAlert = true;
        }
      }
    }
  }
};
</script>
