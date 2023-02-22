import { Injectable } from '@nestjs/common';
import { CreateTaskInput } from './dto/createTask.input';
import { Task } from './models/task.model';

@Injectable()
export class TaskService {
  tasks: Task[] = [];

  getTasks(): Task[] {
    return this.tasks;
  }

  createTask(createTaskInput: CreateTaskInput): Task {
    const { name, dueDate, description } = createTaskInput;

    const newTask = new Task();
    newTask.id = this.tasks.length + 1;
    newTask.name = name;
    newTask.dueDate = dueDate;
    newTask.status = 'NOT_STARTED';
    newTask.description = description;

    this.tasks.push(newTask);

    return newTask;
  }
}
