import { Request, Response, NextFunction } from 'express';

const errorHandler = (err: any, _req: Request, res: Response, next: NextFunction): any => {
  if (res.headersSent) return next(err);
  const status = err && err.status ? err.status : 500;
  res.status(status).json({ error: err.message || 'Internal server error' });
};

export default errorHandler;