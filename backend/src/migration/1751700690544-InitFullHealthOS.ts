import { MigrationInterface, QueryRunner } from "typeorm";

export class InitFullHealthOS1751700690544 implements MigrationInterface {
    name = 'InitFullHealthOS1751700690544'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hospitals" ADD CONSTRAINT "UQ_367c6e851f1d204e0f93688a3b8" UNIQUE ("branch_code")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hospitals" DROP CONSTRAINT "UQ_367c6e851f1d204e0f93688a3b8"`);
    }

}
