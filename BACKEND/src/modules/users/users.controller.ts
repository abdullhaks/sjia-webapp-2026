import {
    Controller,
    Patch,
    Body,
    UseGuards,
    Req,
    UseInterceptors,
    UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Patch('profile')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('photo'))
    updateProfile(
        @Req() req: any,
        @Body() updateProfileDto: UpdateProfileDto,
        @UploadedFile() file?: Express.Multer.File
    ) {
        return this.usersService.updateProfile(req.user.userId, updateProfileDto, file);
    }

    @Patch('push-subscription')
    @UseGuards(JwtAuthGuard)
    savePushSubscription(@Req() req: any, @Body() subscription: any) {
        return this.usersService.savePushSubscription(req.user.userId, subscription);
    }
}
