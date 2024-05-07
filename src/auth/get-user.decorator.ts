import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from 'src/user/user.entity';

export const GetUser = createParamDecorator(
  (_data, ctx: ExecutionContext): UserEntity => {
    const request = ctx.switchToHttp().getRequest();
    return JSON.parse(JSON.stringify(request.user));
  },
);
