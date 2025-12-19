import { PrismaService } from '../prisma/prisma.service';
export declare class NavigationService {
    private prisma;
    constructor(prisma: PrismaService);
    getNavigationItems(filters?: any): Promise<{
        id: any;
        name: any;
        url: any;
        type: any;
        categoryId: any;
        parentId: any;
        sortOrder: any;
        isActive: any;
        openInNew: any;
        icon: any;
        createdAt: any;
        updatedAt: any;
        category: any;
        parent: any;
        children: any;
        childrenCount: any;
    }[]>;
    getNavigationTree(): Promise<{
        id: any;
        name: any;
        url: any;
        type: any;
        categoryId: any;
        parentId: any;
        sortOrder: any;
        isActive: any;
        openInNew: any;
        icon: any;
        createdAt: any;
        updatedAt: any;
        category: any;
        parent: any;
        children: any;
        childrenCount: any;
    }[]>;
    getNavigationItemById(id: string): Promise<{
        id: any;
        name: any;
        url: any;
        type: any;
        categoryId: any;
        parentId: any;
        sortOrder: any;
        isActive: any;
        openInNew: any;
        icon: any;
        createdAt: any;
        updatedAt: any;
        category: any;
        parent: any;
        children: any;
        childrenCount: any;
    }>;
    createNavigationItem(data: any): Promise<{
        id: any;
        name: any;
        url: any;
        type: any;
        categoryId: any;
        parentId: any;
        sortOrder: any;
        isActive: any;
        openInNew: any;
        icon: any;
        createdAt: any;
        updatedAt: any;
        category: any;
        parent: any;
        children: any;
        childrenCount: any;
    }>;
    updateNavigationItem(id: string, data: any): Promise<{
        id: any;
        name: any;
        url: any;
        type: any;
        categoryId: any;
        parentId: any;
        sortOrder: any;
        isActive: any;
        openInNew: any;
        icon: any;
        createdAt: any;
        updatedAt: any;
        category: any;
        parent: any;
        children: any;
        childrenCount: any;
    }>;
    reorderNavigationItems(items: Array<{
        id: string;
        sortOrder: number;
    }>): Promise<{
        success: boolean;
    }>;
    deleteNavigationItem(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    private formatNavigationItem;
}
