import React from 'react';
import {
    Create,
    Datagrid,
    Edit,
    EditButton,
    List,
    required,
    SimpleForm,
    TextField,
    TextInput,
    BooleanField,
    NumberField,
    SelectInput,
    BooleanInput,
    NumberInput,
    ReferenceInput,
    ReferenceField,
    Filter,
    TopToolbar,
    CreateButton,
    Show,
    SimpleShowLayout,
    DateField,
    FunctionField,
    useRecordContext
} from "react-admin";
import { Chip, Box, Typography, Button } from '@mui/material';
import { Visibility, VisibilityOff, Navigation } from '@mui/icons-material';
import {CategoryDeleteButton} from "../components/categories/CategoryDeleteButton";

// Вспомогательная функция для получения названия типа категории
const getCategoryTypeLabel = (type: string): string => {
    const typeLabels: Record<string, string> = {
        'products': 'Товары',
        'balloons': 'Шарики',
        'bouquets': 'Букеты',
        'gifts': 'Подарки',
        'cups': 'Стаканчики',
        'sets': 'Наборы',
        'events': 'События',
        'colors': 'Цвета',
        'materials': 'Материалы',
        'occasions': 'Поводы',
        'PRODUCTS': 'Товары',
        'BALLOONS': 'Шарики',
        'BOUQUETS': 'Букеты',
        'GIFTS': 'Подарки',
        'CUPS': 'Стаканчики',
        'SETS': 'Наборы',
        'EVENTS': 'События',
        'COLORS': 'Цвета',
        'MATERIALS': 'Материалы',
        'OCCASIONS': 'Поводы'
    };

    return typeLabels[type] || type;
};

// Фильтры для списка категорий
const CategoryFilter = () => (
    <Filter>
        <TextInput
            label="Поиск"
            source="search"
            alwaysOn
            placeholder="Название категории..."
        />

        <BooleanInput
            label="Только активные"
            source="active"
            defaultValue={true}
        />

        <BooleanInput
            label="В навигации"
            source="showInNavigation"
        />

        <SelectInput
            source="type"
            label="Тип категории"
            choices={[
                { id: 'products', name: 'Товары' },
                { id: 'balloons', name: 'Шарики' },
                { id: 'bouquets', name: 'Букеты' },
                { id: 'gifts', name: 'Подарки' },
                { id: 'cups', name: 'Стаканчики' },
                { id: 'sets', name: 'Наборы' },
                { id: 'events', name: 'События' },
                { id: 'colors', name: 'Цвета' },
                { id: 'materials', name: 'Материалы' },
                { id: 'occasions', name: 'Поводы' }
            ]}
        />

        <ReferenceInput
            source="parentId"
            reference="categories"
            label="Родительская категория"
        >
            <SelectInput optionText="name" />
        </ReferenceInput>
    </Filter>
);

// Кастомный тулбар с кнопкой управления навигацией
const CategoryListActions = () => (
    <TopToolbar>
        <CreateButton />
        <Button
            variant="contained"
            startIcon={<Navigation />}
            onClick={() => window.open('/navigation', '_blank')}
            sx={{ ml: 1 }}
        >
            Управление навигацией
        </Button>
    </TopToolbar>
);

// Расширенный список категорий
export const CategoryList = () => (
    <List
        filters={<CategoryFilter />}
        actions={<CategoryListActions />}
        sort={{ field: 'sortOrder', order: 'ASC' }}
        perPage={50}
        title="Управление категориями"
    >
        <Datagrid rowClick="edit" bulkActionButtons={false}>
            <FunctionField
                label="Название"
                render={(record: any) => (
                    <Box display="flex" alignItems="center" gap={1}>
                        {record?.parentId && (
                            <Box
                                component="span"
                                sx={{
                                    display: 'inline-block',
                                    width: '20px',
                                    height: '20px',
                                    position: 'relative',
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        left: '8px',
                                        top: '50%',
                                        width: '12px',
                                        height: '1px',
                                        backgroundColor: '#9ca3af',
                                    },
                                    '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        left: '8px',
                                        top: '0',
                                        width: '1px',
                                        height: '50%',
                                        backgroundColor: '#9ca3af',
                                    }
                                }}
                            />
                        )}
                        <span style={{ fontWeight: record?.parentId ? 'normal' : '500' }}>
                            {record?.name}
                        </span>
                    </Box>
                )}
            />

            <TextField
                source="slug"
                label="URL"
                sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}
            />

            <FunctionField
                label="Тип"
                render={(record: any) => (
                    <Chip
                        label={getCategoryTypeLabel(record?.type)}
                        size="small"
                        color="primary"
                        variant="outlined"
                    />
                )}
            />

            <ReferenceField
                source="parentId"
                reference="categories"
                label="Родитель"
                link={false}
                emptyText="—"
            >
                <TextField source="name" />
            </ReferenceField>

            <NumberField source="sortOrder" label="Порядок" />

            <FunctionField
                label="Статус"
                render={(record: any) => (
                    <Chip
                        label={record?.active ? 'Активна' : 'Скрыта'}
                        color={record?.active ? 'success' : 'default'}
                        size="small"
                        icon={record?.active ? <Visibility /> : <VisibilityOff />}
                    />
                )}
            />

            <FunctionField
                label="В навигации"
                render={(record: any) => (
                    <Chip
                        label={record?.showInNavigation ? 'Да' : 'Нет'}
                        color={record?.showInNavigation ? 'success' : 'default'}
                        size="small"
                        variant="outlined"
                        icon={<Navigation />}
                    />
                )}
            />

            {/* ИСПРАВЛЕНО: Действия в FunctionField с stopPropagation */}
            <FunctionField
                label="Действия"
                render={() => (
                    <Box
                        display="flex"
                        gap={1}
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                    >
                        <EditButton />
                        <CategoryDeleteButton />
                    </Box>
                )}
            />
        </Datagrid>
    </List>
);

// Расширенная форма редактирования
export const CategoryEdit = () => (
    <Edit title="Редактировать категорию">
        <CategoryForm />
    </Edit>
);

// Расширенная форма создания
export const CategoryCreate = () => (
    <Create title="Создать категорию">
        <CategoryForm />
    </Create>
);

// Общая форма для создания и редактирования
const CategoryForm = () => {
    const record = useRecordContext();
    
    return (
        <SimpleForm>
            <Box display="flex" gap={3} width="100%">
                <Box flex={2}>
                    <Typography variant="h6" gutterBottom>
                        Основная информация
                    </Typography>

                    <TextInput
                        source="name"
                        label="Название категории"
                        validate={[required()]}
                        fullWidth
                    />

                    <TextInput
                        source="slug"
                        label="URL (slug)"
                        validate={[required()]}
                        fullWidth
                        helperText="Используется в адресе страницы. Только латинские буквы, цифры и дефисы"
                    />

                    <TextInput
                        multiline
                        source="description"
                        label="Описание"
                        rows={3}
                        fullWidth
                    />

                    <SelectInput
                        source="type"
                        label="Тип категории"
                        choices={[
                            { id: 'PRODUCTS', name: 'Товары' },
                            { id: 'BALLOONS', name: 'Шарики' },
                            { id: 'GIFTS', name: 'Подарки' },
                            { id: 'EVENTS', name: 'События' },
                            { id: 'COLORS', name: 'Цвета' },
                            { id: 'MATERIALS', name: 'Материалы' },
                            { id: 'OCCASIONS', name: 'Поводы' }
                        ]}
                        validate={[required()]}
                        fullWidth
                    />
                </Box>

                <Box flex={1}>
                    <Typography variant="h6" gutterBottom>
                        Настройки
                    </Typography>

                    <ReferenceInput
                        source="parentId"
                        reference="categories"
                        label="Родительская категория"
                        filter={record?.id ? { id: { not: record.id } } : {}}
                    >
                        <SelectInput
                            optionText="name"
                            emptyText="Корневая категория (без родителя)"
                        />
                    </ReferenceInput>

                <NumberInput
                    source="sortOrder"
                    label="Порядок сортировки"
                    defaultValue={0}
                    min={0}
                    fullWidth
                    helperText="Чем меньше число, тем выше в списке"
                />

                <BooleanInput
                    source="active"
                    label="Активна"
                    defaultValue={true}
                />

                <BooleanInput
                    source="showInNavigation"
                    label="Показывать в навигации"
                    defaultValue={true}
                    helperText="Отображать эту категорию в главном меню сайта"
                />
            </Box>
        </Box>

        <Box mt={3}>
            <Typography variant="h6" gutterBottom>
                SEO настройки
            </Typography>

            <Box display="flex" gap={2}>
                <TextInput
                    source="metaTitle"
                    label="Meta Title"
                    fullWidth
                    helperText="Заголовок для поисковых систем (до 60 символов)"
                />

                <TextInput
                    source="metaKeywords"
                    label="Ключевые слова"
                    fullWidth
                    helperText="Ключевые слова через запятую"
                />
            </Box>

            <TextInput
                source="metaDescription"
                label="Meta Description"
                multiline
                rows={2}
                fullWidth
                helperText="Описание для поисковых систем (до 160 символов)"
            />
        </Box>

        <Box mt={3}>
            <Typography variant="h6" gutterBottom>
                Настройки фильтров для UI
            </Typography>

            <Box display="flex" gap={2}>
                <BooleanInput
                    source="filters.allowColorFilter"
                    label="Фильтр по цвету"
                    defaultValue={true}
                />

                <BooleanInput
                    source="filters.allowMaterialFilter"
                    label="Фильтр по материалу"
                    defaultValue={true}
                />

                <BooleanInput
                    source="filters.allowPriceFilter"
                    label="Фильтр по цене"
                    defaultValue={true}
                />

                <BooleanInput
                    source="filters.allowSizeFilter"
                    label="Фильтр по размеру"
                    defaultValue={false}
                />
            </Box>
        </Box>

        <Box mt={3}>
            <Typography variant="h6" gutterBottom>
                Дополнительные настройки
            </Typography>

            <Box display="flex" gap={2}>
                <TextInput
                    source="imageUrl"
                    label="URL изображения"
                    fullWidth
                    helperText="Прямая ссылка на изображение категории"
                />

                <TextInput
                    source="bannerUrl"
                    label="URL баннера"
                    fullWidth
                    helperText="Прямая ссылка на баннер категории"
                />
            </Box>
        </Box>
        </SimpleForm>
    );
};

// Компонент просмотра категории
export const CategoryShow = () => (
    <Show title="Просмотр категории">
        <SimpleShowLayout>
            <TextField source="name" label="Название" />
            <TextField source="slug" label="URL" />
            <TextField source="description" label="Описание" />

            {/* ИСПРАВЛЕНО: TextField -> FunctionField */}
            <FunctionField
                label="Тип"
                render={(record: any) => getCategoryTypeLabel(record?.type)}
            />

            <ReferenceField
                source="parentId"
                reference="categories"
                label="Родительская категория"
                emptyText="Корневая категория"
            >
                <TextField source="name" />
            </ReferenceField>

            <NumberField source="sortOrder" label="Порядок сортировки" />
            <BooleanField source="active" label="Активна" />
            <BooleanField source="showInNavigation" label="Показывать в навигации" />

            <TextField source="metaTitle" label="Meta Title" />
            <TextField source="metaDescription" label="Meta Description" />
            <TextField source="metaKeywords" label="Ключевые слова" />

            <TextField source="imageUrl" label="URL изображения" />
            <TextField source="bannerUrl" label="URL баннера" />

            <DateField source="createdAt" label="Создана" showTime />
            <DateField source="updatedAt" label="Обновлена" showTime />
        </SimpleShowLayout>
    </Show>
);