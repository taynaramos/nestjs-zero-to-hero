import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './tasks.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  public getAllTasks(): Task[] {
    return this.tasks;
  }

  public getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto;

    let tasks = this.getAllTasks();

    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    if (search) {
      tasks = tasks.filter((task) => {
        if (task.title.includes(search) || task.description.includes(search)) {
          return true;
        }
        return false;
      });
    }

    return tasks;
  }

  public getATaskById(id: string): Task {
    const found = this.tasks.find((task) => task.id === id);

    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    } else {
      return found;
    }
  }

  public createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;
    const task: Task = {
      id: uuid(),
      title: title,
      description: description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);

    return task;
  }

  // if you don't want to return, the type of return of the func is void
  public deleteATask(id: string): Task {
    const taskToBeDeleted: Task = this.getATaskById(id);
    this.tasks = this.tasks.filter((task) => task.id !== taskToBeDeleted.id);

    return taskToBeDeleted;
  }

  //   public updateTaskStatus(id: string, status: TaskStatus): void {
  //     this.tasks.map((task) => {
  //       if (task.id === id) {
  //         task.status = status;
  //       }
  //     });
  //   }

  public updateTaskStatus(id: string, status: TaskStatus): Task {
    const task = this.getATaskById(id);
    task.status = status;
    return task;
  }
}
