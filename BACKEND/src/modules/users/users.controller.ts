import {
    Controller,
    Patch,
    Body,
    UseGuards,
    Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Patch('profile')
    @UseGuards(JwtAuthGuard)
    updateProfile(@Req() req: any, @Body() updateProfileDto: UpdateProfileDto) {
        return this.usersService.updateProfile(req.user.userId, updateProfileDto);
    }
}
