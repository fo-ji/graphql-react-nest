import { Field, ObjectType, Int } from '@nestjs/graphql';

// MEMO: modelで定義した内容がschema.graphqlに反映される
@ObjectType()
export class Task {
  @Field(() => Int) // MEMO: デフォルトがFloatになってしまうので変換
  id: number;

  @Field()
  name: string;

  @Field()
  dueDate: string;

  @Field()
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

  @Field({ nullable: true }) // MEMO: nullを許容させる場合は追加
  description?: string;
}
