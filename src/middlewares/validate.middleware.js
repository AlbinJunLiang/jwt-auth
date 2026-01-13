export const validate =
    (schema, property = 'body') =>
        (req, res, next) => {
            const result = schema.safeParse(req[property]);

            if (!result.success) {
                return res.status(422).json({
                    message: 'Validación fallida',
                    errors: result.error.flatten().fieldErrors,
                });
            }

            req[property] = result.data;
            next();
        };
