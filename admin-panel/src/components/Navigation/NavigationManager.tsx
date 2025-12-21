import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import {
    Card,
    CardContent,
    Typography,
    Button,
    Switch,
    FormControlLabel,
    Alert,
    Box,
    Chip,
    CircularProgress
} from '@mui/material';
import {
    Category,
    SubdirectoryArrowRight
} from '@mui/icons-material';
import { adminApiService } from '../../services/api';

// Интерфейс для элемента навигации
interface NavigationItem {
    id: string;
    name: string;
    type: string;
    showInNavigation: boolean;
    order: number;
    active: boolean;
    productsCount: number;
    isVisible: boolean;
    hasDropdown: boolean;
    parentId?: string | null;
    parent?: {
        id: string;
        name: string;
    } | null;
    children?: NavigationItem[];
}

export default function NavigationManager() {
    const [categories, setCategories] = useState<NavigationItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await adminApiService.getNavigationCategories();

            // Преобразуем данные для NavigationItem
            const itemsMap = new Map<string, NavigationItem>();
            const allItems: NavigationItem[] = [];
            
            // Сначала создаем все элементы
            data.forEach((category: any) => {
                const item: NavigationItem = {
                    id: category.id,
                    name: category.name,
                    type: category.type,
                    showInNavigation: category.showInNavigation,
                    order: category.order || 0,
                    active: category.active,
                    productsCount: category.productsCount || 0,
                    isVisible: category.showInNavigation,
                    hasDropdown: false,
                    parentId: category.parentId || null,
                    parent: category.parent || null,
                    children: []
                };
                itemsMap.set(category.id, item);
            });
            
            // Теперь группируем: находим родительские и дочерние
            const parentItems: NavigationItem[] = [];
            const childItems: NavigationItem[] = [];
            
            itemsMap.forEach((item) => {
                if (!item.parentId) {
                    // Родительская категория
                    // Проверяем, есть ли у неё дети
                    const children = Array.from(itemsMap.values()).filter(child => child.parentId === item.id);
                    item.children = children;
                    item.hasDropdown = children.length > 0 || item.productsCount > 0;
                    parentItems.push(item);
                } else {
                    // Дочерняя категория
                    const parent = itemsMap.get(item.parentId);
                    if (parent) {
                        item.parent = {
                            id: parent.id,
                            name: parent.name
                        };
                    }
                    item.hasDropdown = item.productsCount > 0;
                    childItems.push(item);
                }
            });
            
            // Сортируем родительские по order
            parentItems.sort((a, b) => a.order - b.order);
            
            // Создаем итоговый список: родительская категория, затем её дети
            parentItems.forEach((parent) => {
                allItems.push(parent);
                // Добавляем детей этой категории, отсортированных по order
                const children = childItems
                    .filter(child => child.parentId === parent.id)
                    .sort((a, b) => a.order - b.order);
                allItems.push(...children);
            });

            setCategories(allItems);
        } catch (error) {
            console.error('Error loading categories:', error);
            setError('Ошибка загрузки категорий');
        } finally {
            setLoading(false);
        }
    };

    const handleDragEnd = (result: any) => {
        if (!result.destination) return;

        const items = Array.from(categories);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        // Обновляем порядковые номера
        const updatedItems = items.map((item, index) => ({
            ...item,
            order: index + 1
        }));

        setCategories(updatedItems);
        setHasChanges(true);
    };

    const toggleNavigation = (categoryId: string) => {
        setCategories(categories.map(cat =>
            cat.id === categoryId
                ? { ...cat, isVisible: !cat.isVisible, showInNavigation: !cat.isVisible }
                : cat
        ));
        setHasChanges(true);
    };

    const toggleDropdown = (categoryId: string) => {
        setCategories(categories.map(cat =>
            cat.id === categoryId
                ? { ...cat, hasDropdown: !cat.hasDropdown }
                : cat
        ));
        setHasChanges(true);
    };

    const saveChanges = async () => {
        try {
            setSaving(true);
            setError(null);

            // Отправляем обновления на сервер
            const results = await Promise.allSettled(
                categories.map(category =>
                    adminApiService.updateCategoryNavigation(category.id, {
                        showInNavigation: category.isVisible,
                        order: category.order,
                        active: category.active
                    })
                )
            );

            // Проверяем результаты
            const failed = results.filter(r => r.status === 'rejected');
            if (failed.length > 0) {
                console.error('Some updates failed:', failed);
                throw new Error(`Не удалось сохранить ${failed.length} категорий`);
            }

            setHasChanges(false);
            // Перезагружаем данные после успешного сохранения
            await loadCategories();
        } catch (error: any) {
            console.error('Save error:', error);
            setError(error.message || 'Ошибка сохранения изменений');
        } finally {
            setSaving(false);
        }
    };

    const resetChanges = () => {
        loadCategories();
        setHasChanges(false);
    };

    const getTypeIcon = (type: string) => {
        const icons: Record<string, string> = {
            'balloons': '🎈',
            'BALLOONS': '🎈',
            'bouquets': '💐',
            'BOUQUETS': '💐',
            'gifts': '🎁',
            'GIFTS': '🎁',
            'cups': '🥤',
            'CUPS': '🥤',
            'sets': '📦',
            'SETS': '📦',
            'events': '🎉',
            'EVENTS': '🎉',
            'occasions': '✨',
            'OCCASIONS': '✨'
        };
        return icons[type] || '📂';
    };

    const getTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            'balloons': 'Шарики',
            'BALLOONS': 'Шарики',
            'bouquets': 'Букеты',
            'BOUQUETS': 'Букеты',
            'gifts': 'Подарки',
            'GIFTS': 'Подарки',
            'cups': 'Стаканчики',
            'CUPS': 'Стаканчики',
            'sets': 'Наборы',
            'SETS': 'Наборы',
            'events': 'События',
            'EVENTS': 'События',
            'occasions': 'Поводы',
            'OCCASIONS': 'Поводы'
        };
        return labels[type] || type;
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
                <Typography variant="h6" sx={{ ml: 2 }}>
                    Загрузка категорий...
                </Typography>
            </Box>
        );
    }

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>
                Управление навигацией
            </Typography>

            <Typography variant="body1" color="textSecondary" paragraph>
                Настройте отображение категорий в главном меню сайта
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {hasChanges && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <span>Есть несохраненные изменения</span>
                        <Box>
                            <Button onClick={resetChanges} sx={{ mr: 1 }}>
                                Отменить
                            </Button>
                            <Button
                                variant="contained"
                                onClick={saveChanges}
                                disabled={saving}
                            >
                                {saving ? 'Сохранение...' : 'Сохранить'}
                            </Button>
                        </Box>
                    </Box>
                </Alert>
            )}

            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Элементы навигации ({categories.length})
                    </Typography>

                    {categories.length === 0 ? (
                        <Typography color="textSecondary">
                            Категории не найдены. Создайте категории в разделе "Категории".
                        </Typography>
                    ) : (
                        <DragDropContext onDragEnd={handleDragEnd}>
                            <Droppable droppableId="navigation">
                                {(provided) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                    >
                                        {categories.map((item, index) => (
                                            <Draggable
                                                key={item.id}
                                                draggableId={item.id}
                                                index={index}
                                            >
                                                {(provided, snapshot) => (
                                                    <Card
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        sx={{
                                                            mb: 1,
                                                            ml: item.parentId ? 4 : 0,
                                                            borderLeft: item.parentId ? '3px solid' : 'none',
                                                            borderColor: item.parentId ? 'secondary.main' : 'transparent',
                                                            backgroundColor: snapshot.isDragging ? 'action.hover' : 'background.paper',
                                                            cursor: 'default'
                                                        }}
                                                    >
                                                        <CardContent sx={{ py: 2 }}>
                                                            <Box display="flex" alignItems="center" gap={2}>
                                                                {/* Drag handle */}
                                                                <div
                                                                    {...provided.dragHandleProps}
                                                                    style={{
                                                                        cursor: 'move',
                                                                        padding: '4px',
                                                                        color: '#666'
                                                                    }}
                                                                >
                                                                    ⋮⋮
                                                                </div>

                                                                {/* Category info */}
                                                                <Box flex={1} display="flex" alignItems="center" gap={2}>
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                        {item.parentId ? (
                                                                            <SubdirectoryArrowRight sx={{ fontSize: 20, color: 'text.secondary' }} />
                                                                        ) : (
                                                                            <Category sx={{ fontSize: 20, color: 'primary.main' }} />
                                                                        )}
                                                                        <Typography variant="h6">
                                                                            {getTypeIcon(item.type)}
                                                                        </Typography>
                                                                    </Box>
                                                                    <Box sx={{ flex: 1 }}>
                                                                        <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                                                                            <Typography variant="subtitle1">
                                                                                {item.name}
                                                                            </Typography>
                                                                            {item.parentId && item.parent && (
                                                                                <Chip
                                                                                    label={`→ ${item.parent.name}`}
                                                                                    size="small"
                                                                                    color="secondary"
                                                                                    sx={{ height: 20, fontSize: '0.7rem' }}
                                                                                />
                                                                            )}
                                                                            {!item.parentId && (
                                                                                <Chip
                                                                                    label="Категория"
                                                                                    size="small"
                                                                                    color="primary"
                                                                                    sx={{ height: 20, fontSize: '0.7rem' }}
                                                                                />
                                                                            )}
                                                                            {item.parentId && (
                                                                                <Chip
                                                                                    label="Подкатегория"
                                                                                    size="small"
                                                                                    color="secondary"
                                                                                    variant="outlined"
                                                                                    sx={{ height: 20, fontSize: '0.7rem' }}
                                                                                />
                                                                            )}
                                                                        </Box>
                                                                        <Box display="flex" gap={1} alignItems="center">
                                                                            <Chip
                                                                                label={getTypeLabel(item.type)}
                                                                                size="small"
                                                                                variant="outlined"
                                                                            />
                                                                            <Typography variant="caption" color="textSecondary">
                                                                                {item.productsCount} товаров
                                                                            </Typography>
                                                                            {!item.active && (
                                                                                <Chip
                                                                                    label="Неактивна"
                                                                                    size="small"
                                                                                    color="error"
                                                                                />
                                                                            )}
                                                                        </Box>
                                                                    </Box>
                                                                </Box>

                                                                {/* Controls */}
                                                                <Box display="flex" alignItems="center" gap={2}>
                                                                    <FormControlLabel
                                                                        control={
                                                                            <Switch
                                                                                checked={item.hasDropdown}
                                                                                onChange={() => toggleDropdown(item.id)}
                                                                                size="small"
                                                                            />
                                                                        }
                                                                        label="Дропдаун"
                                                                        labelPlacement="top"
                                                                    />

                                                                    <FormControlLabel
                                                                        control={
                                                                            <Switch
                                                                                checked={item.isVisible}
                                                                                onChange={() => toggleNavigation(item.id)}
                                                                                color="primary"
                                                                            />
                                                                        }
                                                                        label="В навигации"
                                                                        labelPlacement="top"
                                                                    />

                                                                    <Typography variant="caption" color="textSecondary">
                                                                        #{item.order}
                                                                    </Typography>
                                                                </Box>
                                                            </Box>
                                                        </CardContent>
                                                    </Card>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    )}
                </CardContent>
            </Card>

            <Box mt={3} display="flex" justifyContent="space-between">
                <Button onClick={loadCategories}>
                    🔄 Обновить данные
                </Button>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={saveChanges}
                    disabled={!hasChanges || saving}
                >
                    {saving ? 'Сохранение...' : 'Сохранить изменения'}
                </Button>
            </Box>
        </Box>
    );
}