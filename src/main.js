import Vue from "vue";
import Chart from "v-chart-plugin";
import App from "./App.vue";
import router from "./router";
import store from "./store/index.js";

Vue.config.productionTip = false;
Vue.use(Chart);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
