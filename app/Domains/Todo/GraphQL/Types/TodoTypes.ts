import { gql } from 'apollo-server-core';

export default gql`
  type Query {
    todo(todoId: Int!): Todo
    todos: [Todo]
  }

  type Mutation {
    createTodo(todo: TodoInput!): Todo
    updateTodo(todo: TodoInput!): Todo
    deleteTodo(todoId: String!): Boolean
  }

  type Todo {
    id: Int!
    text: String
  }

  input TodoInput {
    text: String
  }
`;
