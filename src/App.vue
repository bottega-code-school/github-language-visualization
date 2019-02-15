<template>
  <div id="app">
    <div class="app-container">
      <Search />
      <Profile :profile="currentProfile" />
      <Graph v-if="currentRepoData.length > 0" v-bind="graphData" />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import Search from "./components/Search";
import Graph from "./components/Graph";
import Profile from "./components/Profile";

export default {
  name: "App",

  components: {
    Graph,
    Search,
    Profile
  },

  mounted() {
    this.getData({ username: 'jordanhudgens' });
    this.getUserProfileData('jordanhudgens');
  },

  computed: {
    ...mapGetters([
      'currentRepoData',
      'currentProfile'
    ]),

    graphData() {
      return {
        xAxisLabel: 'Month',
        yAxisLabel: 'Project Count',
        xKey: 'date',
        yKey: 'value',
        interval: 'month',
        data: this.currentRepoData
      }
    }
  },


  methods: {
    ...mapActions([
      'getData',
      'getUserProfileData'
    ]),
  }
}
</script>

<style lang="scss">
@import "./styles/main.scss";
</style>
