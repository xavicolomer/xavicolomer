'use strict';

const express = require('express');
const app = express();
const isDev = process.env.NODE_ENV === 'development';

const expressNunjucks = require('express-nunjucks');
const path = require('path');
const nunjucks = require('nunjucks');
const db = require(path.join(__dirname, './src/website.json'));
const dateFormat = require('dateformat');
const templatesPath = path.join(__dirname, 'src/templates');

const NONE = 0;
const ONE = 1;
const MILLISECONDS = 1000;
const PORT = 8080;

const cached = {};
cached.featured = [];
cached.projects = [];
cached.networks = [];

const common = {
  isDev: isDev,
  scriptsFile: 'js/app.min.js',
  stylesFile: 'css/app.min.css',
  footer: 'Xavi Colomer @ ' + (new Date()).getFullYear() + ' - All Rights Reserved'
};

if (isDev) {
  common.STATIC_URL = '/static';
  common.DEMO_URL = 'https://static.xavicolomer.com/demos/';
} else {
  common.STATIC_URL = 'https://static.xavicolomer.com';
  common.DEMO_URL = 'https://static.xavicolomer.com/demos/';
}

app.use('/static', express.static(path.join(__dirname, 'static')));
app.set('views', templatesPath);

expressNunjucks(app, {
  watch: isDev,
  noCache: isDev
});

function skillsByCategory(skills) {
  const result = {};
  let currentCategory = '';

  for (let i = 0, len = skills.length; i < len; ++i) {
    if (currentCategory !== skills[i].skillCategory) {
      currentCategory = skills[i].skillCategory;
    }

    if (typeof result[currentCategory] === 'undefined') {
      result[currentCategory] = [];
    }

    result[currentCategory].push(skills[i].key);
  }

  return result;
}

function skillsById(skills) {
  const result = {};

  for (let i = 0, len = skills.length; i < len; ++i) {
    result[skills[i].key] = skills[i];
  }

  return result;
}

function relatedProjects(project) {
  const results = [];
  if (!project.relatedTo || project.relatedTo === '') {
    return null;
  }

  const related = project.relatedTo.split(',');

  for (let i = 0, len = related.length; i < len; ++i) {
    results.push(cached.projectsById[related[i]]);
  }

  return results;
}

const getAllFeaturedProjects = () => {
  if (cached.featured.length === NONE) {
    const featured = [];
    for (let i = 0, len = db.projects.length; i < len; ++i) {
      if (db.projects[i].isFeatured === ONE) {
        featured.push(db.projects[i]);
      }

      cached.featured = featured;
    }
  }
};

const getProjectById = (projectId) => {
  if (!cached.projectsById) {
    const projects = {};
    for (let i = 0, len = db.projects.length; i < len; ++i) {
      projects[db.projects[i].id] = db.projects[i];
    }
    cached.projectsById = projects;
  }

  return cached.projectsById[projectId];
};

const getProjectMedia = (projectId) => {
  if (!cached.projectsById[projectId].media) {
    const media = [];
    for (let i = 0, len = db.media.length; i < len; ++i) {
      if (projectId === db.media[i].project) {
        media.push(db.media[i]);
      }
    }

    cached.projectsById[projectId].gallery = media;
  }
  return cached.projectsById[projectId].gallery;
};

app.get('/projects/:project/:slug', (req, res) => {
  const project = getProjectById(req.params.project);
  const created = new Date(project.created * MILLISECONDS);
  getProjectMedia(req.params.project);

  nunjucks.configure(templatesPath);
  const template = '{% import \'macros/media-item.html\' as media %} \n' + project.content;
  project.content = nunjucks.renderString(template, Object.assign({}, common, {
    project: project
  }));

  try {
    res.render('layouts/project', Object.assign({}, common, {
      created: dateFormat(created, 'mmmm dS, yyyy'),
      project: project,
      projectSkills: project.skills.split(','),
      skills: skillsById(db.skills),
      relatedProjects: relatedProjects(project)
    }));
  } catch (err) {
    res.render('layouts/404', common);
  }
});

app.get('/', (req, res) => {
  getAllFeaturedProjects();
  res.render('layouts/home', Object.assign({}, common, {
    featured: cached.featured,
    skills: skillsById(db.skills),
    skillsByCategory: skillsByCategory(db.skills),
    networks: db.social_networks
  }));
});

app.get('/*', (req, res) => {
  res.render('layouts/404', common);
});

if (isDev) {
  app.listen(PORT);
}

module.exports = app;
