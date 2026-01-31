const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const schema = require('./schema');
const resolvers = require('./resolvers');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = 'kiram-dashboard-secret-key-2024';

const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const authenticateToken = (req) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return null;
  
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
};

app.use('/graphql', graphqlHTTP((req) => ({
  schema: schema,
  rootValue: resolvers,
  graphiql: true,
  context: {
    user: authenticateToken(req)
  }
})));

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  
  const user = db.getUser(username);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
});

app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});

// ==================== PROFILE API ====================

app.get('/api/profile', (req, res) => {
  try {
    const profile = db.getProfile();
    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/profile', (req, res) => {
  const user = authenticateToken(req);
  if (!user) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  try {
    const { profilePicture, headline, summary, techstack } = req.body;
    const currentProfile = db.getProfile();
    
    const updatedProfile = db.updateProfile({
      ...currentProfile,
      profilePicture: profilePicture || currentProfile.profilePicture,
      headline: headline || currentProfile.headline,
      summary: summary || currentProfile.summary,
      techstack: techstack || currentProfile.techstack
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedProfile
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== EXPERIENCES API ====================

app.get('/api/experiences', (req, res) => {
  try {
    const experiences = db.getExperiences();
    res.json({
      success: true,
      data: experiences,
      total: experiences.length
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/experiences/:id', (req, res) => {
  try {
    const experiences = db.getExperiences();
    const experience = experiences.find(e => e.id === req.params.id);
    
    if (!experience) {
      return res.status(404).json({ success: false, error: 'Experience not found' });
    }

    res.json({ success: true, data: experience });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/experiences', (req, res) => {
  const user = authenticateToken(req);
  if (!user) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  try {
    const { title, company, startDate, endDate, description, current } = req.body;

    if (!title || !company || !startDate) {
      return res.status(400).json({ 
        success: false, 
        error: 'Title, company, and startDate are required' 
      });
    }

    const newExperience = db.addExperience({
      title,
      company,
      startDate,
      endDate: current ? null : endDate,
      description,
      current: current || false
    });

    res.status(201).json({
      success: true,
      message: 'Experience added successfully',
      data: newExperience
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/experiences/:id', (req, res) => {
  const user = authenticateToken(req);
  if (!user) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  try {
    const { title, company, startDate, endDate, description, current } = req.body;
    const experiences = db.getExperiences();
    const experience = experiences.find(e => e.id === req.params.id);

    if (!experience) {
      return res.status(404).json({ success: false, error: 'Experience not found' });
    }

    const updatedExperience = db.updateExperience(req.params.id, {
      title: title || experience.title,
      company: company || experience.company,
      startDate: startDate || experience.startDate,
      endDate: current ? null : (endDate || experience.endDate),
      description: description || experience.description,
      current: current !== undefined ? current : experience.current
    });

    res.json({
      success: true,
      message: 'Experience updated successfully',
      data: updatedExperience
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/experiences/:id', (req, res) => {
  const user = authenticateToken(req);
  if (!user) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  try {
    const experiences = db.getExperiences();
    const experience = experiences.find(e => e.id === req.params.id);

    if (!experience) {
      return res.status(404).json({ success: false, error: 'Experience not found' });
    }

    db.deleteExperience(req.params.id);

    res.json({
      success: true,
      message: 'Experience deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== PROJECTS API ====================

app.get('/api/projects', (req, res) => {
  try {
    const projects = db.getProjects();
    res.json({
      success: true,
      data: projects,
      total: projects.length
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/projects/:id', (req, res) => {
  try {
    const projects = db.getProjects();
    const project = projects.find(p => p.id === req.params.id);
    
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    res.json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/projects', (req, res) => {
  const user = authenticateToken(req);
  if (!user) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  try {
    const { title, description, image, technologies, link, github } = req.body;

    if (!title || !description) {
      return res.status(400).json({ 
        success: false, 
        error: 'Title and description are required' 
      });
    }

    const newProject = db.addProject({
      title,
      description,
      image: image || '/uploads/default-project.png',
      technologies: technologies || [],
      link: link || '',
      github: github || ''
    });

    res.status(201).json({
      success: true,
      message: 'Project added successfully',
      data: newProject
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/projects/:id', (req, res) => {
  const user = authenticateToken(req);
  if (!user) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  try {
    const { title, description, image, technologies, link, github } = req.body;
    const projects = db.getProjects();
    const project = projects.find(p => p.id === req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    const updatedProject = db.updateProject(req.params.id, {
      title: title || project.title,
      description: description || project.description,
      image: image || project.image,
      technologies: technologies || project.technologies,
      link: link !== undefined ? link : project.link,
      github: github !== undefined ? github : project.github
    });

    res.json({
      success: true,
      message: 'Project updated successfully',
      data: updatedProject
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/projects/:id', (req, res) => {
  const user = authenticateToken(req);
  if (!user) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  try {
    const projects = db.getProjects();
    const project = projects.find(p => p.id === req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    db.deleteProject(req.params.id);

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`GraphQL Playground: http://localhost:${PORT}/graphql`);
});
