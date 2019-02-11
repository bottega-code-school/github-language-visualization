import Vue from "vue";
import Vuex from "vuex";

import github from "./modules/github";
import baseState from "./modules/base-state";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    github,
    baseState
  }
});
