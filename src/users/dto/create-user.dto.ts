import { ApiProperty } from '@nestjs/swagger'
import { Role } from '@prisma/client'
import { IsEnum, IsNotEmpty, IsString } from 'class-validator'

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  email: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string

  @IsEnum(Role)
  @ApiProperty({ required: false, default: Role.USER })
  role?: Role = Role.USER
}
