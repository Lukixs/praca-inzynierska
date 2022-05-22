<template>
  <div class="text-center" data-app>
    <v-dialog v-model="isDialogVisible" width="500">
      <v-card>
        <v-toolbar color="primary" dark>{{ dialogText }}</v-toolbar>
        <v-card-actions class="justify-end">
          <v-btn text @click="isDialogVisible = false">Zamknij</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component({
  props: {
    firstPlayerName: {
      type: String,
    },
    secondPlayerName: {
      type: String,
    },
  },
})
export default class PopUp extends Vue {
  isDialogVisible = false;
  dialogText = "";

  showDialog(text: string) {
    this.dialogText = text;
    this.isDialogVisible = true;
  }
}
</script>
