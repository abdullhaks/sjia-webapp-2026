
import axiosInstance from '../axios/authAxios';

export interface FeeStructure {
    _id: string;
    title: string;
    amount: number;
    class: string;
    frequency: string;
    dueDate: string;
    description?: string;
}

export interface FeePayment {
    _id: string;
    student: string; // ID or Populated object depending on usage
    feeStructure: FeeStructure;
    amountPaid: number;
    paymentDate: string;
    method: string;
    status: string;
    transactionId?: string;
    remarks?: string;
}

export interface CreateFeeDto {
    title: string;
    amount: number;
    class: string;
    frequency: string;
    dueDate: string; // ISO Date
    description?: string;
}

export interface RecordPaymentDto {
    studentId: string;
    feeStructureId: string;
    amountPaid: number;
    paymentDate: string; // ISO Date
    method: string;
    status?: string;
    transactionId?: string;
    remarks?: string;
}

export interface FinanceStats {
    totalCollected: number;
    pendingFees: number;
}

const financeApi = {
    async createFee(data: CreateFeeDto): Promise<FeeStructure> {
        const response = await axiosInstance.post('/finance/fees', data);
        return response.data;
    },

    async getFees(filters?: any): Promise<FeeStructure[]> {
        const response = await axiosInstance.get('/finance/fees', { params: filters });
        return response.data;
    },

    async recordPayment(data: RecordPaymentDto): Promise<FeePayment> {
        const response = await axiosInstance.post('/finance/payments', data);
        return response.data;
    },

    async getStudentPayments(studentId: string): Promise<FeePayment[]> {
        const response = await axiosInstance.get(`/finance/payments/student/${studentId}`);
        return response.data;
    },

    async getStats(): Promise<FinanceStats> {
        const response = await axiosInstance.get('/finance/stats');
        return response.data;
    }
};

export default financeApi;
