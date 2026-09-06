"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PdfService = void 0;
const common_1 = require("@nestjs/common");
const pdfMake = require("pdfmake/build/pdfmake");
const pdfFonts = require("pdfmake/build/vfs_fonts");
pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts;
let PdfService = class PdfService {
    async generatePayslipPdf(payslip, employee, companyName = 'PeoplePay360') {
        const docDefinition = {
            content: [
                { text: companyName, style: 'header' },
                { text: 'Payslip', style: 'subheader' },
                { text: `Period: ${new Date(payslip.periodStart).toLocaleDateString()} - ${new Date(payslip.periodEnd).toLocaleDateString()}`, margin: [0, 0, 0, 20] },
                {
                    columns: [
                        {
                            width: '50%',
                            text: [
                                { text: 'Employee Details\n', style: 'sectionHeader' },
                                `Name: ${employee.firstName} ${employee.lastName}\n`,
                                `Department: ${employee.department}\n`,
                                `Position: ${employee.position}\n`
                            ]
                        },
                        {
                            width: '50%',
                            text: [
                                { text: 'Summary\n', style: 'sectionHeader' },
                                `Gross Pay: $${Number(payslip.grossPay).toFixed(2)}\n`,
                                `Deductions: $${Number(payslip.totalDeductions).toFixed(2)}\n`,
                                { text: `Net Pay: $${Number(payslip.netPay).toFixed(2)}\n`, bold: true, fontSize: 14, margin: [0, 5, 0, 0] }
                            ]
                        }
                    ]
                },
                { text: 'Earnings & Deductions (Snapshot)', style: 'sectionHeader', margin: [0, 20, 0, 10] },
                {
                    table: {
                        headerRows: 1,
                        widths: ['*', 'auto', 'auto'],
                        body: [
                            ['Description', 'Type', 'Amount'],
                            ...(payslip.lineItems || []).map(item => [
                                item.description,
                                item.type,
                                `$${Number(item.amount).toFixed(2)}`
                            ])
                        ]
                    }
                },
                { text: 'This is a computer generated document and requires no signature.', style: 'footer', alignment: 'center', margin: [0, 40, 0, 0] }
            ],
            styles: {
                header: { fontSize: 22, bold: true, margin: [0, 0, 0, 5] },
                subheader: { fontSize: 16, bold: true, margin: [0, 0, 0, 10] },
                sectionHeader: { fontSize: 14, bold: true, margin: [0, 10, 0, 5], color: '#333333' },
                footer: { fontSize: 10, italics: true, color: '#888888' }
            },
            defaultStyle: {
                font: 'Roboto'
            }
        };
        return new Promise((resolve, reject) => {
            try {
                const printer = require('pdfmake');
                const pdfDoc = pdfMake.createPdf(docDefinition);
                pdfDoc.getBuffer((buffer) => {
                    resolve(buffer);
                });
            }
            catch (error) {
                reject(error);
            }
        });
    }
};
exports.PdfService = PdfService;
exports.PdfService = PdfService = __decorate([
    (0, common_1.Injectable)()
], PdfService);
//# sourceMappingURL=pdf.service.js.map