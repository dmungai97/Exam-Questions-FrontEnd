<template>
  <div>
    <b-card>
      <b-alert class="mt-1" :show="showAlert" dismissible variant="warning">{{ alertMessage }}</b-alert>
      <b-row class="mb-2">
        <b-col>
          <b-table :fields="documentFields" :items="documents">
            <template v-slot:table-colgroup>
              <col :style="{ width: '35%' }" />
              <col :style="{ width: '55%' }" />
              <col :style="{ width: '10%' }" />
            </template>
            <template v-slot:cell(details)="row">
              <b-button-toolbar>
                <b-button-group>
                  <TableButton iconName="pencil" :title="$t('documentTable.buttons.edit')" :clickHandler="editDocument" :clickParam="row.item.id">
                  </TableButton>
                  <TableButton iconName="trash" :title="$t('documentTable.buttons.delete')" :clickHandler="delDocument" :clickParam="row.item.id">
                  </TableButton>
                </b-button-group>
              </b-button-toolbar>
            </template>
          </b-table>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-button variant="secondary-outline" size="sm" @click="addDocument()"><b-icon icon="file-plus"></b-icon></b-button>
        </b-col>
      </b-row>
    </b-card>
    <DocumentEntry :show="showDocumentEntry" v-model="selectedDocument" @close="handleDocumentUpdate"></DocumentEntry>
  </div>
</template>
<script>
import DocumentEntry from './DocumentEntry.vue';
import TableButton from './TableButton.vue';
import { mapGetters, mapActions } from 'vuex';
import { basicObjectToState, InputState, stateToBasicObject } from '../helpers/inputState';

/* eslint-disable no-debugger */
export default {
  name: 'DocumentTable',
  components: {
    DocumentEntry,
    TableButton
  },
  props: ['questionId'],
  data() {
    return {
      showAlert: false,
      alertMessage: '',
      documentFields: [
        { key: 'publicFileName', sortable: false, label: this.$t('documentTable.columns.fileName') },
        { key: 'url', sortable: false, label: this.$t('documentTable.columns.link') },
        { key: 'details', sortable: false, label: '' }
      ],
      showDocumentEntry: false,
      selectedDocument: {
        id: 0,
        questionId: 0,
        publicFileName: new InputState(),
        url: new InputState()
      }
    };
  },
  computed: {
    ...mapGetters('document', ['getDocuments']),
    documents() {
      return this.getDocuments(this.questionId);
    }
  },
  async mounted() {},
  methods: {
    ...mapActions('document', ['updateDocument', 'deleteDocument']),
    addDocument() {
      basicObjectToState({ id: 0, questionId: this.questionId }, this.selectedDocument);
      this.showDocumentEntry = true;
    },
    editDocument(id) {
      const document = this.documents.find(d => d.id == id);
      basicObjectToState(document, this.selectedDocument);
      this.showDocumentEntry = true;
    },
    async delDocument(id) {
      try {
        await this.deleteDocument(id);
      } catch (err) {
        this.alertMessage = err.message;
        this.showAlert = true;
      }
    },
    async handleDocumentUpdate(save) {
      this.showDocumentEntry = false;
      if (save) {
        try {
          await this.updateDocument(stateToBasicObject(this.selectedDocument));
        } catch (err) {
          this.alertMessage = err.message;
          this.showAlert = true;
        }
      }
    }
  }
};
</script>
