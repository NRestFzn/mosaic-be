import type { QueryInterface } from "sequelize";

export async function up(queryInterface: QueryInterface, Sequelize: any) {
  await queryInterface.createTable("notifications", {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4
    },
    userId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: { model: "users", key: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    },
    materialId: {
      type: Sequelize.UUID,
      allowNull: true,
      references: { model: "materials", key: "id" },
      onDelete: "SET NULL",
      onUpdate: "CASCADE"
    },
    title: {
      type: Sequelize.STRING(200),
      allowNull: false
    },
    body: {
      type: Sequelize.TEXT("long"),
      allowNull: true
    },
    scheduledAt: {
      type: Sequelize.DATE,
      allowNull: false
    },
    sentAt: {
      type: Sequelize.DATE,
      allowNull: true
    },
    status: {
      type: Sequelize.STRING(50),
      allowNull: false,
      defaultValue: "pending"
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false
    }
  });
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.dropTable("notifications");
}
