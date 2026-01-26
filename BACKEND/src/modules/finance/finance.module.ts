
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FinanceController } from './finance.controller';
import { FinanceService } from './finance.service';
import { FeeStructure, FeeStructureSchema } from './schemas/fee-structure.schema';
import { FeePayment, FeePaymentSchema } from './schemas/fee-payment.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: FeeStructure.name, schema: FeeStructureSchema },
            { name: FeePayment.name, schema: FeePaymentSchema },
        ]),
    ],
    controllers: [FinanceController],
    providers: [FinanceService],
    exports: [FinanceService] // Export if needed by other modules
})
export class FinanceModule { }
