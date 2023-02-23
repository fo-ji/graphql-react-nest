import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

// MEMO: local-strategy用にするため引数に"local"を指定
export class GqlAuthGuard extends AuthGuard('local') {
  constructor() {
    super();
  }

  // MEMO: defaultのAuthGuardがREST_API用でGraphQL用にオーバーライドするので関数名は固定
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext();
    request.body = ctx.getArgs().signInInput;
    return request;
  }
}
