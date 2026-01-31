import type { QueryInterface } from "sequelize";

export async function up(queryInterface: QueryInterface, Sequelize: any) {
  await queryInterface.addColumn("flashcards", "correctAnswer", {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  });
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.removeColumn("flashcards", "correctAnswer");
}
