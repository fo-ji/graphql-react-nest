import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Task } from '@prisma/client';
import { CreateTaskInput } from './dto/createTask.input';
import { UpdateTaskInput } from './dto/updateTask.input';
import { Task as TaskModel } from './models/task.model';
import { TaskService } from './task.service';

@Resolver()
export class TaskResolver {
  constructor(private readonly taskService: TaskService) {}

  // MEMO: graphqlの関数であることを明示的にする必要あり
  @Query(() => [TaskModel], { nullable: 'items' }) // MEMO: 戻り値の型が必要（記述方法はgraphqlになる）
  // MEMO: 第2引数はオプション。'items'を設定した場合は値がない場合から配列を返す
  async getTasks(): Promise<Task[]> {
    return this.taskService.getTasks();
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
  async createTask(
    @Args('createTaskInput') createTaskInput: CreateTaskInput,
  ): Promise<Task> {
    return await this.taskService.createTask(createTaskInput);
  }

  @Mutation(() => TaskModel)
  async updateTask(
    @Args('updateTaskInput') updateTaskInput: UpdateTaskInput,
  ): Promise<Task> {
    return await this.taskService.updateTask(updateTaskInput);
  }

  @Mutation(() => TaskModel)
  async deleteTask(@Args('id', { type: () => Int }) id: number): Promise<Task> {
    return await this.taskService.deleteTask(id);
  }
}
