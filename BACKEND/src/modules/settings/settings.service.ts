import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Setting, SettingDocument } from './schemas/setting.schema';
import { CreateSettingDto } from './dto/create-setting.dto';

@Injectable()
export class SettingsService {
    constructor(
        @InjectModel(Setting.name) private settingModel: Model<SettingDocument>,
    ) { }

    async createOrUpdate(createSettingDto: CreateSettingDto): Promise<Setting> {
        const { key } = createSettingDto;
        // Format value based on type if needed, forcing string storage for simplicity
        const data = { ...createSettingDto, value: String(createSettingDto.value) };

        const setting = await this.settingModel.findOneAndUpdate(
            { key },
            data,
            { new: true, upsert: true }
        ).exec();

        return setting;
    }

    async findAll(): Promise<Setting[]> {
        return this.settingModel.find().exec();
    }

    async findOne(key: string): Promise<Setting> {
        const setting = await this.settingModel.findOne({ key }).exec();
        if (!setting) {
            throw new NotFoundException(`Setting with key ${key} not found`);
        }
        return setting;
    }
}
