import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMapQueriesTable1749583255790 implements MigrationInterface {
  name = 'CreateMapQueriesTable1749583255790';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "map_query" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "radius" integer, "longitude" double precision, "latitude" double precision, "inputText" character varying, "llmResponse" character varying, "llmModel" character varying, "status" character varying, "duration" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_3059ddb7f5266d422525da3d999" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "map_query" ADD CONSTRAINT "FK_fe182712983006ab84ef3e14924" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "map_query" DROP CONSTRAINT "FK_fe182712983006ab84ef3e14924"`,
    );
    await queryRunner.query(`DROP TABLE "map_query"`);
  }
}
