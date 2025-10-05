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
    
    const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1" || location.hostname === "tyism.com")
    ? "/"                  // Local server or custom domain
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

      // Normalize local website/demo URLs to BASE_PATH so they work on all pages
      let websiteHref = project.website;
      if (websiteHref && !/^https?:\/\//.test(websiteHref)) {
        if (websiteHref.startsWith('../')) websiteHref = BASE_PATH + websiteHref.slice(3);
        else if (websiteHref.startsWith('./')) websiteHref = BASE_PATH + websiteHref.slice(2);
        else websiteHref = BASE_PATH + websiteHref;
      }

      let demoHref = project.demo;
      if (demoHref && !/^https?:\/\//.test(demoHref)) {
        if (demoHref.startsWith('../')) demoHref = BASE_PATH + demoHref.slice(3);
        else if (demoHref.startsWith('./')) demoHref = BASE_PATH + demoHref.slice(2);
        else demoHref = BASE_PATH + demoHref;
      }

      const demoHTML = demoHref
        ? `<a class="demo-link" href="${demoHref}" target="_blank" rel="noopener noreferrer">Demo ⏯️</a>`
        : '';

      const websiteHTML = websiteHref
        ? `<a class="website-link" href="${websiteHref}" target="_blank" rel="noopener noreferrer">Writeup 📝</a>`
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
  