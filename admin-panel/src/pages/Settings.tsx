import React from 'react';
import { Title } from 'react-admin';

export const SettingsPage = () => (
    <div style={{ padding: '20px' }}>
        <Title title="Настройки" />
        <h1>Настройки системы</h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
            <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: 'white' }}>
                <h3>Общие настройки</h3>
                <p>Основные настройки магазина</p>
            </div>

            <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: 'white' }}>
                <h3>Интеграции</h3>
                <p>Настройки интеграций с внешними сервисами</p>
            </div>

            <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: 'white' }}>
                <h3>Уведомления</h3>
                <p>Настройки уведомлений</p>
            </div>

            <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: 'white' }}>
                <h3>Пользователи</h3>
                <p>Управление пользователями админ-панели</p>
            </div>
        </div>
    </div>
);