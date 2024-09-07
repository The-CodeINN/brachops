import { type Request, type Response, type NextFunction } from "express";
import { type AnyZodObject } from "zod";
import { log } from "$/utils/logger";

const validateResource =
  (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      log.error(error);
      next(error); // Pass the error to the next middleware
    }
  };

export { validateResource };
