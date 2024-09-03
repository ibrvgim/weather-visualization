import { useRef, useEffect } from 'react';
import * as d3 from 'd3';

function ParallelCoordinates({ weather }) {
  const svgRef = useRef(null);

  const color = d3.scaleOrdinal(d3.schemeCategory10);
  const width = 750;
  const height = 350;

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const margin = { top: 50, right: 80, bottom: 50, left: 80 };

    svg.attr('viewBox', [0, 0, width, height]);
    svg.selectAll('*').remove();

    if (!weather?.list) return;

    const weatherData = weather.list.map((item) => ({
      minTemp: Math.ceil(item.main.temp_min - 273.15),
      temperature: Math.ceil(item.main.temp - 273.15),
      maxTemp: Math.ceil(item.main.temp_max - 273.15),
    }));

    const values = ['minTemp', 'temperature', 'maxTemp'];
    const labels = [
      'Minimum Temperature (°C)',
      'Average Temperature (°C)',
      'Maximum Temperature (°C)',
    ];

    const scales = new Map();
    values.forEach((attr) => {
      scales.set(
        attr,
        d3
          .scaleLinear()
          .domain(d3.extent(weatherData, (d) => d[attr]))
          .range([height - margin.bottom, margin.top])
      );
    });

    const xScale = d3
      .scalePoint()
      .domain(values)
      .range([margin.left, width - margin.right]);

    const axes = svg
      .selectAll('g.axis')
      .data(values)
      .join('g')
      .attr('transform', (d) => `translate(${xScale(d)},0)`)
      .style('font-size', '11px')
      .each(function (d) {
        d3.select(this).call(d3.axisLeft(scales.get(d)));
      });

    axes
      .append('text')
      .attr('y', margin.top - 30)
      .attr('text-anchor', 'middle')
      .attr('fill', 'black')
      .attr('font-weight', '700')
      .style('font-size', '11px')
      .text((_, i) => labels[i]);

    const line = d3
      .line()
      .defined((d) => !isNaN(d[1]))
      .x((d) => xScale(d[0]))
      .y((d) => scales.get(d[0])(d[1]));

    svg
      .selectAll('polyline')
      .data(weatherData)
      .join('path')
      .attr('d', (d) => line(values.map((attr) => [attr, d[attr]])))
      .attr('stroke', (d) => color(d[values]))
      .attr('stroke-width', 0.5)
      .attr('fill', 'none');
  }, [weather, color, width, height]);

  return (
    <>
      <svg ref={svgRef}></svg>
    </>
  );
}

export default ParallelCoordinates;
