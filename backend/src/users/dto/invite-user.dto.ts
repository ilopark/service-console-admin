import { IsEmail, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class InviteUserDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;
}

export class AcceptInviteDto {
  @IsUUID()
  @IsNotEmpty()
  token!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;
}