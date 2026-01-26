import { Controller, Get, Query } from '@nestjs/common';
import { ResultService } from './result.service';

@Controller('public/result')
export class ResultPublicController {
    constructor(private readonly resultService: ResultService) { }

    @Get('toppers')
    async getToppers(@Query('limit') limit: number) {
        return this.resultService.findTopPerformers(limit || 5);
    }
}
