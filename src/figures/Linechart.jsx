import { useRef, useEffect } from 'react';
import * as d3 from 'd3';

function LineChart({ weather }) {
  const svgRef = useRef(null);
  const svgRefTwo = useRef(null);

  const color = d3.scaleOrdinal(d3.schemeCategory10);
  const width = 700;
  const height = 350;

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const svg2 = d3.select(svgRefTwo.current);
    const margin = { top: 40, right: 140, bottom: 50, left: 50 };

    svg.attr('viewBox', [0, 0, width, height]).style('font', '11px sans-serif');

    svg.selectAll('*').remove();

    if (!weather?.list) return;

    const weatherData = weather.list.map((item) => ({
      date: new Date(item.dt_txt),
      temperature: Math.ceil(item.main.temp - 273.15),
      feels: Math.ceil(item.main.feels_like - 273.15),
    }));

    const scaleX = d3
      .scaleTime()
      .domain(d3.extent(weatherData, (d) => d.date))
      .range([margin.left, width - margin.right]);

    const scaleY = d3
      .scaleLinear()
      .domain([
        d3.min(weatherData, (d) => Math.min(d.temperature, d.feels)),
        d3.max(weatherData, (d) => Math.max(d.temperature, d.feels)),
      ])
      .range([height - margin.bottom, margin.top])
      .nice();

    svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(
        d3
          .axisBottom(scaleX)
          .ticks(width / 80)
          .tickSizeOuter(0)
      );

    svg
      .append('text')
      .attr('y', height - margin.bottom + 20)
      .attr('x', width - margin.right + 10)
      .attr('dy', '2em')
      .style('font-weight', 600)
      .style('text-anchor', 'left')
      .text('Date & Time');

    svg
      .append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(
        d3
          .axisLeft(scaleY)
          .tickFormat((d) => `${d}°C`)
          .ticks(height / 30)
      )
      .call((g) =>
        g
          .selectAll('.tick line')
          .clone()
          .attr('stroke-opacity', 0.2)
          .attr('x2', width - margin.left - margin.right)
      );

    svg
      .append('text')
      .attr('y', margin.top - 10)
      .attr('x', margin.left)
      .attr('dy', '-2em')
      .style('font-weight', 600)
      .style('text-anchor', 'middle')
      .text('Temperature (°C)');

    const lineTemperature = d3
      .line()
      .x((d) => scaleX(d.date))
      .y((d) => scaleY(d.temperature));

    const lineFeelsLike = d3
      .line()
      .x((d) => scaleX(d.date))
      .y((d) => scaleY(d.feels));

    svg
      .append('path')
      .datum(weatherData)
      .attr('fill', 'none')
      .attr('stroke', color(0))
      .attr('stroke-width', 1.5)
      .attr('d', lineTemperature);

    svg
      .append('path')
      .datum(weatherData)
      .attr('fill', 'none')
      .attr('stroke', color(1))
      .attr('stroke-width', 1.5)
      .attr('d', lineFeelsLike);

    svg
      .append('text')
      .attr('fill', color(0))
      .attr('x', width - margin.right + 10)
      .attr('y', scaleY(weatherData[weatherData.length - 1].temperature))
      .attr('dy', '1em')
      .attr('text-anchor', 'start')
      .text('Real Temperature (°C)');

    svg
      .append('text')
      .attr('fill', color(1))
      .attr('x', width - margin.right + 10)
      .attr('y', scaleY(weatherData[weatherData.length - 1].feels))
      .attr('dy', '-1em')
      .attr('text-anchor', 'start')
      .text('Feeling Temperature (°C)');

    const brush = d3
      .brushX()
      .extent([
        [margin.left, margin.top],
        [width - margin.right, height - margin.bottom],
      ])
      .on('brush end', brushed)
      .on('start', reset);

    svg.append('g').call(brush);

    function reset() {
      svg2.selectAll('*').remove();
      svg2.attr('viewBox', [0, 0, 0, 0]).style('font', '11px sans-serif');
    }

    function brushed(event) {
      const selection = event.selection;
      if (!selection) return;

      const [x0, x1] = selection.map(scaleX.invert);

      const filteredData = weatherData.filter(
        (d) => d.date >= x0 && d.date <= x1
      );

      drawSecondChart(filteredData);
    }

    function drawSecondChart(filteredData) {
      svg2
        .attr('viewBox', [0, 0, width, height])
        .style('font', '11px sans-serif');
      svg2.selectAll('*').remove();

      const scaleX2 = d3
        .scaleTime()
        .domain(d3.extent(filteredData, (d) => d.date))
        .range([margin.left, width - margin.right]);

      const scaleY2 = d3
        .scaleLinear()
        .domain([
          d3.min(filteredData, (d) => Math.min(d.temperature, d.feels)),
          d3.max(filteredData, (d) => Math.max(d.temperature, d.feels)),
        ])
        .range([height - margin.bottom, margin.top])
        .nice();

      svg2
        .append('g')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(
          d3
            .axisBottom(scaleX2)
            .ticks(width / 80)
            .tickSizeOuter(0)
        );

      svg2
        .append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(
          d3
            .axisLeft(scaleY2)
            .tickFormat((d) => `${d}°C`)
            .ticks(height / 30)
        )
        .call((g) =>
          g
            .selectAll('.tick line')
            .clone()
            .attr('stroke-opacity', 0.2)
            .attr('x2', width - margin.left - margin.right)
        );

      const lineTemperature2 = d3
        .line()
        .x((d) => scaleX2(d.date))
        .y((d) => scaleY2(d.temperature));

      const lineFeelsLike2 = d3
        .line()
        .x((d) => scaleX2(d.date))
        .y((d) => scaleY2(d.feels));

      svg2
        .append('path')
        .datum(filteredData)
        .attr('fill', 'none')
        .attr('stroke', color(0))
        .attr('stroke-width', 1.5)
        .attr('d', lineTemperature2);

      svg2
        .append('path')
        .datum(filteredData)
        .attr('fill', 'none')
        .attr('stroke', color(1))
        .attr('stroke-width', 1.5)
        .attr('d', lineFeelsLike2);
    }
  }, [weather, color, width, height]);

  return (
    <>
      <svg ref={svgRef}></svg>
      <svg ref={svgRefTwo}></svg>
    </>
  );
}

export default LineChart;
