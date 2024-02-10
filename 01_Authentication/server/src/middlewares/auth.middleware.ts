import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { prisma } from "../utils/prisma.client";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (
      !req.headers ||
      !req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer")
    ) {
      return res
        .status(401)
        .json({ message: "Authorization header is required" });
    }

    const accessToken = req.headers.authorization.split(" ")[1];

    const decodedUser = jwt.verify(
      accessToken,
      process.env.JWT_SECRET_KEY!
    ) as { id: string; name: string; email: string };

    const user = await prisma.user.findUnique({
      where: {
        email: decodedUser?.email,
      },
    });
    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    req.user = decodedUser;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
};
