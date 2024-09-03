import { useRef, useEffect } from 'react';
import * as d3 from 'd3';

function BarChart({ weather }) {
  const svgRef = useRef(null);
  const width = 750;
  const height = 400;

  useEffect(() => {
    const margin = { top: 40, right: 20, bottom: 40, left: 40 };
    const svg = d3
      .select(svgRef.current)
      .attr('viewBox', [0, 0, width, height]);
    svg.selectAll('*').remove();

    if (!weather?.list) return;

    const humidityMap = new Map();
    weather.list.forEach((item) => {
      const date = new Date(item.dt_txt).toLocaleDateString();
      if (!humidityMap.has(date)) {
        humidityMap.set(date, {
          date,
          humidity: item.main.humidity,
        });
      }
    });

    const humidityData = Array.from(humidityMap.values());

    // Create scales
    const xScale = d3
      .scaleBand()
      .domain(humidityData.map((d) => d.date))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([0, 100])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Create axes
    svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .style('font-size', '13px')
      .call(d3.axisBottom(xScale));

    svg
      .append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .style('font-size', '13px')
      .call(
        d3
          .axisLeft(yScale)
          .ticks(10)
          .tickFormat((d) => `${d}%`)
      );

    // Draw bars
    svg
      .selectAll('.bar')
      .data(humidityData)
      .join('rect')
      .attr('class', 'bar')
      .attr('x', (d) => xScale(d.date))
      .attr('y', (d) => yScale(d.humidity))
      .attr('width', xScale.bandwidth())
      .attr('height', (d) => yScale(0) - yScale(d.humidity))
      .attr('fill', '#1f77b4');

    // Add labels
    svg
      .selectAll('.label')
      .data(humidityData)
      .join('text')
      .attr('class', 'label')
      .attr('x', (d) => xScale(d.date) + xScale.bandwidth() / 2)
      .attr('y', (d) => yScale(d.humidity) - 15)
      .attr('text-anchor', 'middle')
      .attr('fill', 'black')
      .attr('font-weight', '500')
      .style('font-size', '15px')
      .text((d) => `${d.humidity}%`);
  }, [weather]);

  return <svg ref={svgRef} width={width} height={height}></svg>;
}

export default BarChart;
