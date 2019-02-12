<template>
  <div id="app">
    <graph v-if="currentRepoData.length > 0" v-bind="graphData" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import Graph from "./components/Graph";

export default {
  name: "App",

  components: {
    Graph
  },

  mounted() {
    this.getData('jordanhudgens');
  },

  computed: {
    ...mapGetters([
      'currentRepoData',
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
      'getData'
    ]),
  }
}
</script>

<style lang="scss">
@import "./styles/main.scss";
</style>
