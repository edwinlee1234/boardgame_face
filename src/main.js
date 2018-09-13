// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import store from './store'

Vue.config.productionTip = false
window.axios = axios
window.Vue = Vue
// 讓client可以去save cookie
axios.defaults.withCredentials = true;  

window.BASE = "http://localhost:8787/#/";
window.APIURL = "http://localhost:8300";
window.WSURL = "localhost:8300";
window.LOBBYWS = null;
window.GAMEWS = null;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
