<script>
import VueCharts from 'vue-chartjs'
import { Bar, Line } from 'vue-chartjs'

export default {
  extends: Bar,
  mounted() {
    this.renderChart({
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      datasets: [
        {
          type: 'line',
          label: 'Budget',
          backgroundColor: 'brown',
          fill: false,
          data: [1020, 1020, 1020, 1020, 1020, 350, 600, 1020, 1020, 1020, 1020, 1020]
        },
        {
          type: 'bar',
          label: 'Invoiced',
          backgroundColor: '#12c44c',
          data: [1050, 900, 1000, 850, 820, 420, 700, 1010, 999, 340, 0, 0]
        },
        {
          type: 'bar',
          label: 'Order',
          backgroundColor: 'red',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 800, 120, 90]
        }
      ]
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