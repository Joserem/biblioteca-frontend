import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  BookOpen,
  ChevronDown,
  PlusCircle,
  ListFilter,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
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

  // Submenu de livros sempre aberto por padrão
  const [booksMenuOpen, setBooksMenuOpen] = useState(true);
  const isBooksRoute = location.pathname.startsWith('/livros');

  const subItems = [
    { label: 'Listagem', path: '/livros', icon: <ListFilter className="w-4 h-4" /> },
    { label: 'Novo Livro', path: '/livros/novo', icon: <PlusCircle className="w-4 h-4" /> },
  ];

  const sidebarContent = (
    <div
      className="flex flex-col h-full text-slate-100 select-none border-r border-[#6B0032]/40 relative"
      style={{
        background: 'linear-gradient(180deg, #A90046 0%, #7D003E 48%, #42002F 100%)',
      }}
    >
      {/* Top Header / Branding UNDB */}
      <div className="flex items-center justify-between px-5 py-6 shrink-0 relative border-b border-white/10">
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
            <div className="flex flex-col">
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
          className="md:hidden text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
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
        {isCollapsed ? (
          <NavLink
            to="/livros"
            title="Livros"
            className={({ isActive }) =>
              cn(
                'flex items-center justify-center p-3 rounded-xl transition-all duration-150 relative group',
                isActive || isBooksRoute
                  ? 'bg-[#E9005B] text-white font-bold shadow-md'
                  : 'text-white/85 hover:text-white hover:bg-white/10'
              )
            }
          >
            <BookOpen className="w-5 h-5" />
          </NavLink>
        ) : (
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => setBooksMenuOpen(!booksMenuOpen)}
              className={cn(
                'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer',
                isBooksRoute
                  ? 'bg-white/15 text-white font-semibold'
                  : 'text-white/85 hover:text-white hover:bg-white/10'
              )}
            >
              <div className="flex items-center gap-3">
                <span className="text-white/90">
                  <BookOpen className="w-5 h-5" />
                </span>
                <span>Livros</span>
              </div>
              <ChevronDown
                className={cn(
                  'w-4 h-4 text-white/70 transition-transform duration-200',
                  booksMenuOpen && 'rotate-180 text-white'
                )}
              />
            </button>

            {booksMenuOpen && (
              <div className="pl-9 pr-1 py-1 space-y-1 animate-in fade-in duration-150">
                {subItems.map((sub, sIndex) => (
                  <NavLink
                    key={sIndex}
                    to={sub.path}
                    onClick={onMobileClose}
                    end={sub.path === '/livros'}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150',
                        isActive
                          ? 'bg-[#E9005B] text-white font-bold shadow-xs'
                          : 'text-white/75 hover:text-white hover:bg-white/10'
                      )
                    }
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
                    <span>{sub.label}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        )}
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
