import { IsIn, IsOptional, IsString, MaxLength, Matches } from "class-validator";

export class CreateRoleDto {
  @IsString()
  @MaxLength(50)
  @Matches(/^[A-Z0-9_]+$/, { message: "code must be like ADMIN or SUPPORT_ROLE" })
  code: string;

  @IsString()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsIn(["system", "custom"])
  type: "system" | "custom";
}
