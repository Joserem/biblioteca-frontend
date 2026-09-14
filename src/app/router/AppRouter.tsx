import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';

// Books Pages
import { BooksListPage } from '../../features/books/pages/BooksListPage';
import { NewBookPage } from '../../features/books/pages/NewBookPage';
import { BookDetailsPage } from '../../features/books/pages/BookDetailsPage';
import { EditBookPage } from '../../features/books/pages/EditBookPage';

// 404
import { NotFoundPage } from '../../pages/NotFoundPage';

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          {/* Redirecionamento da raiz / direto para /livros */}
          <Route index element={<Navigate to="/livros" replace />} />

          {/* Módulo Estrito de Livros (Equipe 1) */}
          <Route path="livros" element={<BooksListPage />} />
          <Route path="livros/novo" element={<NewBookPage />} />
          <Route path="livros/:id" element={<BookDetailsPage />} />
          <Route path="livros/:id/editar" element={<EditBookPage />} />

          {/* 404 Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
