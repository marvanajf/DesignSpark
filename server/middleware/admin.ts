import { Request, Response, NextFunction } from "express";

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Authentication required" });
  }
  
  // Check if user has admin role
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  
  next();
}