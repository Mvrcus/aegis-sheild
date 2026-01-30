import { useState, useCallback, useMemo, memo } from "react";
import type { Client, PhaseTemplate, Phase, ProductType, Step } from "../types";
import { AVAILABLE_MODULES } from "../data/mockData";
import { getFileIcon, getStatusColor, generateId, getInitials } from "../utils/helpers";
import { PhaseTemplateManager } from "./PhaseTemplateManager";
import { ShieldIcon, ChevronRightIcon, UserFilledIcon, DocumentIcon } from "./ui/Icons";
import { UploadModal } from "./ui/Modal";

// Step Description Edit Modal
const StepEditModal = memo(function StepEditModal({
  step,
  phaseName,
  onSave,
  onClose
}: {
  step: Step;
  phaseName: string;
  onSave: (description: string) => void;
  onClose: () => void;
}) {
  const [description, setDescription] = useState(step.description || "");

  const handleSave = () => {
    onSave(description);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal step-edit-modal" onClick={e => e.stopPropagation()}>
        <h3>Edit Step Details</h3>
        <div className="step-edit-info">
          <span className="step-edit-phase">{phaseName}</span>
          <span className="step-edit-name">{step.name}</span>
        </div>
        
        <div className="form-group">
          <label>Description</label>
          <p className="form-hint">
            This description is specific to this client. Changes won't affect other clients or the template.
          </p>
          <textarea
            className="step-description-input"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Enter details about this step that will help the client understand what's happening..."
            rows={6}
          />
        </div>

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="submit-btn" onClick={handleSave}>Save Changes</button>
        </div>
      </div>
    </div>
  );
});

interface AdminPanelProps {
  clients: Client[];
  onLogout: () => void;
  onUpdateClient: (clientId: string, updates: Partial<Client>) => void;
  onAddClient: (client: Client) => void;
  phaseTemplates: PhaseTemplate[];
  onUpdateTemplates: (templates: PhaseTemplate[]) => void;
}

// Memoized client list item to prevent re-renders
const ClientListItem = memo(function ClientListItem({
  client,
  isSelected,
  onSelect,
}: {
  client: Client;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <li
      className={`client-item ${isSelected ? "selected" : ""}`}
      onClick={onSelect}
    >
      <div className="client-avatar-inline" data-product={client.product.toLowerCase()}>
        {getInitials(client.name)}
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
  );
});

// Memoized client avatar for collapsed view
const ClientAvatar = memo(function ClientAvatar({
  client,
  isSelected,
  onSelect,
}: {
  client: Client;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <li
      className={`client-avatar ${isSelected ? "selected" : ""} ${client.product.toLowerCase()}`}
      onClick={onSelect}
      title={client.name}
    >
      {getInitials(client.name)}
    </li>
  );
});

export const AdminPanel = memo(function AdminPanel({
  clients,
  onLogout,
  onUpdateClient,
  onAddClient,
  phaseTemplates,
  onUpdateTemplates,
}: AdminPanelProps) {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
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

  // Step edit modal state
  const [editingStep, setEditingStep] = useState<{ step: Step; phaseId: string; phaseName: string } | null>(null);

  // Memoized selected client lookup
  const selectedClient = useMemo(() => 
    clients.find(c => c.id === selectedClientId) ?? null,
    [clients, selectedClientId]
  );

  // Memoized filtered clients
  const filteredClients = useMemo(() => {
    const term = searchTerm.toLowerCase();
    if (!term) return clients;
    return clients.filter(c =>
      c.name.toLowerCase().includes(term) ||
      c.email.toLowerCase().includes(term)
    );
  }, [clients, searchTerm]);

  // Create phases from templates based on product type and selected modules
  const createPhasesFromTemplates = useCallback((product: ProductType, modules: string[]): Phase[] => {
    const relevantTemplates = product === "ZEUS"
      ? phaseTemplates
      : phaseTemplates.filter(template =>
          template.modules.length === 0 ||
          template.modules.some(mod => modules.includes(mod))
        );

    return relevantTemplates.map(template => ({
      id: template.id,
      name: template.name,
      description: template.description, // Copy phase description from template
      modules: template.modules,
      steps: template.steps.map(step => ({
        id: step.id,
        name: step.name,
        description: step.description, // Copy step description from template
        completed: false,
      })),
    }));
  }, [phaseTemplates]);

  const handleAddNewClient = useCallback(() => {
    if (!newClientName.trim() || !newClientEmail.trim()) return;
    if (newClientProduct === "HESTIA" && newClientModules.length === 0) return;

    const phases = createPhasesFromTemplates(newClientProduct, newClientModules);

    const newClient: Client = {
      id: generateId("client"),
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
    setSelectedClientId(newClient.id);

    // Reset form
    setNewClientName("");
    setNewClientEmail("");
    setNewClientProduct("ZEUS");
    setNewClientModules([]);
    setNewClientModalOpen(false);
  }, [newClientName, newClientEmail, newClientProduct, newClientModules, createPhasesFromTemplates, onAddClient]);

  const toggleNewClientModule = useCallback((moduleId: string) => {
    setNewClientModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(m => m !== moduleId)
        : [...prev, moduleId]
    );
  }, []);

  const resetNewClientModal = useCallback(() => {
    setNewClientName("");
    setNewClientEmail("");
    setNewClientProduct("ZEUS");
    setNewClientModules([]);
    setNewClientModalOpen(false);
  }, []);

  const handleStepToggle = useCallback((phaseId: string, stepId: string) => {
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
  }, [selectedClient, onUpdateClient]);

  const handleUpdateStepDescription = useCallback((phaseId: string, stepId: string, description: string) => {
    if (!selectedClient) return;

    const updatedPhases = selectedClient.phases.map(phase => {
      if (phase.id !== phaseId) return phase;
      return {
        ...phase,
        steps: phase.steps.map(step => {
          if (step.id !== stepId) return step;
          return { ...step, description };
        }),
      };
    });

    onUpdateClient(selectedClient.id, { phases: updatedPhases });
  }, [selectedClient, onUpdateClient]);

  const handleSelectClient = useCallback((clientId: string) => {
    setSelectedClientId(clientId);
    setSidebarCollapsed(true);
  }, []);

  const handleExpandSidebar = useCallback(() => {
    setSidebarCollapsed(false);
  }, []);

  const handleOpenNewClientModal = useCallback(() => {
    setNewClientModalOpen(true);
  }, []);

  const handleCloseUploadModal = useCallback(() => {
    setUploadModalOpen(false);
  }, []);

  const handleOpenUploadModal = useCallback(() => {
    setUploadModalOpen(true);
  }, []);

  const handleSetAdminViewClients = useCallback(() => {
    setAdminView("clients");
  }, []);

  const handleSetAdminViewTemplates = useCallback(() => {
    setAdminView("templates");
  }, []);

  // Memoized validation for submit button
  const isNewClientValid = useMemo(() => 
    newClientName.trim() && 
    newClientEmail.trim() && 
    (newClientProduct !== "HESTIA" || newClientModules.length > 0),
    [newClientName, newClientEmail, newClientProduct, newClientModules]
  );

  return (
    <div className="dashboard admin-dashboard">
      <header className="dashboard-header admin-header">
        <div className="header-left">
          <div className="logo-small">
            <ShieldIcon />
            <span>Aegis Shield Admin</span>
          </div>
          <nav className="admin-nav">
            <button
              className={`nav-tab ${adminView === "clients" ? "active" : ""}`}
              onClick={handleSetAdminViewClients}
            >
              Clients
            </button>
            <button
              className={`nav-tab ${adminView === "templates" ? "active" : ""}`}
              onClick={handleSetAdminViewTemplates}
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
          <button 
            className="sidebar-expand-btn" 
            onClick={handleExpandSidebar}
            title="Expand client list"
          >
            <ChevronRightIcon />
          </button>

          {/* Collapsed view - avatars only */}
          <div className="sidebar-collapsed-content">
            <ul className="client-avatars">
              {filteredClients.map(client => (
                <ClientAvatar
                  key={client.id}
                  client={client}
                  isSelected={selectedClientId === client.id}
                  onSelect={() => handleSelectClient(client.id)}
                />
              ))}
            </ul>
          </div>
          
          {/* Expanded view - full client list */}
          <div className="sidebar-expanded">
            <div className="sidebar-header">
              <div className="sidebar-title-row">
                <h2>Clients</h2>
                <button className="add-client-btn" onClick={handleOpenNewClientModal}>
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
                <ClientListItem
                  key={client.id}
                  client={client}
                  isSelected={selectedClientId === client.id}
                  onSelect={() => handleSelectClient(client.id)}
                />
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
                <p className="section-subtitle">Check off steps as they're completed. Click the edit icon to customize step details for this client.</p>
                <div className="phases-admin">
                  {selectedClient.phases.map(phase => (
                    <div key={phase.id} className="phase-admin-item">
                      <h3>{phase.name}</h3>
                      {phase.description && (
                        <p className="phase-admin-description">{phase.description}</p>
                      )}
                      <ul className="steps-admin-list">
                        {phase.steps.map(step => (
                          <li key={step.id} className="step-admin-item">
                            <label className="step-checkbox">
                              <input
                                type="checkbox"
                                checked={step.completed}
                                onChange={() => handleStepToggle(phase.id, step.id)}
                              />
                              <div className="step-checkbox-content">
                                <span className={step.completed ? "completed" : ""}>{step.name}</span>
                                {step.description && (
                                  <span className="step-description-preview">
                                    {step.description.length > 60 
                                      ? step.description.slice(0, 60) + '...' 
                                      : step.description}
                                  </span>
                                )}
                              </div>
                            </label>
                            <button 
                              className="action-btn icon-btn small"
                              onClick={() => setEditingStep({ step, phaseId: phase.id, phaseName: phase.name })}
                              title="Edit step details"
                            >
                              <DocumentIcon />
                            </button>
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
                  <button className="upload-btn" onClick={handleOpenUploadModal}>
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
                <UserFilledIcon />
              </div>
              <h2>Select a Client</h2>
              <p>Choose a client from the list to view and manage their project</p>
            </div>
          )}
        </main>
      </div>
      )}

      {/* Upload Modal */}
      <UploadModal
        isOpen={uploadModalOpen}
        onClose={handleCloseUploadModal}
        title="Upload Deliverable"
        hint="Supports: PDF, Images, Documents"
      />

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
                disabled={!isNewClientValid}
              >
                Create Client
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step Edit Modal */}
      {editingStep && (
        <StepEditModal
          step={editingStep.step}
          phaseName={editingStep.phaseName}
          onSave={(description) => handleUpdateStepDescription(editingStep.phaseId, editingStep.step.id, description)}
          onClose={() => setEditingStep(null)}
        />
      )}
    </div>
  );
});
