import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { Role, User } from '@prisma/client'
import { Observable } from 'rxjs'
import { ROLES_KEY } from './roles.decorator'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService
  ) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ])
    if (!requiredRoles) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    let token = request.headers.authorization
    if (/Bearer/.test(token)) {
      token = token.split(' ').pop()
    }
    const user = this.jwtService.decode(token) as User
    if (!user || !user.role) {
      return false
    }
    return requiredRoles.some((role) => user.role === role)
  }
}
