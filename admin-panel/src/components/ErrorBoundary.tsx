import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        // Обновляем состояние так, чтобы при следующем рендере показался fallback UI
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Игнорируем ошибки, связанные с Snackbar/Grow в Material-UI
        if (error.message?.includes('Cannot read properties of undefined') && 
            error.stack?.includes('Grow.js')) {
            // Это известная проблема с react-admin и Material-UI, не критичная
            console.warn('Игнорируется известная ошибка Material-UI Grow component:', error);
            this.setState({ hasError: false });
            return;
        }
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            // В случае ошибки рендерим null, чтобы не ломать UI
            return null;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;


