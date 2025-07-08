import React, { useState } from 'react';
import {
    List,
    Datagrid,
    TextField,
    DateField,
    Edit,
    Create,
    SimpleForm,
    TextInput,
    SelectInput,
    ArrayInput,
    SimpleFormIterator,
    required,
    useRecordContext,
    TopToolbar,
    CreateButton,
    ExportButton,
    FunctionField,
    BooleanField,
    BooleanInput
} from 'react-admin';
import {
    Card,
    Typography,
    Box,
    Chip,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    IconButton,
    Tooltip,
    TextField as MuiTextField
} from '@mui/material';
import {
    Key,
    Visibility,
    VisibilityOff,
    ContentCopy,
    Warning,
    CheckCircle,
    Cancel
} from '@mui/icons-material';

// Интерфейс API ключа
interface ApiKey {
    id: string;
    name: string;
    key: string;
    type: 'public' | 'private' | 'webhook' | 'integration';
    permissions: string[];
    allowedIPs?: string[];
    rateLimit: number;
    active: boolean;
    lastUsed?: string;
    usageCount: number;
    expiresAt?: string;
    createdBy: string;
    createdAt: string;
}

// Компонент для отображения типа API ключа
const ApiKeyTypeField = () => {
    const record = useRecordContext();
    if (!record) return null;

    const getTypeInfo = (type: string) => {
        switch (type) {
            case 'public':
                return { label: 'Публичный', color: 'info', description: 'Для фронтенда' };
            case 'private':
                return { label: 'Приватный', color: 'warning', description: 'Для бэкенда' };
            case 'webhook':
                return { label: 'Webhook', color: 'success', description: 'Для уведомлений' };
            case 'integration':
                return { label: 'Интеграция', color: 'primary', description: 'Внешние сервисы' };
            default:
                return { label: type, color: 'default', description: '' };
        }
    };

    const typeInfo = getTypeInfo(record.type);

    return (
        <Tooltip title={typeInfo.description}>
            <Chip
                label={typeInfo.label}
                color={typeInfo.color as any}
                size="small"
                icon={<Key />}
            />
        </Tooltip>
    );
};

// Компонент для отображения статуса ключа
const ApiKeyStatusField = () => {
    const record = useRecordContext();
    if (!record) return null;

    const isExpired = record.expiresAt && new Date(record.expiresAt) < new Date();
    const isActive = record.active && !isExpired;

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
                label={isActive ? 'Активен' : isExpired ? 'Истёк' : 'Отключен'}
                color={isActive ? 'success' : 'error'}
                size="small"
                icon={isActive ? <CheckCircle /> : <Cancel />}
            />
            {record.lastUsed && (
                <Typography variant="caption" color="text.secondary">
                    Использован: {new Date(record.lastUsed).toLocaleDateString()}
                </Typography>
            )}
        </Box>
    );
};

// Компонент для безопасного отображения ключа
const SecureKeyField = () => {
    const record = useRecordContext();
    const [showKey, setShowKey] = useState(false);

    if (!record?.key) return null;

    const maskedKey = `${record.key.substring(0, 8)}${'*'.repeat(24)}${record.key.substring(-4)}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(record.key);
        // Здесь можно добавить уведомление о копировании
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
                variant="body2"
                sx={{
                    fontFamily: 'monospace',
                    backgroundColor: '#f5f5f5',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    minWidth: 200
                }}
            >
                {showKey ? record.key : maskedKey}
            </Typography>

            <IconButton
                size="small"
                onClick={() => setShowKey(!showKey)}
                title={showKey ? 'Скрыть ключ' : 'Показать ключ'}
            >
                {showKey ? <VisibilityOff /> : <Visibility />}
            </IconButton>

            <IconButton
                size="small"
                onClick={copyToClipboard}
                title="Копировать ключ"
            >
                <ContentCopy />
            </IconButton>
        </Box>
    );
};

// Модальное окно с новым API ключом
const NewApiKeyModal = ({ open, onClose, apiKey }: {
    open: boolean;
    onClose: () => void;
    apiKey?: string;
}) => (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Key />
                API ключ создан
            </Box>
        </DialogTitle>
        <DialogContent>
            <Alert severity="warning" sx={{ mb: 3 }}>
                Сохраните этот ключ в безопасном месте! Он больше не будет показан.
            </Alert>

            <Typography variant="subtitle2" gutterBottom>
                Ваш новый API ключ:
            </Typography>

            <MuiTextField
                fullWidth
                value={apiKey || ''}
                InputProps={{
                    readOnly: true,
                    style: { fontFamily: 'monospace' },
                    endAdornment: (
                        <IconButton
                            onClick={() => navigator.clipboard.writeText(apiKey || '')}
                            title="Копировать"
                        >
                            <ContentCopy />
                        </IconButton>
                    )
                }}
                sx={{ mb: 2 }}
            />

            <Typography variant="body2" color="text.secondary">
                Этот ключ предоставляет доступ к выбранным API endpoints согласно настроенным правам.
            </Typography>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose} variant="contained">
                Понятно
            </Button>
        </DialogActions>
    </Dialog>
);

// Список API ключей
export const ApiKeyList = () => (
    <List
        title="API ключи"
        sort={{ field: 'createdAt', order: 'DESC' }}
        perPage={25}
        actions={
            <TopToolbar>
                <CreateButton />
                <ExportButton />
            </TopToolbar>
        }
    >
        <Datagrid rowClick="edit">
            <TextField source="name" label="Название" />
            <FunctionField label="Тип" render={() => <ApiKeyTypeField />} />
            <FunctionField label="Ключ" render={() => <SecureKeyField />} />
            <TextField source="rateLimit" label="Лимит запросов/час" />
            <TextField source="usageCount" label="Использований" />
            <FunctionField label="Статус" render={() => <ApiKeyStatusField />} />
            <DateField source="createdAt" label="Создан" />
            <DateField source="expiresAt" label="Истекает" />
        </Datagrid>
    </List>
);

// Редактирование API ключа
export const ApiKeyEdit = () => (
    <Edit title="Редактировать API ключ">
        <Card>
            <SimpleForm>
                <Box display="flex" gap={3} width="100%">
                    <Box flex={2}>
                        <Typography variant="h6" gutterBottom>
                            Основная информация
                        </Typography>

                        <TextInput
                            source="name"
                            label="Название ключа"
                            fullWidth
                            validate={[required()]}
                            helperText="Описательное название для идентификации"
                        />

                        <SelectInput
                            source="type"
                            label="Тип ключа"
                            choices={[
                                { id: 'public', name: 'Публичный (фронтенд)' },
                                { id: 'private', name: 'Приватный (бэкенд)' },
                                { id: 'webhook', name: 'Webhook (уведомления)' },
                                { id: 'integration', name: 'Интеграция (внешние сервисы)' }
                            ]}
                            validate={[required()]}
                            fullWidth
                        />

                        <TextInput
                            source="rateLimit"
                            label="Лимит запросов в час"
                            type="number"
                            defaultValue={1000}
                            fullWidth
                        />

                        <TextInput
                            source="expiresAt"
                            label="Дата истечения"
                            type="datetime-local"
                            fullWidth
                            helperText="Оставьте пустым для бессрочного ключа"
                        />
                    </Box>

                    <Box flex={1}>
                        <Typography variant="h6" gutterBottom>
                            Права доступа
                        </Typography>

                        <ArrayInput source="permissions" label="Разрешения">
                            <SimpleFormIterator>
                                <SelectInput
                                    source=""
                                    choices={[
                                        { id: 'products.read', name: 'Чтение товаров' },
                                        { id: 'products.write', name: 'Запись товаров' },
                                        { id: 'orders.read', name: 'Чтение заказов' },
                                        { id: 'orders.write', name: 'Запись заказов' },
                                        { id: 'customers.read', name: 'Чтение клиентов' },
                                        { id: 'customers.write', name: 'Запись клиентов' },
                                        { id: 'analytics.read', name: 'Аналитика' },
                                        { id: 'webhooks.receive', name: 'Получение webhook\'ов' }
                                    ]}
                                    fullWidth
                                />
                            </SimpleFormIterator>
                        </ArrayInput>

                        <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                            Безопасность
                        </Typography>

                        <ArrayInput source="allowedIPs" label="Разрешённые IP адреса">
                            <SimpleFormIterator>
                                <TextInput
                                    source=""
                                    label="IP адрес"
                                    helperText="Например: 192.168.1.100 или 192.168.1.0/24"
                                    fullWidth
                                />
                            </SimpleFormIterator>
                        </ArrayInput>

                        <BooleanInput
                            source="active"
                            label="Активный ключ"
                            defaultValue={true}
                        />
                    </Box>
                </Box>
            </SimpleForm>
        </Card>
    </Edit>
);

// Создание API ключа
export const ApiKeyCreate = () => {
    const [newApiKey, setNewApiKey] = useState('');
    const [showKeyModal, setShowKeyModal] = useState(false);

    const handleSuccess = (data: any) => {
        // После создания ключа показываем его пользователю
        setNewApiKey(data.key);
        setShowKeyModal(true);
    };

    return (
        <>
            <Create
                title="Создать API ключ"
                mutationOptions={{ onSuccess: handleSuccess }}
            >
                <Card>
                    <SimpleForm>
                        <Alert severity="info" sx={{ mb: 3 }}>
                            API ключ будет показан только один раз после создания. Обязательно сохраните его!
                        </Alert>

                        <Box display="flex" gap={3} width="100%">
                            <Box flex={2}>
                                <Typography variant="h6" gutterBottom>
                                    Основная информация
                                </Typography>

                                <TextInput
                                    source="name"
                                    label="Название ключа"
                                    fullWidth
                                    validate={[required()]}
                                />

                                <SelectInput
                                    source="type"
                                    label="Тип ключа"
                                    choices={[
                                        { id: 'public', name: 'Публичный (фронтенд)' },
                                        { id: 'private', name: 'Приватный (бэкенд)' },
                                        { id: 'webhook', name: 'Webhook (уведомления)' },
                                        { id: 'integration', name: 'Интеграция (внешние сервисы)' }
                                    ]}
                                    validate={[required()]}
                                    fullWidth
                                    defaultValue="private"
                                />

                                <TextInput
                                    source="rateLimit"
                                    label="Лимит запросов в час"
                                    type="number"
                                    defaultValue={1000}
                                    fullWidth
                                />
                            </Box>

                            <Box flex={1}>
                                <Typography variant="h6" gutterBottom>
                                    Права доступа
                                </Typography>

                                <ArrayInput source="permissions" label="Разрешения">
                                    <SimpleFormIterator>
                                        <SelectInput
                                            source=""
                                            choices={[
                                                { id: 'products.read', name: 'Чтение товаров' },
                                                { id: 'orders.read', name: 'Чтение заказов' },
                                                { id: 'customers.read', name: 'Чтение клиентов' },
                                                { id: 'webhooks.receive', name: 'Получение webhook\'ов' }
                                            ]}
                                            fullWidth
                                        />
                                    </SimpleFormIterator>
                                </ArrayInput>

                                <BooleanInput
                                    source="active"
                                    label="Активный ключ"
                                    defaultValue={true}
                                />
                            </Box>
                        </Box>
                    </SimpleForm>
                </Card>
            </Create>

            <NewApiKeyModal
                open={showKeyModal}
                onClose={() => setShowKeyModal(false)}
                apiKey={newApiKey}
            />
        </>
    );
};