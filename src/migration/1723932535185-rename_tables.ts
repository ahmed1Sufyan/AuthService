import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameTables1723932535185 implements MigrationInterface {
    name = 'RenameTables1723932535185';
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "RefreshToken" DROP CONSTRAINT "FK_3a4d068289fa6c2038fb2101e5b"`,
        );
        await queryRunner.query(
            `CREATE TABLE "users" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" character varying NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "refreshTokens" ("id" SERIAL NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_c4a0078b846c2c4508473680625" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `ALTER TABLE "refreshTokens" ADD CONSTRAINT "FK_265bec4e500714d5269580a0219" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "refreshTokens" DROP CONSTRAINT "FK_265bec4e500714d5269580a0219"`,
        );
        await queryRunner.query(`DROP TABLE "refreshTokens"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }
}