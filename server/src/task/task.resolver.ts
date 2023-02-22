import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateTaskInput } from './dto/createTask.input';
import { Task } from './models/task.model';
import { TaskService } from './task.service';

@Resolver()
export class TaskResolver {
  constructor(private readonly taskService: TaskService) {}

  // MEMO: graphqlの関数であることを明示的にする必要あり
  @Query(() => [Task], { nullable: 'items' }) // MEMO: 戻り値の型が必要（記述方法はgraphqlになる）
  // MEMO: 第2引数はオプション。'items'を設定した場合は値がない場合から配列を返す
  getTasks(): Task[] {
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
  @Mutation(() => Task)
  createTask(@Args('createTaskInput') createTaskInput: CreateTaskInput): Task {
    return this.taskService.createTask(createTaskInput);
  }
}
