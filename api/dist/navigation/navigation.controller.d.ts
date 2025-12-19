import { NavigationService } from './navigation.service';
export declare class NavigationController {
    private navigationService;
    constructor(navigationService: NavigationService);
    getNavigationItems(query: any): Promise<{
        success: boolean;
        data: {
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
        }[];
        total: number;
    }>;
    getNavigationTree(): Promise<{
        success: boolean;
        data: {
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
        }[];
    }>;
    getNavigationItem(id: string): Promise<{
        success: boolean;
        data: {
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
        };
    }>;
    createNavigationItem(body: any): Promise<{
        success: boolean;
        data: {
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
        };
        message: string;
    }>;
    updateNavigationItem(id: string, body: any): Promise<{
        success: boolean;
        data: {
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
        };
        message: string;
    }>;
    patchNavigationItem(id: string, body: any): Promise<{
        success: boolean;
        data: {
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
        };
        message: string;
    }>;
    reorderNavigationItems(body: {
        items: Array<{
            id: string;
            sortOrder: number;
        }>;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    deleteNavigationItem(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
