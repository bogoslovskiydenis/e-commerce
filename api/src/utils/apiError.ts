export class ApiError extends Error {
    public statusCode: number;
    public isOperational: boolean;
    public details?: any;

    constructor(
        statusCode: number,
        message: string,
        details?: any,
        isOperational = true,
        stack = ''
    ) {
        super(message);

        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.details = details;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }

    /**
     *  Bad Request (400)
     */
    static badRequest(message: string, details?: any): ApiError {
        return new ApiError(400, message, details);
    }

    /**
     * Unauthorized (401)
     */
    static unauthorized(message: string = 'Unauthorized'): ApiError {
        return new ApiError(401, message);
    }

    /**
     * Forbidden (403)
     */
    static forbidden(message: string = 'Forbidden'): ApiError {
        return new ApiError(403, message);
    }

    /**
     *  Not Found (404)
     */
    static notFound(message: string = 'Resource not found'): ApiError {
        return new ApiError(404, message);
    }

    /**
     *  Conflict (409)
     */
    static conflict(message: string, details?: any): ApiError {
        return new ApiError(409, message, details);
    }

    /**
     * Unprocessable Entity (422)
     */
    static unprocessableEntity(message: string, details?: any): ApiError {
        return new ApiError(422, message, details);
    }

    /**
     * Too Many Requests (429)
     */
    static tooManyRequests(message: string = 'Too many requests'): ApiError {
        return new ApiError(429, message);
    }

    /**
     * Internal Server Error (500)
     */
    static internal(message: string = 'Internal server error'): ApiError {
        return new ApiError(500, message);
    }

    /**
     * Service Unavailable (503)
     */
    static serviceUnavailable(message: string = 'Service unavailable'): ApiError {
        return new ApiError(503, message);
    }

    /**
     * Преобразовать в JSON для ответа
     */
    toJSON() {
        return {
            success: false,
            error: {
                message: this.message,
                statusCode: this.statusCode,
                details: this.details
            }
        };
    }
}

/**
 * Проверка, является ли ошибка операционной
 */
export const isOperationalError = (error: Error): boolean => {
    if (error instanceof ApiError) {
        return error.isOperational;
    }
    return false;
};