<template>
  <div id="app">
    <div class="app-container">
      <Search />
      <Profile :profile="currentProfile" />

      <div class="graph-wrapper">
        <StackGraph :graphData="graphData" :graphLabels="graphLabels" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import Search from "./components/Search";
import StackGraph from "./components/StackGraph";
import Profile from "./components/Profile";

export default {
  name: "App",

  components: {
    StackGraph,
    Search,
    Profile
  },

  data() {
    return {
      graphLabels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      graphData: [
        {
          type: 'line',
          label: 'Budget',
          backgroundColor: 'brown',
          fill: false,
          data: [1020, 1020, 1020, 1020, 1020, 350, 600, 1020, 1020, 1020, 1020, 1020]
        },
        {
          type: 'line',
          fill: true,
          label: 'Invoiced',
          backgroundColor: '#12c44c',
          data: [1050, 900, 1000, 850, 820, 420, 700, 1010, 999, 340, 0, 0]
        },
        {
          type: 'line',
          fill: true,
          label: 'Order',
          backgroundColor: 'yellow',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 800, 120, 90]
        }
      ]
    }
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
