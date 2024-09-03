import { useRef, useEffect } from 'react';
import * as d3 from 'd3';

function ScatterPlot({ citiesWeather }) {
  const svgRef = useRef(null);
  const width = 800;
  const height = 500;

  useEffect(() => {
    const margin = { top: 20, right: 30, bottom: 60, left: 70 };
    const svg = d3
      .select(svgRef.current)
      .attr('viewBox', [0, 0, width, height]);

    svg.selectAll('*').remove();

    const scatterData = citiesWeather.flatMap((cityData) =>
      cityData?.list?.map((item) => ({
        cityName: cityData?.city?.name,
        temperature: Math.ceil(item.main.temp - 273.15),
        humidity: item.main.humidity,
        date: new Date(item.dt_txt).toLocaleDateString(),
      }))
    );

    const colorScale = d3
      .scaleOrdinal()
      .domain(citiesWeather.map((d) => d?.city?.name))
      .range(d3.schemeCategory10);

    // Create scales
    const xScale = d3
      .scaleLinear()
      .domain([0, 100])
      .range([margin.left, width - margin.right]);

    const yScale = d3
      .scaleLinear()
      .domain([
        d3.min(scatterData, (d) => d?.temperature) - 5,
        d3.max(scatterData, (d) => d?.temperature) + 5,
      ])
      .range([height - margin.bottom, margin.top])
      .nice();

    // Create axes
    svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale).tickSizeOuter(0))
      .selectAll('text')
      .style('font-size', '13px');

    svg
      .append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale))
      .selectAll('text')
      .style('font-size', '13px');

    svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .append('text')
      .attr('x', width / 2)
      .attr('y', 50)
      .attr('fill', 'black')
      .attr('text-anchor', 'middle')
      .attr('font-weight', 'bold')
      .style('font-size', '13px')
      .text('Humidity ( % )');

    svg
      .append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -50)
      .attr('fill', 'black')
      .attr('text-anchor', 'middle')
      .attr('font-weight', 'bold')
      .style('font-size', '13px')
      .text('Temperature ( °C )');

    // Draw scatterplot points
    const circles = svg
      .selectAll('circle')
      .data(scatterData)
      .join('circle')
      .attr('cx', (d) => xScale(d?.humidity))
      .attr('cy', (d) => yScale(d?.temperature))
      .attr('r', 5)
      .attr('fill', (d) => colorScale(d?.cityName))
      .attr('opacity', 0.75);

    // Add tooltip
    const tooltip = d3
      .select('body')
      .append('div')
      .style('position', 'absolute')
      .style('padding', '6px')
      .style('background', 'white')
      .style('border', '1px solid #ccc')
      .style('border-radius', '4px')
      .style('pointer-events', 'none')
      .style('visibility', 'hidden');

    circles
      .on('mouseover', function (_, d) {
        tooltip
          .style('visibility', 'visible')
          .text(`${d?.temperature}°C | ${d?.humidity}%`);
      })
      .on('mousemove', function (event) {
        tooltip
          .style('top', `${event.pageY - 10}px`)
          .style('left', `${event.pageX + 10}px`);
      })
      .on('mouseout', function () {
        tooltip.style('visibility', 'hidden');
      });

    // Create legend
    const legend = svg
      .append('g')
      .attr(
        'transform',
        `translate(${width - margin.right - 100},${margin.top})`
      );

    const legendItems = legend
      .selectAll('.legend-item')
      .data(colorScale.domain())
      .join('g')
      .attr('class', 'legend-item')
      .attr('transform', (_, i) => `translate(0, ${i * 30})`);

    legendItems
      .append('circle')
      .attr('cx', 30)
      .attr('cy', 0)
      .attr('r', 6)
      .attr('fill', colorScale);

    legendItems
      .append('text')
      .attr('x', 50)
      .attr('y', 5)
      .attr('fill', 'black')
      .text((d) => d);
  }, [citiesWeather]);

  if (!citiesWeather || citiesWeather.length === 0) return;

  return <svg ref={svgRef} width={width} height={height}></svg>;
}

export default ScatterPlot;
