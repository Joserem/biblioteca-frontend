import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RotateCcw, BookOpen } from 'lucide-react';
import { Button } from '../ui/Button';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in application:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center p-6 text-center font-sans">
          <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rose-100">
              <AlertOctagon className="w-8 h-8" />
            </div>

            <h1 className="text-xl font-bold text-slate-900 mb-2">
              Algo inesperado ocorreu
            </h1>

            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              Ocorreu um erro temporário na renderização desta tela. Você pode tentar recarregar a interface.
            </p>

            {this.state.error?.message && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-left font-mono text-2xs text-slate-600 overflow-x-auto mb-6">
                {this.state.error.message}
              </div>
            )}

            <div className="flex items-center justify-center gap-3">
              <Button
                variant="outline"
                size="sm"
                icon={<RotateCcw className="w-4 h-4" />}
                onClick={() => window.location.reload()}
              >
                Recarregar
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={<BookOpen className="w-4 h-4" />}
                onClick={() => (window.location.href = '/livros')}
              >
                Ir para Livros
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
