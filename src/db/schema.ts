import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const stacks = sqliteTable("stacks", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  config: text("config").notNull(),
  category: text("category"),
  deviceId: text("device_id").notNull(),
  isPublished: integer("is_published", { mode: "boolean" }).notNull().default(false),
  isPreset: integer("is_preset", { mode: "boolean" }).notNull().default(false),
  likesCount: integer("likes_count").notNull().default(0),
  savesCount: integer("saves_count").notNull().default(0),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const stackLikes = sqliteTable("stack_likes", {
  stackId: text("stack_id")
    .notNull()
    .references(() => stacks.id, { onDelete: "cascade" }),
  deviceId: text("device_id").notNull(),
});

export const stackSaves = sqliteTable("stack_saves", {
  stackId: text("stack_id")
    .notNull()
    .references(() => stacks.id, { onDelete: "cascade" }),
  deviceId: text("device_id").notNull(),
});
