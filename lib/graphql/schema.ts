import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type News {
    id: ID!
    title: String!
    slug: String!
    summary: String!
    content: String!
    category: String!
    imageUrl: String
    featured: Boolean!
    published: Boolean!
    publishedAt: String!
    createdAt: String!
    updatedAt: String!
    authorId: String
    author: User
    views: Int!
    likes: Int!
    tags: [String!]!
  }

  type User {
    id: ID!
    email: String!
    username: String!
    role: UserRole!
    name: String
    avatar: String
    createdAt: String!
    updatedAt: String!
    news: [News!]!
  }

  type Category {
    id: ID!
    name: String!
    slug: String!
    description: String
    color: String!
    createdAt: String!
    updatedAt: String!
  }

  enum UserRole {
    USER
    ADMIN
    EDITOR
  }

  type Query {
    # News queries
    news(id: ID!): News
    newsList(
      page: Int = 1
      limit: Int = 10
      category: String
      search: String
      featured: Boolean
      published: Boolean = true
      sortBy: String = "publishedAt"
      sortOrder: String = "desc"
    ): NewsListResponse!
    newsCount(category: String, search: String, published: Boolean = true): Int!
    
    # Category queries
    categories: [Category!]!
    category(id: ID!): Category
    
    # User queries
    user(id: ID!): User
    users: [User!]!
    me: User
  }

  type Mutation {
    # News mutations
    createNews(input: CreateNewsInput!): News!
    updateNews(id: ID!, input: UpdateNewsInput!): News!
    deleteNews(id: ID!): Boolean!
    toggleNewsPublished(id: ID!): News!
    toggleNewsFeatured(id: ID!): News!
    incrementNewsViews(id: ID!): News!
    likeNews(id: ID!): News!
    
    # Category mutations
    createCategory(input: CreateCategoryInput!): Category!
    updateCategory(id: ID!, input: UpdateCategoryInput!): Category!
    deleteCategory(id: ID!): Boolean!
    
    # User mutations
    createUser(input: CreateUserInput!): User!
    updateUser(id: ID!, input: UpdateUserInput!): User!
    deleteUser(id: ID!): Boolean!
    
    # Auth mutations
    login(email: String!, password: String!): AuthResponse!
    register(input: RegisterInput!): AuthResponse!
    logout: Boolean!
  }

  type NewsListResponse {
    news: [News!]!
    total: Int!
    page: Int!
    limit: Int!
    totalPages: Int!
    hasNextPage: Boolean!
    hasPrevPage: Boolean!
  }

  type AuthResponse {
    token: String!
    user: User!
  }

  input CreateNewsInput {
    title: String!
    slug: String!
    summary: String!
    content: String!
    category: String!
    imageUrl: String
    featured: Boolean = false
    published: Boolean = true
    publishedAt: String
    tags: [String!] = []
  }

  input UpdateNewsInput {
    title: String
    slug: String
    summary: String
    content: String
    category: String
    imageUrl: String
    featured: Boolean
    published: Boolean
    publishedAt: String
    tags: [String!]
  }

  input CreateCategoryInput {
    name: String!
    slug: String!
    description: String
    color: String = "#3B82F6"
  }

  input UpdateCategoryInput {
    name: String
    slug: String
    description: String
    color: String
  }

  input CreateUserInput {
    email: String!
    username: String!
    password: String!
    role: UserRole = USER
    name: String
    avatar: String
  }

  input UpdateUserInput {
    email: String
    username: String
    password: String
    role: UserRole
    name: String
    avatar: String
  }

  input RegisterInput {
    email: String!
    username: String!
    password: String!
    name: String
  }
`; 