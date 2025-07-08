import { Router } from 'express';

const router = Router();

// Все разрешения
router.get('/permissions', (req, res) => {
    const allPermissions = [
        'users.create', 'users.edit', 'users.delete', 'users.view',
        'products.create', 'products.edit', 'products.delete', 'products.view',
        'orders.view', 'orders.edit', 'orders.delete', 'orders.create',
        'customers.view', 'customers.edit', 'customers.delete',
        'analytics.view', 'logs.view', 'admin.full_access'
    ];

    const permissionsByCategory = {
        users: allPermissions.filter(p => p.startsWith('users.')),
        products: allPermissions.filter(p => p.startsWith('products.')),
        orders: allPermissions.filter(p => p.startsWith('orders.')),
        customers: allPermissions.filter(p => p.startsWith('customers.')),
        system: allPermissions.filter(p => p.startsWith('logs.') || p.startsWith('admin.'))
    };

    res.json({
        success: true,
        data: {
            all: allPermissions,
            byCategory: permissionsByCategory,
            total: allPermissions.length
        }
    });
});

// Роли
router.get('/roles', (req, res) => {
    res.json({
        success: true,
        data: {
            roles: [
                {
                    role: 'SUPER_ADMIN',
                    permissions: ['admin.full_access'],
                    hasFullAccess: true
                },
                {
                    role: 'ADMINISTRATOR',
                    permissions: ['products.create', 'users.view'],
                    hasFullAccess: false
                }
            ]
        }
    });
});

// Мои права
router.get('/permissions/my', (req, res) => {
    res.json({
        success: true,
        data: {
            user: {
                id: '1',
                username: 'admin',
                role: 'SUPER_ADMIN'
            },
            allPermissions: ['admin.full_access'],
            hasFullAccess: true
        }
    });
});

// Проверка прав
router.post('/permissions/check', (req, res) => {
    const { permissions } = req.body;

    res.json({
        success: true,
        data: {
            hasAllPermissions: true,
            permissions: (permissions || []).map((p: string) => ({
                permission: p,
                hasPermission: true
            }))
        }
    });
});

export default router;