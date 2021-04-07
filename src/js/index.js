import Vue from "vue";
import App from "./components/app.vue";

window.onload = () => {
  'use strict';
  if ('serviceWorker' in navigator) {
    console.log('Register SW')
    navigator.serviceWorker.register('/sw.js');
  }
}

new Vue({
  el: "#root",
  components: {
    App,
  },
});
