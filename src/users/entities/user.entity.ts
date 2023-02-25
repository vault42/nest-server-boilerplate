import { ApiProperty } from '@nestjs/swagger'
import { Role, User } from '@prisma/client'

export class UserEntity implements User {
  @ApiProperty()
  id: number

  @ApiProperty()
  email: string

  @ApiProperty()
  password: string

  @ApiProperty()
  role: Role

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date
}
