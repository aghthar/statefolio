import { makeAutoObservable } from 'mobx';

export class CounterStore {
  value = 0;

  constructor() {
    makeAutoObservable(this);
  }

  increment = () => {
    this.value++;
  };

  decrement = () => {
    this.value--;
  };
}

export class TodoStore {
  todos: string[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  get todoCount() {
    return this.todos.length;
  }

  addTodo = (todo: string) => {
    this.todos.push(todo);
  };

  removeTodo = (index: number) => {
    this.todos.splice(index, 1);
  };
}

export class RootStore {
  counter: CounterStore;
  todos: TodoStore;

  constructor() {
    this.counter = new CounterStore();
    this.todos = new TodoStore();
  }
} 