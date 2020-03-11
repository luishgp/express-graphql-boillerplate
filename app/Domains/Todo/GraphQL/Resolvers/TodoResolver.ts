import { Todo } from '@/Domains/Todo/Contracts/Todo';
import TodoService from '@/Domains/Todo/Services/TodoService';

export default {
  Query: {
    todo: (parent: any, { todoId }: { todoId: number }) => TodoService.getTodo(todoId),
    todos: (parent: any) => TodoService.getTodoList(),
  },

  Mutation: {
    createTodo: (parent: any, { todo }: { todo: Todo }) => TodoService.createTodo(todo),
    updateTodo: (parent: any, { todo }: { todo: Todo }) => TodoService.updateTodo(todo),
    deleteTodo: (parent: any, { todoId }: { todoId: number }) => TodoService.deleteTodo(todoId),
  },
};
