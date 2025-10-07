// Типы для совместимости с разными версиями Next.js
export type PageProps<T = any> = {
    params: T | Promise<T>
    searchParams?: { [key: string]: string | string[] | undefined }
}

export async function resolveParams<T>(params: T | Promise<T>): Promise<T> {
    return params instanceof Promise ? await params : params
}