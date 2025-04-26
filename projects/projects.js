import { fetchJSON, renderProjects } from "../global.js";

const projects = await fetchJSON('../lib/projects.json');
const projectContainer = document.querySelector('.projects');

renderProjects(projects, projectContainer, 'h2');

const countElement = document.getElementById('project-count');
countElement.textContent = `${projects.length} Projects`;