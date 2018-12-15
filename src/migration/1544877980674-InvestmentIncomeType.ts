import {MigrationInterface, QueryRunner} from "typeorm";

export class InvestmentIncomeType1544877980674 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.query(`ALTER TABLE "Investment" ADD COLUMN "incomeType" VARCHAR`);
    }
 
    public async down(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.query(`ALTER TABLE "Investment" DROP COLUMN "incomeType"`);
    }

}
