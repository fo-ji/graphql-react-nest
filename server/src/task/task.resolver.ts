import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Task } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateTaskInput } from './dto/createTask.input';
import { UpdateTaskInput } from './dto/updateTask.input';
import { Task as TaskModel } from './models/task.model';
import { TaskService } from './task.service';

@Resolver()
export class TaskResolver {
  constructor(private readonly taskService: TaskService) {}

  // MEMO: graphqlの関数であることを明示的にする必要あり
  @Query(() => [TaskModel], { nullable: 'items' }) // MEMO: 戻り値の型が必要（記述方法はgraphqlになる）
  @UseGuards(JwtAuthGuard)
  // MEMO: 第2引数はオプション。'items'を設定した場合は値がない場合から配列を返す
  async getTasks(
    @Args('userId', { type: () => Int }) userId: number,
  ): Promise<Task[]> {
    return this.taskService.getTasks(userId);
  }

  // MEMO: バリデーションなし
  // @Mutation(() => Task)
  // createTask(
  //   @Args('name') name: string,
  //   @Args('dueDate') dueDate: string,
  //   @Args('description', { nullable: true }) description: string,
  // ): Task {
  //   return this.taskService.createTask(name, dueDate, description);
  // }
  @Mutation(() => TaskModel)
  @UseGuards(JwtAuthGuard)
  async createTask(
    @Args('createTaskInput') createTaskInput: CreateTaskInput,
  ): Promise<Task> {
    return await this.taskService.createTask(createTaskInput);
  }

  @Mutation(() => TaskModel)
  @UseGuards(JwtAuthGuard)
  async updateTask(
    @Args('updateTaskInput') updateTaskInput: UpdateTaskInput,
  ): Promise<Task> {
    return await this.taskService.updateTask(updateTaskInput);
  }

  @Mutation(() => TaskModel)
  @UseGuards(JwtAuthGuard)
  async deleteTask(@Args('id', { type: () => Int }) id: number): Promise<Task> {
    return await this.taskService.deleteTask(id);
  }
}
