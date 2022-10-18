import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task, TaskStatus } from './tasks.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  // @Get()
  // getAllTasks(): Task[] {
  //   return this.tasksService.getAllTasks();
  // }

  @Get()
  getTasks(@Query() filterDto: GetTasksFilterDto): Task[] {
    if (Object.keys(filterDto).length) {
      return this.tasksService.getTasksWithFilters(filterDto);
    } else {
      return this.tasksService.getAllTasks();
    }
  }

  @Get('/:id')
  getATask(@Param('id') id: string): Task {
    return this.tasksService.getATaskById(id);
  }

  // using dtos
  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): Task {
    return this.tasksService.createTask(createTaskDto);
  }

  // get the values of the keys specified as parameters
  //   @Post()
  //   createTask(
  //     @Body('title') title: string,
  //     @Body('description') description: string,
  //   ): Task {
  //     return this.tasksService.createTask(title, description);
  //   }

  // get all the body
  //   @Post()
  //   createTask(@Body() body) {
  //     console.log(body);
  //   }

  @Delete('/:id')
  deleteATask(@Param('id') id: string): Task {
    return this.tasksService.deleteATask(id);
  }

  // if status was passed throught parameters
  //   @Patch('/:id/:status')
  //   updateTaskStatus(
  //     @Param('id') id: string,
  //     @Param('status') status: TaskStatus,
  //   ): void {
  //     return this.tasksService.updateTaskStatus(id, status);
  //   }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id: string,
    // @Body('status') status: TaskStatus,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ): Task {
    const { status } = updateTaskStatusDto;
    return this.tasksService.updateTaskStatus(id, status);
  }
}
