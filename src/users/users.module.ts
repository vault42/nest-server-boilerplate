import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { PrismaModule } from 'src/prisma/prisma.module'
import { JwtService } from '@nestjs/jwt'
import { APP_GUARD } from '@nestjs/core'
import { RolesGuard } from 'src/auth/guards/roles.guard'

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    JwtService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    }
  ],
  imports: [PrismaModule],
  exports: [UsersService]
})
export class UsersModule {}
