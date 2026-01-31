# REST API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## 1. PROFILE API

### Get Profile
```
GET /profile
```
**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "profilePicture": "/uploads/default-avatar.png",
    "headline": "Full Stack Developer",
    "summary": "Passionate developer with experience in building web applications.",
    "techstack": ["JavaScript", "React", "Node.js", "GraphQL"]
  }
}
```

### Update Profile
```
PUT /profile
```
**Headers:**
- Authorization: Bearer <token>

**Body:**
```json
{
  "profilePicture": "/uploads/new-avatar.png",
  "headline": "Senior Developer",
  "summary": "Updated summary",
  "techstack": ["React", "Node.js", "TypeScript"]
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "1",
    "profilePicture": "/uploads/new-avatar.png",
    "headline": "Senior Developer",
    "summary": "Updated summary",
    "techstack": ["React", "Node.js", "TypeScript"]
  }
}
```

---

## 2. WORK EXPERIENCES API

### Get All Experiences
```
GET /experiences
```
**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-1",
      "title": "Full Stack Developer",
      "company": "Tech Company",
      "startDate": "2023-01-15",
      "endDate": null,
      "description": "Building web applications",
      "current": true
    },
    {
      "id": "uuid-2",
      "title": "Frontend Developer",
      "company": "Startup Inc",
      "startDate": "2021-06-01",
      "endDate": "2022-12-31",
      "description": "Developed responsive UI",
      "current": false
    }
  ],
  "total": 2
}
```

### Get Single Experience
```
GET /experiences/:id
```
**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-1",
    "title": "Full Stack Developer",
    "company": "Tech Company",
    "startDate": "2023-01-15",
    "endDate": null,
    "description": "Building web applications",
    "current": true
  }
}
```

**Response (404):**
```json
{
  "success": false,
  "error": "Experience not found"
}
```

### Create Experience
```
POST /experiences
```
**Headers:**
- Authorization: Bearer <token>

**Body:**
```json
{
  "title": "Software Engineer",
  "company": "Big Tech Corp",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "description": "Working on cloud services",
  "current": false
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Experience added successfully",
  "data": {
    "id": "uuid-new",
    "title": "Software Engineer",
    "company": "Big Tech Corp",
    "startDate": "2024-01-01",
    "endDate": "2024-12-31",
    "description": "Working on cloud services",
    "current": false
  }
}
```

### Update Experience
```
PUT /experiences/:id
```
**Headers:**
- Authorization: Bearer <token>

**Body:**
```json
{
  "title": "Senior Software Engineer",
  "description": "Updated description"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Experience updated successfully",
  "data": {
    "id": "uuid-1",
    "title": "Senior Software Engineer",
    "company": "Big Tech Corp",
    "startDate": "2024-01-01",
    "endDate": "2024-12-31",
    "description": "Updated description",
    "current": false
  }
}
```

### Delete Experience
```
DELETE /experiences/:id
```
**Headers:**
- Authorization: Bearer <token>

**Response (200):**
```json
{
  "success": true,
  "message": "Experience deleted successfully"
}
```

---

## 3. PROJECTS API

### Get All Projects
```
GET /projects
```
**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-1",
      "title": "Portfolio Website",
      "description": "Personal portfolio with admin dashboard",
      "image": "/uploads/project1.png",
      "technologies": ["React", "Node.js", "GraphQL"],
      "link": "https://myportfolio.com",
      "github": "https://github.com/user/portfolio"
    }
  ],
  "total": 1
}
```

### Get Single Project
```
GET /projects/:id
```
**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-1",
    "title": "Portfolio Website",
    "description": "Personal portfolio with admin dashboard",
    "image": "/uploads/project1.png",
    "technologies": ["React", "Node.js", "GraphQL"],
    "link": "https://myportfolio.com",
    "github": "https://github.com/user/portfolio"
  }
}
```

**Response (404):**
```json
{
  "success": false,
  "error": "Project not found"
}
```

### Create Project
```
POST /projects
```
**Headers:**
- Authorization: Bearer <token>

**Body:**
```json
{
  "title": "E-commerce Platform",
  "description": "Full-featured e-commerce solution",
  "image": "/uploads/ecommerce.png",
  "technologies": ["React", "Node.js", "MongoDB", "Stripe"],
  "link": "https://myshop.com",
  "github": "https://github.com/user/ecommerce"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Project added successfully",
  "data": {
    "id": "uuid-new",
    "title": "E-commerce Platform",
    "description": "Full-featured e-commerce solution",
    "image": "/uploads/ecommerce.png",
    "technologies": ["React", "Node.js", "MongoDB", "Stripe"],
    "link": "https://myshop.com",
    "github": "https://github.com/user/ecommerce"
  }
}
```

### Update Project
```
PUT /projects/:id
```
**Headers:**
- Authorization: Bearer <token>

**Body:**
```json
{
  "title": "Updated Project Title",
  "link": "https://new-link.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Project updated successfully",
  "data": {
    "id": "uuid-1",
    "title": "Updated Project Title",
    "description": "Full-featured e-commerce solution",
    "image": "/uploads/ecommerce.png",
    "technologies": ["React", "Node.js", "MongoDB", "Stripe"],
    "link": "https://new-link.com",
    "github": "https://github.com/user/ecommerce"
  }
}
```

### Delete Project
```
DELETE /projects/:id
```
**Headers:**
- Authorization: Bearer <token>

**Response (200):**
```json
{
  "success": true,
  "message": "Project deleted successfully"
}
```

---

## 4. AUTH API

### Login
```
POST /login
```

**Body:**
```json
{
  "username": "dwikiramdaniganteng",
  "password": "g4nt3ng$b4ng3t"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "username": "dwikiramdaniganteng",
    "role": "admin"
  }
}
```

**Response (401):**
```json
{
  "error": "Invalid credentials"
}
```

---

## 5. UPLOAD API

### Upload File
```
POST /upload
```
**Content-Type:** multipart/form-data

**Body:** form-data with file field named "file"

**Response (200):**
```json
{
  "url": "/uploads/filename-123.png"
}
```

**Response (400):**
```json
{
  "error": "No file uploaded"
}
```

---

## ERROR RESPONSES

### Unauthorized (401)
```json
{
  "success": false,
  "error": "Unauthorized"
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

## CORS ENABLED

All API endpoints support CORS for cross-origin requests.

---

## RATE LIMITING

No rate limiting is implemented by default. Consider adding rate limiting for production use.

---

## TESTING WITH CURL

### Get Profile
```bash
curl http://localhost:3000/api/profile
```

### Get Experiences (with auth)
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/experiences
```

### Create Experience
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Developer","company":"ABC","startDate":"2024-01-01"}' \
  http://localhost:3000/api/experiences
```

### Upload Image
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@image.png" \
  http://localhost:3000/api/upload
```
