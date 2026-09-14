import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookX, BookOpen, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 text-center font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
        <div className="w-16 h-16 bg-rose-50 text-[#D90052] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rose-100">
          <BookX className="w-8 h-8" />
        </div>

        <span className="text-4xl font-black text-slate-900 block mb-1">404</span>
        <h1 className="text-lg font-bold text-slate-900 mb-2">Página Não Encontrada</h1>

        <p className="text-xs text-slate-500 mb-6 leading-relaxed">
          O endereço que você está tentando acessar não existe ou foi removido do sistema da biblioteca.
        </p>

        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            icon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => navigate(-1)}
          >
            Voltar
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={<BookOpen className="w-4 h-4" />}
            onClick={() => navigate('/livros')}
          >
            Ir para Livros
          </Button>
        </div>
      </div>
    </div>
  );
};
