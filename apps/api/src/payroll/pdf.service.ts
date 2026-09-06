import { Injectable } from '@nestjs/common';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

(pdfMake as any).vfs = (pdfFonts as any).pdfMake ? (pdfFonts as any).pdfMake.vfs : pdfFonts;

@Injectable()
export class PdfService {
  async generatePayslipPdf(payslip: any, employee: any, companyName: string = 'PeoplePay360'): Promise<Buffer> {
    const docDefinition: TDocumentDefinitions = {
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
              ...((payslip.lineItems || []) as any[]).map(item => [
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
        (pdfDoc as any).getBuffer((buffer: Buffer) => {
          resolve(buffer);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}
