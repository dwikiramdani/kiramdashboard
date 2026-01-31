# Portfolio Dashboard

A full-stack portfolio admin dashboard with GraphQL API and JWT authentication.

## Features

- Profile management (profile picture, headline, summary, tech stack)
- Work experiences management
- Project portfolio management
- JWT authentication
- GraphQL API

## Login Credentials

- **Username:** dwikiramdaniganteng
- **Password:** g4nt3ng$b4ng3t

## Installation

```bash
npm install
node setup.js
npm start
```

## Running the Server

```bash
npm start
```

The server will run on `http://localhost:3000`

## GraphQL Playground

Access the GraphQL playground at `http://localhost:3000/graphql`

## Deployment

### Option 1: Render.com (Free)

1. Push your code to GitHub
2. Create a new web service on Render
3. Connect your GitHub repository
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Add environment variables if needed

### Option 2: Railway.app

1. Push your code to GitHub
2. Create a new project on Railway
3. Connect your GitHub repository
4. Deploy automatically

### Option 3: VPS (DigitalOcean, Linode, etc.)

1. Clone the repository
2. Install Node.js
3. Run `npm install`
4. Run `node setup.js`
5. Use PM2 for process management:
   ```bash
   npm install -g pm2
   pm2 start server.js
   pm2 startup
   pm2 save
   ```

### Option 4: Heroku (Deprecated - use alternatives)

Heroku discontinued free tier. Use Render or Railway instead.

## Project Structure

```
kiramdashboard/
├── server.js          # Main server file
├── schema.js          # GraphQL schema
├── resolvers.js       # GraphQL resolvers
├── database.js        # Database operations
├── setup.js           # Database initialization
├── package.json       # Dependencies
├── db.json            # Database file (created by setup)
├── public/
│   ├── index.html     # Dashboard UI
│   ├── styles.css     # Styles
│   ├── app.js         # Frontend JavaScript
│   └── uploads/       # Uploaded files
└── README.md
```

## API Endpoints

- `POST /api/login` - User login
- `POST /api/upload` - File upload
- `GET /graphql` - GraphQL endpoint
- `POST /graphql` - GraphQL endpoint

## Tech Stack

- Node.js
- Express
- GraphQL
- JWT Authentication
- LowDB (JSON database)
- Multer (file uploads)
