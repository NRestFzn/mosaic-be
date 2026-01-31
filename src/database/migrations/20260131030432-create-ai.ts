import type { QueryInterface } from "sequelize";

export async function up(queryInterface: QueryInterface, Sequelize: any) {
  await queryInterface.createTable("materials", {
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
    title: {
      type: Sequelize.STRING(200),
      allowNull: false
    },
    sourceType: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    originalFilename: {
      type: Sequelize.STRING(255),
      allowNull: true
    },
    rawText: {
      type: Sequelize.TEXT("long"),
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

  await queryInterface.createTable("content_chunks", {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4
    },
    materialId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: { model: "materials", key: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    },
    content: {
      type: Sequelize.TEXT("long"),
      allowNull: false
    },
    embedding: {
      type: Sequelize.JSON,
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

  await queryInterface.createTable("summaries", {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4
    },
    materialId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: { model: "materials", key: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    },
    content: {
      type: Sequelize.TEXT("long"),
      allowNull: false
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

  await queryInterface.createTable("flashcards", {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4
    },
    materialId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: { model: "materials", key: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    },
    front: {
      type: Sequelize.TEXT("long"),
      allowNull: false
    },
    back: {
      type: Sequelize.TEXT("long"),
      allowNull: false
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

  await queryInterface.createTable("quizzes", {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4
    },
    materialId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: { model: "materials", key: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    },
    question: {
      type: Sequelize.TEXT("long"),
      allowNull: false
    },
    options: {
      type: Sequelize.JSON,
      allowNull: false
    },
    answer: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    explanation: {
      type: Sequelize.TEXT("long"),
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

  await queryInterface.createTable("flashcard_attempts", {
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
    flashcardId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: { model: "flashcards", key: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    },
    isCorrect: {
      type: Sequelize.BOOLEAN,
      allowNull: false
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

  await queryInterface.createTable("quiz_attempts", {
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
    quizId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: { model: "quizzes", key: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    },
    selectedAnswer: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    isCorrect: {
      type: Sequelize.BOOLEAN,
      allowNull: false
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

  await queryInterface.createTable("comprehension_scores", {
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
      allowNull: false,
      references: { model: "materials", key: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    },
    score: {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0
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
  await queryInterface.dropTable("comprehension_scores");
  await queryInterface.dropTable("quiz_attempts");
  await queryInterface.dropTable("flashcard_attempts");
  await queryInterface.dropTable("quizzes");
  await queryInterface.dropTable("flashcards");
  await queryInterface.dropTable("summaries");
  await queryInterface.dropTable("content_chunks");
  await queryInterface.dropTable("materials");
}
