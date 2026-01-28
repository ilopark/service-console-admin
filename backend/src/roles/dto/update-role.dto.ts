import { IsIn, IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateRoleDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  // 프론트에서 빈 값이면 null로 보내도 OK
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string | null;

  @IsOptional()
  @IsIn(["system", "custom"])
  type?: "system" | "custom";
}