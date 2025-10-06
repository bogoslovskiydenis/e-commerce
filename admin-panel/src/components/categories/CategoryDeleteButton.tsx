import React, { useState } from 'react';
import { useDelete, useNotify, useRefresh, useRecordContext } from 'react-admin';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    IconButton,
    Alert,
    Box
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

export const CategoryDeleteButton = () => {
    const record = useRecordContext();
    const [open, setOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [deleteOne, { isLoading }] = useDelete();
    const notify = useNotify();
    const refresh = useRefresh();

    const handleOpen = () => {
        setError(null);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setError(null);
    };

    const handleDelete = async (force: boolean = false) => {
        if (!record?.id) return;

        try {
            // Формируем URL с параметром force если нужно
            const meta = force ? { force: 'true' } : {};

            await deleteOne(
                'categories',
                {
                    id: record.id,
                    previousData: record,
                    meta
                },
                {
                    onSuccess: () => {
                        notify('Категория успешно удалена', { type: 'success' });
                        handleClose();
                        refresh();
                    },
                    onError: (err: any) => {
                        // Получаем сообщение ошибки из разных возможных мест
                        const errorMessage =
                            err?.body?.error ||           // Наш формат
                            err?.message ||                // Стандартное сообщение
                            err?.toString() ||             // Преобразование в строку
                            'Ошибка при удалении категории';

                        console.log('Error object:', err); // Для отладки

                        // Если ошибка о том, что есть товары - показываем её в диалоге
                        if (errorMessage.includes('products') ||
                            errorMessage.includes('товаров') ||
                            errorMessage.includes('Cannot delete')) {
                            setError(errorMessage);
                        } else {
                            notify(errorMessage, { type: 'error' });
                            handleClose();
                        }
                    },
                }
            );
        } catch (err: any) {
            const errorMessage = err?.body?.error || err?.message || 'Неизвестная ошибка';
            setError(errorMessage);
        }
    };

    if (!record) return null;

    return (
        <>
            <IconButton
                size="small"
                color="error"
                onClick={handleOpen}
                disabled={isLoading}
                title="Удалить категорию"
            >
                <DeleteIcon fontSize="small" />
            </IconButton>

            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    Удалить категорию "{record.name}"?
                </DialogTitle>
                <DialogContent>
                    {error ? (
                        <Box>
                            <Alert severity="warning" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                            <DialogContentText sx={{ mb: 2 }}>
                                У этой категории есть связанные товары. Что вы хотите сделать?
                            </DialogContentText>
                            <Alert severity="info">
                                <strong>Принудительное удаление</strong> удалит категорию и отвяжет все товары от неё.
                                Товары останутся в базе данных, но будут без категории.
                            </Alert>
                        </Box>
                    ) : (
                        <DialogContentText>
                            Вы действительно хотите удалить эту категорию?
                            Это действие нельзя отменить.
                        </DialogContentText>
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleClose} disabled={isLoading}>
                        Отмена
                    </Button>
                    {error ? (
                        <Button
                            onClick={() => handleDelete(true)}
                            color="error"
                            variant="contained"
                            disabled={isLoading}
                        >
                            Удалить принудительно
                        </Button>
                    ) : (
                        <Button
                            onClick={() => handleDelete(false)}
                            color="error"
                            variant="contained"
                            disabled={isLoading}
                        >
                            Удалить
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </>
    );
};