import express from "express";
import type { Request, Response } from "express";

export const server = express();

server.use(express.json());

server.get("/", (_req: Request, res: Response) => {
  res.status(200).json({ message: "¡Hola Mundo! 🌎" });
});

server.post("/echo", (req: Request, res: Response) => {
  res.status(200).json({ data: req.body });
});
