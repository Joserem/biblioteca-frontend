import React from 'react';
import { useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Breadcrumb } from '../../components/ui/Breadcrumb';
import { IconButton } from '../../components/ui/IconButton';
import { BreadcrumbItem } from '../../types';
import logoLoginImg from '../../assets/logologin.png';

export interface HeaderProps {
  onMobileOpen: () => void;
  isSidebarCollapsed: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onMobileOpen }) => {
  const location = useLocation();

  // Breadcrumbs simplificados para o escopo estrito de Livros
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const path = location.pathname;
    if (path === '/' || path === '/livros') {
      return [{ label: 'Livros' }];
    }
    if (path === '/livros/novo') {
      return [{ label: 'Livros', path: '/livros' }, { label: 'Novo Livro' }];
    }
    if (path.startsWith('/livros/') && path.endsWith('/editar')) {
      return [{ label: 'Livros', path: '/livros' }, { label: 'Editar Livro' }];
    }
    if (path.startsWith('/livros/')) {
      return [{ label: 'Livros', path: '/livros' }, { label: 'Detalhes' }];
    }
    return [{ label: 'Livros', path: '/livros' }];
  };

  return (
    <>
      {/* Mobile Institutional UNDB Header */}
      <header
        className="md:hidden sticky top-0 z-20 h-[70px] w-full px-4 flex items-center justify-between select-none shadow-md"
        style={{
          background: 'linear-gradient(135deg, #B0004B 0%, #E6005C 45%, #6A00D9 100%)',
        }}
      >
        {/* Left: Burger Button */}
        <button
          type="button"
          onClick={onMobileOpen}
          className="p-2 text-white hover:bg-white/10 rounded-xl transition-colors flex items-center justify-center focus:outline-none cursor-pointer"
          aria-label="Abrir menu lateral"
        >
          <Menu className="w-6 h-6 text-white" />
        </button>

        {/* Center: White UNDB Logo */}
        <div className="flex items-center justify-center flex-1 mx-2">
          <img
            src={logoLoginImg}
            alt="UNDB Sistema Bibliotecário"
            className="h-9 max-h-9 w-auto object-contain brightness-0 invert"
          />
        </div>

        {/* Spacer para manter a logo centralizada */}
        <div className="w-10 shrink-0" aria-hidden="true" />
      </header>

      {/* Desktop Header */}
      <header className="hidden md:block sticky top-0 z-20 h-16 bg-white border-b border-slate-200/80 shadow-2xs">
        <div className="w-full max-w-[1440px] mx-auto h-full px-4 sm:px-6 md:px-8 flex items-center justify-between gap-4">
          {/* Left Side: Mobile burger + Breadcrumbs */}
          <div className="flex items-center gap-3 min-w-0">
            <IconButton
              variant="ghost"
              size="sm"
              ariaLabel="Abrir menu lateral"
              onClick={onMobileOpen}
              className="md:hidden"
            >
              <Menu className="w-5 h-5 text-slate-700" />
            </IconButton>

            <Breadcrumb items={getBreadcrumbs()} />
          </div>
        </div>
      </header>
    </>
  );
};
