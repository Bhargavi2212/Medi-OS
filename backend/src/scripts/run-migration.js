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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ormconfig_1 = __importDefault(require("../config/ormconfig"));
function runMigration() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('🔄 Initializing database connection...');
            yield ormconfig_1.default.initialize();
            console.log('✅ Database connected successfully');
            console.log('🔄 Running migrations...');
            yield ormconfig_1.default.runMigrations();
            console.log('✅ Migrations completed successfully');
            yield ormconfig_1.default.destroy();
            console.log('🔌 Database connection closed');
        }
        catch (error) {
            console.error('❌ Migration failed:', error);
            process.exit(1);
        }
    });
}
runMigration();
