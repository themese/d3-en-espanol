import * as React from "react";
import { useLayoutEffect } from "react";
import * as d3 from "d3";
import { createScale } from "../utils";
import d3Tip from "d3-tip";

interface AxisType {
  type: "linear" | "date" | "ordinal" | "band" | "point";
  field: string;
  timeUnit?: string;
  minValue?: number;
  numTicks?: number;
}
interface BarChartProps {
  data: any[];
  id?: string;
  x: AxisType;
  y: AxisType;
  fill?: string;
  stroke?: string;
  barWidth?: number;
  barSpacing?: number;
  leftAxisText?: string;
  leftAxisTextSize?: string;
  tickColor?: string;
  fontWeight?: string;
  fontSize?: string;
  renderGridLines?: boolean;
  renderTooltip?: (data: any) => any;
  formatYTicks?: (value: any) => string;
  yTickCount?: string;
}

const BarChart: React.FunctionComponent<BarChartProps> = (props) => {
  let svg: d3.Selection<any, any, any, any> = d3.select(`#${props.id}`).select("g");
  const margin = { top: 20, right: 20, bottom: 80, left: 70 };
  const height = 440 - margin.top - margin.bottom;
  const width = 835 - margin.right - margin.left;
  let xScale: any;
  let yScale: any;

  const createAxis = () => {
    d3.select(".x-axis").remove();
    d3.select(".y-axis").remove();
    const xAxis = d3.axisBottom(xScale);

    const yAxis = d3.axisLeft(yScale);

    if (props.formatYTicks && typeof) {
      yAxis.ticks(props.yTickCount)
           .tickFormat(d => props.formatYTicks(d));
    } else {
      yAxis.ticks(props.yTickCount, "s");
    }

    const barWidth = ((width - (props.barSpacing * props.data.length)) / props.data.length);
    svg.append("g").attr("class", "x-axis")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis)
      .selectAll("text")
      .style("fill", props.tickColor)
      .style("font-weight", props.fontWeight)
      .style("font-size", props.fontSize)
      .call(d => wrap(d, barWidth));

    svg.append("g").attr("class", "y-axis")
      .attr("transform", `translate(${0}, 0)`)
      .call(yAxis)
      .selectAll("text")
      .style("fill", props.tickColor)
      .style("font-weight", props.fontWeight)
      .style("font-size", props.fontSize);

    d3.select(".x-axis path").attr("stroke", "#c0c0c0");
    d3.select(".y-axis path").attr("stroke", "#c0c0c0");
  };

  const updateGridLines = () => {
    // update grid lines
    svg.select(".x-grid")
      .call(d3.axisBottom(xScale)
        .tickSize(-height)
        // @ts-ignore
        .tickFormat(""),
      );

    svg.select(".y-grid")
      .call(d3.axisLeft(yScale)
        .tickSize(-width)
        // @ts-ignore
        .tickFormat(""),
      );

    d3.selectAll(".x-grid line").attr("stroke", "lightgrey");
    d3.selectAll(".y-grid line").attr("stroke", "lightgrey");
    d3.selectAll(".x-grid path").attr("stroke-width", "0");
    d3.selectAll(".y-grid path").attr("stroke-width", "0");
  };

  const updateScales = () => {
    const [xMin, xMax] = d3.extent(props.data, d => d[props.x.field]);
    const [, yMax] = d3.extent(props.data, d => d[props.y.field]);

    const xType = props.x.type;
    const yType = props.y.type;
    const values = props.data.map(d => d[props.x.field]);
    const yValues = props.data.map(d => d[props.y.field]);

    if (xType === "linear" || xType === "date") {
      xScale = createScale(xType, [xMin, xMax], [0, width]);
    } else if (xType === "ordinal" || xType === "band" || xType === "point") {
      xScale = createScale(xType, values, [0, width]);
    }

    if (yType === "linear" || yType === "date") {
      yScale = createScale(yType, [0, yMax], [height, 0]);
    } else if (yType === "ordinal" || yType === "band" || yType === "point") {
      yScale = createScale(yType, yValues, [height, 0]);
    }
  };
  const renderChart = () => {
    d3.select(".d3-tooltip").remove();
    const { renderTooltip } = props;
    const toolTip = d3Tip();
    let tip;
    if (renderTooltip) {
      tip = toolTip.attr("class", "d3-tip").direction("e").offset([0, 2]).html(props.renderTooltip);
      svg.call(tip);
    }
    const bars = svg.selectAll("rect")
      .data(props.data, d => d[props.x.field]);

    bars.exit().attr("y", height).attr("height", 0).remove();

    if (props.leftAxisText) {
      d3.select(".y-axis-text").text(props.leftAxisText)
        .attr("transform", `translate(20, ${height / 1.4})rotate(-90)`)
        .style("fill", props.tickColor)
        .style("font-weight", props.fontWeight)
        .style("font-size", props.leftAxisTextSize);
    }
    const barsEnter = bars.enter().append("rect")
      .attr("fill", props.fill)
      .attr("y", height)
      .attr("height", 0)
      .attr("x", d => (xScale(d[props.x.field])) + props.barSpacing / 2)
      .attr("stroke", props.stroke);

    bars.merge(barsEnter)
      .attr("class", "bar")
      .attr("width", props.barWidth ? props.barWidth :
        ((width - (props.barSpacing * props.data.length)) / props.data.length))
      .on("mouseover", function (d) {
        if (!props.renderTooltip) {
            return;
        }

        d3.selectAll(".bar")
          .style("opacity", "0.5");
        d3.select(this)
          .style("opacity", "1");
        if (tip) {
          tip.show(d, this);
        }
      })
      .on("mouseout", () => {
        d3.selectAll(".bar")
          .style("opacity", "1");
        if (tip) {
          tip.hide();
        }
      })
      .transition()
      .duration(1000)
      .attr("y", d => yScale(d[props.y.field]))
      .attr("x", d => (xScale(d[props.x.field])) + props.barSpacing / 2)
      .attr("height", d => height - yScale(d[props.y.field]));
  };

  useLayoutEffect(() => {
    svg  = d3.select(`#${props.id}`).select("g");
    updateScales();
    createAxis();
    if (props.renderGridLines) {
      updateGridLines();
    }

    renderChart();
  },              [props]);

  return (
    <svg id={`${props.id}`} viewBox={`0, 0, ${width + margin.left + margin.right}, ${height + margin.top + margin.bottom}`}>
      <text className="y-axis-text"></text>
      <g transform={`translate(${margin.left}, ${margin.top})`}></g>
    </svg>
  );
};

BarChart.defaultProps = {
  stroke: "black",
  fill: "green",
  barSpacing: 0,
  tickColor: "#333333",
  fontWeight: "normal",
  fontSize: "inherit",
  leftAxisTextSize: "inherit",
  renderGridLines: true,
  id: "bar_chart",
  yTickCount: "5",
};

export { BarChart };