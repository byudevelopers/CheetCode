import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';

export const validateSchema = (schema: ZodObject) =>
    (req: Request, res: Response, next: NextFunction) => {
        try {
            // 1. Attempt to parse the request body
            schema.parse(req.body);

            // 2. If successful, pass control to the next handler/route
            next();
            return;
        } catch (error) {
            if (error instanceof ZodError) {
                // 3. If validation fails, return a 400 Bad Request
                return res.status(400).json({
                    message: 'Validation failed',
                    errors: error.issues.map(issue => ({
                        field: issue.path.join('.'),
                        message: issue.message,
                    })),
                });
            }
            // Handle other potential errors
            next(error);
            return;
        }
    };



