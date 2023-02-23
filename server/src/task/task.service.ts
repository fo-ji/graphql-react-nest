import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskInput } from './dto/createTask.input';
import { Task } from '@prisma/client';
import { UpdateTaskInput } from './dto/updateTask.input';

@Injectable()
export class TaskService {
  constructor(private readonly prismaService: PrismaService) {}

  async getTasks(userId: number): Promise<Task[]> {
    return await this.prismaService.task.findMany({
      where: { userId },
    });
  }

  async createTask(createTaskInput: CreateTaskInput): Promise<Task> {
    return this.prismaService.task.create({ data: createTaskInput });
  }

  async updateTask(updateTaskInput: UpdateTaskInput): Promise<Task> {
    const { id, ...input } = updateTaskInput;
    return this.prismaService.task.update({ data: input, where: { id } });
  }

  async deleteTask(id: number): Promise<Task> {
    return this.prismaService.task.delete({ where: { id } });
  }
}
