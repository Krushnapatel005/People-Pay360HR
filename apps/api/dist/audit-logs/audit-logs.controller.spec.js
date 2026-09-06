"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const audit_logs_controller_1 = require("./audit-logs.controller");
describe('AuditLogsController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [audit_logs_controller_1.AuditLogsController],
        }).compile();
        controller = module.get(audit_logs_controller_1.AuditLogsController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=audit-logs.controller.spec.js.map