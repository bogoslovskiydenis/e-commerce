import React from 'react';
import { Box, Chip } from '@mui/material';

export const TimePeriods = () => (
    <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
        <Chip label="Сегодня" variant="outlined" />
        <Chip label="Вчера" variant="outlined" />
        <Chip label="Неделя" variant="outlined" />
        <Chip label="Месяц" variant="outlined" />
        <Chip label="Квартал" variant="filled" color="primary" />
    </Box>
);