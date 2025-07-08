import React, { useState } from 'react';
import {
    Edit,
    SimpleForm,
    TextInput,
    NumberInput,
    ImageInput,
    ImageField,
    required,
    email,
    useNotify,
    useRefresh,
    ArrayInput,
    SimpleFormIterator,
    BooleanInput
} from 'react-admin';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Tabs,
    Tab,
    Grid,
    TextField,
    Button,
    Divider,
    Alert
} from '@mui/material';
import {
    Palette,
    ContactPhone,
    Language,
    Settings as SettingsIcon,
    Payment,
    LocalShipping
} from '@mui/icons-material';

// Компонент для выбора цвета
const ColorPicker = ({ source, label, ...props }: any) => {
    const [color, setColor] = useState('#1976d2');

    return (
        <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>{label}</Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    style={{ width: 50, height: 40, border: 'none', borderRadius: 4 }}
                />
                <TextInput
                    source={source}
                    value={color}
                    sx={{ flex: 1 }}
                    {...props}
                />
            </Box>
        </Box>
    );
};

// Компонент табов
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
            id={`settings-tabpanel-${index}`}
            aria-labelledby={`settings-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

// Основной компонент настроек
export const SiteSettingsEdit = () => {
    const [tabValue, setTabValue] = useState(0);
    const notify = useNotify();
    const refresh = useRefresh();

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleSuccess = () => {
        notify('Настройки успешно сохранены');
        refresh();
    };

    return (
        <Edit
            title="Настройки сайта"
            id="1"
            resource="settings"
            mutationOptions={{ onSuccess: handleSuccess }}
        >
            <Card>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabValue} onChange={handleTabChange} aria-label="настройки сайта">
                        <Tab icon={<SettingsIcon />} label="Основные" />
                        <Tab icon={<Palette />} label="Дизайн" />
                        <Tab icon={<ContactPhone />} label="Контакты" />
                        <Tab icon={<Language />} label="SEO" />
                        <Tab icon={<LocalShipping />} label="Доставка" />
                        <Tab icon={<Payment />} label="Оплата" />
                    </Tabs>
                </Box>

                <SimpleForm toolbar={<></>}>
                    {/* Основные настройки */}
                    <TabPanel value={tabValue} index={0}>
                        <Typography variant="h6" gutterBottom>
                            Основная информация о сайте
                        </Typography>

                        <Grid container spacing={3}>
                            <Grid item xs={12} md={8}>
                                <TextInput
                                    source="siteName"
                                    label="Название сайта"
                                    fullWidth
                                    validate={[required()]}
                                />

                                <TextInput
                                    source="siteDescription"
                                    label="Описание сайта"
                                    fullWidth
                                    multiline
                                    rows={3}
                                />

                                <TextInput
                                    source="siteKeywords"
                                    label="Ключевые слова"
                                    fullWidth
                                    helperText="Через запятую"
                                />
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Логотип и иконки
                                </Typography>

                                <ImageInput
                                    source="logo"
                                    label="Логотип"
                                    accept="image/*"
                                >
                                    <ImageField source="src" title="title" />
                                </ImageInput>

                                <ImageInput
                                    source="favicon"
                                    label="Фавикон"
                                    accept="image/x-icon,image/png"
                                >
                                    <ImageField source="src" title="title" />
                                </ImageInput>
                            </Grid>
                        </Grid>
                    </TabPanel>

                    {/* Настройки дизайна */}
                    <TabPanel value={tabValue} index={1}>
                        <Typography variant="h6" gutterBottom>
                            Цветовая схема и дизайн
                        </Typography>

                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <ColorPicker
                                    source="primaryColor"
                                    label="Основной цвет"
                                    validate={[required()]}
                                />

                                <ColorPicker
                                    source="secondaryColor"
                                    label="Вторичный цвет"
                                    validate={[required()]}
                                />

                                <ColorPicker
                                    source="accentColor"
                                    label="Акцентный цвет"
                                />

                                <TextInput
                                    source="fontFamily"
                                    label="Шрифт"
                                    fullWidth
                                    helperText="Например: 'Roboto', sans-serif"
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Alert severity="info" sx={{ mb: 2 }}>
                                    Изменения цветовой схемы будут применены после сохранения настроек
                                </Alert>

                                <Typography variant="subtitle2" gutterBottom>
                                    Предпросмотр цветов
                                </Typography>

                                <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                                    <Box
                                        sx={{
                                            p: 2,
                                            backgroundColor: 'primary.main',
                                            color: 'white',
                                            borderRadius: 1,
                                            mb: 1
                                        }}
                                    >
                                        Основной цвет
                                    </Box>
                                    <Box
                                        sx={{
                                            p: 2,
                                            backgroundColor: 'secondary.main',
                                            color: 'white',
                                            borderRadius: 1
                                        }}
                                    >
                                        Вторичный цвет
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </TabPanel>

                    {/* Контактная информация */}
                    <TabPanel value={tabValue} index={2}>
                        <Typography variant="h6" gutterBottom>
                            Контактная информация
                        </Typography>

                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Основные контакты
                                </Typography>

                                <TextInput
                                    source="phone"
                                    label="Основной телефон"
                                    fullWidth
                                    validate={[required()]}
                                />

                                <TextInput
                                    source="alternativePhone"
                                    label="Дополнительный телефон"
                                    fullWidth
                                />

                                <TextInput
                                    source="email"
                                    label="Email"
                                    fullWidth
                                    validate={[required(), email()]}
                                />

                                <TextInput
                                    source="supportEmail"
                                    label="Email поддержки"
                                    fullWidth
                                    validate={[email()]}
                                />

                                <TextInput
                                    source="address"
                                    label="Адрес"
                                    fullWidth
                                    multiline
                                    rows={2}
                                    validate={[required()]}
                                />

                                <TextInput
                                    source="workingHours"
                                    label="Режим работы"
                                    fullWidth
                                    validate={[required()]}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Социальные сети
                                </Typography>

                                <TextInput
                                    source="socialMedia.facebook"
                                    label="Facebook"
                                    fullWidth
                                />

                                <TextInput
                                    source="socialMedia.instagram"
                                    label="Instagram"
                                    fullWidth
                                />

                                <TextInput
                                    source="socialMedia.telegram"
                                    label="Telegram"
                                    fullWidth
                                />

                                <TextInput
                                    source="socialMedia.viber"
                                    label="Viber"
                                    fullWidth
                                />

                                <TextInput
                                    source="socialMedia.youtube"
                                    label="YouTube"
                                    fullWidth
                                />

                                <TextInput
                                    source="socialMedia.tiktok"
                                    label="TikTok"
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                    </TabPanel>

                    {/* SEO и аналитика */}
                    <TabPanel value={tabValue} index={3}>
                        <Typography variant="h6" gutterBottom>
                            SEO и системы аналитики
                        </Typography>

                        <Alert severity="warning" sx={{ mb: 3 }}>
                            Будьте осторожны при изменении кодов аналитики. Неправильные коды могут нарушить работу системы.
                        </Alert>

                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Google сервисы
                                </Typography>

                                <TextInput
                                    source="googleAnalytics"
                                    label="Google Analytics ID"
                                    fullWidth
                                    helperText="Например: GA-123456789-1"
                                />

                                <TextInput
                                    source="googleTagManager"
                                    label="Google Tag Manager ID"
                                    fullWidth
                                    helperText="Например: GTM-XXXXXXX"
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Другие системы
                                </Typography>

                                <TextInput
                                    source="facebookPixel"
                                    label="Facebook Pixel ID"
                                    fullWidth
                                />

                                <TextInput
                                    source="yandexMetrica"
                                    label="Яндекс.Метрика ID"
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                    </TabPanel>

                    {/* Настройки доставки */}
                    <TabPanel value={tabValue} index={4}>
                        <Typography variant="h6" gutterBottom>
                            Настройки доставки
                        </Typography>

                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <NumberInput
                                    source="deliverySettings.freeDeliveryFrom"
                                    label="Бесплатная доставка от (грн)"
                                    fullWidth
                                />

                                <NumberInput
                                    source="deliverySettings.deliveryPrice"
                                    label="Стоимость доставки (грн)"
                                    fullWidth
                                />

                                <TextInput
                                    source="deliverySettings.deliveryTime"
                                    label="Время доставки"
                                    fullWidth
                                    helperText="Например: 1-2 дня"
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextInput
                                    source="deliverySettings.deliveryInfo"
                                    label="Дополнительная информация о доставке"
                                    fullWidth
                                    multiline
                                    rows={4}
                                />
                            </Grid>
                        </Grid>
                    </TabPanel>

                    {/* Способы оплаты */}
                    <TabPanel value={tabValue} index={5}>
                        <Typography variant="h6" gutterBottom>
                            Способы оплаты
                        </Typography>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Выберите доступные способы оплаты на вашем сайте
                        </Typography>

                        <ArrayInput source="paymentMethods" label="Способы оплаты">
                            <SimpleFormIterator>
                                <TextInput source="" label="Способ оплаты" fullWidth />
                            </SimpleFormIterator>
                        </ArrayInput>

                        <Divider sx={{ my: 3 }} />

                        <Typography variant="subtitle1" gutterBottom>
                            Популярные способы оплаты:
                        </Typography>

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {[
                                'Наличными при получении',
                                'Картой при получении',
                                'Онлайн картой',
                                'Monobank',
                                'PrivatBank',
                                'Безналичный расчет',
                                'LiqPay',
                                'Fondy'
                            ].map((method) => (
                                <Button
                                    key={method}
                                    variant="outlined"
                                    size="small"
                                    onClick={() => {
                                        // Логика добавления способа оплаты
                                        console.log('Add payment method:', method);
                                    }}
                                >
                                    Добавить "{method}"
                                </Button>
                            ))}
                        </Box>
                    </TabPanel>
                </SimpleForm>

                {/* Кнопки сохранения */}
                <Box sx={{ p: 3, borderTop: 1, borderColor: 'divider' }}>
                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        onClick={() => {
                            // Логика сохранения
                            handleSuccess();
                        }}
                    >
                        Сохранить настройки
                    </Button>

                    <Button
                        variant="outlined"
                        size="large"
                        sx={{ ml: 2 }}
                        onClick={() => {
                            // Логика предпросмотра
                            window.open('/', '_blank');
                        }}
                    >
                        Предпросмотр сайта
                    </Button>
                </Box>
            </Card>
        </Edit>
    );
};