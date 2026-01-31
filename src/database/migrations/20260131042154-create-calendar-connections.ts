import type { QueryInterface } from "sequelize";

export async function up(queryInterface: QueryInterface, Sequelize: any) {
  await queryInterface.createTable("calendar_connections", {
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
    provider: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    accessToken: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    refreshToken: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    expiryDate: {
      type: Sequelize.BIGINT,
      allowNull: true
    },
    scope: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    tokenType: {
      type: Sequelize.STRING(50),
      allowNull: true
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
  await queryInterface.dropTable("calendar_connections");
}
