import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Avatar,
    Grid,
    Divider,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    Chip,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    IconButton
} from '@mui/material';
import {
    Person,
    Security,
    Edit,
    Save,
    Cancel,
    Visibility,
    VisibilityOff,
    QrCode,
    Smartphone,
    Key,
    Badge
} from '@mui/icons-material';
import { useNotify } from 'react-admin';
import { authProvider } from '../auth/authProvider';
import { UserPermissionsInfo } from '../components/PermissionGuard';

interface ProfileData {
    id: string;
    username: string;
    email: string;
    fullName: string;
    role: 'SUPER_ADMIN' | 'ADMINISTRATOR' | 'MANAGER' | 'CRM_MANAGER';
    permissions: string[];
    avatar?: string;
    active: boolean;
    twoFactorEnabled: boolean;
    lastLogin?: string;
    createdAt: string;
}

interface PasswordChangeData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

const ProfilePage: React.FC = () => {
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [editData, setEditData] = useState<Partial<ProfileData>>({});
    const [passwordData, setPasswordData] = useState<PasswordChangeData>({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
    const [twoFactorDialogOpen, setTwoFactorDialogOpen] = useState(false);
    const [twoFactorSetup, setTwoFactorSetup] = useState<any>(null);
    const [twoFactorCode, setTwoFactorCode] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    const notify = useNotify();

    // Загрузка данных профиля
    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const user = authProvider.getCurrentUser();
            if (user) {
                setProfile(user);
                setEditData({
                    fullName: user.fullName,
                    email: user.email
                });
            }
        } catch (error) {
            console.error('Ошибка загрузки профиля:', error);
            notify('Ошибка загрузки профиля', { type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    // Сохранение изменений профиля
    const handleSaveProfile = async () => {
        if (!profile) return;

        try {
            setActionLoading(true);

            await authProvider.updateProfile(editData);

            // Обновляем локальные данные
            setProfile(prev => prev ? { ...prev, ...editData } : null);
            setEditMode(false);

            notify('Профиль успешно обновлен', { type: 'success' });
        } catch (error: any) {
            console.error('Ошибка обновления профиля:', error);
            notify(error.message || 'Ошибка обновления профиля', { type: 'error' });
        } finally {
            setActionLoading(false);
        }
    };

    // Смена пароля
    const handlePasswordChange = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            notify('Пароли не совпадают', { type: 'error' });
            return;
        }

        if (passwordData.newPassword.length < 6) {
            notify('Пароль должен содержать минимум 6 символов', { type: 'error' });
            return;
        }

        try {
            setActionLoading(true);

            await authProvider.changePassword(
                passwordData.currentPassword,
                passwordData.newPassword
            );

            setPasswordDialogOpen(false);
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });

            notify('Пароль успешно изменен', { type: 'success' });
        } catch (error: any) {
            console.error('Ошибка смены пароля:', error);
            notify(error.message || 'Ошибка смены пароля', { type: 'error' });
        } finally {
            setActionLoading(false);
        }
    };

    // Настройка 2FA
    const handleSetup2FA = async () => {
        try {
            setActionLoading(true);

            const setup = await authProvider.setup2FA();
            setTwoFactorSetup(setup);
            setTwoFactorDialogOpen(true);

        } catch (error: any) {
            console.error('Ошибка настройки 2FA:', error);
            notify(error.message || 'Ошибка настройки 2FA', { type: 'error' });
        } finally {
            setActionLoading(false);
        }
    };

    // Подтверждение 2FA
    const handleVerify2FA = async () => {
        if (!twoFactorCode || twoFactorCode.length !== 6) {
            notify('Введите 6-значный код', { type: 'error' });
            return;
        }

        try {
            setActionLoading(true);

            await authProvider.verify2FA(twoFactorCode);

            // Обновляем статус 2FA
            setProfile(prev => prev ? { ...prev, twoFactorEnabled: true } : null);

            setTwoFactorDialogOpen(false);
            setTwoFactorCode('');
            setTwoFactorSetup(null);

            notify('Двухфакторная аутентификация включена', { type: 'success' });
        } catch (error: any) {
            console.error('Ошибка верификации 2FA:', error);
            notify(error.message || 'Неверный код верификации', { type: 'error' });
        } finally {
            setActionLoading(false);
        }
    };

    // Отключение 2FA
    const handleDisable2FA = async () => {
        if (!twoFactorCode || twoFactorCode.length !== 6) {
            notify('Введите 6-значный код для отключения', { type: 'error' });
            return;
        }

        try {
            setActionLoading(true);

            await authProvider.disable2FA(twoFactorCode);

            // Обновляем статус 2FA
            setProfile(prev => prev ? { ...prev, twoFactorEnabled: false } : null);

            setTwoFactorDialogOpen(false);
            setTwoFactorCode('');

            notify('Двухфакторная аутентификация отключена', { type: 'success' });
        } catch (error: any) {
            console.error('Ошибка отключения 2FA:', error);
            notify(error.message || 'Ошибка отключения 2FA', { type: 'error' });
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    if (!profile) {
        return (
            <Alert severity="error">
                Не удалось загрузить данные профиля
            </Alert>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Мой профиль
            </Typography>

            <Grid container spacing={3}>
                {/* Основная информация */}
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center" gap={2} mb={3}>
                                <Avatar sx={{ width: 80, height: 80 }}>
                                    {profile.avatar ? (
                                        <img src={profile.avatar} alt={profile.fullName} />
                                    ) : (
                                        <Person sx={{ fontSize: 40 }} />
                                    )}
                                </Avatar>
                                <Box>
                                    <Typography variant="h5">
                                        {profile.fullName}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        @{profile.username}
                                    </Typography>
                                    <Box display="flex" gap={1} mt={1}>
                                        <Chip
                                            icon={<Badge />}
                                            label={getRoleDisplayName(profile.role)}
                                            size="small"
                                            color="primary"
                                        />
                                        {profile.twoFactorEnabled && (
                                            <Chip
                                                icon={<Security />}
                                                label="2FA"
                                                size="small"
                                                color="success"
                                            />
                                        )}
                                    </Box>
                                </Box>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Полное имя"
                                        value={editMode ? editData.fullName || '' : profile.fullName}
                                        onChange={(e) => setEditData(prev => ({ ...prev, fullName: e.target.value }))}
                                        disabled={!editMode}
                                        variant={editMode ? 'outlined' : 'standard'}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        value={editMode ? editData.email || '' : profile.email}
                                        onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                                        disabled={!editMode}
                                        variant={editMode ? 'outlined' : 'standard'}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Логин"
                                        value={profile.username}
                                        disabled
                                        variant="standard"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Дата создания"
                                        value={new Date(profile.createdAt).toLocaleDateString()}
                                        disabled
                                        variant="standard"
                                    />
                                </Grid>
                            </Grid>

                            <Box display="flex" gap={2} mt={3}>
                                {editMode ? (
                                    <>
                                        <Button
                                            variant="contained"
                                            startIcon={<Save />}
                                            onClick={handleSaveProfile}
                                            disabled={actionLoading}
                                        >
                                            Сохранить
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            startIcon={<Cancel />}
                                            onClick={() => {
                                                setEditMode(false);
                                                setEditData({
                                                    fullName: profile.fullName,
                                                    email: profile.email
                                                });
                                            }}
                                        >
                                            Отмена
                                        </Button>
                                    </>
                                ) : (
                                    <Button
                                        variant="contained"
                                        startIcon={<Edit />}
                                        onClick={() => setEditMode(true)}
                                    >
                                        Редактировать
                                    </Button>
                                )}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Боковая панель */}
                <Grid item xs={12} md={4}>
                    {/* Безопасность */}
                    <Card sx={{ mb: 2 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                <Security sx={{ mr: 1, verticalAlign: 'middle' }} />
                                Безопасность
                            </Typography>

                            <List dense>
                                <ListItem>
                                    <ListItemIcon>
                                        <Key />
                                    </ListItemIcon>
                                    <ListItemText primary="Пароль" secondary="Изменить пароль" />
                                    <Button
                                        size="small"
                                        onClick={() => setPasswordDialogOpen(true)}
                                    >
                                        Изменить
                                    </Button>
                                </ListItem>

                                <ListItem>
                                    <ListItemIcon>
                                        <Smartphone />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="2FA"
                                        secondary={profile.twoFactorEnabled ? "Включена" : "Отключена"}
                                    />
                                    <Button
                                        size="small"
                                        color={profile.twoFactorEnabled ? "error" : "primary"}
                                        onClick={() => {
                                            if (profile.twoFactorEnabled) {
                                                setTwoFactorDialogOpen(true);
                                            } else {
                                                handleSetup2FA();
                                            }
                                        }}
                                        disabled={actionLoading}
                                    >
                                        {profile.twoFactorEnabled ? "Отключить" : "Настроить"}
                                    </Button>
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>

                    {/* Разрешения */}
                    <Card>
                        <CardContent>
                            <UserPermissionsInfo />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Диалог смены пароля */}
            <Dialog open={passwordDialogOpen} onClose={() => setPasswordDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Изменить пароль</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 1 }}>
                        <TextField
                            fullWidth
                            label="Текущий пароль"
                            type={showPassword ? 'text' : 'password'}
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                            margin="normal"
                            InputProps={{
                                endAdornment: (
                                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                )
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Новый пароль"
                            type={showPassword ? 'text' : 'password'}
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                            margin="normal"
                            helperText="Минимум 6 символов"
                        />
                        <TextField
                            fullWidth
                            label="Подтвердите новый пароль"
                            type={showPassword ? 'text' : 'password'}
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            margin="normal"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setPasswordDialogOpen(false)}>
                        Отмена
                    </Button>
                    <Button
                        onClick={handlePasswordChange}
                        variant="contained"
                        disabled={actionLoading}
                    >
                        {actionLoading ? <CircularProgress size={20} /> : 'Изменить'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Диалог 2FA */}
            <Dialog open={twoFactorDialogOpen} onClose={() => setTwoFactorDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {profile.twoFactorEnabled ? 'Отключить 2FA' : 'Настроить 2FA'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 1 }}>
                        {!profile.twoFactorEnabled && twoFactorSetup && (
                            <>
                                <Alert severity="info" sx={{ mb: 2 }}>
                                    Отсканируйте QR код в приложении Google Authenticator или Authy
                                </Alert>
                                <Box textAlign="center" mb={2}>
                                    <QrCode sx={{ fontSize: 100, color: 'primary.main' }} />
                                    <Typography variant="body2" mt={1}>
                                        QR код для настройки
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary" mb={2}>
                                    Или введите этот код вручную: <strong>{twoFactorSetup.secret}</strong>
                                </Typography>
                            </>
                        )}

                        <TextField
                            fullWidth
                            label="Код из приложения"
                            value={twoFactorCode}
                            onChange={(e) => setTwoFactorCode(e.target.value)}
                            inputProps={{
                                maxLength: 6,
                                pattern: '[0-9]*',
                                inputMode: 'numeric'
                            }}
                            helperText="Введите 6-значный код"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setTwoFactorDialogOpen(false)}>
                        Отмена
                    </Button>
                    <Button
                        onClick={profile.twoFactorEnabled ? handleDisable2FA : handleVerify2FA}
                        variant="contained"
                        color={profile.twoFactorEnabled ? "error" : "primary"}
                        disabled={actionLoading}
                    >
                        {actionLoading ? (
                            <CircularProgress size={20} />
                        ) : (
                            profile.twoFactorEnabled ? 'Отключить' : 'Включить'
                        )}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

// Утилиты
const getRoleDisplayName = (role: string): string => {
    const roleNames: Record<string, string> = {
        'SUPER_ADMIN': 'Супер администратор',
        'ADMINISTRATOR': 'Администратор',
        'MANAGER': 'Менеджер',
        'CRM_MANAGER': 'CRM менеджер'
    };

    return roleNames[role] || role;
};

export default ProfilePage;