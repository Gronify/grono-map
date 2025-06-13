import { MigrationInterface, QueryRunner } from 'typeorm';

export class DeleteRadiousFromMapQueriesTable1749781978783
  implements MigrationInterface
{
  name = 'DeleteRadiousFromMapQueriesTable1749781978783';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "map_query" DROP COLUMN "radius"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "map_query" ADD "radius" integer`);
  }
}
