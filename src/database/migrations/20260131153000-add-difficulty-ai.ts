import type { QueryInterface } from "sequelize";

export async function up(queryInterface: QueryInterface, Sequelize: any) {
  await queryInterface.addColumn("flashcards", "difficulty", {
    type: Sequelize.STRING(10),
    allowNull: false,
    defaultValue: "medium"
  });

  await queryInterface.addColumn("quizzes", "difficulty", {
    type: Sequelize.STRING(10),
    allowNull: false,
    defaultValue: "medium"
  });
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.removeColumn("flashcards", "difficulty");
  await queryInterface.removeColumn("quizzes", "difficulty");
}
