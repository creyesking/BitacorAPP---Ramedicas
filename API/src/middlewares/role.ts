import { Request, Response, NextFunction } from 'express';

export const checkRole = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { role } = req['user'];
    roles.includes(role) ? next() : res.status(403).json();
  };
};
