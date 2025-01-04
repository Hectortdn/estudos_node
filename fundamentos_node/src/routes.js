import { DataBase } from "./database/database.js";
import { randomUUID } from "node:crypto";
import { buildRoutePath } from "./utils/buildRoutePath.js";

const database = new DataBase();

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (_, res) => {
      const tasks = database.select("tasks");

      return res.end(JSON.stringify(tasks));
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      if (!req.body?.title) {
        return res
          .writeHead(400)
          .end(JSON.stringify({ message: "title is required" }));
      }

      if (!req.body?.description) {
        return res
          .writeHead(400)
          .end(JSON.stringify({ message: "description is required" }));
      }

      const { title, description } = req.body;

      const task = {
        title,
        description,
        id: randomUUID(),
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      database.insert("tasks", task);

      return res.writeHead(201).end(JSON.stringify(task));
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;

      if (!title && !description) {
        return res
          .writeHead(400)
          .end(
            JSON.stringify({ message: "title or description are required" })
          );
      }

      const [task] = database.select("tasks", { id });
      database.update("tasks", id, {
        title: title ?? task.title,
        description: description ?? task.description,
        updated_at: new Date(),
      });

      return res.writeHead(204).end();
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;

      const [task] = database.select("tasks", { id });

      if (!task) {
        return res.writeHead(404).end();
      }

      database.delete("tasks", id);
      return res.writeHead(204).end();
    },
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handler: (req, res) => {
      const { id } = req.params;

      const [task] = database.select("tasks", { id });

      if (!task) {
        return res.writeHead(404).end();
      }

      const isTaskCompleted = !!task.completed_at;
      const completed_at = isTaskCompleted ? isTaskCompleted : new Date();

      database.update("tasks", id, { completed_at });

      return res.writeHead(204).end();
    },
  },
];
