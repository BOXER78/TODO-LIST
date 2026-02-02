import { NextFunction, Request, Response } from "express";

// Very simple header-based auth for demonstration:
// Client must send: Authorization: Bearer <API_KEY>
// where API_KEY is stored in process.env.API_KEY

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  const expectedKey = process.env.API_KEY;

  if (!expectedKey) {
    // If no key configured, allow all requests (useful for local dev)
    return next();
  }

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const token = authHeader.substring("Bearer ".length);

  if (token !== expectedKey) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }

  next();
}


