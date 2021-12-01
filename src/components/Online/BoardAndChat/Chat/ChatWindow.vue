<template>
  <div>
    <ul>
      <li style="display:block" v-for="(message, id) in messages" :key="id">
        {{ message.name }}: {{ message.message }}
      </li>
    </ul>

    <input
      name="MessageInput"
      v-on:input="updateMessage($event.target.value)"
      type="text"
      placeholder="message"
    />

    <button @click="sendMessage">Send</button>
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
  //=================================================
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
