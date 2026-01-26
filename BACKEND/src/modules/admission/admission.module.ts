import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdmissionService } from './admission.service';
import { AdmissionController } from './admission.controller';
import { AdmissionRepository } from './admission.repository';
import { Admission, AdmissionSchema } from './schemas/admission.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Admission.name, schema: AdmissionSchema }]),
    ],
    controllers: [AdmissionController],
    providers: [AdmissionService, AdmissionRepository],
    exports: [AdmissionService],
})
export class AdmissionModule { }
