
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FeeStructure, FeeStructureDocument } from './schemas/fee-structure.schema';
import { FeePayment, FeePaymentDocument } from './schemas/fee-payment.schema';
import { CreateFeeDto } from './dto/create-fee.dto';
import { RecordPaymentDto } from './dto/record-payment.dto';

@Injectable()
export class FinanceService {
    constructor(
        @InjectModel(FeeStructure.name) private feeStructureModel: Model<FeeStructureDocument>,
        @InjectModel(FeePayment.name) private feePaymentModel: Model<FeePaymentDocument>,
    ) { }

    // Fee Structure Methods
    async createFee(createFeeDto: CreateFeeDto): Promise<FeeStructure> {
        return this.feeStructureModel.create(createFeeDto);
    }

    async findAllFees(query: any = {}): Promise<FeeStructure[]> {
        return this.feeStructureModel.find(query).sort({ dueDate: 1 }).exec();
    }

    async findFeeById(id: string): Promise<FeeStructure> {
        const fee = await this.feeStructureModel.findById(id).exec();
        if (!fee) throw new NotFoundException('Fee Structure not found');
        return fee;
    }

    // Payment Methods
    async recordPayment(recordPaymentDto: RecordPaymentDto): Promise<FeePayment> {
        const payment = new this.feePaymentModel({
            student: recordPaymentDto.studentId,
            feeStructure: recordPaymentDto.feeStructureId,
            ...recordPaymentDto
        });
        return payment.save();
    }

    async findStudentPayments(studentId: string): Promise<FeePayment[]> {
        return this.feePaymentModel
            .find({ student: studentId } as any)
            .populate('feeStructure')
            .sort({ paymentDate: -1 })
            .exec();
    }

    async getStats(): Promise<any> {
        const totalCollected = await this.feePaymentModel.aggregate([
            { $group: { _id: null, total: { $sum: '$amountPaid' } } }
        ]);

        const pending = 0; // Placeholder: Logic for pending fees needs iteration over students vs fees

        return {
            totalCollected: totalCollected[0]?.total || 0,
            pendingFees: pending
        };
    }
}
