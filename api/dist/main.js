"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const helmet_1 = __importDefault(require("helmet"));
const path_1 = require("path");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const logging_interceptor_1 = require("./common/interceptors/logging.interceptor");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const logger = new common_1.Logger('Bootstrap');
    const configService = app.get(config_1.ConfigService);
    const port = configService.get('PORT', 3001);
    const nodeEnv = configService.get('NODE_ENV', 'development');
    const frontendUrl = configService.get('FRONTEND_URL', 'http://localhost:3000');
    const allowedOrigins = frontendUrl.split(',').map(url => url.trim()).filter(Boolean);
    app.enableCors({
        origin: allowedOrigins,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    });
    app.use((0, helmet_1.default)({
        crossOriginResourcePolicy: { policy: 'cross-origin' },
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                imgSrc: ["'self'", 'data:', 'https:'],
                scriptSrc: ["'self'", "'unsafe-inline'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
            },
        },
    }));
    app.setGlobalPrefix('api');
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.useGlobalInterceptors(new logging_interceptor_1.LoggingInterceptor());
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const uploadPath = configService.get('UPLOAD_PATH', './uploads');
    app.useStaticAssets((0, path_1.join)(process.cwd(), uploadPath), {
        prefix: '/uploads',
    });
    await app.listen(port);
    logger.log('='.repeat(50));
    logger.log(`🚀 Server running on port ${port}`);
    logger.log(`📝 Environment: ${nodeEnv}`);
    logger.log(`🌐 Frontend URL: ${frontendUrl}`);
    logger.log(`📦 API prefix: /api`);
    logger.log(`🏥 Health check: http://localhost:${port}/api/health`);
    logger.log('='.repeat(50));
}
bootstrap();
//# sourceMappingURL=main.js.map