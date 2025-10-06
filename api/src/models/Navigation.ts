// api/src/models/Navigation.ts - Модель для кастомной навигации
import { z } from 'zod';

export const NavigationItemSchema = z.object({
    id: z.string(),
    title: z.string(),
    href: z.string(),
    type: z.enum(['link', 'category', 'page', 'external']),
    icon: z.string().optional(),
    isVisible: z.boolean(),
    order: z.number(),
    parentId: z.string().optional(),
    target: z.enum(['_self', '_blank']).optional(),
    description: z.string().optional(),
    badge: z.string().optional(),
    cssClass: z.string().optional(),
    children: z.array(z.lazy(() => NavigationItemSchema)).optional()
});

export type NavigationItem = z.infer<typeof NavigationItemSchema>;

