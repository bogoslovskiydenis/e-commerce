// admin/src/resources/website/navigation.tsx - ИСПРАВЛЕННАЯ ВЕРСИЯ
import React from 'react';
import {
    List,
    Datagrid,
    TextField,
    Edit,
    Create,
    SimpleForm,
    TextInput,
    NumberInput,
    BooleanInput,
    SelectInput,
    ArrayInput,
    SimpleFormIterator,
    required,
    useRecordContext,
    ReferenceInput,
    TopToolbar,
    CreateButton,
    ExportButton,
    NumberField,
    FunctionField
} from 'react-admin';
import {
    Card,
    Typography,
    Box,
    Chip
} from '@mui/material';
import {
    DragIndicator,
    Visibility,
    VisibilityOff
} from '@mui/icons-material';

// Действия в списке
const NavigationListActions = () => (
    <TopToolbar>
        <CreateButton />
        <ExportButton />
    </TopToolbar>
);

// Список пунктов навигации
export const NavigationList = () => (
    <List
        title="Навигация сайта"
        sort={{ field: 'order', order: 'ASC' }}
        perPage={50}
        actions={<NavigationListActions />}
    >
        <Datagrid rowClick="edit">
            {/* Иерархия с drag handle */}
            <FunctionField
                label="Название"
                render={(record: any) => (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <DragIndicator sx={{ mr: 1, color: 'action.disabled' }} />
                        <Box sx={{ pl: record.parentId ? 3 : 0 }}>
                            {record.parentId && '└ '}
                            {record.title}
                        </Box>
                    </Box>
                )}
            />

            <TextField source="url" label="URL" />

            {/* Тип пункта меню */}
            <FunctionField
                label="Тип"
                render={(record: any) => {
                    const typeLabels = {
                        'category': 'Категория',
                        'page': 'Страница',
                        'external': 'Внешняя ссылка',
                        'custom': 'Произвольная'
                    };
                    return (
                        <Typography variant="body2">
                            {typeLabels[record.type as keyof typeof typeLabels] || record.type}
                        </Typography>
                    );
                }}
            />

            <NumberField source="order" label="Порядок" />

            {/* Статус активности */}
            <FunctionField
                label="Статус"
                render={(record: any) => (
                    <Chip
                        label={record.active ? 'Активен' : 'Скрыт'}
                        color={record.active ? 'success' : 'default'}
                        size="small"
                        icon={record.active ? <Visibility /> : <VisibilityOff />}
                    />
                )}
            />
        </Datagrid>
    </List>
);

// Форма редактирования пункта навигации
export const NavigationEdit = () => (
    <Edit title="Редактировать пункт навигации">
        <Card>
            <SimpleForm>
                <Box display="flex" gap={3} width="100%">
                    {/* Основная информация */}
                    <Box flex={2}>
                        <Typography variant="h6" gutterBottom>
                            Основная информация
                        </Typography>

                        <TextInput
                            source="title"
                            label="Название пункта"
                            fullWidth
                            validate={[required()]}
                        />

                        <TextInput
                            source="url"
                            label="URL"
                            fullWidth
                            validate={[required()]}
                            helperText="Например: /balloons или https://external-site.com"
                        />

                        <SelectInput
                            source="type"
                            label="Тип пункта"
                            choices={[
                                { id: 'category', name: 'Категория товаров' },
                                { id: 'page', name: 'Страница сайта' },
                                { id: 'external', name: 'Внешняя ссылка' },
                                { id: 'custom', name: 'Произвольная ссылка' }
                            ]}
                            validate={[required()]}
                            fullWidth
                        />

                        {/* Связь с категорией если тип = category */}
                        <ReferenceInput
                            source="categoryId"
                            reference="categories"
                            label="Связанная категория"
                        >
                            <SelectInput optionText="name" />
                        </ReferenceInput>
                    </Box>

                    {/* Настройки отображения */}
                    <Box flex={1}>
                        <Typography variant="h6" gutterBottom>
                            Настройки отображения
                        </Typography>

                        <ReferenceInput
                            source="parentId"
                            reference="navigation"
                            label="Родительский пункт"
                        >
                            <SelectInput
                                optionText="title"
                                emptyText="Корневой уровень"
                            />
                        </ReferenceInput>

                        <NumberInput
                            source="order"
                            label="Порядок сортировки"
                            fullWidth
                            defaultValue={1}
                        />

                        <BooleanInput
                            source="active"
                            label="Показывать в навигации"
                            defaultValue={true}
                        />

                        <SelectInput
                            source="target"
                            label="Цель ссылки"
                            choices={[
                                { id: '_self', name: 'В том же окне' },
                                { id: '_blank', name: 'В новом окне' }
                            ]}
                            defaultValue="_self"
                            fullWidth
                        />

                        <TextInput
                            source="cssClass"
                            label="CSS класс"
                            fullWidth
                            helperText="Дополнительные стили для пункта"
                        />

                        <TextInput
                            source="icon"
                            label="Иконка"
                            fullWidth
                            helperText="Название иконки или emoji"
                        />
                    </Box>
                </Box>

                {/* Подменю */}
                <Box width="100%" mt={3}>
                    <Typography variant="h6" gutterBottom>
                        Подменю (выпадающий список)
                    </Typography>

                    <ArrayInput source="submenu" label="Пункты подменю">
                        <SimpleFormIterator>
                            <TextInput
                                source="title"
                                label="Название"
                                validate={[required()]}
                            />
                            <TextInput
                                source="url"
                                label="URL"
                                validate={[required()]}
                            />
                            <BooleanInput
                                source="active"
                                label="Активен"
                                defaultValue={true}
                            />
                        </SimpleFormIterator>
                    </ArrayInput>
                </Box>
            </SimpleForm>
        </Card>
    </Edit>
);

// Форма создания пункта навигации
export const NavigationCreate = () => (
    <Create title="Добавить пункт навигации">
        <Card>
            <SimpleForm>
                <Box display="flex" gap={3} width="100%">
                    <Box flex={2}>
                        <Typography variant="h6" gutterBottom>
                            Основная информация
                        </Typography>

                        <TextInput
                            source="title"
                            label="Название пункта"
                            fullWidth
                            validate={[required()]}
                        />

                        <TextInput
                            source="url"
                            label="URL"
                            fullWidth
                            validate={[required()]}
                        />

                        <SelectInput
                            source="type"
                            label="Тип пункта"
                            choices={[
                                { id: 'category', name: 'Категория товаров' },
                                { id: 'page', name: 'Страница сайта' },
                                { id: 'external', name: 'Внешняя ссылка' },
                                { id: 'custom', name: 'Произвольная ссылка' }
                            ]}
                            validate={[required()]}
                            fullWidth
                            defaultValue="category"
                        />

                        <ReferenceInput
                            source="categoryId"
                            reference="categories"
                            label="Связанная категория"
                        >
                            <SelectInput optionText="name" />
                        </ReferenceInput>
                    </Box>

                    <Box flex={1}>
                        <Typography variant="h6" gutterBottom>
                            Настройки
                        </Typography>

                        <NumberInput
                            source="order"
                            label="Порядок"
                            defaultValue={1}
                            fullWidth
                        />

                        <BooleanInput
                            source="active"
                            label="Активен"
                            defaultValue={true}
                        />

                        <SelectInput
                            source="target"
                            label="Цель ссылки"
                            choices={[
                                { id: '_self', name: 'В том же окне' },
                                { id: '_blank', name: 'В новом окне' }
                            ]}
                            defaultValue="_self"
                        />

                        <TextInput
                            source="cssClass"
                            label="CSS класс"
                            fullWidth
                        />

                        <TextInput
                            source="icon"
                            label="Иконка"
                            fullWidth
                        />
                    </Box>
                </Box>

                {/* Подменю для создания */}
                <Box width="100%" mt={3}>
                    <Typography variant="h6" gutterBottom>
                        Подменю (выпадающий список)
                    </Typography>

                    <ArrayInput source="submenu" label="Пункты подменю">
                        <SimpleFormIterator>
                            <TextInput
                                source="title"
                                label="Название"
                                validate={[required()]}
                            />
                            <TextInput
                                source="url"
                                label="URL"
                                validate={[required()]}
                            />
                            <BooleanInput
                                source="active"
                                label="Активен"
                                defaultValue={true}
                            />
                        </SimpleFormIterator>
                    </ArrayInput>
                </Box>
            </SimpleForm>
        </Card>
    </Create>
);