import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { User } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateUserInput } from './dto/createUser.input';
import { GetUserArgs } from './dto/getUser.args';
import { User as UserModel } from './models/user.model';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => UserModel)
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User> {
    return await this.userService.createUser(createUserInput);
  }

  @Query(() => UserModel, { nullable: true })
  @UseGuards(JwtAuthGuard)
  // MEMO: Argsデコレータはgraphqlで型が生成されず中身が展開されるので、引数で名前を指定する必要がない
  async getUser(@Args() getUserArgs: GetUserArgs): Promise<User | null> {
    return await this.userService.getUser(getUserArgs.email);
  }
}
