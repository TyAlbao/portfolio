import { fetchJSON, renderProjects } from "../global.js";
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

// Fetch projects and select DOM elements
const projects         = await fetchJSON('../lib/projects.json');
const projectContainer = document.querySelector('.projects');
const countElement     = document.getElementById('project-count');
const searchInput      = document.querySelector('.searchBar');

// Track the selected wedge (-1 means none)
let selectedIndex = -1;

// 1️⃣ Render project list and count
function renderList(projs) {
  renderProjects(projs, projectContainer, 'h2');
  countElement.textContent = `${projs.length} Projects`;
}

// D3 pie chart setup
const arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
const colorScale   = d3.scaleOrdinal(d3.schemeTableau10);

// 2️⃣ Render pie chart + legend for given data
function renderPieChart(projs) {
  // A) Group by year and count
  const rolled = d3.rollups(
    projs,
    v => v.length,
    d => d.year
  );
  const chartData = rolled.map(([year, count]) => ({ label: year, value: count }));

  // B) Select the SVG and clear old paths
  const svg = d3.select('#projects-pie-plot');
  svg.selectAll('path').remove();

  // C) Draw new slices with click handlers
  chartData.forEach((d, i) => {
    const slice = d3.arc()(d3.pie().value(d => d.value)(chartData)[i]);
    svg.append('path')
      .attr('d', arcGenerator(d3.pie().value(d => d.value)(chartData)[i]))
      .attr('fill', colorScale(i))
      .classed('selected', i === selectedIndex)
      .style('cursor', 'pointer')
      .on('click', () => {
        // Toggle selection
        selectedIndex = (selectedIndex === i ? -1 : i);
        // Update slice and legend classes
        svg.selectAll('path').classed('selected', (_, idx) => idx === selectedIndex);
        d3.select('.legend').selectAll('li').classed('selected', (_, idx) => idx === selectedIndex);
        // Filter projects by selected year and render
        if (selectedIndex === -1) {
          renderList(projects);
        } else {
          const selectedYear = chartData[selectedIndex].label;
          const filtered = projects.filter(p => p.year === selectedYear);
          renderList(filtered);
        }
      });
  });

  // D) Render legend items
  const legend = d3.select('.legend');
  legend.selectAll('li').remove();
  chartData.forEach((d, i) => {
    legend.append('li')
      .attr('class', 'legend-item')
      .classed('selected', i === selectedIndex)
      .attr('style', `--color: ${colorScale(i)}`)
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)  
      .style('cursor', 'pointer')
      .on('click', () => {
        // Toggle selection
        selectedIndex = (selectedIndex === i ? -1 : i);
        // Update slice and legend classes
        svg.selectAll('path').classed('selected', (_, idx) => idx === selectedIndex);
        legend.selectAll('li').classed('selected', (_, idx) => idx === selectedIndex);
        // Filter projects by selected year and render
        if (selectedIndex === -1) {
          renderList(projects);
        } else {
          const selectedYear = chartData[selectedIndex].label;
          const filtered = projects.filter(p => p.year === selectedYear);
          renderList(filtered);
        }
      });
  });
}

// Initial render on page load
renderList(projects);
renderPieChart(projects);

// 3️⃣ Filter on search input and reset selection
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = projects.filter(proj =>
      Object.values(proj).join(' ').toLowerCase().includes(query)
    );
    selectedIndex = -1;                     // clear selection
    renderList(filtered);
    renderPieChart(filtered);
  });
}