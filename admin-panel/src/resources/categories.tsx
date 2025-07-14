// resources/categories.tsx
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
    DeleteButton,
    Show,
    SimpleShowLayout,
    DateField
} from "react-admin";
import { Chip, Box, Typography } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

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

        <SelectInput
            source="type"
            label="Тип категории"
            choices={[
                { id: 'products', name: 'Товары' },
                { id: 'balloons', name: 'Шарики' },
                { id: 'gifts', name: 'Подарки' },
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

// Кастомный тулбар
const CategoryListActions = () => (
    <TopToolbar>
        <CreateButton />
    </TopToolbar>
);

// Расширенный список категорий
export const CategoryList = () => (
    <List
        filters={<CategoryFilter />}
        actions={<CategoryListActions />}
        sort={{ field: 'order', order: 'ASC' }}
        perPage={50}
        title="Управление категориями"
    >
        <Datagrid rowClick="edit" bulkActionButtons={false}>
            <TextField source="name" label="Название" />

            <TextField
                source="slug"
                label="URL"
                sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}
            />

            {/* Тип категории с красивым отображением */}
            <TextField
                source="type"
                label="Тип"
                render={({ record }: { record: any }) => (
                    <Chip
                        label={getCategoryTypeLabel(record?.type)}
                        size="small"
                        color="primary"
                        variant="outlined"
                    />
                )}
            />

            {/* Родительская категория */}
            <ReferenceField
                source="parentId"
                reference="categories"
                label="Родитель"
                link={false}
                emptyText="—"
            >
                <TextField source="name" />
            </ReferenceField>

            {/* Порядок сортировки */}
            <NumberField source="order" label="Порядок" />

            {/* Статус активности */}
            <BooleanField
                source="active"
                label="Статус"
                render={({ record }: { record: any }) => (
                    <Chip
                        label={record?.active ? 'Активна' : 'Скрыта'}
                        color={record?.active ? 'success' : 'default'}
                        size="small"
                        icon={record?.active ? <Visibility /> : <VisibilityOff />}
                    />
                )}
            />

            {/* Показ в навигации */}
            <BooleanField
                source="showInNavigation"
                label="В навигации"
                render={({ record }: { record: any }) => (
                    record?.showInNavigation ? '✅' : '❌'
                )}
            />

            {/* Действия */}
            <Box display="flex" gap={1}>
                <EditButton />
                <DeleteButton />
            </Box>
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
const CategoryForm = () => (
    <SimpleForm>
        <Box display="flex" gap={3} width="100%">
            {/* Левая колонка - основная информация */}
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
                        { id: 'products', name: 'Товары' },
                        { id: 'balloons', name: 'Шарики' },
                        { id: 'gifts', name: 'Подарки' },
                        { id: 'events', name: 'События' },
                        { id: 'colors', name: 'Цвета' },
                        { id: 'materials', name: 'Материалы' },
                        { id: 'occasions', name: 'Поводы' }
                    ]}
                    validate={[required()]}
                    fullWidth
                />
            </Box>

            {/* Правая колонка - настройки */}
            <Box flex={1}>
                <Typography variant="h6" gutterBottom>
                    Настройки
                </Typography>

                <ReferenceInput
                    source="parentId"
                    reference="categories"
                    label="Родительская категория"
                >
                    <SelectInput
                        optionText="name"
                        emptyText="Корневая категория"
                    />
                </ReferenceInput>

                <NumberInput
                    source="order"
                    label="Порядок сортировки"
                    defaultValue={0}
                    min={0}
                    fullWidth
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
                />
            </Box>
        </Box>

        {/* SEO настройки */}
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

        {/* Настройки фильтров */}
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

        {/* Дополнительные настройки */}
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

// Компонент просмотра категории
export const CategoryShow = () => (
    <Show title="Просмотр категории">
        <SimpleShowLayout>
            <TextField source="name" label="Название" />
            <TextField source="slug" label="URL" />
            <TextField source="description" label="Описание" />

            <TextField
                source="type"
                label="Тип"
                render={({ record }: { record: any }) => getCategoryTypeLabel(record?.type)}
            />

            <ReferenceField
                source="parentId"
                reference="categories"
                label="Родительская категория"
                emptyText="Корневая категория"
            >
                <TextField source="name" />
            </ReferenceField>

            <NumberField source="order" label="Порядок сортировки" />
            <BooleanField source="active" label="Активна" />
            <BooleanField source="showInNavigation" label="Показывать в навигации" />

            {/* SEO поля */}
            <TextField source="metaTitle" label="Meta Title" />
            <TextField source="metaDescription" label="Meta Description" />
            <TextField source="metaKeywords" label="Ключевые слова" />

            {/* URLs */}
            <TextField source="imageUrl" label="URL изображения" />
            <TextField source="bannerUrl" label="URL баннера" />

            {/* Системные поля */}
            <DateField source="createdAt" label="Создана" showTime />
            <DateField source="updatedAt" label="Обновлена" showTime />
        </SimpleShowLayout>
    </Show>
);

// Вспомогательная функция для получения названия типа категории
const getCategoryTypeLabel = (type: string): string => {
    const typeLabels: Record<string, string> = {
        'products': 'Товары',
        'balloons': 'Шарики',
        'gifts': 'Подарки',
        'events': 'События',
        'colors': 'Цвета',
        'materials': 'Материалы',
        'occasions': 'Поводы',
        'PRODUCTS': 'Товары',
        'BALLOONS': 'Шарики',
        'GIFTS': 'Подарки',
        'EVENTS': 'События',
        'COLORS': 'Цвета',
        'MATERIALS': 'Материалы',
        'OCCASIONS': 'Поводы'
    };

    return typeLabels[type] || type;
};