import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    Alert,
    InputAdornment,
    IconButton,
    CircularProgress,
    Chip
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    Security,
    AdminPanelSettings,
    Login as LoginIcon
} from '@mui/icons-material';
import { useLogin, useNotify } from 'react-admin';

interface LoginFormData {
    username: string;
    password: string;
    twoFactorCode?: string;
}

const LoginPage: React.FC = () => {
    const [formData, setFormData] = useState<LoginFormData>({
        username: '',
        password: '',
        twoFactorCode: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [requiresTwoFactor, setRequiresTwoFactor] = useState(false);

    const login = useLogin();
    const notify = useNotify();

    const handleInputChange = (field: keyof LoginFormData) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.value
        }));

        // Очищаем ошибку при вводе
        if (error) {
            setError('');
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!formData.username.trim() || !formData.password.trim()) {
            setError('Заполните все обязательные поля');
            return;
        }

        if (requiresTwoFactor && !formData.twoFactorCode?.trim()) {
            setError('Введите код двухфакторной аутентификации');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const loginData: any = {
                username: formData.username.trim(),
                password: formData.password,
            };

            // Добавляем 2FA код только если он введен
            if (formData.twoFactorCode?.trim()) {
                loginData.twoFactorCode = formData.twoFactorCode.trim();
            }

            await login(loginData);

            // Успешный вход
            notify('Добро пожаловать!', { type: 'success' });

        } catch (error: any) {
            console.error('Ошибка входа:', error);

            let errorMessage = 'Ошибка входа в систему';

            if (error.message) {
                errorMessage = error.message;
            } else if (error.body?.message) {
                errorMessage = error.body.message;
            }

            // Проверяем, требуется ли 2FA
            if (errorMessage.includes('Требуется код двухфакторной аутентификации') ||
                errorMessage.includes('requiresTwoFactor')) {
                setRequiresTwoFactor(true);
                setError('');
                notify('Введите код из приложения аутентификации', { type: 'info' });
                setLoading(false);
                return;
            }

            setError(errorMessage);
            setLoading(false);

            // Если ошибка 2FA, но мы уже на этапе 2FA, сбрасываем
            if (requiresTwoFactor && errorMessage.includes('2FA')) {
                setFormData(prev => ({ ...prev, twoFactorCode: '' }));
            }
        }
    };

    const handleDemoLogin = (demoUser: 'admin' | 'manager' | 'operator') => {
        const demoCredentials = {
            admin: { username: 'admin', password: 'admin123' },
            manager: { username: 'manager', password: 'manager123' },
            operator: { username: 'operator', password: 'operator123' }
        };

        const credentials = demoCredentials[demoUser];
        setFormData(prev => ({
            ...prev,
            username: credentials.username,
            password: credentials.password
        }));
    };

    const resetForm = () => {
        setFormData({ username: '', password: '', twoFactorCode: '' });
        setRequiresTwoFactor(false);
        setError('');
        setLoading(false);
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: 2
            }}
        >
            <Card
                elevation={24}
                sx={{
                    width: '100%',
                    maxWidth: 400,
                    borderRadius: 3,
                    overflow: 'visible'
                }}
            >
                <CardContent sx={{ p: 4 }}>
                    {/* Заголовок */}
                    <Box textAlign="center" mb={3}>
                        <AdminPanelSettings
                            sx={{
                                fontSize: 48,
                                color: 'primary.main',
                                mb: 1
                            }}
                        />
                        <Typography variant="h4" component="h1" gutterBottom>
                            Админ панель
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Шарики - интернет магазин
                        </Typography>
                    </Box>

                    {/* Форма входа */}
                    <Box component="form" onSubmit={handleSubmit}>
                        {/* Ошибки */}
                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}

                        {/* 2FA уведомление */}
                        {requiresTwoFactor && (
                            <Alert severity="info" sx={{ mb: 2 }}>
                                <Typography variant="body2">
                                    Введите 6-значный код из приложения Google Authenticator или Authy
                                </Typography>
                            </Alert>
                        )}

                        {/* Поля формы */}
                        {!requiresTwoFactor ? (
                            <>
                                {/* Логин */}
                                <TextField
                                    fullWidth
                                    label="Логин или Email"
                                    value={formData.username}
                                    onChange={handleInputChange('username')}
                                    margin="normal"
                                    required
                                    autoComplete="username"
                                    autoFocus
                                    disabled={loading}
                                />

                                {/* Пароль */}
                                <TextField
                                    fullWidth
                                    label="Пароль"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={handleInputChange('password')}
                                    margin="normal"
                                    required
                                    autoComplete="current-password"
                                    disabled={loading}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                    disabled={loading}
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </>
                        ) : (
                            <>
                                {/* 2FA код */}
                                <TextField
                                    fullWidth
                                    label="Код аутентификации"
                                    value={formData.twoFactorCode}
                                    onChange={handleInputChange('twoFactorCode')}
                                    margin="normal"
                                    required
                                    autoFocus
                                    disabled={loading}
                                    inputProps={{
                                        maxLength: 6,
                                        pattern: '[0-9]*',
                                        inputMode: 'numeric'
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Security />
                                            </InputAdornment>
                                        )
                                    }}
                                    helperText="Введите 6-значный код из приложения аутентификации"
                                />
                            </>
                        )}

                        {/* Кнопки */}
                        <Box sx={{ mt: 3, mb: 2 }}>
                            {requiresTwoFactor ? (
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Button
                                        onClick={resetForm}
                                        disabled={loading}
                                        variant="outlined"
                                        sx={{ flex: 1 }}
                                    >
                                        Назад
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={loading}
                                        sx={{ flex: 2 }}
                                        startIcon={loading ? <CircularProgress size={20} /> : <LoginIcon />}
                                    >
                                        {loading ? 'Проверка...' : 'Войти'}
                                    </Button>
                                </Box>
                            ) : (
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    disabled={loading}
                                    startIcon={loading ? <CircularProgress size={20} /> : <LoginIcon />}
                                >
                                    {loading ? 'Вход...' : 'Войти'}
                                </Button>
                            )}
                        </Box>

                        {/* Демо кнопки */}
                        {!requiresTwoFactor && (
                            <Box>
                                <Typography variant="body2" color="text.secondary" align="center" mb={2}>
                                    Демо аккаунты для тестирования:
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                                    <Chip
                                        label="Админ"
                                        onClick={() => handleDemoLogin('admin')}
                                        disabled={loading}
                                        clickable
                                        size="small"
                                        color="primary"
                                    />
                                    <Chip
                                        label="Менеджер"
                                        onClick={() => handleDemoLogin('manager')}
                                        disabled={loading}
                                        clickable
                                        size="small"
                                        color="secondary"
                                    />
                                    <Chip
                                        label="Оператор"
                                        onClick={() => handleDemoLogin('operator')}
                                        disabled={loading}
                                        clickable
                                        size="small"
                                        color="info"
                                    />
                                </Box>
                                <Typography variant="caption" color="text.secondary" align="center" display="block" mt={1}>
                                    Для оператора потребуется 2FA код: 123456
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </CardContent>
            </Card>

            {/* Информация о системе */}
            <Box
                sx={{
                    position: 'absolute',
                    bottom: 16,
                    left: 16,
                    color: 'white',
                    opacity: 0.8
                }}
            >
                <Typography variant="caption">
                    Версия 1.0.0 | API интеграция
                </Typography>
            </Box>
        </Box>
    );
};

export default LoginPage;