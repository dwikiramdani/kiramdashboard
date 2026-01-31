const jwt = require('jsonwebtoken');
const db = require('./database');

const JWT_SECRET = 'kiram-dashboard-jwt-secret-key-2024-secure';
const JWT_EXPIRY = '7d';

const resolvers = {
  login: async ({ username, password }) => {
    const user = db.getUserByUsername(username);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    const validPassword = db.verifyPassword(password, user.password);
    if (!validPassword) {
      throw new Error('Invalid credentials');
    }
    
    const token = jwt.sign(
      { id: user.id, username: user.username, role: 'admin' },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );
    
    return { 
      token, 
      user: { id: user.id, username: user.username, role: 'admin' } 
    };
  },
  
  profile: () => db.getProfile(),
  
  experiences: () => db.getExperiences(),
  
  projects: () => db.getProjects(),
  
  me: ({ user }) => user,
  
  regenerateApiKey: ({ user }) => {
    if (!user) throw new Error('Not authenticated');
    
    const newApiKey = db.generateApiKey();
    db.updateApiKey(newApiKey);
    
    return { 
      apiKey: newApiKey,
      message: 'API key regenerated successfully'
    };
  },
  
  updateProfile: ({ profilePicture, headline, summary, techstack }, { user }) => {
    if (!user) throw new Error('Not authenticated');
    
    const currentProfile = db.getProfile();
    const updatedProfile = db.updateProfile({
      ...currentProfile,
      profilePicture: profilePicture || currentProfile.profilePicture,
      headline: headline || currentProfile.headline,
      summary: summary || currentProfile.summary,
      techstack: techstack || currentProfile.techstack
    });
    
    return updatedProfile;
  },
  
  addExperience: (args, { user }) => {
    if (!user) throw new Error('Not authenticated');
    return db.addExperience(args);
  },
  
  updateExperience: ({ id, ...data }, { user }) => {
    if (!user) throw new Error('Not authenticated');
    return db.updateExperience(id, data);
  },
  
  deleteExperience: ({ id }, { user }) => {
    if (!user) throw new Error('Not authenticated');
    db.deleteExperience(id);
    return true;
  },
  
  addProject: (args, { user }) => {
    if (!user) throw new Error('Not authenticated');
    return db.addProject(args);
  },
  
  updateProject: ({ id, ...data }, { user }) => {
    if (!user) throw new Error('Not authenticated');
    return db.updateProject(id, data);
  },
  
  deleteProject: ({ id }, { user }) => {
    if (!user) throw new Error('Not authenticated');
    db.deleteProject(id);
    return true;
  }
};

module.exports = resolvers;
