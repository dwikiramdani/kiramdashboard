const fs = require('fs');
const path = require('path');
const db = require('./database');

const dbPath = path.join(__dirname, 'db.json');

function setup() {
  const password = 'g4nt3ng$b4ng3t';
  const hashedPassword = db.hashPassword(password);
  const apiKey = db.generateApiKey();
  
  const defaultDb = {
    profiles: [
      {
        id: '1',
        username: 'dwikiramdaniganteng',
        password: hashedPassword,
        apiKey: apiKey,
        profilePicture: '/uploads/default-avatar.png',
        headline: 'Full Stack Developer',
        summary: 'Passionate developer with experience in building web applications.',
        techstack: ['JavaScript', 'React', 'Node.js', 'GraphQL']
      }
    ],
    experiences: [],
    projects: []
  };
  
  fs.writeFileSync(dbPath, JSON.stringify(defaultDb, null, 2));
  
  console.log('==============================================');
  console.log('Database initialized successfully!');
  console.log('==============================================');
  console.log('LOGIN CREDENTIALS:');
  console.log('Username: dwikiramdaniganteng');
  console.log('Password: g4nt3ng$b4ng3t');
  console.log('==============================================');
  console.log('SECURITY SETTINGS:');
  console.log('Password Hash: PBKDF2 with SHA512, 100000 iterations, 16 byte salt');
  console.log('API Key:', apiKey);
  console.log('==============================================');
  console.log('API USAGE:');
  console.log('Authorization: Bearer <JWT_TOKEN>');
  console.log('X-Api-Key: <API_KEY>');
  console.log('==============================================');
}

setup();
