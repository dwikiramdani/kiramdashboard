const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

const adapter = new FileSync('db.json');
const db = lowdb(adapter);

const SALT_ROUNDS = 12;

function generateApiKey() {
  return 'kir_' + crypto.randomBytes(32).toString('hex');
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedPassword) {
  const [salt, hash] = storedPassword.split(':');
  const verifyHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return hash === verifyHash;
}

db.defaults({
  profiles: [
    {
      id: '1',
      username: 'dwikiramdaniganteng',
      password: '', // Will be set by setup.js
      apiKey: '', // Will be set by setup.js
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
  generateApiKey,
  hashPassword,
  verifyPassword,
  SALT_ROUNDS,
  getProfile: () => db.get('profiles').first() || db.get('profiles')[0],
  getUserByUsername: (username) => db.get('profiles').find({ username }).value(),
  getUserByApiKey: (apiKey) => db.get('profiles').find({ apiKey }).value(),
  updateProfile: (data) => {
    const currentProfile = db.get('profiles').first();
    const updatedProfile = { ...currentProfile, ...data };
    db.get('profiles').first().assign(updatedProfile).write();
    return updatedProfile;
  },
  updateApiKey: (apiKey) => {
    db.get('profiles').first().assign({ apiKey }).write();
    return apiKey;
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
