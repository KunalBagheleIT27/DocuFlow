import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import UploadPage from './pages/UploadPage';
import DocumentListPage from './pages/DocumentListPage';
import DocumentDetailPage from './pages/DocumentDetailPage';
import DashboardPage from './pages/DashboardPage';
import { AuthedLayout } from './components/AuthedLayout';
import MyDocumentsPage from './pages/MyDocumentsPage';
import InboxPage from './pages/InboxPage';
import TemplatesPage from './pages/TemplatesPage';
import ReportsPage from './pages/ReportsPage';

function PrivateRoute({ children }: { children: React.ReactElement }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          element={
            <PrivateRoute>
              <AuthedLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="upload" element={<UploadPage />} />
          <Route path="documents/:id" element={<DocumentDetailPage />} />
          <Route path="" element={<MyDocumentsPage />} />
          <Route path="inbox" element={<InboxPage />} />
          <Route path="templates" element={<TemplatesPage />} />
          <Route path="reports" element={<ReportsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}



