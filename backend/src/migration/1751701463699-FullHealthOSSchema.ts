import { MigrationInterface, QueryRunner } from "typeorm";

export class FullHealthOSSchema1751701463699 implements MigrationInterface {
    name = 'FullHealthOSSchema1751701463699'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "patients" ("id" SERIAL NOT NULL, "abha_id" character varying, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "dob" date NOT NULL, "gender" character varying NOT NULL, "contact_number" character varying NOT NULL, "email" character varying, "address" character varying, "blood_group" character varying, "allergies" text array, "existing_conditions" text array, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "hospital_id" integer NOT NULL, CONSTRAINT "UQ_66bb100f2f13eaa53d6100e6e5c" UNIQUE ("abha_id"), CONSTRAINT "PK_a7f0b9fcbb3469d5ec0b0aceaa7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_48521ad09d7391fb1f88f390b3" ON "patients" ("hospital_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_66bb100f2f13eaa53d6100e6e5" ON "patients" ("abha_id") `);
        await queryRunner.query(`CREATE TYPE "public"."appointments_status_enum" AS ENUM('scheduled', 'checked_in', 'in_consult', 'completed', 'cancelled', 'no_show')`);
        await queryRunner.query(`CREATE TABLE "appointments" ("id" SERIAL NOT NULL, "appointment_time" TIMESTAMP NOT NULL, "status" "public"."appointments_status_enum" NOT NULL, "notes" character varying, "is_deleted" boolean NOT NULL DEFAULT false, "deleted_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "patient_id" integer NOT NULL, "doctor_id" integer NOT NULL, "hospital_id" integer NOT NULL, CONSTRAINT "PK_4a437a9a27e948726b8bb3e36ad" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_2d30747bbf78f942f465d4c73d" ON "appointments" ("hospital_id") `);
        await queryRunner.query(`CREATE TABLE "documents" ("id" SERIAL NOT NULL, "type" character varying NOT NULL, "category" character varying, "tags" text array, "file_path" character varying NOT NULL, "summary" character varying, "is_deleted" boolean NOT NULL DEFAULT false, "deleted_at" TIMESTAMP, "uploaded_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "patient_id" integer NOT NULL, "uploaded_by" integer NOT NULL, "hospital_id" integer NOT NULL, CONSTRAINT "PK_ac51aa5181ee2036f5ca482857c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_12a69a7e9c79aa91db029491b7" ON "documents" ("hospital_id") `);
        await queryRunner.query(`CREATE TABLE "audit_logs" ("id" SERIAL NOT NULL, "action" character varying NOT NULL, "details" character varying, "timestamp" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer NOT NULL, "hospital_id" integer NOT NULL, CONSTRAINT "PK_1bb179d048bbc581caa3b013439" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_01b46ffa8bbbecbfc17111b6f9" ON "audit_logs" ("hospital_id") `);
        await queryRunner.query(`CREATE TABLE "roles" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_hospitals" ("id" SERIAL NOT NULL, "is_primary" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer NOT NULL, "hospital_id" integer NOT NULL, "role_id" integer NOT NULL, CONSTRAINT "PK_66acc2da12b992fabad76baedf9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b579e0a3507189aa24aaf4b6c4" ON "user_hospitals" ("hospital_id") `);
        await queryRunner.query(`CREATE TABLE "permissions" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_48ce552495d14eae9b187bb6716" UNIQUE ("name"), CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role_permissions" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "role_id" integer NOT NULL, "permission_id" integer NOT NULL, CONSTRAINT "PK_84059017c90bfcb701b8fa42297" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "patients" ADD CONSTRAINT "FK_48521ad09d7391fb1f88f390b35" FOREIGN KEY ("hospital_id") REFERENCES "hospitals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD CONSTRAINT "FK_3330f054416745deaa2cc130700" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD CONSTRAINT "FK_4cf26c3f972d014df5c68d503d2" FOREIGN KEY ("doctor_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD CONSTRAINT "FK_2d30747bbf78f942f465d4c73da" FOREIGN KEY ("hospital_id") REFERENCES "hospitals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "documents" ADD CONSTRAINT "FK_f06c282a41ed7987669c9c4e1f5" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "documents" ADD CONSTRAINT "FK_b9e28779ec77ff2223e2da41f6d" FOREIGN KEY ("uploaded_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "documents" ADD CONSTRAINT "FK_12a69a7e9c79aa91db029491b7c" FOREIGN KEY ("hospital_id") REFERENCES "hospitals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "audit_logs" ADD CONSTRAINT "FK_bd2726fd31b35443f2245b93ba0" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "audit_logs" ADD CONSTRAINT "FK_01b46ffa8bbbecbfc17111b6f9f" FOREIGN KEY ("hospital_id") REFERENCES "hospitals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_hospitals" ADD CONSTRAINT "FK_547deaf47b794648dfbfd3a5a4a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_hospitals" ADD CONSTRAINT "FK_b579e0a3507189aa24aaf4b6c43" FOREIGN KEY ("hospital_id") REFERENCES "hospitals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_hospitals" ADD CONSTRAINT "FK_bd5ec7479b704b828ea021b87b6" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_178199805b901ccd220ab7740ec" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_17022daf3f885f7d35423e9971e" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_17022daf3f885f7d35423e9971e"`);
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_178199805b901ccd220ab7740ec"`);
        await queryRunner.query(`ALTER TABLE "user_hospitals" DROP CONSTRAINT "FK_bd5ec7479b704b828ea021b87b6"`);
        await queryRunner.query(`ALTER TABLE "user_hospitals" DROP CONSTRAINT "FK_b579e0a3507189aa24aaf4b6c43"`);
        await queryRunner.query(`ALTER TABLE "user_hospitals" DROP CONSTRAINT "FK_547deaf47b794648dfbfd3a5a4a"`);
        await queryRunner.query(`ALTER TABLE "audit_logs" DROP CONSTRAINT "FK_01b46ffa8bbbecbfc17111b6f9f"`);
        await queryRunner.query(`ALTER TABLE "audit_logs" DROP CONSTRAINT "FK_bd2726fd31b35443f2245b93ba0"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP CONSTRAINT "FK_12a69a7e9c79aa91db029491b7c"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP CONSTRAINT "FK_b9e28779ec77ff2223e2da41f6d"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP CONSTRAINT "FK_f06c282a41ed7987669c9c4e1f5"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP CONSTRAINT "FK_2d30747bbf78f942f465d4c73da"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP CONSTRAINT "FK_4cf26c3f972d014df5c68d503d2"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP CONSTRAINT "FK_3330f054416745deaa2cc130700"`);
        await queryRunner.query(`ALTER TABLE "patients" DROP CONSTRAINT "FK_48521ad09d7391fb1f88f390b35"`);
        await queryRunner.query(`DROP TABLE "role_permissions"`);
        await queryRunner.query(`DROP TABLE "permissions"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b579e0a3507189aa24aaf4b6c4"`);
        await queryRunner.query(`DROP TABLE "user_hospitals"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_01b46ffa8bbbecbfc17111b6f9"`);
        await queryRunner.query(`DROP TABLE "audit_logs"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_12a69a7e9c79aa91db029491b7"`);
        await queryRunner.query(`DROP TABLE "documents"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2d30747bbf78f942f465d4c73d"`);
        await queryRunner.query(`DROP TABLE "appointments"`);
        await queryRunner.query(`DROP TYPE "public"."appointments_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_66bb100f2f13eaa53d6100e6e5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_48521ad09d7391fb1f88f390b3"`);
        await queryRunner.query(`DROP TABLE "patients"`);
    }

}
