import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { BookOpen, PlusCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  const isListActive = path === '/livros' || path === '/';
  const isNewActive = path === '/livros/novo';

  const navItems = [
    {
      label: 'Listagem de Livros',
      path: '/livros',
      icon: <BookOpen className="w-5 h-5" />,
      isActive: isListActive,
    },
    {
      label: 'Novo Livro',
      path: '/livros/novo',
      icon: <PlusCircle className="w-5 h-5" />,
      isActive: isNewActive,
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E8EDF4] shadow-[0_-4px_16px_rgba(15,23,42,0.06)] px-6 py-2 flex items-center justify-around select-none">
      {navItems.map(item => (
        <NavLink
          key={item.path}
          to={item.path}
          className={cn(
            'flex flex-col items-center justify-center py-1 px-4 min-w-[100px] rounded-xl transition-all duration-150',
            item.isActive
              ? 'text-[#D90052] font-bold'
              : 'text-slate-500 hover:text-slate-700 font-medium'
          )}
        >
          <div className={cn('p-1 rounded-lg transition-transform', item.isActive && 'scale-110')}>
            {item.icon}
          </div>
          <span className="text-xs leading-tight mt-0.5">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};
