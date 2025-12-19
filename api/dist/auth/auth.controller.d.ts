import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        success: boolean;
        data: import("./auth.service").AuthResult;
    }>;
    logout(): Promise<{
        success: boolean;
        message: string;
    }>;
    getMe(req: any): Promise<{
        success: boolean;
        data: any;
    }>;
    refresh(refreshTokenDto: RefreshTokenDto): Promise<{
        success: boolean;
        data: import("./auth.service").AuthResult;
    }>;
}
