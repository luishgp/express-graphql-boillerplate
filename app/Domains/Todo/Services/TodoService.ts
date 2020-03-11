import { Todo } from '@/Domains/Todo/Contracts/Todo';

export default class TodoService {
  static async getTodo(todoId: number) {
    return {};
  }

  static async getTodoList() {
    return [{ id: 123, text: 'Hello World' }];
  }

  static async createTodo(todo: Todo) {
    return {};
  }

  static async updateTodo(todo: Todo) {
    return {};
  }

  static async deleteTodo(todoId: number) {
    return true;
  }
}
