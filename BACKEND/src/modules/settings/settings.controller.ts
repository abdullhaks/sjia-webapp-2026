import {
    Controller,
    Get,
    Post,
    Body,
    UseGuards,
    Param,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { CreateSettingDto } from './dto/create-setting.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../database/schemas/user.schema';

@Controller('settings')
export class SettingsController {
    constructor(private readonly settingsService: SettingsService) { }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPERADMIN)
    create(@Body() createSettingDto: CreateSettingDto) {
        return this.settingsService.createOrUpdate(createSettingDto);
    }

    @Get()
    // Public or Authenticated depending on requirement. 
    // For now allowing all users to see (e.g., Site Name)
    findAll() {
        return this.settingsService.findAll();
    }

    @Get(':key')
    findOne(@Param('key') key: string) {
        return this.settingsService.findOne(key);
    }
}
