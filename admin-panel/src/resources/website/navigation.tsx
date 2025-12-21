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
    VisibilityOff,
    Category,
    SubdirectoryArrowRight
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
        sort={{ field: 'sortOrder', order: 'ASC' }}
        perPage={50}
        actions={<NavigationListActions />}
    >
        <Datagrid rowClick="edit">
            {/* Иерархия с drag handle */}
            <FunctionField
                label="Название"
                render={(record: any) => {
                    const isSubcategory = !!record.parentId;
                    const isCategory = record.type === 'category' || record.type === 'CATEGORY';
                    const categoryIsParent = record.category?.parentId === null || record.category?.parentId === undefined;
                    const categoryIsChild = record.category?.parentId !== null && record.category?.parentId !== undefined;
                    
                    return (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <DragIndicator sx={{ color: 'action.disabled' }} />
                            <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 1,
                                pl: isSubcategory ? 3 : 0,
                                flex: 1
                            }}>
                                {isSubcategory && (
                                    <SubdirectoryArrowRight sx={{ fontSize: 18, color: 'text.secondary' }} />
                                )}
                                {!isSubcategory && isCategory && (
                                    <Category sx={{ fontSize: 18, color: 'primary.main' }} />
                                )}
                                <Typography variant="body2" component="span">
                                    {record.name || record.title}
                                </Typography>
                                {isCategory && (
                                    <Chip
                                        label={categoryIsParent ? 'Категория' : 'Подкатегория'}
                                        size="small"
                                        color={categoryIsParent ? 'primary' : 'secondary'}
                                        sx={{ height: 20, fontSize: '0.7rem' }}
                                    />
                                )}
                                {isSubcategory && (
                                    <Chip
                                        label="Подменю"
                                        size="small"
                                        color="default"
                                        variant="outlined"
                                        sx={{ height: 20, fontSize: '0.7rem' }}
                                    />
                                )}
                            </Box>
                        </Box>
                    );
                }}
            />

            <FunctionField
                label="URL"
                render={(record: any) => (
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {record.url || '-'}
                    </Typography>
                )}
            />

            {/* Тип пункта меню */}
            <FunctionField
                label="Тип"
                render={(record: any) => {
                    const typeLabels = {
                        'category': 'Категория',
                        'CATEGORY': 'Категория',
                        'page': 'Страница',
                        'external': 'Внешняя ссылка',
                        'EXTERNAL': 'Внешняя ссылка',
                        'custom': 'Произвольная',
                        'LINK': 'Ссылка'
                    };
                    return (
                        <Typography variant="body2">
                            {typeLabels[record.type as keyof typeof typeLabels] || record.type}
                        </Typography>
                    );
                }}
            />

            {/* Связанная категория */}
            <FunctionField
                label="Связанная категория"
                render={(record: any) => {
                    if (!record.category) return <Typography variant="body2" sx={{ color: 'text.secondary' }}>-</Typography>;
                    const isParentCategory = !record.category.parentId;
                    return (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Typography variant="body2">{record.category.name}</Typography>
                            {isParentCategory ? (
                                <Chip label="Родительская" size="small" color="primary" sx={{ height: 18, fontSize: '0.65rem' }} />
                            ) : (
                                <Chip label="Дочерняя" size="small" color="secondary" sx={{ height: 18, fontSize: '0.65rem' }} />
                            )}
                        </Box>
                    );
                }}
            />

            <NumberField source="sortOrder" label="Порядок" />

            {/* Статус активности */}
            <FunctionField
                label="Статус"
                render={(record: any) => (
                    <Chip
                        label={record.isActive ? 'Активен' : 'Скрыт'}
                        color={record.isActive ? 'success' : 'default'}
                        size="small"
                        icon={record.isActive ? <Visibility /> : <VisibilityOff />}
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
                            source="name"
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
                            <SelectInput 
                                optionText={(record: any) => {
                                    const isParent = !record.parentId;
                                    return `${record.name} ${isParent ? '(Категория)' : '(Подкатегория)'}`;
                                }}
                            />
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
                                optionText="name"
                                emptyText="Корневой уровень"
                            />
                        </ReferenceInput>

                        <NumberInput
                            source="sortOrder"
                            label="Порядок сортировки"
                            fullWidth
                            defaultValue={0}
                        />

                        <BooleanInput
                            source="isActive"
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
                            source="name"
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
                            <SelectInput 
                                optionText={(record: any) => {
                                    const isParent = !record.parentId;
                                    return `${record.name} ${isParent ? '(Категория)' : '(Подкатегория)'}`;
                                }}
                            />
                        </ReferenceInput>
                    </Box>

                    <Box flex={1}>
                        <Typography variant="h6" gutterBottom>
                            Настройки
                        </Typography>

                        <NumberInput
                            source="sortOrder"
                            label="Порядок"
                            defaultValue={0}
                            fullWidth
                        />

                        <BooleanInput
                            source="isActive"
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