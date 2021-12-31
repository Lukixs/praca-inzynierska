<template>
  <div class="chatbox">
    <div class="header"><h1>Konwersacja</h1></div>
    <div class="messages">
      <ul>
        <li
          style="display:block"
          v-for="(message, index) in messages"
          :key="index"
        >
          {{ message.name }}: {{ message.message }}
        </li>
      </ul>
    </div>
    <div class="input">
      <v-text-field
        class="input--text"
        placeholder="Placeholder"
        v-on:input="updateMessage($event.target.value)"
        type="text"
        dark
      ></v-text-field>
      <v-btn elevation="4" dark @click="sendMessage">Wyślij</v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component({
  props: {
    socket: {},
  },
})
export default class Board extends Vue {
  mounted(): void {
    this.loadSocketsListeners();
  }

  loadSocketsListeners(): void {
    this.$props.socket.on("message", (name: string, message: string) => {
      this.messages.push({ name, message });
    });
  }

  updateMessage(text: string): void {
    this.message = text;
  }

  sendMessage(): void {
    this.$props.socket.emit("message", this.message);
  }

  message: string;
  messages: { name: string; message: string }[] = [];
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.chatbox {
  margin-top: 50px;
  background-color: #6e6e6e30;
  display: flex;
  flex-flow: column;

  .messages {
    min-height: 19vh;
    background-color: #6e6e6e;
    overflow-y: auto;
  }

  .input {
    color: white;
    padding: 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    &--text {
      margin: 0 30px 0 10px;
    }
  }
}
</style>
