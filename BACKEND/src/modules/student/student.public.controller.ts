import { Controller, Get } from '@nestjs/common';
import { StudentService } from './student.service';

@Controller('public/student')
export class StudentPublicController {
    constructor(private readonly studentService: StudentService) { }

    @Get('council')
    async getCouncilMembers() {
        return this.studentService.findCouncilMembers();
    }
}
