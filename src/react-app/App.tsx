// src/App.tsx - Aegis Shield Client Portal

import { useState } from "react";
import "./App.css";

// Types
import type { UserRole, Client, PhaseTemplate } from "./types";

// Data
import { mockClients, defaultPhaseTemplates } from "./data/mockData";

// Components
import { LoginPage } from "./components/LoginPage";
import { ClientDashboard } from "./components/ClientDashboard";
import { AdminPanel } from "./components/AdminPanel";

// ============ MAIN APP ============
function App() {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [currentClientId, setCurrentClientId] = useState<string | null>(null);
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [phaseTemplates, setPhaseTemplates] = useState<PhaseTemplate[]>(defaultPhaseTemplates);

  const handleLogin = (role: UserRole, clientId?: string) => {
    setUserRole(role);
    if (clientId) {
      setCurrentClientId(clientId);
    }
  };

  const handleLogout = () => {
    setUserRole(null);
    setCurrentClientId(null);
  };

  const handleUpdateClient = (clientId: string, updates: Partial<Client>) => {
    setClients(prev => prev.map(c =>
      c.id === clientId ? { ...c, ...updates } : c
    ));
  };

  const handleAddClient = (client: Client) => {
    setClients(prev => [...prev, client]);
  };

  const handleUpdateTemplates = (templates: PhaseTemplate[]) => {
    setPhaseTemplates(templates);
  };

  const handleRequestFinalRecord = () => {
    if (currentClientId) {
      handleUpdateClient(currentClientId, { finalRecordStatus: "requested" });
    }
  };

  const currentClient = clients.find(c => c.id === currentClientId);

  // Render based on user role
  if (!userRole) {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (userRole === "client" && currentClient) {
    return (
      <ClientDashboard
        client={currentClient}
        onLogout={handleLogout}
        onRequestFinalRecord={handleRequestFinalRecord}
      />
    );
  }

  if (userRole === "admin") {
    return (
      <AdminPanel
        clients={clients}
        onLogout={handleLogout}
        onUpdateClient={handleUpdateClient}
        onAddClient={handleAddClient}
        phaseTemplates={phaseTemplates}
        onUpdateTemplates={handleUpdateTemplates}
      />
    );
  }

  return <LoginPage onLogin={handleLogin} />;
}

export default App;
