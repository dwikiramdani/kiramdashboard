const API_URL = '/graphql';

let authToken = localStorage.getItem('authToken');
let currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

document.addEventListener('DOMContentLoaded', () => {
  if (authToken && currentUser) {
    showDashboard();
  } else {
    showLogin();
  }
  setupEventListeners();
});

function setupEventListeners() {
  document.getElementById('login-form').addEventListener('submit', handleLogin);
  document.getElementById('logout-btn').addEventListener('click', handleLogout);
  document.getElementById('profile-form').addEventListener('submit', handleProfileUpdate);
  document.getElementById('experience-form').addEventListener('submit', handleAddExperience);
  document.getElementById('project-form').addEventListener('submit', handleAddProject);
  
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const section = item.dataset.section;
      if (section === 'logout') {
        handleLogout();
      } else {
        navigateToSection(section);
      }
    });
  });

  document.getElementById('profile-picture').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        const data = await response.json();
        if (data.url) {
          document.getElementById('profile-preview').src = data.url;
        }
      } catch (error) {
        console.error('Upload error:', error);
      }
    }
  });

  document.getElementById('proj-image').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        const data = await response.json();
        if (data.url) {
          document.getElementById('project-preview').src = data.url;
        }
      } catch (error) {
        console.error('Upload error:', error);
      }
    }
  });
}

async function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const errorEl = document.getElementById('login-error');
  
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      authToken = data.token;
      currentUser = data.user;
      localStorage.setItem('authToken', authToken);
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      showDashboard();
    } else {
      errorEl.textContent = data.error || 'Login failed';
    }
  } catch (error) {
    errorEl.textContent = 'An error occurred. Please try again.';
  }
}

function handleLogout() {
  authToken = null;
  currentUser = null;
  localStorage.removeItem('authToken');
  localStorage.removeItem('currentUser');
  showLogin();
}

async function handleProfileUpdate(e) {
  e.preventDefault();
  
  const profilePicture = document.getElementById('profile-preview').src;
  const headline = document.getElementById('headline').value;
  const summary = document.getElementById('summary').value;
  const techstack = document.getElementById('techstack').value.split(',').map(t => t.trim()).filter(t => t);
  
  const query = `
    mutation UpdateProfile($profilePicture: String, $headline: String, $summary: String, $techstack: [String!]) {
      updateProfile(profilePicture: $profilePicture, headline: $headline, summary: $summary, techstack: $techstack) {
        id
        profilePicture
        headline
        summary
        techstack
      }
    }
  `;
  
  try {
    const result = await graphqlRequest(query, {
      profilePicture,
      headline,
      summary,
      techstack
    });
    alert('Profile updated successfully!');
  } catch (error) {
    alert('Error updating profile: ' + error.message);
  }
}

async function handleAddExperience(e) {
  e.preventDefault();
  
  const title = document.getElementById('exp-title').value;
  const company = document.getElementById('exp-company').value;
  const startDate = document.getElementById('exp-start').value;
  const endDate = document.getElementById('exp-end').value;
  const current = document.getElementById('exp-current').checked;
  const description = document.getElementById('exp-description').value;
  
  const query = `
    mutation AddExperience($title: String!, $company: String!, $startDate: String!, $endDate: String, $description: String, $current: Boolean) {
      addExperience(title: $title, company: $company, startDate: $startDate, endDate: $endDate, description: $description, current: $current) {
        id
        title
        company
        startDate
        endDate
        description
        current
      }
    }
  `;
  
  try {
    await graphqlRequest(query, {
      title,
      company,
      startDate,
      endDate: current ? null : endDate,
      description,
      current
    });
    e.target.reset();
    loadExperiences();
    alert('Experience added successfully!');
  } catch (error) {
    alert('Error adding experience: ' + error.message);
  }
}

async function handleAddProject(e) {
  e.preventDefault();
  
  const title = document.getElementById('proj-title').value;
  const description = document.getElementById('proj-description').value;
  const image = document.getElementById('project-preview').src;
  const technologies = document.getElementById('proj-technologies').value.split(',').map(t => t.trim()).filter(t => t);
  const link = document.getElementById('proj-link').value;
  const github = document.getElementById('proj-github').value;
  
  const query = `
    mutation AddProject($title: String!, $description: String!, $image: String, $technologies: [String!]!, $link: String, $github: String) {
      addProject(title: $title, description: $description, image: $image, technologies: $technologies, link: $link, github: $github) {
        id
        title
        description
        image
        technologies
        link
        github
      }
    }
  `;
  
  try {
    await graphqlRequest(query, {
      title,
      description,
      image,
      technologies,
      link,
      github
    });
    e.target.reset();
    document.getElementById('project-preview').src = '/uploads/default-project.png';
    loadProjects();
    alert('Project added successfully!');
  } catch (error) {
    alert('Error adding project: ' + error.message);
  }
}

async function graphqlRequest(query, variables = {}) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify({ query, variables })
  });
  
  const result = await response.json();
  
  if (result.errors) {
    throw new Error(result.errors[0].message);
  }
  
  return result.data;
}

function showLogin() {
  document.getElementById('login-screen').classList.remove('hidden');
  document.getElementById('dashboard-screen').classList.add('hidden');
}

function showDashboard() {
  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('dashboard-screen').classList.remove('hidden');
  loadProfile();
  loadExperiences();
  loadProjects();
}

function navigateToSection(section) {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  document.querySelector(`[data-section="${section}"]`).classList.add('active');
  
  document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
  document.getElementById(`${section}-section`).classList.remove('hidden');
  
  const titles = {
    profile: 'Profile Management',
    experiences: 'Work Experiences',
    projects: 'Projects'
  };
  document.getElementById('page-title').textContent = titles[section];
}

async function loadProfile() {
  const query = `
    query GetProfile {
      profile {
        id
        profilePicture
        headline
        summary
        techstack
      }
    }
  `;
  
  try {
    const data = await graphqlRequest(query);
    const profile = data.profile;
    
    document.getElementById('profile-preview').src = profile.profilePicture || '/uploads/default-avatar.png';
    document.getElementById('headline').value = profile.headline || '';
    document.getElementById('summary').value = profile.summary || '';
    document.getElementById('techstack').value = (profile.techstack || []).join(', ');
  } catch (error) {
    console.error('Error loading profile:', error);
  }
}

async function loadExperiences() {
  const query = `
    query GetExperiences {
      experiences {
        id
        title
        company
        startDate
        endDate
        description
        current
      }
    }
  `;
  
  try {
    const data = await graphqlRequest(query);
    const experiences = data.experiences;
    
    const container = document.getElementById('experiences-list');
    container.innerHTML = experiences.map(exp => `
      <div class="list-item" data-id="${exp.id}">
        <div class="list-item-content">
          <h4>${exp.title}</h4>
          <p>${exp.company}</p>
          <p class="date">${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate)}</p>
          ${exp.description ? `<p>${exp.description}</p>` : ''}
        </div>
        <div class="list-item-actions">
          <button class="btn btn-danger btn-sm" onclick="deleteExperience('${exp.id}')">Delete</button>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading experiences:', error);
  }
}

async function loadProjects() {
  const query = `
    query GetProjects {
      projects {
        id
        title
        description
        image
        technologies
        link
        github
      }
    }
  `;
  
  try {
    const data = await graphqlRequest(query);
    const projects = data.projects;
    
    const container = document.getElementById('projects-list');
    container.innerHTML = projects.map(proj => `
      <div class="project-card" data-id="${proj.id}">
        <img src="${proj.image || '/uploads/default-project.png'}" alt="${proj.title}">
        <div class="project-card-content">
          <h4>${proj.title}</h4>
          <p>${proj.description}</p>
          <div class="tech-tags">
            ${(proj.technologies || []).map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
          </div>
          <div class="project-links">
            ${proj.link ? `<a href="${proj.link}" target="_blank">Live Demo</a>` : ''}
            ${proj.github ? `<a href="${proj.github}" target="_blank">GitHub</a>` : ''}
          </div>
        </div>
        <div class="list-item-actions">
          <button class="btn btn-danger btn-sm" onclick="deleteProject('${proj.id}')">Delete</button>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading projects:', error);
  }
}

async function deleteExperience(id) {
  if (!confirm('Are you sure you want to delete this experience?')) return;
  
  const query = `
    mutation DeleteExperience($id: ID!) {
      deleteExperience(id: $id)
    }
  `;
  
  try {
    await graphqlRequest(query, { id });
    loadExperiences();
  } catch (error) {
    alert('Error deleting experience: ' + error.message);
  }
}

async function deleteProject(id) {
  if (!confirm('Are you sure you want to delete this project?')) return;
  
  const query = `
    mutation DeleteProject($id: ID!) {
      deleteProject(id: $id)
    }
  `;
  
  try {
    await graphqlRequest(query, { id });
    loadProjects();
  } catch (error) {
    alert('Error deleting project: ' + error.message);
  }
}

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

window.deleteExperience = deleteExperience;
window.deleteProject = deleteProject;
