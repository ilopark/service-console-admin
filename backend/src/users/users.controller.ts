import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { UsersService } from "./users.service";
import { AcceptInviteDto, InviteUserDto } from "./dto/invite-user.dto";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  list() {
    return this.usersService.list();
  }
  
  @Post("invite")
  invite(@Body() dto: InviteUserDto) {
    return this.usersService.invite(dto);
  }

  @Get("invites/verify")
  verifyInvite(@Query("token") token: string) {
    return this.usersService.verifyInvite(token);
  }

  @Post("accept-invite")
  acceptInvite(@Body() dto: AcceptInviteDto) {
    return this.usersService.acceptInvite(dto);
  }
}