import React from 'react';
import {
    List,
    Datagrid,
    TextField,
    DateField,
    Edit,
    Create,
    SimpleForm,
    TextInput,
    DateInput,
    SelectInput,
    required,
    BooleanInput,
    NumberInput,
    ImageField,
    ImageInput,
    useRecordContext,
    TopToolbar,
    EditButton,
    DeleteButton,
    useNotify,
    useRefresh
} from 'react-admin';
import {
    Card,
    Typography,
    Box,
    Chip,
    Button
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

// Компонент для отображения статуса баннера
const BannerStatusField = () => {
    const record = useRecordContext();
    if (!record) return null;

    const getStatusInfo = () => {
        const now = new Date();
        const startDate = record.startDate ? new Date(record.startDate) : null;
        const endDate = record.endDate ? new Date(record.endDate) : null;

        if (!record.active) {
            return { label: 'Неактивен', color: 'default' as const };
        }

        if (startDate && now < startDate) {
            return { label: 'Запланирован', color: 'info' as const };
        }

        if (endDate && now > endDate) {
            return { label: 'Истек', color: 'warning' as const };
        }

        return { label: 'Активен', color: 'success' as const };
    };

    const status = getStatusInfo();

    return (
        <Chip
            label={status.label}
            color={status.color}
            size="small"
            icon={record.active ? <Visibility /> : <VisibilityOff />}
        />
    );
};

// Компонент для отображения позиции баннера
const PositionField = () => {
    const record = useRecordContext();
    if (!record) return null;

    const positionLabels = {
        'main': 'Главная страница',
        'category': 'Страницы категорий',
        'sidebar': 'Боковая панель',
        'promo': 'Промо блок'
    };

    return (
        <Typography variant="body2">
            {positionLabels[record.position as keyof typeof positionLabels] || record.position}
        </Typography>
    );
};

// Компонент предпросмотра баннера
const BannerPreview = () => {
    const record = useRecordContext();
    if (!record?.image) return null;

    return (
        <Card sx={{ maxWidth: 300, mb: 2 }}>
            <Box
                sx={{
                    position: 'relative',
                    backgroundImage: `url(${record.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: 150,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    textAlign: 'center'
                }}
            >
                <Box sx={{ p: 2, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 1 }}>
                    <Typography variant="h6">{record.title}</Typography>
                    {record.subtitle && (
                        <Typography variant="body2">{record.subtitle}</Typography>
                    )}
                    {record.buttonText && (
                        <Button
                            variant="contained"
                            size="small"
                            sx={{ mt: 1 }}
                        >
                            {record.buttonText}
                        </Button>
                    )}
                </Box>
            </Box>
        </Card>
    );
};

// Действия в списке
const BannerListActions = () => (
    <TopToolbar>
        <EditButton />
        <DeleteButton />
    </TopToolbar>
);

// Список баннеров
export const BannerList = () => (
    <List
        title="Баннеры"
        sort={{ field: 'order', order: 'ASC' }}
        perPage={25}
        actions={<BannerListActions />}
    >
        <Datagrid rowClick="edit">
            <NumberInput source="order" label="Порядок" />
            <TextField source="title" label="Заголовок" />
            <TextField source="position" label="Позиция" />
            <TextField source="active" label="Статус" />
            <DateField source="startDate" label="Дата начала" />
            <DateField source="endDate" label="Дата окончания" />
            <DateField source="updatedAt" label="Обновлен" showTime />
        </Datagrid>
    </List>
);

// Форма редактирования баннера
export const BannerEdit = () => {
    const notify = useNotify();
    const refresh = useRefresh();

    const handleSuccess = () => {
        notify('Баннер успешно обновлен');
        refresh();
    };

    return (
        <Edit title="Редактировать баннер" mutationOptions={{ onSuccess: handleSuccess }}>
            <SimpleForm>
                <Box display="flex" gap={3} width="100%">
                    {/* Левая колонка - основная информация */}
                    <Box flex={2}>
                        <Typography variant="h6" gutterBottom>
                            Основная информация
                        </Typography>

                        <TextInput
                            source="title"
                            label="Заголовок"
                            fullWidth
                            validate={[required()]}
                        />

                        <TextInput
                            source="subtitle"
                            label="Подзаголовок"
                            fullWidth
                        />

                        <TextInput
                            source="description"
                            label="Описание"
                            fullWidth
                            multiline
                            rows={3}
                        />

                        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                            <TextInput
                                source="buttonText"
                                label="Текст кнопки"
                                sx={{ flex: 1 }}
                            />
                            <TextInput
                                source="buttonUrl"
                                label="Ссылка кнопки"
                                sx={{ flex: 1 }}
                            />
                        </Box>

                        {/* Изображения */}
                        <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                            Изображения
                        </Typography>

                        <ImageInput
                            source="image"
                            label="Основное изображение"
                            accept="image/*"
                            validate={[required()]}
                        >
                            <ImageField source="src" title="title" />
                        </ImageInput>

                        <ImageInput
                            source="mobileImage"
                            label="Изображение для мобильных"
                            accept="image/*"
                        >
                            <ImageField source="src" title="title" />
                        </ImageInput>
                    </Box>

                    {/* Правая колонка - настройки */}
                    <Box flex={1}>
                        <Typography variant="h6" gutterBottom>
                            Настройки отображения
                        </Typography>

                        <SelectInput
                            source="position"
                            label="Позиция"
                            choices={[
                                { id: 'main', name: 'Главная страница' },
                                { id: 'category', name: 'Страницы категорий' },
                                { id: 'sidebar', name: 'Боковая панель' },
                                { id: 'promo', name: 'Промо блок' }
                            ]}
                            validate={[required()]}
                            fullWidth
                        />

                        <NumberInput
                            source="order"
                            label="Порядок сортировки"
                            fullWidth
                            defaultValue={1}
                        />

                        <BooleanInput
                            source="active"
                            label="Активен"
                            defaultValue={true}
                        />

                        <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                            Период показа
                        </Typography>

                        <DateInput
                            source="startDate"
                            label="Дата начала"
                            fullWidth
                        />

                        <DateInput
                            source="endDate"
                            label="Дата окончания"
                            fullWidth
                        />

                        {/* Предпросмотр */}
                        <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                            Предпросмотр
                        </Typography>
                        <BannerPreview />
                    </Box>
                </Box>
            </SimpleForm>
        </Edit>
    );
};

// Форма создания баннера
export const BannerCreate = () => {
    const notify = useNotify();

    const handleSuccess = () => {
        notify('Баннер успешно создан');
        // Перенаправление произойдет автоматически
    };

    return (
        <Create title="Создать баннер" mutationOptions={{ onSuccess: handleSuccess }}>
            <SimpleForm>
                <Box display="flex" gap={3} width="100%">
                    {/* Левая колонка */}
                    <Box flex={2}>
                        <Typography variant="h6" gutterBottom>
                            Основная информация
                        </Typography>

                        <TextInput
                            source="title"
                            label="Заголовок"
                            fullWidth
                            validate={[required()]}
                        />

                        <TextInput
                            source="subtitle"
                            label="Подзаголовок"
                            fullWidth
                        />

                        <TextInput
                            source="description"
                            label="Описание"
                            fullWidth
                            multiline
                            rows={3}
                        />

                        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                            <TextInput
                                source="buttonText"
                                label="Текст кнопки"
                                sx={{ flex: 1 }}
                            />
                            <TextInput
                                source="buttonUrl"
                                label="Ссылка кнопки"
                                sx={{ flex: 1 }}
                            />
                        </Box>

                        <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                            Изображения
                        </Typography>

                        <ImageInput
                            source="image"
                            label="Основное изображение"
                            accept="image/*"
                            validate={[required()]}
                        >
                            <ImageField source="src" title="title" />
                        </ImageInput>

                        <ImageInput
                            source="mobileImage"
                            label="Изображение для мобильных"
                            accept="image/*"
                        >
                            <ImageField source="src" title="title" />
                        </ImageInput>
                    </Box>

                    {/* Правая колонка */}
                    <Box flex={1}>
                        <Typography variant="h6" gutterBottom>
                            Настройки отображения
                        </Typography>

                        <SelectInput
                            source="position"
                            label="Позиция"
                            choices={[
                                { id: 'main', name: 'Главная страница' },
                                { id: 'category', name: 'Страницы категорий' },
                                { id: 'sidebar', name: 'Боковая панель' },
                                { id: 'promo', name: 'Промо блок' }
                            ]}
                            validate={[required()]}
                            fullWidth
                            defaultValue="main"
                        />

                        <NumberInput
                            source="order"
                            label="Порядок сортировки"
                            fullWidth
                            defaultValue={1}
                        />

                        <BooleanInput
                            source="active"
                            label="Активен"
                            defaultValue={true}
                        />

                        <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                            Период показа
                        </Typography>

                        <DateInput
                            source="startDate"
                            label="Дата начала"
                            fullWidth
                        />

                        <DateInput
                            source="endDate"
                            label="Дата окончания"
                            fullWidth
                        />
                    </Box>
                </Box>
            </SimpleForm>
        </Create>
    );
};