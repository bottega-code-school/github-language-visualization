<template>
  <div id="app">
    <div class="app-container">
      <Search />
      <Profile :profile="currentProfile" />

      <AreaChart />
      <!-- <StackGraph v-if="currentRepoData.length > 0" v-bind="graphData" /> -->
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import Search from "./components/Search";
// import StackGraph from "./components/StackGraph";
import AreaChart from "./components/AreaChart";
import Profile from "./components/Profile";

export default {
  name: "App",

  components: {
    AreaChart,
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
