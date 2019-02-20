<script>
import VueCharts from 'vue-chartjs'
import { Bar, Line } from 'vue-chartjs'

export default {
  extends: Bar,

  props: {
    graphData: Array,
    graphLabels: Array
  },

  mounted() {
    this.renderChart({
      labels: this.graphLabels,
      datasets: this.graphData
    }, {
        title: {
          display: true,
          text: 'GitHub Projects'
        },
        scales: {
          yAxes: [{
            stacked: true
          }],
          xAxes: [{
            stacked: true,
            categoryPercentage: 0.5,
            barPercentage: 1
          }]
        },
        legend: {
          display: true
        },
        responsive: true,
        maintainAspectRatio: false
      }
    )
  }
}
</script>