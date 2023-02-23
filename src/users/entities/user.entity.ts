import { ApiProperty } from '@nestjs/swagger'
import { Role } from '@prisma/client'

export class User {
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
