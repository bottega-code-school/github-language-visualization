import React from "react";
import { BarStackHorizontal } from "@vx/shape";
import { Group } from "@vx/group";
import { AxisBottom, AxisLeft } from "@vx/axis";
import { scaleBand, scaleLinear, scaleOrdinal } from "@vx/scale";
import { timeParse, timeFormat } from "d3-time-format";
import { withTooltip, Tooltip } from "@vx/tooltip";
import { LegendOrdinal } from "@vx/legend";

// Custom color spectrum generated from:
// https://coolors.co/
const color1 = "#1eacb7";
const color2 = "#33658A";
const color3 = "#86BBD8";
const color4 = "#2F4858";
const color5 = "#F6AE2D";
const color6 = "#F26419";
const color7 = "#a16eb2";
const color8 = "#ac3a3a";
const darkThemeColor = "#21282f";
const bg = "transparent";

const StackedBarChart = ({
  width,
  height,
  events = false,
  margin = {
    top: 20,
    left: 50,
    right: 40,
    bottom: 30
  },
  chartData,
  tooltipOpen,
  tooltipLeft,
  tooltipTop,
  tooltipData,
  hideTooltip,
  showTooltip
}) => {
  const keys = Object.keys(chartData[0]).filter(d => d !== "date");

  const totals = chartData.reduce((ret, cur) => {
    const t = keys.reduce((dailyTotal, k) => {
      dailyTotal += +cur[k];
      return dailyTotal;
    }, 0);
    ret.push(t);
    return ret;
  }, []);

  const parseDate = timeParse("%d/%m/%Y");
  const format = timeFormat("%b %y");
  const formatDate = date => format(parseDate(date));

  // accessors
  const y = d => d.date;

  // scales
  const xScale = scaleLinear({
    domain: [0, Math.max(...totals)],
    nice: true
  });
  const yScale = scaleBand({
    domain: chartData.map(y),
    padding: 0.2
  });
  const color = scaleOrdinal({
    domain: keys,
    range: [color1, color2, color3, color4, color5, color6, color7, color8]
  });

  let tooltipTimeout;

  if (width < 10) return null;

  // bounds
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  xScale.rangeRound([0, xMax]);
  yScale.rangeRound([yMax, 0]);

  return (
    <div style={{ position: "relative" }}>
      <svg width={width} height={height}>
        <rect width={width} height={height} fill={bg} rx={14} />
        <Group top={margin.top} left={margin.left}>
          <BarStackHorizontal
            data={chartData}
            keys={keys}
            height={yMax}
            y={y}
            xScale={xScale}
            yScale={yScale}
            color={color}
          >
            {barStacks => {
              return barStacks.map(barStack => {
                return barStack.bars.map(bar => {
                  return (
                    <rect
                      key={`barstack-horizontal-${barStack.index}-${bar.index}`}
                      x={bar.x}
                      y={bar.y}
                      width={bar.width}
                      height={bar.height}
                      fill={bar.color}
                      onClick={event => {
                        if (!events) return;
                        alert(`clicked: ${JSON.stringify(bar)}`);
                      }}
                      onMouseLeave={event => {
                        tooltipTimeout = setTimeout(() => {
                          hideTooltip();
                        }, 300);
                      }}
                      onMouseMove={event => {
                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                        const top = bar.y + margin.top;
                        const left = bar.x + bar.width + margin.left;
                        showTooltip({
                          tooltipData: bar,
                          tooltipTop: top,
                          tooltipLeft: left
                        });
                      }}
                    />
                  );
                });
              });
            }}
          </BarStackHorizontal>
          <AxisLeft
            hideAxisLine={true}
            hideTicks={true}
            scale={yScale}
            tickFormat={formatDate}
            stroke={darkThemeColor}
            tickStroke={darkThemeColor}
            tickLabelProps={(value, index) => ({
              fill: darkThemeColor,
              fontSize: 11,
              textAnchor: "end",
              dy: "0.33em"
            })}
          />
          <AxisBottom
            top={yMax}
            scale={xScale}
            stroke={darkThemeColor}
            tickStroke={darkThemeColor}
            tickLabelProps={(value, index) => ({
              fill: darkThemeColor,
              fontSize: 11,
              textAnchor: "middle"
            })}
          />
        </Group>
      </svg>
      <div
        style={{
          position: "absolute",
          top: margin.top / 2 - 10,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          fontSize: "14px"
        }}
      >
        <LegendOrdinal scale={color} direction="row" labelMargin="0 15px 0 0" />
      </div>
      {tooltipOpen && (
        <Tooltip
          top={tooltipTop}
          left={tooltipLeft}
          style={{
            minWidth: 60,
            backgroundColor: "rgba(0,0,0,0.9)",
            color: "white"
          }}
        >
          <div style={{ color: color(tooltipData.key) }}>
            <strong>{tooltipData.key}</strong>
          </div>
          <div>{tooltipData.bar.data[tooltipData.key]} new projects</div>
          <div>
            <small>{formatDate(y(tooltipData.bar.data))}</small>
          </div>
        </Tooltip>
      )}
    </div>
  );
};

export default withTooltip(StackedBarChart);
