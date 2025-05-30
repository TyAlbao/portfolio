// import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

// async function loadData() {
//   const data = await d3.csv('loc.csv', (row) => ({
//     ...row,
//     line: Number(row.line), // or just +row.line
//     depth: Number(row.depth),
//     length: Number(row.length),
//     date: new Date(row.date + 'T00:00' + row.timezone),
//     datetime: new Date(row.datetime),
//   }));

//   return data;
// }


// function processCommits(data) {
//   return d3
//     .groups(data, (d) => d.commit)
//     .map(([commit, lines]) => {
//       let first = lines[0];
//       let { author, date, time, timezone, datetime } = first;
//       let ret = {
//         id: commit,
//         url: 'https://github.com/TyAlbao/portfolio/commit/' + commit,
//         author,
//         date,
//         time,
//         timezone,
//         datetime,
//         hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
//         totalLines: lines.length,
//       };

//       Object.defineProperty(ret, 'lines', {
//         value: lines,
//         // What other options do we need to set?
//         // Hint: look up configurable, writable, and enumerable
//         configurable: false,
//         writable: false,
//         enumerable: false,
//       });

//       return ret;
//     });
// }


// function renderCommitInfo(data, commits) {
//   // Create the dl element
//   const dl = d3.select('#stats').append('dl').attr('class', 'stats');

//   // Add total LOC
//   dl.append('dt').html('Total <abbr title="Lines of code">LOC</abbr>');
//   dl.append('dd').text(data.length);

//   // Add total commits
//   dl.append('dt').text('Total commits');
//   dl.append('dd').text(commits.length);

//   // Add more stats as needed...
  
//   dl.append('dt').text('First commit');
//   dl.append('dd').text(commits[commits.length - 1].datetime.toLocaleString());

//   dl.append('dt').text('Last commit');
//   dl.append('dd').text(commits[0].datetime.toLocaleString());

//   dl.append('dt').text('First commit date');
//   dl.append('dd').text(commits[commits.length - 1].datetime.toLocaleString());

// }

// let xScale, yScale; // Global variables for scales


// function renderScatterPlot(data, commits) {
//  // Put all the JS code of Steps inside this function
 
    
//  const sortedCommits = d3.sort(commits, (d) => -d.totalLines);
//  const width = 1000;
//  const height = 600;
//  const svg = d3
//   .select('#chart')
//   .append('svg')
//   .attr('viewBox', `0 0 ${width} ${height}`)
//   .style('overflow', 'visible');

//   xScale = d3
//   .scaleTime()
//   .domain(d3.extent(commits, (d) => d.datetime))
//   .range([0, width])
//   .nice();

//   yScale = d3.scaleLinear().domain([0, 24]).range([height, 0]);
//   const dots = svg.append('g').attr('class', 'dots');
//   const [minLines, maxLines] = d3.extent(commits, (d) => d.totalLines);
//   const rScale = d3
//   .scaleSqrt() // Change only this line
//   .domain([minLines, maxLines])
//   .range([2, 30]);


//   dots
//   .selectAll('circle')
//   .data(sortedCommits)
//   .join('circle')
//   .attr('cx', (d) => xScale(d.datetime))
//   .attr('cy', (d) => yScale(d.hourFrac))
//   .attr('r', (d) => rScale(d.totalLines))
//   .attr('fill', 'steelblue')
//   .style('fill-opacity', 0.7)
//   .on('mouseenter', (event, commit) => {
//     renderTooltipContent(commit);
//     updateTooltipVisibility(true);
//     updateTooltipPosition(event);
//   })
//   .on('mouseleave', () => {
//     updateTooltipVisibility(false);
//   });

//   const margin = { top: 10, right: 10, bottom: 30, left: 20 };
//   const usableArea = {
//   top: margin.top,
//   right: width - margin.right,
//   bottom: height - margin.bottom,
//   left: margin.left,
//   width: width - margin.left - margin.right,
//   height: height - margin.top - margin.bottom,
// };

// // Update scales with new ranges
// xScale.range([usableArea.left, usableArea.right]);
// yScale.range([usableArea.bottom, usableArea.top]);

// const gridlines = svg
//   .append('g')
//   .attr('class', 'gridlines')
//   .attr('transform', `translate(${usableArea.left}, 0)`);

// // Create gridlines as an axis with no labels and full-width ticks
// gridlines.call(d3.axisLeft(yScale).tickFormat('').tickSize(-usableArea.width));

// // Create the axes
// const xAxis = d3.axisBottom(xScale);
// const yAxis = d3
//   .axisLeft(yScale)
//   .tickFormat((d) => String(d % 24).padStart(2, '0') + ':00');
// // Add X axis
// svg
//   .append('g')
//   .attr('transform', `translate(0, ${usableArea.bottom})`)
//   .call(xAxis);

// // Add Y axis
// svg
//   .append('g')
//   .attr('transform', `translate(${usableArea.left}, 0)`)
//   .call(yAxis);

//  // Create brush
// // svg.call(d3.brush());
// svg.call(d3.brush().on('start brush end', brushed));


// // Raise dots and everything after overlay
// svg.selectAll('.dots, .overlay ~ *').raise();
  
// }

// let data = await loadData();
// let commits = processCommits(data);
// console.log(commits);

// renderCommitInfo(data, commits);
// renderScatterPlot(data, commits);

// function renderTooltipContent(commit) {
//   const link = document.getElementById('commit-link');
//   const date = document.getElementById('commit-date');
//   const time = document.getElementById('commit-time');
//   const author = document.getElementById('commit-author');
//   const linesEdited = document.getElementById('commit-lines-edited');

//   if (Object.keys(commit).length === 0) return;

//   link.href = commit.url;
//   link.textContent = commit.id;
//   date.textContent = commit.datetime?.toLocaleString('en', {
//     dateStyle: 'full',
//   });
//   time.textContent = commit.time;
//   author.textContent = commit.author;
//   linesEdited.textContent = commit.totalLines;
// }

// function updateTooltipVisibility(isVisible) {
//   const tooltip = document.getElementById('commit-tooltip');
//   tooltip.hidden = !isVisible;
// }

// function updateTooltipPosition(event) {
//   const tooltip = document.getElementById('commit-tooltip');
//   tooltip.style.left = `${event.clientX}px`;
//   tooltip.style.top = `${event.clientY}px`;
// }

// function createBrushSelector(svg) {
//   svg.call(d3.brush());
// }

// function brushed(event) {
//   const selection = event.selection;
//   d3.selectAll('circle').classed('selected', (d) =>
//     isCommitSelected(selection, d),
//   );
//   const selectedCommits = renderSelectionCount(selection);
//   const breakdown = renderLanguageBreakdown(selection);
// }

// function isCommitSelected(selection, commit) {
//   if (!selection) {
//     return false;
//   }
//   const [x0, x1] = selection.map((d) => d[0]);
//   const [y0, y1] = selection.map((d) => d[1]);
//   const x = xScale(commit.datetime);
//   const y = yScale(commit.hourFrac);
//   return x >= x0 && x <= x1 && y >= y0 && y <= y1;
// }

// function renderSelectionCount(selection) {
//   const selectedCommits = selection
//     ? commits.filter((d) => isCommitSelected(selection, d))
//     : [];

//   const countElement = document.querySelector('#selection-count');
//   countElement.textContent = `${
//     selectedCommits.length || 'No'
//   } commits selected`;

//   return selectedCommits;
// }

// function renderLanguageBreakdown(selection) {
//   const selectedCommits = selection
//     ? commits.filter((d) => isCommitSelected(selection, d))
//     : [];
//   const container = document.getElementById('language-breakdown');

//   if (selectedCommits.length === 0) {
//     container.innerHTML = '';
//     return;
//   }
//   const requiredCommits = selectedCommits.length ? selectedCommits : commits;
//   const lines = requiredCommits.flatMap((d) => d.lines);

//   // Use d3.rollup to count lines per language
//   const breakdown = d3.rollup(
//     lines,
//     (v) => v.length,
//     (d) => d.type,
//   );

//   // Update DOM with breakdown
//   container.innerHTML = '';

//   for (const [language, count] of breakdown) {
//     const proportion = count / lines.length;
//     const formatted = d3.format('.1~%')(proportion);

//     container.innerHTML += `
//             <dt>${language}</dt>
//             <dd>${count} lines (${formatted})</dd>
//         `;
//   }
// }

// let commitProgress = 100;


// let timeScale = d3
//   .scaleTime()
//   .domain([
//     d3.min(commits, (d) => d.datetime),
//     d3.max(commits, (d) => d.datetime),
//   ])
//   .range([0, 100]);
// let commitMaxTime = timeScale.invert(commitProgress);

import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

let xScale, yScale;
let commitProgress = 100;

const data = await loadData();
const commits = processCommits(data);
let filteredCommits = commits;

const timeScale = d3.scaleTime()
  .domain(d3.extent(commits, (d) => d.datetime))
  .range([0, 100]);

let commitMaxTime = timeScale.invert(commitProgress);

renderCommitInfo(data, filteredCommits);
renderScatterPlot(data, filteredCommits);
updateFileDisplay(filteredCommits);
// onTimeSliderChange();

// document.getElementById('commit-progress').addEventListener('input', onTimeSliderChange);

async function loadData() {
  return await d3.csv('loc.csv', (row) => ({
    ...row,
    line: +row.line,
    depth: +row.depth,
    length: +row.length,
    date: new Date(row.date + 'T00:00' + row.timezone),
    datetime: new Date(row.datetime),
  }));
}

function processCommits(data) {
  return d3.groups(data, d => d.commit).map(([commit, lines]) => {
    const { author, date, time, timezone, datetime } = lines[0];
    const entry = {
      id: commit,
      url: 'https://github.com/tyalbao/portfolio/commit/' + commit,
      author, date, time, timezone, datetime,
      hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
      totalLines: lines.length,
    };
    Object.defineProperty(entry, 'lines', {
      value: lines, enumerable: false, writable: false, configurable: false
    });
    return entry;
  });
}

function renderCommitInfo(data, commits) {
  const dl = d3.select('#stats').append('dl').attr('class', 'stats');
  dl.append('dt').html('Total <abbr title="Lines of code">LOC</abbr>');
  dl.append('dd').text(data.length);
  dl.append('dt').text('Total commits');
  dl.append('dd').text(commits.length);
  dl.append('dt').text('Number of files');
  dl.append('dd').text(new Set(data.map(d => d.file)).size);
  dl.append('dt').text('Average File Length (lines)');
  dl.append('dd').text(d3.mean(d3.groups(data, d => d.file).map(([, lines]) => lines.length)).toFixed(2));
  const max = d3.max(d3.groups(data, d => d.file).map(([, lines]) => lines.length));
  const maxFile = d3.groups(data, d => d.file).find(([, lines]) => lines.length === max)[0];
  dl.append('dt').text('Longest File (lines)');
  dl.append('dd').text(`${maxFile} (${max})`);
}

function renderScatterPlot(data, commits) {
  const width = 1000, height = 600;
  const margin = { top: 10, right: 10, bottom: 30, left: 20 };
  const usableArea = {
    top: margin.top, right: width - margin.right,
    bottom: height - margin.bottom, left: margin.left,
    width: width - margin.left - margin.right,
    height: height - margin.top - margin.bottom,
  };

  const svg = d3.select('#chart').append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .style('overflow', 'visible');

  xScale = d3.scaleTime().domain(d3.extent(commits, d => d.datetime)).range([usableArea.left, usableArea.right]).nice();
  yScale = d3.scaleLinear().domain([0, 24]).range([usableArea.bottom, usableArea.top]);

  svg.append('g').attr('transform', `translate(0, ${usableArea.bottom})`).attr('class', 'x-axis').call(d3.axisBottom(xScale));
  svg.append('g').attr('transform', `translate(${usableArea.left}, 0)`).attr('class', 'y-axis').call(d3.axisLeft(yScale).tickFormat(d => `${String(d).padStart(2, '0')}:00`));
  svg.append('g').attr('class', 'gridlines').attr('transform', `translate(${usableArea.left}, 0)`).call(d3.axisLeft(yScale).tickFormat('').tickSize(-usableArea.width));
  svg.append('g').attr('class', 'dots');

  updateScatterPlot(data, commits);
}

function updateScatterPlot(data, commits) {
  const svg = d3.select('#chart').select('svg');
  xScale.domain(d3.extent(commits, d => d.datetime));

  const [minLines, maxLines] = d3.extent(commits, d => d.totalLines);
  const rScale = d3.scaleSqrt().domain([minLines, maxLines]).range([2, 25]);

  const xAxis = d3.axisBottom(xScale);
  svg.select('g.x-axis').transition().duration(500).call(xAxis);

  const dots = svg.select('g.dots');
  const sortedCommits = d3.sort(commits, d => -d.totalLines);

  const update = dots.selectAll('circle')
    .data(sortedCommits, d => d.id);

  update
    .join(
      enter => enter.append('circle')
        .attr('cx', d => xScale(d.datetime))
        .attr('cy', d => yScale(d.hourFrac))
        .attr('r', 0)
        .attr('fill', 'steelblue')
        .style('fill-opacity', 0.7)
        .on('mouseenter', (event, commit) => {
          d3.select(event.currentTarget).style('fill-opacity', 1);
          renderTooltipContent(commit);
          updateTooltipVisibility(true);
          updateTooltipPosition(event);
        })
        .on('mouseleave', (event) => {
          d3.select(event.currentTarget).style('fill-opacity', 0.7);
          updateTooltipVisibility(false);
        })
        .transition()
        .duration(500)
        .attr('r', d => rScale(d.totalLines)),

      update => update
        .transition()
        .duration(500)
        .attr('cx', d => xScale(d.datetime))
        .attr('cy', d => yScale(d.hourFrac))
        .attr('r', d => rScale(d.totalLines)),

      exit => exit
        .transition()
        .duration(300)
        .attr('r', 0)
        .remove()
    );
}

function onTimeSliderChange() {
  commitProgress = +document.getElementById('commit-progress').value;
  commitMaxTime = timeScale.invert(commitProgress);
  document.getElementById('commit-time').textContent = commitMaxTime.toLocaleString('en', {
    dateStyle: 'long', timeStyle: 'short'
  });
  filteredCommits = commits.filter((d) => d.datetime <= commitMaxTime);
  updateScatterPlot(data, filteredCommits);
  updateFileDisplay(filteredCommits);
}

function updateFileDisplay(filteredCommits) {
  const colors = d3.scaleOrdinal(d3.schemeTableau10);
  const lines = filteredCommits.flatMap(d => d.lines);
  const files = d3.groups(lines, d => d.file)
    .map(([name, lines]) => ({ name, lines }))
    .sort((a, b) => b.lines.length - a.lines.length);

  const filesContainer = d3.select('#files')
    .selectAll('div')
    .data(files, d => d.name)
    .join(
      enter => enter.append('div').call(div => {
        div.append('dt').append('code');
        div.append('dd');
      })
    );

  filesContainer.select('dt > code').html(d => `${d.name}<br><small>${d.lines.length} lines</small>`);

  filesContainer.select('dd')
    .selectAll('div')
    .data(d => d.lines)
    .join('div')
    .attr('class', 'loc')
    .style('background-color', d => colors(d.type));
}

function renderTooltipContent(commit) {
  document.getElementById('commit-link').href = commit.url;
  document.getElementById('commit-link').textContent = commit.id;
  document.getElementById('commit-date').textContent = commit.datetime?.toLocaleString('en', { dateStyle: 'full' });
  document.getElementById('commit-lines').textContent = commit.totalLines;
  document.getElementById('commit-author').textContent = commit.author;
  document.getElementById('commit-time').textContent = commit.time;
}

function updateTooltipVisibility(isVisible) {
  document.getElementById('commit-tooltip').hidden = !isVisible;
}

function updateTooltipPosition(event) {
  const tooltip = document.getElementById('commit-tooltip');
  tooltip.style.left = `${event.clientX}px`;
  tooltip.style.top = `${event.clientY}px`;
}

import scrollama from 'https://cdn.jsdelivr.net/npm/scrollama@3.2.0/+esm';

// Commit narrative text
d3.select('#scatter-story')
  .selectAll('.step')
  .data(commits)
  .join('div')
  .attr('class', 'step')
  .html((d, i) => `
    <p>On ${d.datetime.toLocaleString('en', {
      dateStyle: 'full',
      timeStyle: 'short',
    })}, I made <a href="${d.url}" target="_blank">
    ${i > 0 ? 'another glorious commit' : 'my first commit, and it was glorious'}</a>.
    I edited ${d.totalLines} lines across ${
      d3.rollups(d.lines, D => D.length, d => d.file).length
    } files. Then I looked over all I had made, and I saw that it was very good.</p>
  `);

// Setup Scrollama
function onStepEnter(response) {
  const commit = response.element.__data__;
  filteredCommits = commits.filter(d => d.datetime <= commit.datetime);
  updateScatterPlot(data, filteredCommits);
  updateFileDisplay(filteredCommits);
}

const scroller = scrollama();
scroller
  .setup({
    container: '#scrolly-1',
    step: '#scatter-story .step',
    offset: 0.5,
  })
  .onStepEnter(onStepEnter);
