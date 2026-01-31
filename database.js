const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const { v4: uuidv4 } = require('uuid');

const adapter = new FileSync('db.json');
const db = lowdb(adapter);

db.defaults({
  profiles: [
    {
      id: '1',
      username: 'dwikiramdaniganteng',
      password: '$2a$10$rQZ3fK4g7k8k7k8k7k8k7uLxXsXsXsXsXsXsXsXsXsXsXsXsXsXsX',
      profilePicture: '/uploads/default-avatar.png',
      headline: 'Full Stack Developer',
      summary: 'Passionate developer with experience in building web applications.',
      techstack: ['JavaScript', 'React', 'Node.js', 'GraphQL']
    }
  ],
  experiences: [],
  projects: []
}).write();

module.exports = {
  getProfile: () => db.get('profiles').first() || db.get('profiles')[0],
  getUserByUsername: (username) => db.get('profiles').find({ username }).value(),
  updateProfile: (data) => {
    const currentProfile = db.get('profiles').first();
    const updatedProfile = { ...currentProfile, ...data };
    db.get('profiles').first().assign(updatedProfile).write();
    return updatedProfile;
  },
  getExperiences: () => db.get('experiences').value(),
  addExperience: (experience) => {
    const newExperience = { id: uuidv4(), ...experience };
    db.get('experiences').push(newExperience).write();
    return newExperience;
  },
  updateExperience: (id, data) => {
    db.get('experiences').find({ id }).assign(data).write();
    return db.get('experiences').find({ id }).value();
  },
  deleteExperience: (id) => {
    db.get('experiences').remove({ id }).write();
  },
  getProjects: () => db.get('projects').value(),
  addProject: (project) => {
    const newProject = { id: uuidv4(), ...project };
    db.get('projects').push(newProject).write();
    return newProject;
  },
  updateProject: (id, data) => {
    db.get('projects').find({ id }).assign(data).write();
    return db.get('projects').find({ id }).value();
  },
  deleteProject: (id) => {
    db.get('projects').remove({ id }).write();
  }
};
