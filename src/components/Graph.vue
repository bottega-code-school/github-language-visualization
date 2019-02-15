<template>
  <div class="graph-wrapper">
    <div class="data-graph-chart" :id="chartId" ref="chart" :style="chartStyle" />
    <div class="data-graph-legend">
      <div class="legend-key">Programming Languages</div>
      <ul>
        <li class="legend-series" v-for="(d,i) in graphData" :key="d.name">
          <div class="legend-icon" :style="`background-color: ${ordinalColors(i)}`"></div>
          <div class="legend-text">{{d.name}}</div>
        </li>
      </ul>
    </div>
    <div class="graph-tooltip" :data-tooltip="chartId"></div>
  </div>
</template>

<script>
// TODO
// integrate https://www.npmjs.com/package/d3-shape#stacks
import _ from "lodash";
import Popper from "popper.js";
import { scaleTime, scaleLinear, scaleOrdinal } from "d3-scale";
import { line } from "d3-shape";
import { select, selectAll, mouse } from "d3-selection";
import { bisector, extent, max } from "d3-array";
import { axisBottom, axisLeft } from "d3-axis";
import { schemeCategory10 } from "d3-scale-chromatic";
import { transition } from "d3-transition";
import { timeParse, timeFormat } from "d3-time-format";
import { format as d3format } from "d3-format";
import {
  timeSecond,
  timeMinute,
  timeHour,
  timeDay,
  timeMonth,
  timeWeek,
  timeYear
} from "d3-time";
const d3 = {
  select,
  selectAll,
  mouse,
  bisector,
  extent,
  max,
  axisBottom,
  axisLeft,
  transition,
  timeParse,
  timeFormat,
  timeSecond,
  timeMinute,
  timeHour,
  timeDay,
  timeMonth,
  timeWeek,
  timeYear,
  line,
  schemeCategory10,
  scaleTime,
  scaleLinear,
  scaleOrdinal,
  format: d3format
};

export default {
  props: {
    chartId: {
      type: String,
      default: `graph-${Date.now()}`
    },
    colors: { type: Array, default: () => d3.schemeCategory10 },
    width: { type: String, default: "100%" },
    height: { type: String, default: "500px" },
    xAxisLabel: { type: String, default: null },
    yAxisLabel: { type: String, default: null },
    xKey: { type: String, required: true /* date */ },
    yKey: { type: String, required: true /* price */ },
    interval: { type: String, default: "year" },
    data: {
      type: Array,
      default: () => []
    }
  },

  computed: {
    graphData() {
      const parseDate = date => {
        const dateFormat = "%d/%m/%Y";
        const r = d3.timeParse(dateFormat)(date);
        if (!r) throw Error(`String date format expected: ${dateFormat}`);
        return r;
      };
      return _.map(this.data, o => ({
        ...o,
        values: _.map(o.values, d => ({
          x: parseDate(d[this.xKey]),
          y: +d[this.yKey]
        }))
      }));
    },
    chartHeight() {
      return this.$refs.chart.clientHeight;
    },
    chartWidth() {
      return this.$refs.chart.clientWidth;
    },
    tooltipEl() {
      return document.querySelector(`[data-tooltip='${this.chartId}']`);
    },

    lengthOfXAxis() {
      return _.max(this.graphData.map(({ values }) => values.length));
    },

    longestSeries() {
      let largestRecord = {};
      let maxCountOfProjects = 0;
      this.graphData.forEach(record => {
        record.values.forEach(val => {
          if (val.y > maxCountOfProjects) {
            maxCountOfProjects = val.y;
            largestRecord = record;
          }
        })
      })
      return largestRecord;
    },

    xAxisTicksByInterval() {
      const { interval, lengthOfXAxis } = this;
      const axisBy = {
        year: d3.timeYear,
        week: d3.timeWeek,
        month: d3.timeMonth
      };
      return axisBy[interval] || lengthOfXAxis;
    },

    ordinalColors() {
      return d3.scaleOrdinal(this.colors);
    },

    chartStyle() {
      return {
        width: this.width,
        height: this.height
      };
    },

    hasData() {
      return this.data.length !== 0;
    },

    hasXKey() {
      return !!this.xKey;
    },

    hasYKey() {
      return !!this.yKey;
    },

    isChartOptionsValid() {
      return this.hasData && this.hasXKey && this.hasYKey;
    },

  },

  watch: {
    data() {
      this.chartGenerator();
    }
  },

  methods: {
    dateFormatter(date, i = this.hoverIndex(date)) {
      const formatObj = {
        month: d3.timeFormat("%B %Y"),
        quarter: d3.timeFormat(`Quarter ${i + 1}`),
        year: d3.timeFormat("%Y")
      };

      const formatter = formatObj[this.interval];
      return formatter && _.escape(formatter(date));
    },

    seriesBasedData({ series: { values }, xPoint, focusPoint }) {
      const dateSplitter = d3.bisector(d => d.x).left;
      const i = dateSplitter(values, xPoint, 1);
      const d0 = values[i - 1];
      const d1 = values[i] || {};
      const closestD = xPoint - d0.x > d1.x - xPoint ? d1 : d0;
      const xPointMinusClosestD = Math.abs(xPoint - closestD.x);
      const focusPointMinusXPoint = Math.abs(xPoint - focusPoint);
      const r = focusPoint
        ? xPointMinusClosestD > focusPointMinusXPoint
          ? null
          : closestD
        : closestD;
      return r;
    },

    cleanedDateObj(date) {
      return `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
    },

    hoverIndex(focusPoint) {
      const { cleanedDateObj, longestSeries } = this;
      return _.findIndex(
        longestSeries.values,
        d => cleanedDateObj(d.x) === cleanedDateObj(focusPoint)
      );
    },

    popperConfig(tooltipRefEl, tooltipEl) {
      return new Popper(tooltipRefEl, tooltipEl, {
        placement: "left",
        modifiers: {
          preventOverflow: {
            boundariesElement: document.querySelector(`#${this.chartId}`)
          },
          offset: {
            offset: "0, 8px"
          },
          flip: { behavior: ["left", "right"] }
        }
      });
    },

    composeTooltipHTML({ focusDataPoints, focusPoint }) {
      return `
        <div class="graph-tooltip-title">${this.dateFormatter(
          focusPoint
        )}</div>
        <div class="series-container">
          ${focusDataPoints
          .map(
          d => `
                <div class="series-row">
                  <span class="color-bar" style="background-color:${_.escape(
              d.color
            )}">&nbsp;</span>
                  <div class="series-info">
                    <div class="series-name">${_.escape(d.series)}</div>
                    <div class="series-value">${_.escape(d.y)}</div>
                  </div>
                </div>
              `
          )
          .join("")}
        </div>
        <div class="popper-arrow" x-arrow=""></div>
      `;
    },

    chartGenerator() {
      const currentChart = this;
      const {
        ordinalColors: colors,
        graphData: data,
        isChartOptionsValid,
        chartId,
        chartWidth,
        chartHeight,
        seriesBasedData,
        tooltipEl,
        dateFormatter,
        longestSeries,
        xAxisTicksByInterval,
        popperConfig,
        composeTooltipHTML,
        xAxisLabel,
        yAxisLabel
      } = currentChart;

      const axisOffset = 16;
      const labelOffset = 21 * 1.75 + axisOffset;

      const margin = {
        top: 30,
        left: 30 + (yAxisLabel ? labelOffset : 0),
        right: 30,
        bottom: 30 + (xAxisLabel ? labelOffset : 0)
      };
      const width = chartWidth - margin.left - margin.right;
      const height = chartHeight - margin.top - margin.bottom;

      const xScale = d3
        .scaleTime()
        .domain(d3.extent(longestSeries.values, d => d.x))
        .range([0, width]);

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(longestSeries.values, d => d.y)])
        .range([height - 0, 0]);

      const drawLine = ({ values }) =>
        d3
          .line()
          .x(d => xScale(d.x))
          .y(d => yScale(d.y))(values);

      const tooltip = d3.select(tooltipEl);

      d3.select(`#${chartId} svg`).remove();
      d3.select(`#${chartId} div`).remove();
      tooltip.html("");

      const svg = d3
        .select(`#${chartId}`)
        .append("svg")
        .attr("width", width + margin.left + margin.right + "px")
        .attr("height", height + margin.top + margin.bottom + "px")

      const g = svg
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)

      const xAxis = d3
        .axisBottom(xScale)
        .tickSize(0)
        .tickFormat(dateFormatter)
        .ticks(xAxisTicksByInterval);

      g.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis)
        .selectAll("text")
        .attr("y", axisOffset);

      const yAxis = d3
        .axisLeft(yScale)
        .tickSize(-width)
        .ticks(4)
        .tickFormat(d3.format("~s"))
        .scale(yScale.nice());

      g.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .selectAll("text")
        .attr("x", -axisOffset);

      const xAxisTickHeight = 30;
      const xLabelOffset = xAxisTickHeight + 21;
      svg
        .select(".x.axis")
        .append("text")
        .text(xAxisLabel)
        .attr("class", "line-graph-label")
        .attr("transform", `translate(${width / 2}, ${xLabelOffset})`);

      svg
        .select(".y.axis")
        .append("text")
        .text(yAxisLabel)
        .attr("class", "line-graph-label")
        .attr(
        "transform",
        `translate(${-labelOffset}, ${(height - margin.top) / 2}) rotate(-90)`
        )

      const lines = g.append("g").attr("class", "lines");

      const series = lines
        .selectAll(".line-group")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "line-group");

      series
        .append("path")
        .attr("class", "line")
        .attr("d", d => drawLine(d))
        .style("stroke", (d, i) => colors(i))
        .style("opacity", "0.85");

      const tooltipRef = d3
        .select(`#${chartId}`)
        .append("div")
        .attr("class", "tooltip-ref");

      let tooltipPopper;

      const overlay = g.append("rect");
      overlay
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height)
        .on("mousemove", function() {
          const [mouseX] = d3.mouse(this);
          const xPoint = xScale.invert(mouseX);
          const focusDataPoints = [];

          g.selectAll(".circle").remove();

          const { x: focusPoint } = seriesBasedData({
            series: longestSeries,
            xPoint
          });

          data.forEach((series, i) => {
            const d = seriesBasedData({ series, xPoint, focusPoint });
            if (!d) return;
            focusDataPoints.push({
              ...d,
              series: series.name,
              color: colors(i)
            });

            const circleRadius = 3;
            g.append("g")
              .attr("class", "circle")
              .append("circle")
              .style("fill", colors(i))
              .attr("cx", xScale(d.x))
              .attr("cy", yScale(d.y))
              .attr("r", circleRadius);
          });

          tooltipRef
            .style("left", `calc(${xScale(focusPoint)}px + ${margin.left}px)`)
            .style("transform", `translateY(-50%)`)
            .style("top", `calc(50% - ${margin.top}px)`);

          tooltip.style("display", "inherit").html(
            composeTooltipHTML({
              focusDataPoints,
              focusPoint
            })
          );

          if (!tooltipPopper) {
            const [tooltipRefEl] = tooltipRef.nodes();
            tooltipPopper = popperConfig(tooltipRefEl, tooltipEl);
          }

          if (tooltipPopper) {
            tooltipPopper.update();
          }
        })
        .on("mouseout", function() {
          const [mouseX, mouseY] = d3.mouse(this);
          const maxWidth = overlay.node().getAttribute("width");
          const maxHeight = overlay.node().getAttribute("height");
          if (
            mouseX < 0 ||
            mouseX >= maxWidth ||
            mouseY < 0 ||
            mouseY >= maxHeight
          ) {
            g.selectAll(".circle").remove();
            tooltip.html("");
          }
        });
    }
  },

  mounted() {
    this.chartGenerator();
  }
};
</script>
