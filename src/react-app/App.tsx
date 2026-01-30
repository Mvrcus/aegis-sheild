// src/App.tsx - Aegis Shield Client Portal

import { useState, useCallback, useMemo, lazy, Suspense } from "react";
import "./App.css";

// Types
import type { UserRole, Client, PhaseTemplate } from "./types";

// Data
import { mockClients, defaultPhaseTemplates } from "./data/mockData";

// Lazy load components for code splitting
const LoginPage = lazy(() => import("./components/LoginPage").then(m => ({ default: m.LoginPage })));
const ClientDashboard = lazy(() => import("./components/ClientDashboard").then(m => ({ default: m.ClientDashboard })));
const AdminPanel = lazy(() => import("./components/AdminPanel").then(m => ({ default: m.AdminPanel })));

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="loading-fallback">
      <div className="loading-spinner" />
    </div>
  );
}

// ============ MAIN APP ============
function App() {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [currentClientId, setCurrentClientId] = useState<string | null>(null);
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [phaseTemplates, setPhaseTemplates] = useState<PhaseTemplate[]>(defaultPhaseTemplates);

  // Memoized callbacks to prevent child re-renders
  const handleLogin = useCallback((role: UserRole, clientId?: string) => {
    setUserRole(role);
    if (clientId) {
      setCurrentClientId(clientId);
    }
  }, []);

  const handleLogout = useCallback(() => {
    setUserRole(null);
    setCurrentClientId(null);
  }, []);

  const handleUpdateClient = useCallback((clientId: string, updates: Partial<Client>) => {
    setClients(prev => prev.map(c =>
      c.id === clientId ? { ...c, ...updates } : c
    ));
  }, []);

  const handleAddClient = useCallback((client: Client) => {
    setClients(prev => [...prev, client]);
  }, []);

  const handleUpdateTemplates = useCallback((templates: PhaseTemplate[]) => {
    setPhaseTemplates(templates);
  }, []);

  const handleRequestFinalRecord = useCallback(() => {
    if (currentClientId) {
      setClients(prev => prev.map(c =>
        c.id === currentClientId ? { ...c, finalRecordStatus: "requested" as const } : c
      ));
    }
  }, [currentClientId]);

  // Memoized derived state
  const currentClient = useMemo(() => 
    clients.find(c => c.id === currentClientId),
    [clients, currentClientId]
  );

  // Render based on user role with Suspense for lazy loading
  return (
    <Suspense fallback={<LoadingFallback />}>
      {!userRole ? (
        <LoginPage onLogin={handleLogin} />
      ) : userRole === "client" && currentClient ? (
        <ClientDashboard
          client={currentClient}
          onLogout={handleLogout}
          onRequestFinalRecord={handleRequestFinalRecord}
        />
      ) : userRole === "admin" ? (
        <AdminPanel
          clients={clients}
          onLogout={handleLogout}
          onUpdateClient={handleUpdateClient}
          onAddClient={handleAddClient}
          phaseTemplates={phaseTemplates}
          onUpdateTemplates={handleUpdateTemplates}
        />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </Suspense>
  );
}

export default App;
