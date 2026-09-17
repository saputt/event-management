import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  mixin,
} from '@nestjs/common';
import { UserRole } from 'generated/prisma/enums';

export function RoleGuard(...allowedRoles: UserRole[]) {
  @Injectable()
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();
      const user = request.user;

      if (!user) {
        throw new ForbiddenException('User not authenticated');
      }

      if (!allowedRoles.includes(user.role)) {
        throw new ForbiddenException('Insufficient permissions');
      }

      return true;
    }
  }

  return mixin(RoleGuardMixin);
}