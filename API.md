# REST API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication Methods

### 1. JWT Token (Recommended for frontend)
```
Authorization: Bearer <JWT_TOKEN>
```

### 2. API Key (For external services)
```
X-Api-Key: <API_KEY>
```

---

## 1. AUTH API

### Login
```
POST /login
```

**Request Body:**
```json
{
  "username": "dwikiramdaniganteng",
  "password": "g4nt3ng$b4ng3t"
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "1",
    "username": "dwikiramdaniganteng",
    "role": "admin"
  },
  "apiKey": "kir_abc123..."
}
```

### Regenerate API Key
```
POST /regenerate-api-key
```
**Authentication Required:** Bearer Token or API Key

**Response (200):**
```json
{
  "success": true,
  "apiKey": "kir_newkey456...",
  "message": "API key regenerated successfully..."
}
```

---

## 2. PROFILE API

### Get Profile
```
GET /profile
```
**Authentication Required:** None (public data only)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "username": "dwikiramdaniganteng",
    "profilePicture": "/uploads/default-avatar.png",
    "headline": "Full Stack Developer",
    "summary": "Passionate developer...",
    "techstack": ["JavaScript", "React", "Node.js"]
  }
}
```

### Update Profile
```
PUT /profile
```
**Authentication Required:** Yes

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```
or
```
X-Api-Key: <API_KEY>
```

**Request Body:**
```json
{
  "profilePicture": "/uploads/new-avatar.png",
  "headline": "Senior Developer",
  "summary": "Updated summary",
  "techstack": ["React", "Node.js", "TypeScript"]
}
```

---

## 3. WORK EXPERIENCES API

### Get All Experiences
```
GET /experiences
```
**Authentication Required:** No

**Response (200):**
```json
{
  "success": true,
  "data": [...],
  "total": 2
}
```

### Get Single Experience
```
GET /experiences/:id
```

### Create Experience
```
POST /experiences
```
**Authentication Required:** Yes

**Request Body:**
```json
{
  "title": "Software Engineer",
  "company": "Tech Corp",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "description": "Working on cloud services",
  "current": false
}
```

### Update Experience
```
PUT /experiences/:id
```
**Authentication Required:** Yes

### Delete Experience
```
DELETE /experiences/:id
```
**Authentication Required:** Yes

---

## 4. PROJECTS API

### Get All Projects
```
GET /projects
```
**Authentication Required:** No

### Create Project
```
POST /projects
```
**Authentication Required:** Yes

**Request Body:**
```json
{
  "title": "E-commerce Platform",
  "description": "Full-featured e-commerce solution",
  "image": "/uploads/project.png",
  "technologies": ["React", "Node.js", "MongoDB"],
  "link": "https://myshop.com",
  "github": "https://github.com/user/ecommerce"
}
```

### Update Project
```
PUT /projects/:id
```
**Authentication Required:** Yes

### Delete Project
```
DELETE /projects/:id
```
**Authentication Required:** Yes

---

## 5. UPLOAD API

### Upload File
```
POST /upload
```
**Authentication Required:** Yes

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Content-Type:** multipart/form-data

**Body:** form-data with file field named "file"

**Response (200):**
```json
{
  "success": true,
  "url": "/uploads/filename-123.png"
}
```

---

## 6. HEALTH CHECK

### Server Health
```
GET /health
```

**Response (200):**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-31T12:00:00.000Z"
}
```

---

## SECURITY FEATURES

### Password Hashing
- Algorithm: PBKDF2 with SHA512
- Iterations: 100,000
- Salt: 16 bytes (randomly generated)
- Key length: 64 bytes

### JWT Token
- Algorithm: HS256
- Expiry: 7 days
- Payload: { id, username, role }

### API Key
- Format: `kir_<32-character-hex-string>`
- Secure random generation using crypto.randomBytes(32)
- Can be regenerated via dashboard or API

---

## ERROR RESPONSES

### Unauthorized (401)
```json
{
  "success": false,
  "error": "Unauthorized - Invalid or missing authentication"
}
```

### Forbidden (403)
```json
{
  "success": false,
  "error": "Forbidden"
}
```

### Not Found (404)
```json
{
  "success": false,
  "error": "Resource not found"
}
```

### Bad Request (400)
```json
{
  "success": false,
  "error": "Validation error message"
}
```

### Server Error (500)
```json
{
  "success": false,
  "error": "Internal server error message"
}
```

---

## TESTING WITH CURL

### Login
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"dwikiramdaniganteng","password":"g4nt3ng$b4ng3t"}'
```

### Get Profile (with JWT)
```bash
curl http://localhost:3000/api/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Profile (with API Key)
```bash
curl http://localhost:3000/api/profile \
  -H "X-Api-Key: kir_your_api_key"
```

### Create Experience (with JWT)
```bash
curl -X POST http://localhost:3000/api/experiences \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Developer","company":"ABC","startDate":"2024-01-01"}'
```

### Upload Image (with JWT)
```bash
curl -X POST http://localhost:3000/api/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@image.png"
```

---

## EXAMPLE USAGE IN JAVASCRIPT

```javascript
const API_BASE = 'https://your-domain.com/api';

// Login
const loginResponse = await fetch(`${API_BASE}/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, password })
});
const { token, apiKey } = await loginResponse.json();

// Use API Key for external requests
const profileResponse = await fetch(`${API_BASE}/profile`, {
  headers: { 'X-Api-Key': apiKey }
});
```

---

## CORS ENABLED

All API endpoints support CORS for cross-origin requests.

---

## RATE LIMITING

No rate limiting is implemented by default. Consider adding rate limiting for production use.
