import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { ResultService } from './result.service';

@Controller('public/result')
export class ResultPublicController {
    constructor(private readonly resultService: ResultService) { }

    @Get('toppers')
    async getToppers(@Query('limit') limit: number) {
        return this.resultService.findTopPerformers(limit || 5);
    }

    @Get('search')
    async searchPublic(@Query('q') query: string) {
        if (!query) throw new BadRequestException('Search query is required');
        return this.resultService.searchPublicResults(query);
    }
}
