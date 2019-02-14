<template>
  <div id="app">
    <div class="app-container">
      <!-- <pre>{{currentProfile}}</pre> -->
      <Search />
      <Graph v-if="currentRepoData.length > 0" v-bind="graphData" />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import Search from "./components/Search";
import Graph from "./components/Graph";

export default {
  name: "App",

  components: {
    Graph,
    Search
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
