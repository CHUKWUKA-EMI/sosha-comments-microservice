import {MigrationInterface, QueryRunner} from "typeorm";

export class commentsTable1653146776171 implements MigrationInterface {
    name = 'commentsTable1653146776171'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "comments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" character varying NOT NULL, "userFirstName" character varying NOT NULL, "userLastName" character varying NOT NULL, "userName" character varying NOT NULL, "userImageUrl" character varying, "postId" character varying NOT NULL, "comment" text NOT NULL, "numberOfReplies" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "comments"`);
    }

}
