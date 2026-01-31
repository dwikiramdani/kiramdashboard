const { buildSchema } = require('graphql');

const schema = buildSchema(`
  type Profile {
    id: ID!
    username: String!
    profilePicture: String!
    headline: String!
    summary: String!
    techstack: [String!]!
  }

  type Experience {
    id: ID!
    title: String!
    company: String!
    startDate: String!
    endDate: String
    description: String
    current: Boolean
  }

  type Project {
    id: ID!
    title: String!
    description: String!
    image: String
    technologies: [String!]!
    link: String
    github: String
  }

  type AuthPayload {
    token: String!
    user: User!
    apiKey: String
  }

  type ApiKeyResponse {
    apiKey: String!
    message: String!
  }

  type User {
    id: ID!
    username: String!
    role: String!
  }

  type Query {
    profile: Profile
    experiences: [Experience!]!
    projects: [Project!]!
    me: User
  }

  type Mutation {
    login(username: String!, password: String!): AuthPayload
    regenerateApiKey: ApiKeyResponse
    updateProfile(
      profilePicture: String
      headline: String
      summary: String
      techstack: [String!]
    ): Profile
    addExperience(
      title: String!
      company: String!
      startDate: String!
      endDate: String
      description: String
      current: Boolean
    ): Experience
    updateExperience(
      id: ID!
      title: String
      company: String
      startDate: String
      endDate: String
      description: String
      current: Boolean
    ): Experience
    deleteExperience(id: ID!): Boolean
    addProject(
      title: String!
      description: String!
      image: String
      technologies: [String!]!
      link: String
      github: String
    ): Project
    updateProject(
      id: ID!
      title: String
      description: String
      image: String
      technologies: [String!]
      link: String
      github: String
    ): Project
    deleteProject(id: ID!): Boolean
  }
`);

module.exports = schema;
