import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function ParallelCoordinates({ citiesWeather }) {
  const svgRef = useRef();

  useEffect(() => {
    const margin = { top: 50, right: 30, bottom: 50, left: 50 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const parallelData = citiesWeather.flatMap((cityData) =>
      cityData?.list?.map((item) => ({
        cityName: cityData?.city?.name,
        date: new Date(item.dt_txt).toLocaleDateString(),
        windGust: Math.ceil(item.wind?.gust),
      }))
    );

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3
      .select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Extract the unique cities
    const cities = [...new Set(parallelData.map((d) => d?.cityName))];
    const xScale = d3.scalePoint().domain(cities).range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(parallelData, (d) => d?.windGust)])
      .range([height, 0]);

    const groupedData = d3.group(parallelData, (d) => d?.date);

    const color = d3
      .scaleOrdinal(d3.schemeCategory10)
      .domain([...groupedData.keys()]);

    // Draw axes for each city
    cities.forEach((city) => {
      svg
        .append('g')
        .attr('transform', `translate(${xScale(city)},0)`)
        .call(
          d3
            .axisLeft(yScale)
            .tickFormat((d) => `${d} km/h`)
            .ticks(6)
        )
        .selectAll('text')
        .style('font-size', '12px');

      svg
        .append('text')
        .attr('transform', `translate(${xScale(city)},${height + margin.top})`)
        .attr('text-anchor', 'middle')
        .attr('font-size', '16px')
        .text(city)
        .style('fill', 'black');
    });

    const linePath = d3
      .line()
      .x((d) => xScale(d?.cityName))
      .y((d) => yScale(d?.windGust));

    const tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('background', 'lightsteelblue')
      .style('padding', '5px')
      .style('border-radius', '5px')
      .style('opacity', 0);

    // Draw the lines
    groupedData.forEach((values, date) => {
      svg
        .append('path')
        .datum(values)
        .attr('d', linePath)
        .attr('fill', 'none')
        .attr('stroke', color(date))
        .attr('stroke-width', 2.5)
        .attr('opacity', 0.7)
        .on('mouseover', function (event) {
          d3.select(this).attr('stroke-width', 4).attr('opacity', 1);
          tooltip.transition().duration(200).style('opacity', 0.9);
          tooltip
            .html(`Date: ${date}`)
            .style('left', event.pageX + 5 + 'px')
            .style('top', event.pageY - 28 + 'px');
        })
        .on('mouseout', function () {
          d3.select(this).attr('stroke-width', 2.5).attr('opacity', 0.7);
          tooltip.transition().duration(500).style('opacity', 0);
        });
    });
  }, [citiesWeather]);

  return <svg ref={svgRef}></svg>;
}

export default ParallelCoordinates;
