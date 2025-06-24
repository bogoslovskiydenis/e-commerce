import React from 'react';
import {
    List,
    Datagrid,
    TextField,
    DateField,
    Edit,
    SimpleForm,
    TextInput,
    DateInput,
    SelectInput,
    required,
    SearchInput,
    FilterButton,
    TopToolbar,
    useRecordContext,
    FunctionField,
    BooleanField,
    Show,
    SimpleShowLayout,
    RichTextField
} from 'react-admin';
import { Chip, Box, Typography } from '@mui/material';

// Компонент для отображения статуса комментария
const CommentStatusField = () => {
    const record = useRecordContext();
    if (!record) return null;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'new': return 'warning';
            case 'approved': return 'success';
            case 'rejected': return 'error';
            case 'spam': return 'default';
            default: return 'default';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'new': return 'Новости';
            case 'approved': return 'Одобрен';
            case 'rejected': return 'Отклонен';
            case 'spam': return 'Спам';
            default: return status;
        }
    };

    return (
        <Chip
            label={getStatusLabel(record.status)}
            color={getStatusColor(record.status) as any}
            size="small"
        />
    );
};

// Компонент для отображения типа комментария
const CommentTypeField = () => {
    const record = useRecordContext();
    if (!record) return null;

    return (
        <Box>
            <Typography variant="body2" color="primary">
                {record.type === 'review' ? 'Отзыв' : 'Комментарий'}
            </Typography>
            {record.subject && (
                <Typography variant="caption" color="text.secondary">
                    {record.subject}
                </Typography>
            )}
        </Box>
    );
};

// Фильтры для комментариев
const commentFilters = [
    <SearchInput source="q" placeholder="Поиск по комментарию или автору" alwaysOn />,
    <SelectInput
        source="status"
        label="Статус"
        choices={[
            { id: 'new', name: 'Новые' },
            { id: 'approved', name: 'Одобренные' },
            { id: 'rejected', name: 'Отклоненные' },
            { id: 'spam', name: 'Спам' },
        ]}
        emptyText="Все статусы"
    />,
    <SelectInput
        source="type"
        label="Тип"
        choices={[
            { id: 'comment', name: 'Комментарий' },
            { id: 'review', name: 'Отзыв' },
        ]}
        emptyText="Все типы"
    />,
];

// Действия в тулбаре
const CommentListActions = () => (
    <TopToolbar>
        <FilterButton />
    </TopToolbar>
);

// Основной компонент списка комментариев
export const CommentList = () => (
    <List
        filters={commentFilters}
        actions={<CommentListActions />}
        sort={{ field: 'createdAt', order: 'DESC' }}
        perPage={25}
        title="Комментарии и отзывы"
    >
        <Datagrid rowClick="edit" sx={{ '& .RaDatagrid-headerCell': { fontWeight: 'bold' } }}>
            <DateField source="createdAt" label="Дата" showTime />
            <FunctionField
                label="Комментарий"
                render={(record: any) => (
                    <Box sx={{ maxWidth: 400 }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                            {record.subject}
                        </Typography>
                        <Typography variant="body2" sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical'
                        }}>
                            {record.content}
                        </Typography>
                    </Box>
                )}
            />
            <TextField source="template" label="Шаблон" />
            <FunctionField
                label="Запись"
                render={(record: any) => (
                    <Box>
                        <Typography variant="body2" color="primary">
                            {record.recordType}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            ID: {record.recordId}
                        </Typography>
                    </Box>
                )}
            />
            <FunctionField
                label="Комментатор"
                render={(record: any) => (
                    <Box>
                        <Typography variant="body2">
                            {record.author?.name || 'Аноним'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {record.author?.email}
                        </Typography>
                    </Box>
                )}
            />
            <FunctionField
                label="Пользователь"
                render={(record: any) => (
                    <Box>
                        <Typography variant="body2">
                            {record.user?.name || 'Гость'}
                        </Typography>
                        {record.user?.role && (
                            <Typography variant="caption" color="text.secondary">
                                {record.user.role}
                            </Typography>
                        )}
                    </Box>
                )}
            />
            <FunctionField
                label="Отображать"
                render={(record: any) => (
                    <Typography variant="body2">
                        {record.isVisible ? 'Да' : 'Нет'}
                    </Typography>
                )}
            />
            <FunctionField
                label="Управление"
                render={(record: any) => (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip
                            label="Изменить"
                            size="small"
                            color="primary"
                            variant="outlined"
                            onClick={() => window.location.href = `#/comments/${record.id}`}
                        />
                        <Chip
                            label="Отправить"
                            size="small"
                            color="success"
                            variant="outlined"
                        />
                    </Box>
                )}
            />
        </Datagrid>
    </List>
);

// Форма редактирования комментария
export const CommentEdit = () => (
    <Edit title="Редактирование комментария">
        <SimpleForm>
            <Box display="flex" gap={2} width="100%">
                <Box flex={1}>
                    <Typography variant="h6" gutterBottom>Основная информация</Typography>
                    <TextInput source="subject" label="Тема" fullWidth validate={[required()]} />
                    <TextInput source="content" label="Содержание" fullWidth multiline rows={6} validate={[required()]} />
                    <SelectInput
                        source="status"
                        label="Статус"
                        choices={[
                            { id: 'new', name: 'Новый' },
                            { id: 'approved', name: 'Одобрен' },
                            { id: 'rejected', name: 'Отклонен' },
                            { id: 'spam', name: 'Спам' },
                        ]}
                        validate={[required()]}
                    />
                    <SelectInput
                        source="type"
                        label="Тип"
                        choices={[
                            { id: 'comment', name: 'Комментарий' },
                            { id: 'review', name: 'Отзыв' },
                        ]}
                        validate={[required()]}
                    />
                </Box>

                <Box flex={1}>
                    <Typography variant="h6" gutterBottom>Автор</Typography>
                    <TextInput source="author.name" label="Имя автора" fullWidth />
                    <TextInput source="author.email" label="Email автора" fullWidth />
                    <TextInput source="author.phone" label="Телефон автора" fullWidth />

                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Связанная запись</Typography>
                    <TextInput source="recordType" label="Тип записи" fullWidth />
                    <TextInput source="recordId" label="ID записи" fullWidth />
                    <TextInput source="template" label="Шаблон" fullWidth />
                </Box>
            </Box>

            <Box width="100%" mt={3}>
                <Typography variant="h6" gutterBottom>Настройки отображения</Typography>
                <SelectInput
                    source="isVisible"
                    label="Отображать на сайте"
                    choices={[
                        { id: true, name: 'Да' },
                        { id: false, name: 'Нет' },
                    ]}
                    fullWidth
                />
                <TextInput source="moderatorNote" label="Заметка модератора" fullWidth multiline />
            </Box>
        </SimpleForm>
    </Edit>
);

// Просмотр комментария
export const CommentShow = () => (
    <Show title="Просмотр комментария">
        <SimpleShowLayout>
            <TextField source="subject" label="Тема" />
            <RichTextField source="content" label="Содержание" />
            <FunctionField
                label="Статус"
                render={(record: any) => {
                    const getStatusColor = (status: string) => {
                        switch (status) {
                            case 'new': return 'warning';
                            case 'approved': return 'success';
                            case 'rejected': return 'error';
                            case 'spam': return 'default';
                            default: return 'default';
                        }
                    };

                    const getStatusLabel = (status: string) => {
                        switch (status) {
                            case 'new': return 'Новости';
                            case 'approved': return 'Одобрен';
                            case 'rejected': return 'Отклонен';
                            case 'spam': return 'Спам';
                            default: return status;
                        }
                    };

                    return (
                        <Chip
                            label={getStatusLabel(record.status)}
                            color={getStatusColor(record.status) as any}
                            size="small"
                        />
                    );
                }}
            />
            <TextField source="author.name" label="Автор" />
            <TextField source="author.email" label="Email автора" />
            <DateField source="createdAt" label="Дата создания" showTime />
            <BooleanField source="isVisible" label="Отображается" />
        </SimpleShowLayout>
    </Show>
);