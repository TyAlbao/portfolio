console.log("IT'S ALIVE!");

function $$(selector, context = document) {
    return Array.from(context.querySelectorAll(selector));
}

// const navLinks = $$("nav a");

// let currentLink = navLinks.find(
//     (a) => a.host === location.host && a.pathname === location.pathname,
//   );

// currentLink?.classList.add('current');

let pages = [
    {url: '', title: 'Home'},
    {url: 'projects/', title: 'Projects'},
    {url: 'lib/resume.pdf', title: 'Resume'},
    {url: 'https://github.com/TyAlbao', title: 'Github'},
    {url: 'http://www.linkedin.com/in/ty-albao', title: 'LinkedIn'}
    // {url: 'contact/', title: 'Contact'},
    // {url: 'meta/', title: 'Meta'}
]

let nav = document.createElement('nav');
document.body.prepend(nav)
    
    const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
    ? "/"                  // Local server
    : "/portfolio/";         // GitHub Pages repo name

for (let p of pages) {
    let url = p.url;
    let title = p.title;

    if (!url.startsWith('http')) {
    url = BASE_PATH + url;
    }
    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;
    nav.append(a);

    a.classList.toggle(
        'current',
        a.host === location.host && a.pathname === location.pathname,
    );
    
    if (a.host !== location.host || a.pathname.endsWith('.pdf')) {
        a.target = "_blank";
        a.rel = "noopener noreferrer";
      }
}

document.body.insertAdjacentHTML(
    'afterbegin',
    `
    <label class="color-scheme">
      Theme:
      <select>
        <option value="light dark">Automatic</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </label>
    `
  );

let select = document.querySelector('.color-scheme select');


select.addEventListener('input', function (event) {
    console.log('color scheme changed to', event.target.value);
    document.documentElement.style.setProperty('color-scheme', event.target.value);
    localStorage.colorScheme = event.target.value
});

if ("colorScheme" in localStorage) {
    document.documentElement.style.setProperty('color-scheme', localStorage.colorScheme);
    select.value = localStorage.colorScheme;
}

export async function fetchJSON(url) {
    try {
      // Fetch the JSON file from the given URL
      const response = await fetch(url);
      console.log(response)
      if (!response.ok) {
        throw new Error(`Failed to fetch projects: ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching or parsing JSON data:', error);
    }
  }

export function renderProjects(projects, containerElement, headingLevel = 'h2') {
    if (!containerElement) {
      console.error('Error: containerElement is null or undefined.');
      return;
    }
  
    // Validate headingLevel
    const validHeadings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    if (!validHeadings.includes(headingLevel)) {
      console.warn(`Invalid heading level "${headingLevel}" passed. Defaulting to "h2".`);
      headingLevel = 'h2';
    }
  
    containerElement.innerHTML = '';
  
    projects.forEach(project => {
      const article = document.createElement('article');

      const titleHTML = project.github
        ? `<a href="${project.github}" target="_blank" rel="noopener noreferrer">${project.title}</a>`
        : `${project.title}`;

      const demoHTML = project.demo
        ? `<a class="demo-link" href="${project.demo}" target="_blank" rel="noopener noreferrer">Live demo</a>`
        : '';

      const websiteHTML = project.website
        ? `<a class="website-link" href="${project.website}" target="_blank" rel="noopener noreferrer">Website</a>`
        : '';

      let imageSrc = project.image;
      if (imageSrc && !/^https?:\/\//.test(imageSrc)) {
        if (imageSrc.startsWith('../images/')) {
          imageSrc = BASE_PATH + 'images/' + imageSrc.slice('../images/'.length);
        } else if (imageSrc.startsWith('images/')) {
          imageSrc = BASE_PATH + imageSrc;
        } else if (imageSrc.startsWith('./images/')) {
          imageSrc = BASE_PATH + imageSrc.slice(2);
        }
      }

      article.innerHTML = `
        <${headingLevel}>${titleHTML}</${headingLevel}>
        <img src="${imageSrc}" alt="${project.title}">
        <div class="project-links">${[websiteHTML, demoHTML].filter(Boolean).join(' • ')}</div>
        <p>${project.description}</p>
        <div class = "project-year">${project.year}</div>
      `;

      containerElement.appendChild(article);
    });
  }

// export async function fetchGithubData(username) {
//   return fetchJSON(`https://api.github.com/users/${username}`)
// }
  