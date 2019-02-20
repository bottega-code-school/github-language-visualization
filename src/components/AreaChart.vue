<template>
  <div>
    <v-chart v-bind:chartData="chartData"></v-chart>
  </div>
</template>

<script>
export default {
  name: 'AreaChart',

  data() {
    return {
      chartData: {
        chartType: "vBarChart",
        selector: "chart",
        title: "Important Data",
        width: 400,
        height: 200,
        metric: 'count', // for two or more metrics pass as an array ['count', 'pyCount']
        legends: {
          enabled: true,
          height: 25,
          width: 50,
        },
        grid: {
          enabled: true,
          gridTicks: 25,
        },
        goal: 220,
        label: true,
        data: [
          {
            'count': 120,
            'fruit': 'apples'
          },
          {
            'count': 250,
            'fruit': 'oranges'
          }
        ]
      }
    }
  }
}
</script>