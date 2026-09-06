"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const audit_logs_service_1 = require("./audit-logs.service");
describe('AuditLogsService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [audit_logs_service_1.AuditLogsService],
        }).compile();
        service = module.get(audit_logs_service_1.AuditLogsService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=audit-logs.service.spec.js.map