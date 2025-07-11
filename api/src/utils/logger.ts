import winston from 'winston';
import path from 'path';
import fs from 'fs';

const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

const customFormat = winston.format.combine(
    winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ level, message, timestamp, stack, ...meta }) => {
        let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;

        if (Object.keys(meta).length > 0) {
            log += ` ${JSON.stringify(meta)}`;
        }

        if (stack) {
            log += `\n${stack}`;
        }

        return log;
    })
);

const transports: winston.transport[] = [
    // Консоль
    new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            customFormat
        ),
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug'
    })
];

if (process.env.NODE_ENV === 'production' || process.env.LOG_TO_FILE === 'true') {
    // Общий лог файл
    transports.push(
        new winston.transports.File({
            filename: path.join(logsDir, 'app.log'),
            format: customFormat,
            maxsize: 5242880, // 5MB
            maxFiles: 5,
            level: 'info'
        })
    );

    transports.push(
        new winston.transports.File({
            filename: path.join(logsDir, 'error.log'),
            format: customFormat,
            maxsize: 5242880, // 5MB
            maxFiles: 5,
            level: 'error'
        })
    );

    transports.push(
        new winston.transports.File({
            filename: path.join(logsDir, 'access.log'),
            format: customFormat,
            maxsize: 5242880, // 5MB
            maxFiles: 10,
            level: 'http'
        })
    );
}

export const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: customFormat,
    transports,
    // Отключаем выход при необработанных исключениях
    exitOnError: false
});

logger.exceptions.handle(
    new winston.transports.File({
        filename: path.join(logsDir, 'exceptions.log')
    })
);

logger.rejections.handle(
    new winston.transports.File({
        filename: path.join(logsDir, 'rejections.log')
    })
);

export const httpLogger = logger.child({ service: 'http' });
export const dbLogger = logger.child({ service: 'database' });
export const authLogger = logger.child({ service: 'auth' });
export const apiLogger = logger.child({ service: 'api' });

export const logInfo = (message: string, meta?: any) => {
    logger.info(message, meta);
};

export const logError = (message: string, error?: Error | any, meta?: any) => {
    if (error instanceof Error) {
        logger.error(message, {
            error: error.message,
            stack: error.stack,
            ...meta
        });
    } else {
        logger.error(message, { error, ...meta });
    }
};

export const logWarn = (message: string, meta?: any) => {
    logger.warn(message, meta);
};

export const logDebug = (message: string, meta?: any) => {
    logger.debug(message, meta);
};

export const logHttp = (message: string, meta?: any) => {
    httpLogger.http(message, meta);
};

export const requestLogger = (req: any, res: any, next: any) => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        const { method, url, ip } = req;
        const { statusCode } = res;

        logHttp(`${method} ${url}`, {
            method,
            url,
            statusCode,
            duration: `${duration}ms`,
            ip,
            userAgent: req.get('User-Agent')
        });
    });

    next();
};

export const logDatabaseQuery = (query: string, duration: number, params?: any) => {
    dbLogger.debug('Database query executed', {
        query,
        duration: `${duration}ms`,
        params
    });
};

export const logUserAction = (
    userId: string,
    action: string,
    details?: any,
    ip?: string
) => {
    authLogger.info(`User action: ${action}`, {
        userId,
        action,
        details,
        ip,
        timestamp: new Date().toISOString()
    });
};

export const logApiError = (
    error: Error,
    req?: any,
    context?: string
) => {
    const errorInfo: any = {
        message: error.message,
        stack: error.stack,
        context
    };

    if (req) {
        errorInfo.request = {
            method: req.method,
            url: req.url,
            headers: req.headers,
            body: req.body,
            params: req.params,
            query: req.query,
            ip: req.ip,
            userAgent: req.get('User-Agent')
        };

        if (req.user) {
            errorInfo.user = {
                id: req.user.id,
                email: req.user.email,
                role: req.user.role
            };
        }
    }

    apiLogger.error('API Error', errorInfo);
};