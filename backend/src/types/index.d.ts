import express from "express";
import type { JwtPayload } from "@/types/auth";

declare global {
  namespace Express {
    interface Request {
      auth: JwtPayload;
    }
  }
}
