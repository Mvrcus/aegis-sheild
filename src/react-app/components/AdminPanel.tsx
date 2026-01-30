import { useState } from "react";
import type { Client, PhaseTemplate, Phase, FinalRecordStatus, ProductType } from "../types";
import { AVAILABLE_MODULES } from "../data/mockData";
import { PhaseTemplateManager } from "./PhaseTemplateManager";

interface AdminPanelProps {
  clients: Client[];
  onLogout: () => void;
  onUpdateClient: (clientId: string, updates: Partial<Client>) => void;
  onAddClient: (client: Client) => void;
  phaseTemplates: PhaseTemplate[];
  onUpdateTemplates: (templates: PhaseTemplate[]) => void;
}

export function AdminPanel({
  clients,
  onLogout,
  onUpdateClient,
  onAddClient,
  phaseTemplates,
  onUpdateTemplates,
}: AdminPanelProps) {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [adminView, setAdminView] = useState<"clients" | "templates">("clients");

  // New client modal state
  const [newClientModalOpen, setNewClientModalOpen] = useState(false);
  const [newClientName, setNewClientName] = useState("");
  const [newClientEmail, setNewClientEmail] = useState("");
  const [newClientProduct, setNewClientProduct] = useState<ProductType>("ZEUS");
  const [newClientModules, setNewClientModules] = useState<string[]>([]);

  const generateId = () => `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Create phases from templates based on product type and selected modules
  const createPhasesFromTemplates = (product: ProductType, modules: string[]): Phase[] => {
    // Filter templates based on product type and selected modules
    const relevantTemplates = product === "ZEUS"
      ? phaseTemplates
      : phaseTemplates.filter(template =>
          template.modules.length === 0 || // Universal phases
          template.modules.some(mod => modules.includes(mod))
        );

    return relevantTemplates.map(template => ({
      id: template.id,
      name: template.name,
      modules: template.modules,
      steps: template.steps.map(step => ({
        id: step.id,
        name: step.name,
        completed: false,
      })),
    }));
  };

  const handleAddNewClient = () => {
    if (!newClientName.trim() || !newClientEmail.trim()) return;
    if (newClientProduct === "HESTIA" && newClientModules.length === 0) return;

    const phases = createPhasesFromTemplates(newClientProduct, newClientModules);

    const newClient: Client = {
      id: generateId(),
      name: newClientName.trim(),
      email: newClientEmail.trim(),
      product: newClientProduct,
      hestiaModules: newClientProduct === "HESTIA" ? newClientModules : [],
      progress: 0,
      phases,
      clientFiles: [],
      adminFiles: [],
      meetingLinks: [],
      finalRecordStatus: "not_requested",
    };

    onAddClient(newClient);
    setSelectedClient(newClient);

    // Reset form
    setNewClientName("");
    setNewClientEmail("");
    setNewClientProduct("ZEUS");
    setNewClientModules([]);
    setNewClientModalOpen(false);
  };

  const toggleNewClientModule = (moduleId: string) => {
    setNewClientModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(m => m !== moduleId)
        : [...prev, moduleId]
    );
  };

  const resetNewClientModal = () => {
    setNewClientName("");
    setNewClientEmail("");
    setNewClientProduct("ZEUS");
    setNewClientModules([]);
    setNewClientModalOpen(false);
  };

  const filteredClients = clients.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStepToggle = (phaseId: string, stepId: string) => {
    if (!selectedClient) return;

    const updatedPhases = selectedClient.phases.map(phase => {
      if (phase.id !== phaseId) return phase;
      return {
        ...phase,
        steps: phase.steps.map(step => {
          if (step.id !== stepId) return step;
          return { ...step, completed: !step.completed };
        }),
      };
    });

    // Recalculate progress
    const totalSteps = updatedPhases.flatMap(p => p.steps).length;
    const completedSteps = updatedPhases.flatMap(p => p.steps).filter(s => s.completed).length;
    const newProgress = Math.round((completedSteps / totalSteps) * 100);

    onUpdateClient(selectedClient.id, { phases: updatedPhases, progress: newProgress });
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "document": return "📄";
      case "image": return "🖼️";
      case "video": return "🎬";
      default: return "📎";
    }
  };

  const getStatusColor = (status: FinalRecordStatus) => {
    switch (status) {
      case "not_requested": return "#6b7280";
      case "requested": return "#f59e0b";
      case "generated": return "#10b981";
      case "delivered": return "#3b82f6";
      default: return "#6b7280";
    }
  };

  return (
    <div className="dashboard admin-dashboard">
      <header className="dashboard-header admin-header">
        <div className="header-left">
          <div className="logo-small">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
            </svg>
            <span>Aegis Shield Admin</span>
          </div>
          <nav className="admin-nav">
            <button
              className={`nav-tab ${adminView === "clients" ? "active" : ""}`}
              onClick={() => setAdminView("clients")}
            >
              Clients
            </button>
            <button
              className={`nav-tab ${adminView === "templates" ? "active" : ""}`}
              onClick={() => setAdminView("templates")}
            >
              Phase Templates
            </button>
          </nav>
        </div>
        <div className="header-right">
          <span className="user-name">Administrator</span>
          <button className="logout-btn" onClick={onLogout}>Logout</button>
        </div>
      </header>

      {adminView === "templates" ? (
        <div className="admin-templates-view">
          <PhaseTemplateManager
            phaseTemplates={phaseTemplates}
            onUpdateTemplates={onUpdateTemplates}
          />
        </div>
      ) : (
      <div className={`admin-layout ${sidebarCollapsed ? 'sidebar-collapsed-state' : ''}`}>
        {/* Client List Sidebar */}
        <aside className="client-sidebar">
          {/* Expand button - floating on the edge */}
          <button 
            className="sidebar-expand-btn" 
            onClick={() => setSidebarCollapsed(false)}
            title="Expand client list"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>

          {/* Collapsed view - avatars only */}
          <div className="sidebar-collapsed-content">
            <ul className="client-avatars">
              {filteredClients.map(client => (
                <li
                  key={client.id}
                  className={`client-avatar ${selectedClient?.id === client.id ? "selected" : ""} ${client.product.toLowerCase()}`}
                  onClick={() => {
                    setSelectedClient(client);
                    setSidebarCollapsed(true);
                  }}
                  title={client.name}
                >
                  {client.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </li>
              ))}
            </ul>
          </div>
          
          {/* Expanded view - full client list */}
          <div className="sidebar-expanded">
            <div className="sidebar-header">
              <div className="sidebar-title-row">
                <h2>Clients</h2>
                <button className="add-client-btn" onClick={() => setNewClientModalOpen(true)}>
                  + New Client
                </button>
              </div>
              <input
                type="text"
                placeholder="Search clients..."
                className="search-input"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <ul className="client-list">
              {filteredClients.map(client => (
                <li
                  key={client.id}
                  className={`client-item ${selectedClient?.id === client.id ? "selected" : ""}`}
                  onClick={() => {
                    setSelectedClient(client);
                    setSidebarCollapsed(true);
                  }}
                >
                  <div className="client-avatar-inline" data-product={client.product.toLowerCase()}>
                    {client.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="client-info">
                    <strong>{client.name}</strong>
                    <span className="client-email">{client.email}</span>
                  </div>
                  <div className="client-meta">
                    <span className={`product-tag ${client.product.toLowerCase()}`}>
                      {client.product}
                    </span>
                    <span className="progress-tag">{client.progress}%</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Client Detail Panel */}
        <main className="admin-main">
          {selectedClient ? (
            <div className="client-detail">
              <div className="detail-header">
                <div>
                  <h1>{selectedClient.name}</h1>
                  <p className="client-email">{selectedClient.email}</p>
                </div>
                <div className="product-info">
                  <span className={`badge large ${selectedClient.product.toLowerCase()}`}>
                    {selectedClient.product}
                  </span>
                  {selectedClient.product === "HESTIA" && (
                    <div className="modules-edit">
                      <strong>Modules:</strong> {selectedClient.hestiaModules.join(", ")}
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Management - Full width */}
              <section className="admin-section">
                <h2>Progress Management</h2>
                <div className="progress-control">
                  <div className="progress-display">
                    <div className="progress-bar large">
                      <div
                        className="progress-fill"
                        style={{ width: `${selectedClient.progress}%` }}
                      />
                    </div>
                    <span className="progress-text">{selectedClient.progress}%</span>
                  </div>
                </div>
              </section>

              {/* Phase/Step Management - Full width */}
              <section className="admin-section">
                <h2>Phase & Step Management</h2>
                <div className="phases-admin">
                  {selectedClient.phases.map(phase => (
                    <div key={phase.id} className="phase-admin-item">
                      <h3>{phase.name}</h3>
                      <ul className="steps-admin-list">
                        {phase.steps.map(step => (
                          <li key={step.id}>
                            <label className="step-checkbox">
                              <input
                                type="checkbox"
                                checked={step.completed}
                                onChange={() => handleStepToggle(phase.id, step.id)}
                              />
                              <span className={step.completed ? "completed" : ""}>{step.name}</span>
                            </label>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              {/* Client Files */}
              <section className="admin-section">
                <h2>Client Uploaded Files</h2>
                {selectedClient.clientFiles.length > 0 ? (
                  <table className="files-table">
                    <thead>
                      <tr>
                        <th>File</th>
                        <th>Type</th>
                        <th>Uploaded</th>
                        <th>Size</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedClient.clientFiles.map(file => (
                        <tr key={file.id}>
                          <td>
                            <span className="file-icon">{getFileIcon(file.type)}</span>
                            {file.name}
                          </td>
                          <td className="capitalize">{file.type}</td>
                          <td>{file.uploadedAt}</td>
                          <td>{file.size}</td>
                          <td>
                            <button className="action-btn">View</button>
                            <button className="action-btn">Download</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="empty-state">No files uploaded by client</p>
                )}
              </section>

              {/* Admin Deliverables */}
              <section className="admin-section">
                <div className="section-header">
                  <h2>Deliverables (Admin Uploads)</h2>
                  <button className="upload-btn" onClick={() => setUploadModalOpen(true)}>
                    + Upload Deliverable
                  </button>
                </div>
                {selectedClient.adminFiles.length > 0 ? (
                  <table className="files-table">
                    <thead>
                      <tr>
                        <th>File</th>
                        <th>Uploaded</th>
                        <th>Size</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedClient.adminFiles.map(file => (
                        <tr key={file.id}>
                          <td>
                            <span className="file-icon">{getFileIcon(file.type)}</span>
                            {file.name}
                          </td>
                          <td>{file.uploadedAt}</td>
                          <td>{file.size}</td>
                          <td>
                            <button className="action-btn">Edit</button>
                            <button className="action-btn danger">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="empty-state">No deliverables uploaded yet</p>
                )}
              </section>

              {/* Meeting Links & Final Record Grid */}
              <div className="admin-sections-grid">
                {/* Meeting Links */}
                <section className="admin-section">
                  <div className="section-header">
                    <h2>Meeting Links</h2>
                    <button className="add-btn">+ Add Meeting Link</button>
                  </div>
                  {selectedClient.meetingLinks.length > 0 ? (
                    <div className="meetings-admin-list">
                      {selectedClient.meetingLinks.map(meeting => (
                        <div key={meeting.id} className="meeting-admin-item">
                          <div>
                            <strong>{meeting.title}</strong>
                            <span className="meeting-date">{meeting.date}</span>
                            <a href={meeting.url} target="_blank" rel="noopener noreferrer">{meeting.url}</a>
                          </div>
                          <div className="meeting-actions">
                            <button className="action-btn">Edit</button>
                            <button className="action-btn danger">Delete</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="empty-state">No meeting links added</p>
                  )}
                </section>

                {/* Final Record Status */}
                <section className="admin-section">
                  <h2>Final Project Record</h2>
                  <div className="final-record-admin">
                    <div className="record-status-admin">
                      <span>Status:</span>
                      <span
                        className="status-indicator"
                        style={{ backgroundColor: getStatusColor(selectedClient.finalRecordStatus) }}
                      >
                        {selectedClient.finalRecordStatus.replace("_", " ").toUpperCase()}
                      </span>
                    </div>
                    <div className="record-actions">
                      {selectedClient.finalRecordStatus === "requested" && (
                        <button className="generate-btn">Generate Final Record</button>
                      )}
                      {selectedClient.finalRecordStatus === "generated" && (
                        <button className="deliver-btn">Mark as Delivered</button>
                      )}
                      <button className="sync-btn">Sync to GHL</button>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          ) : (
            <div className="no-selection">
              <div className="no-selection-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              <h2>Select a Client</h2>
              <p>Choose a client from the list to view and manage their project</p>
            </div>
          )}
        </main>
      </div>
      )}

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="modal-overlay" onClick={() => setUploadModalOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Upload Deliverable</h3>
            <div className="upload-area">
              <div className="upload-icon">📁</div>
              <p>Drag and drop files here or click to browse</p>
              <p className="upload-hint">Supports: PDF, Images, Documents</p>
              <input type="file" className="file-input" />
            </div>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setUploadModalOpen(false)}>Cancel</button>
              <button className="submit-btn" onClick={() => setUploadModalOpen(false)}>Upload</button>
            </div>
          </div>
        </div>
      )}

      {/* New Client Modal */}
      {newClientModalOpen && (
        <div className="modal-overlay" onClick={resetNewClientModal}>
          <div className="modal new-client-modal" onClick={e => e.stopPropagation()}>
            <h3>Create New Client</h3>

            <div className="form-row">
              <div className="form-group">
                <label>Client Name</label>
                <input
                  type="text"
                  placeholder="e.g., John Smith"
                  value={newClientName}
                  onChange={e => setNewClientName(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="e.g., john.smith@email.com"
                  value={newClientEmail}
                  onChange={e => setNewClientEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Product Type</label>
              <div className="product-type-selector">
                <label className={`product-option ${newClientProduct === "ZEUS" ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="productType"
                    value="ZEUS"
                    checked={newClientProduct === "ZEUS"}
                    onChange={() => {
                      setNewClientProduct("ZEUS");
                      setNewClientModules([]);
                    }}
                  />
                  <div className="product-option-content">
                    <strong>ZEUS</strong>
                    <span>Full Bundle - All modules included</span>
                  </div>
                </label>
                <label className={`product-option ${newClientProduct === "HESTIA" ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="productType"
                    value="HESTIA"
                    checked={newClientProduct === "HESTIA"}
                    onChange={() => setNewClientProduct("HESTIA")}
                  />
                  <div className="product-option-content">
                    <strong>HESTIA</strong>
                    <span>A La Carte - Select specific modules</span>
                  </div>
                </label>
              </div>
            </div>

            {newClientProduct === "HESTIA" && (
              <div className="form-group">
                <label>Select Modules</label>
                <p className="form-hint">Choose which modules this client will have access to</p>
                <div className="module-checkboxes">
                  {AVAILABLE_MODULES.map(mod => (
                    <label key={mod.id} className="module-checkbox">
                      <input
                        type="checkbox"
                        checked={newClientModules.includes(mod.id)}
                        onChange={() => toggleNewClientModule(mod.id)}
                      />
                      <span>{mod.name}</span>
                    </label>
                  ))}
                </div>
                {newClientModules.length === 0 && (
                  <p className="form-error">Please select at least one module for HESTIA clients</p>
                )}
              </div>
            )}

            <div className="modal-actions">
              <button className="cancel-btn" onClick={resetNewClientModal}>Cancel</button>
              <button
                className="submit-btn"
                onClick={handleAddNewClient}
                disabled={
                  !newClientName.trim() ||
                  !newClientEmail.trim() ||
                  (newClientProduct === "HESTIA" && newClientModules.length === 0)
                }
              >
                Create Client
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
