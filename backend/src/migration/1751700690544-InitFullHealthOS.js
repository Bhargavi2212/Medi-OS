"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitFullHealthOS1751700690544 = void 0;
class InitFullHealthOS1751700690544 {
    constructor() {
        this.name = 'InitFullHealthOS1751700690544';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "hospitals" ADD CONSTRAINT "UQ_367c6e851f1d204e0f93688a3b8" UNIQUE ("branch_code")`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "hospitals" DROP CONSTRAINT "UQ_367c6e851f1d204e0f93688a3b8"`);
        });
    }
}
exports.InitFullHealthOS1751700690544 = InitFullHealthOS1751700690544;
