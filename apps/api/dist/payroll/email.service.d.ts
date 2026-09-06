export declare class EmailService {
    private transporter;
    private readonly logger;
    constructor();
    sendPayslipEmail(employeeEmail: string, employeeName: string, periodString: string, pdfBuffer: Buffer): Promise<void>;
}
