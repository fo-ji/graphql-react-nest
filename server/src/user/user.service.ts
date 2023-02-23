import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserInput } from './dto/createUser.input';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(createUserInput: CreateUserInput): Promise<User> {
    const { password, ...input } = createUserInput;
    const hashedPassword = await bcrypt.hash(password, 10);

    return await this.prismaService.user.create({
      data: { ...input, password: hashedPassword },
    });
  }

  async getUser(email: string): Promise<User | null> {
    return await this.prismaService.user.findUnique({
      where: { email }, // MEMO: whereでは"id"or"unique"属性のフィールドのみ検索可能
    });
  }
}
