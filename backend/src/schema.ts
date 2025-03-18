export const schema = `
  type User {
    id: Int!
    name: String!
    email: String!
    created_at: String
    todos: [Todo!]
  }

  type Todo {
    id: Int!
    title: String!
    description: String
    completed: Boolean!
    created_at: String
    user_id: Int
    user: User
  }

  type Query {
    todos: [Todo!]!
    todo(id: Int!): Todo
    users: [User!]!
    user(id: Int!): User
  }

  type Mutation {
    createTodo(title: String!, description: String, user_id: Int): Todo!
    updateTodo(id: Int!, title: String, description: String, completed: Boolean, user_id: Int): Todo!
    deleteTodo(id: Int!): Boolean!
    
    createUser(name: String!, email: String!): User!
    updateUser(id: Int!, name: String, email: String): User!
    deleteUser(id: Int!): Boolean!
  }
`