const Lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const { v4: uuidv4 } = require('uuid');

const adapter = new FileSync('db.json');
const db = new Lowdb(adapter);

module.exports = {
  getUser: (username) => db.get('users').find({ username }).value(),
  getProfile: () => db.get('profile').value(),
  updateProfile: (data) => {
    db.get('profile').assign(data).write();
    return db.get('profile').value();
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
