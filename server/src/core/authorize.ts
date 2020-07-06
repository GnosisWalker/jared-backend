import type { Response, NextFunction } from "express";
import RequestWithUser from "../types/requestWithUser";

function isString(value: any) {
  return typeof value === "string";
}

export type RequiredRoles = string | Array<string>;

/**
 * Role authorization middleware
 */
export default function (required: RequiredRoles) {
  let requiredRoles: Array<Array<string>>;
  if (typeof required === "string") {
    requiredRoles = [[required]];
  } else if (Array.isArray(required) && required.every(isString)) {
    requiredRoles = [required];
  }

  const _middleware = (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ): void => {
    const user = req.user;

    if (!user) {
      res.status(401).json({ message: "Logged out" });
      return;
    }

    const roles = user.roles;

    var sufficient = requiredRoles.some((r) => {
      r.every((role) => roles.indexOf(role) !== -1);
      return;
    });
    if (!sufficient) {
      res.status(403).json({ message: "Forbidden" });
    } else {
      next();
    }
  };

  return _middleware;
}
