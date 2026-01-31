const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'db.json');

async function setup() {
  const password = 'g4nt3ng$b4ng3t';
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const defaultDb = {
    users: [{
      id: '1',
      username: 'dwikiramdaniganteng',
      password: hashedPassword,
      role: 'admin'
    }],
    profile: {
      id: '1',
      profilePicture: '/uploads/default-avatar.png',
      headline: 'Full Stack Developer',
      summary: 'Passionate developer with experience in building web applications.',
      techstack: ['JavaScript', 'React', 'Node.js', 'GraphQL']
    },
    experiences: [],
    projects: []
  };
  
  fs.writeFileSync(dbPath, JSON.stringify(defaultDb, null, 2));
  console.log('Database initialized with default user.');
  console.log('Username: dwikiramdaniganteng');
  console.log('Password: g4nt3ng$b4ng3t');
}

setup().catch(console.error);
