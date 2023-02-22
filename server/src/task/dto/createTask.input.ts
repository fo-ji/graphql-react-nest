import { Field, InputType } from '@nestjs/graphql';
import { IsDateString, IsNotEmpty } from 'class-validator';

// MEMO: classをmutationの引数として扱う場合はデコレーション必要
@InputType()
export class CreateTaskInput {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsDateString()
  dueDate: string;

  @Field({ nullable: true })
  description?: string;
}
