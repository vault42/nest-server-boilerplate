import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import * as bcrypt from 'bcryptjs'
import { User } from '@prisma/client'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string): Promise<Partial<User>> {
    const user = await this.prismaService.user.findUnique({ where: { email } })
    if (user && bcrypt.compareSync(password, user.password)) {
      const { password, ...result } = user
      return result
    }
    return null
  }

  async login(user: User) {
    const payload = {
      username: user.email,
      id: user.id
    }

    return {
      access_token: this.jwtService.sign(payload)
    }
  }
}
