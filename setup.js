const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'db.json');

async function setup() {
  const password = 'g4nt3ng$b4ng3t';
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const defaultDb = {
    profiles: [
      {
        id: '1',
        username: 'dwikiramdaniganteng',
        password: hashedPassword,
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
  console.log('Database initialized successfully!');
  console.log('=================================');
  console.log('LOGIN CREDENTIALS:');
  console.log('Username: dwikiramdaniganteng');
  console.log('Password: g4nt3ng$b4ng3t');
  console.log('=================================');
}

setup().catch(console.error);
