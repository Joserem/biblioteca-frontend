import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { BookOpen, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import undbLogo from '../../assets/logo.png';
import undbIcon from '../../assets/logo2.png';

export interface SidebarProps {
  isMobileOpen: boolean;
  onMobileClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isMobileOpen,
  onMobileClose,
  isCollapsed,
  onToggleCollapse,
}) => {
  const location = useLocation();
  const isBooksRoute = location.pathname.startsWith('/livros');

  const sidebarContent = (
    <div
      className="flex flex-col h-full text-slate-100 select-none border-r border-[#6B0032]/40 relative"
      style={{
        background: 'linear-gradient(180deg, #A90046 0%, #7D003E 48%, #42002F 100%)',
      }}
    >
      {/* Top Header / Branding UNDB */}
      <div className="flex items-center justify-center px-5 py-6 shrink-0 relative border-b border-white/10">
        <NavLink
          to="/livros"
          onClick={onMobileClose}
          className="flex items-center gap-3 focus:outline-none min-w-0"
        >
          {isCollapsed ? (
            <img
              src={undbIcon}
              alt="UNDB"
              className="w-10 h-10 object-contain mx-auto transition-transform hover:scale-105"
            />
          ) : (
            <div className="flex flex-col items-center text-center">
              <img
                src={undbLogo}
                alt="UNDB Centro Universitário"
                className="h-10 w-auto object-contain max-w-[190px] transition-transform hover:scale-102"
              />
              <span className="text-[11px] font-semibold text-white/70 tracking-wider uppercase mt-1">
                Sistema Bibliotecário
              </span>
            </div>
          )}
        </NavLink>

        {/* Mobile close button */}
        <button
          type="button"
          onClick={onMobileClose}
          className="md:hidden text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 absolute right-4 top-1/2 -translate-y-1/2"
          aria-label="Fechar menu"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Desktop Collapse Button */}
        <button
          type="button"
          onClick={onToggleCollapse}
          className="hidden md:flex items-center justify-center w-7 h-7 rounded-full bg-[#6B0038] text-white hover:bg-[#E9005B] shadow-md transition-colors border border-white/20 absolute -right-3.5 top-7 z-40"
          title={isCollapsed ? 'Expandir menu lateral' : 'Recolher menu lateral'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation list: Apenas o módulo Livros */}
      <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1.5">
        <NavLink
          to="/livros"
          title="Livros"
          onClick={onMobileClose}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-xl transition-all duration-150',
              isCollapsed ? 'justify-center p-3' : 'px-3.5 py-2.5 text-sm font-medium',
              isActive || isBooksRoute
                ? 'bg-[#E9005B] text-white font-bold shadow-md'
                : 'text-white/85 hover:text-white hover:bg-white/10'
            )
          }
        >
          <BookOpen className="w-5 h-5 shrink-0" />
          {!isCollapsed && <span>Livros</span>}
        </NavLink>
      </div>

      {/* Rodapé da Sidebar */}
      {!isCollapsed && (
        <div className="p-4 border-t border-white/10 text-2xs text-white/50 text-center">
          Equipe 1 • Frontend Livros
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside
        className={cn(
          'hidden md:block fixed top-0 left-0 bottom-0 z-30 transition-all duration-200 ease-in-out',
          isCollapsed ? 'w-[72px]' : 'w-[260px]'
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      <div
        className={cn(
          'fixed inset-0 z-50 md:hidden transition-all duration-300 ease-in-out',
          isMobileOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        )}
      >
        <div
          className={cn(
            'fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300 ease-in-out',
            isMobileOpen ? 'opacity-100' : 'opacity-0'
          )}
          onClick={onMobileClose}
          aria-hidden="true"
        />

        <div
          className={cn(
            'fixed top-0 bottom-0 left-0 w-[270px] z-10 shadow-2xl transform transition-transform duration-300 ease-out',
            isMobileOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          {sidebarContent}
        </div>
      </div>
    </>
  );
};
