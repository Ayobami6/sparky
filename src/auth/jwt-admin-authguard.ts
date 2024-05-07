import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtPayload } from './interfaces/jwt.interface';

import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { RoleEnum } from 'src/user/types';

@Injectable()
export class AdminAuthGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }
  //   handle the request from
  handleRequest<TUser = JwtPayload>(err: any, user: any): TUser {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    if (user.role === RoleEnum.admin) return user;
    else throw err || new UnauthorizedException();
  }
}
