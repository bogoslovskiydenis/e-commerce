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
    SelectInput,
    required,
    BooleanField,
    BooleanInput,
    useRecordContext,
    TopToolbar,
    EditButton,
    DeleteButton,
    ShowButton,
    Show,
    SimpleShowLayout,
    useNotify,
    useRefresh,
    useRedirect
} from 'react-admin';
import {
    Card,
    Typography,
    Box,
    Chip,
    Button,
    Alert,
    Tabs,
    Tab
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    Article,
    Settings as SettingsIcon, Search
} from '@mui/icons-material';

// Компонент для отображения статуса страницы
const PageStatusField = () => {
    const record = useRecordContext();
    if (!record) return null;

    return (
        <Chip
            label={record.active ? 'Опубликована' : 'Черновик'}
            color={record.active ? 'success' : 'default'}
            size="small"
            icon={record.active ? <Visibility /> : <VisibilityOff />}
        />
    );
};

// Компонент для отображения типа шаблона
const TemplateField = () => {
    const record = useRecordContext();
    if (!record) return null;

    const templateLabels = {
        'default': 'Стандартный',
        'full-width': 'Во всю ширину',
        'sidebar': 'С боковой панелью'
    };

    return (
        <Typography variant="body2">
            {templateLabels[record.template as keyof typeof templateLabels] || 'Стандартный'}
        </Typography>
    );
};

// Компонент для отображения краткого описания
const ExcerptField = () => {
    const record = useRecordContext();
    if (!record?.excerpt) return null;

    const shortExcerpt = record.excerpt.length > 100
        ? record.excerpt.substring(0, 100) + '...'
        : record.excerpt;

    return (
        <Typography variant="body2" color="text.secondary" title={record.excerpt}>
            {shortExcerpt}
        </Typography>
    );
};

// Действия в списке
const PageListActions = () => (
    <TopToolbar>
        <ShowButton />
        <EditButton />
        <DeleteButton />
    </TopToolbar>
);

// Список страниц
export const PageList = () => (
    <List
        title="Страницы сайта"
        sort={{ field: 'updatedAt', order: 'DESC' }}
        perPage={25}
        actions={<PageListActions />}
    >
        <Datagrid rowClick="edit">
            <TextField source="title" label="Заголовок" />
            <TextField source="slug" label="URL" />
            <TextField source="excerpt" label="Краткое описание" />
            <TextField source="template" label="Шаблон" />
            <BooleanField source="active" label="Активна" />
            <DateField source="updatedAt" label="Обновлена" showTime />
        </Datagrid>
    </List>
);

// Интерфейс для табов
interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 2 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

// Форма редактирования страницы
export const PageEdit = () => {
    const [tabValue, setTabValue] = React.useState(0);
    const notify = useNotify();
    const refresh = useRefresh();

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleSuccess = () => {
        notify('Страница успешно обновлена');
        refresh();
    };

    return (
        <Edit title="Редактировать страницу" mutationOptions={{ onSuccess: handleSuccess }}>
            <Card>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabValue} onChange={handleTabChange}>
                        <Tab icon={<Article />} label="Контент" />
                        <Tab icon={<SettingsIcon />} label="Настройки" />
                    </Tabs>
                </Box>

                <SimpleForm>
                    {/* Основной контент */}
                    <TabPanel value={tabValue} index={0}>
                        <Typography variant="h6" gutterBottom>
                            Основной контент страницы
                        </Typography>

                        <TextInput
                            source="title"
                            label="Заголовок страницы"
                            fullWidth
                            validate={[required()]}
                        />

                        <TextInput
                            source="slug"
                            label="URL (slug)"
                            fullWidth
                            validate={[required()]}
                            helperText="Используйте только латинские буквы, цифры и дефисы"
                        />

                        <TextInput
                            source="excerpt"
                            label="Краткое описание"
                            fullWidth
                            multiline
                            rows={2}
                            helperText="Краткое описание для предпросмотра"
                        />

                        <TextInput
                            source="content"
                            label="Содержимое страницы"
                            fullWidth
                            multiline
                            rows={10}
                            validate={[required()]}
                        />
                    </TabPanel>

                    {/* SEO настройки */}
                    <TabPanel value={tabValue} index={1}>
                        <Typography variant="h6" gutterBottom>
                            SEO оптимизация
                        </Typography>

                        <Alert severity="info" sx={{ mb: 3 }}>
                            Заполните эти поля для улучшения позиций страницы в поисковых системах
                        </Alert>

                        <TextInput
                            source="metaTitle"
                            label="Meta Title"
                            fullWidth
                            helperText="Рекомендуется до 60 символов"
                        />

                        <TextInput
                            source="metaDescription"
                            label="Meta Description"
                            fullWidth
                            multiline
                            rows={3}
                            helperText="Рекомендуется до 160 символов"
                        />

                        <TextInput
                            source="metaKeywords"
                            label="Ключевые слова"
                            fullWidth
                            helperText="Через запятую"
                        />

                        {/* Предпросмотр в поиске */}
                        <Box sx={{ mt: 3 }}>
                            <Typography variant="subtitle1" gutterBottom>
                                Предпросмотр в поисковых результатах:
                            </Typography>
                            <Card variant="outlined" sx={{ p: 2, backgroundColor: '#f8f9fa' }}>
                                <Typography
                                    variant="h6"
                                    color="primary"
                                    sx={{ fontSize: '18px', lineHeight: 1.2, mb: 1 }}
                                >
                                    Meta Title или заголовок страницы
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="success.main"
                                    sx={{ mb: 1 }}
                                >
                                    yoursite.com/page-slug
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Meta Description или краткое описание страницы...
                                </Typography>
                            </Card>
                        </Box>
                    </TabPanel>

                    {/* Настройки отображения */}
                    <TabPanel value={tabValue} index={2}>
                        <Typography variant="h6" gutterBottom>
                            Настройки отображения
                        </Typography>

                        <SelectInput
                            source="template"
                            label="Шаблон страницы"
                            choices={[
                                { id: 'default', name: 'Стандартный' },
                                { id: 'full-width', name: 'Во всю ширину' },
                                { id: 'sidebar', name: 'С боковой панелью' }
                            ]}
                            defaultValue="default"
                            fullWidth
                        />

                        <BooleanInput
                            source="active"
                            label="Опубликовать страницу"
                            defaultValue={true}
                        />

                        {/* Кнопки действий */}
                        <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                            <Button
                                variant="outlined"
                                onClick={() => {
                                    // Логика предпросмотра страницы
                                    window.open('/page-slug', '_blank');
                                }}
                                sx={{ mr: 2 }}
                            >
                                Предпросмотр
                            </Button>

                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={() => {
                                    // Логика дублирования страницы
                                    console.log('Duplicate page');
                                }}
                            >
                                Дублировать
                            </Button>
                        </Box>
                    </TabPanel>
                </SimpleForm>
            </Card>
        </Edit>
    );
};

// Форма создания страницы
export const PageCreate = () => {
    const [tabValue, setTabValue] = React.useState(0);
    const notify = useNotify();
    const redirect = useRedirect();

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleSuccess = () => {
        notify('Страница успешно создана');
        redirect('list', 'pages');
    };

    return (
        <Create title="Создать страницу" mutationOptions={{ onSuccess: handleSuccess }}>
            <Card>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabValue} onChange={handleTabChange}>
                        <Tab icon={<Article />} label="Контент" />
                        <Tab icon={<SettingsIcon />} label="Настройки" />
                    </Tabs>
                </Box>

                <SimpleForm>
                    <TabPanel value={tabValue} index={0}>
                        <Typography variant="h6" gutterBottom>
                            Основной контент страницы
                        </Typography>

                        <TextInput
                            source="title"
                            label="Заголовок страницы"
                            fullWidth
                            validate={[required()]}
                        />

                        <TextInput
                            source="slug"
                            label="URL (slug)"
                            fullWidth
                            validate={[required()]}
                            helperText="Используйте только латинские буквы, цифры и дефисы"
                        />

                        <TextInput
                            source="excerpt"
                            label="Краткое описание"
                            fullWidth
                            multiline
                            rows={2}
                        />

                        <TextInput
                            source="content"
                            label="Содержимое страницы"
                            fullWidth
                            multiline
                            rows={10}
                            validate={[required()]}
                        />
                    </TabPanel>

                    <TabPanel value={tabValue} index={1}>
                        <Typography variant="h6" gutterBottom>
                            SEO оптимизация
                        </Typography>

                        <TextInput
                            source="metaTitle"
                            label="Meta Title"
                            fullWidth
                        />

                        <TextInput
                            source="metaDescription"
                            label="Meta Description"
                            fullWidth
                            multiline
                            rows={3}
                        />

                        <TextInput
                            source="metaKeywords"
                            label="Ключевые слова"
                            fullWidth
                        />
                    </TabPanel>

                    <TabPanel value={tabValue} index={2}>
                        <Typography variant="h6" gutterBottom>
                            Настройки отображения
                        </Typography>

                        <SelectInput
                            source="template"
                            label="Шаблон страницы"
                            choices={[
                                { id: 'default', name: 'Стандартный' },
                                { id: 'full-width', name: 'Во всю ширину' },
                                { id: 'sidebar', name: 'С боковой панелью' }
                            ]}
                            defaultValue="default"
                            fullWidth
                        />

                        <BooleanInput
                            source="active"
                            label="Опубликовать страницу"
                            defaultValue={true}
                        />
                    </TabPanel>
                </SimpleForm>
            </Card>
        </Create>
    );
};

// Просмотр страницы
export const PageShow = () => (
    <Show title="Просмотр страницы">
        <SimpleShowLayout>
            <TextField source="title" label="Заголовок" />
            <TextField source="slug" label="URL" />
            <TextField source="excerpt" label="Краткое описание" />
            <TextField source="content" label="Содержимое" />
            <TextField source="metaTitle" label="Meta Title" />
            <TextField source="metaDescription" label="Meta Description" />
            <BooleanField source="active" label="Опубликована" />
            <DateField source="createdAt" label="Создана" showTime />
            <DateField source="updatedAt" label="Обновлена" showTime />
        </SimpleShowLayout>
    </Show>
);