import { Chart } from 'react-chartjs-2';

const ChartUtils = {
  tasksChartData: (stats = []) => ({
    labels: ChartUtils.getLabels(stats, ChartUtils.labels),
    datasets: [{
      data: ChartUtils.getLabels(stats, {}),
      backgroundColor: ChartUtils.getLabels(stats, ChartUtils.backgroundColor),
      borderColor: ChartUtils.getLabels(stats, ChartUtils.borderColor),
      borderWidth: 2,
      minBarLength: 20,
    }]
  }),
  labels: ['Open', 'Assigned', 'In Progress', 'Review', 'Accepted', 'Declined', 'Rework'],
  backgroundColor: ['rgba(108, 117, 125, 1)', 'rgba(23, 162, 184, 1)', 'rgba(0, 123, 255, 1)', 'rgba(40, 167, 69, 1)','rgba(0, 123, 255, 1)', 'rgba(220, 53, 69, 1)', 'rgba(255, 193, 7, 1)'],
  borderColor: ['rgba(108, 117, 125, 1)', 'rgba(23, 162, 184, 1)', 'rgba(0, 123, 255, 1)', 'rgba(40, 167, 69, 1)','rgba(0, 123, 255, 1)', 'rgba(220, 53, 69, 1)', 'rgba(255, 193, 7, 1)'],
  getLabels: (stats = [], data = []) => {
    const labels = [];
    if (stats && !stats.length) {
      return labels;
    }
    stats.forEach((item, idx) => {
      if (item) {
        labels.push(data[idx] || item);
      }
    });
    return labels;
  },

  options: (onClickCallback) => ({
    animation: {
      duration: 500,
      onComplete: function () {
        var chartInstance = this.chart, ctx = chartInstance.ctx;
        ctx.font = Chart.helpers.fontString(
          Chart.defaults.global.defaultFontSize,
          Chart.defaults.global.defaultFontStyle,
          Chart.defaults.global.defaultFontFamily);
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';

        this.data.datasets.forEach(function (dataset, i) {
          var meta = chartInstance.controller.getDatasetMeta(i);
          meta.data.forEach(function (bar, index) {
            var data = dataset.data[index];
            ctx.fillText(data, bar._model.x, bar._model.y + 5);
          });
        });
      }
    },
    hover: {
      animationDuration: 0
    },
    tooltips: {
      enabled: false,
    },
    legend: {
      display: false
    },
    scales: {
      xAxes: [{
        gridLines: {
          display: false,
          color: 'rgba(0, 0, 0, 0)',
        },
        ticks: {
          fontColor: '#6c757d'
        }
      }],
      yAxes: [{
        ticks: {
          display: false,
          beginAtZero: true
        },
        gridLines: {
          color: 'rgba(0, 0, 0, 0)',
        }
      }]
    },
    onClick: function(event, item = []) {
      const e = item[0];
      var type = this.data.labels[e._index];
      onClickCallback && (onClickCallback(event, type));
    }
  }),
};
export default ChartUtils;
