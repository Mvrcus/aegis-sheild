// src/App.tsx - Aegis Shield Client Portal Mock

import { useState } from "react";
import "./App.css";

// ============ TYPES ============
type UserRole = "client" | "admin" | null;
type ProductType = "ZEUS" | "HESTIA";
type FinalRecordStatus = "not_requested" | "requested" | "generated" | "delivered";

interface Phase {
  id: string;
  name: string;
  steps: Step[];
  modules: string[]; // Which HESTIA modules this phase belongs to (empty = all/ZEUS)
}

interface Step {
  id: string;
  name: string;
  completed: boolean;
}

interface UploadedFile {
  id: string;
  name: string;
  type: "document" | "image" | "video";
  uploadedBy: "client" | "admin";
  uploadedAt: string;
  size: string;
}

interface MeetingLink {
  id: string;
  title: string;
  url: string;
  date: string;
}

interface Client {
  id: string;
  name: string;
  email: string;
  product: ProductType;
  hestiaModules: string[];
  progress: number;
  phases: Phase[];
  clientFiles: UploadedFile[];
  adminFiles: UploadedFile[];
  meetingLinks: MeetingLink[];
  finalRecordStatus: FinalRecordStatus;
}

// ============ MOCK DATA ============
const createPhases = (): Phase[] => [
  {
    id: "vetting",
    name: "Vetting Phase",
    modules: ["vetting"],
    steps: [
      { id: "v1", name: "Initial consultation completed", completed: true },
      { id: "v2", name: "Contractor credentials verified", completed: true },
      { id: "v3", name: "License and insurance confirmed", completed: false },
      { id: "v4", name: "Reference check completed", completed: false },
    ],
  },
  {
    id: "review",
    name: "Review Phase",
    modules: ["review"],
    steps: [
      { id: "r1", name: "Contract review initiated", completed: true },
      { id: "r2", name: "Scope of work documented", completed: true },
      { id: "r3", name: "Payment terms reviewed", completed: false },
      { id: "r4", name: "Timeline approved", completed: false },
    ],
  },
  {
    id: "design",
    name: "Design & Material Phase",
    modules: ["design"],
    steps: [
      { id: "d1", name: "Design consultation scheduled", completed: false },
      { id: "d2", name: "Material selections documented", completed: false },
      { id: "d3", name: "Design approval received", completed: false },
      { id: "d4", name: "Material orders placed", completed: false },
    ],
  },
  {
    id: "inspection",
    name: "Inspection & Warranty Phase",
    modules: ["inspection"],
    steps: [
      { id: "i1", name: "Pre-work inspection completed", completed: false },
      { id: "i2", name: "Mid-project inspection scheduled", completed: false },
      { id: "i3", name: "Final inspection completed", completed: false },
      { id: "i4", name: "Warranty documentation collected", completed: false },
    ],
  },
  {
    id: "dispute",
    name: "Dispute & Completion",
    modules: ["dispute"],
    steps: [
      { id: "dc1", name: "Final walkthrough scheduled", completed: false },
      { id: "dc2", name: "Punch list created", completed: false },
      { id: "dc3", name: "All items resolved", completed: false },
      { id: "dc4", name: "Project signed off", completed: false },
    ],
  },
];

const mockClients: Client[] = [
  {
    id: "client1",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    product: "ZEUS",
    hestiaModules: [],
    progress: 35,
    phases: createPhases(),
    clientFiles: [
      { id: "f1", name: "contract_draft.pdf", type: "document", uploadedBy: "client", uploadedAt: "2026-01-15", size: "2.4 MB" },
      { id: "f2", name: "kitchen_before.jpg", type: "image", uploadedBy: "client", uploadedAt: "2026-01-18", size: "3.1 MB" },
      { id: "f3", name: "walkthrough_video.mp4", type: "video", uploadedBy: "client", uploadedAt: "2026-01-20", size: "45.2 MB" },
    ],
    adminFiles: [
      { id: "af1", name: "contractor_analysis.pdf", type: "document", uploadedBy: "admin", uploadedAt: "2026-01-17", size: "1.8 MB" },
      { id: "af2", name: "scope_review_annotated.pdf", type: "document", uploadedBy: "admin", uploadedAt: "2026-01-22", size: "3.2 MB" },
    ],
    meetingLinks: [
      { id: "m1", title: "Initial Consultation", url: "https://zoom.us/j/123456789", date: "2026-01-25 2:00 PM" },
      { id: "m2", title: "Contract Review Call", url: "https://meet.google.com/abc-defg-hij", date: "2026-01-28 10:00 AM" },
    ],
    finalRecordStatus: "not_requested",
  },
  {
    id: "client2",
    name: "Michael Chen",
    email: "michael.chen@email.com",
    product: "HESTIA",
    hestiaModules: ["vetting", "review"],
    progress: 65,
    phases: createPhases(),
    clientFiles: [
      { id: "f4", name: "bid_comparison.xlsx", type: "document", uploadedBy: "client", uploadedAt: "2026-01-10", size: "856 KB" },
      { id: "f5", name: "contractor_license.pdf", type: "document", uploadedBy: "client", uploadedAt: "2026-01-12", size: "1.2 MB" },
    ],
    adminFiles: [
      { id: "af3", name: "vetting_report.pdf", type: "document", uploadedBy: "admin", uploadedAt: "2026-01-14", size: "2.1 MB" },
    ],
    meetingLinks: [
      { id: "m3", title: "Vetting Results Review", url: "https://zoom.us/j/987654321", date: "2026-01-30 3:00 PM" },
    ],
    finalRecordStatus: "requested",
  },
  {
    id: "client3",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@email.com",
    product: "ZEUS",
    hestiaModules: [],
    progress: 85,
    phases: createPhases().map((phase, idx) => ({
      ...phase,
      steps: phase.steps.map((step, stepIdx) => ({
        ...step,
        completed: idx < 4 || (idx === 4 && stepIdx < 2),
      })),
    })),
    clientFiles: [
      { id: "f6", name: "final_contract.pdf", type: "document", uploadedBy: "client", uploadedAt: "2025-12-01", size: "4.5 MB" },
      { id: "f7", name: "renovation_complete.jpg", type: "image", uploadedBy: "client", uploadedAt: "2026-01-24", size: "5.2 MB" },
    ],
    adminFiles: [
      { id: "af4", name: "full_project_analysis.pdf", type: "document", uploadedBy: "admin", uploadedAt: "2026-01-20", size: "8.7 MB" },
      { id: "af5", name: "warranty_documentation.pdf", type: "document", uploadedBy: "admin", uploadedAt: "2026-01-23", size: "2.3 MB" },
    ],
    meetingLinks: [
      { id: "m4", title: "Final Walkthrough", url: "https://zoom.us/j/456789123", date: "2026-02-01 11:00 AM" },
    ],
    finalRecordStatus: "generated",
  },
];

// ============ COMPONENTS ============

// Login Page Component
function LoginPage({ onLogin }: { onLogin: (role: UserRole, clientId?: string) => void }) {
  return (
    <div className="login-page">
      <div className="login-wrapper">
        <div className="login-branding">
          <div className="login-branding-content">
            <h2>Protect Your Home Renovation Investment</h2>
            <p>Aegis Shield provides comprehensive protection throughout your entire renovation project, from contractor vetting to final inspection.</p>
            <ul className="login-features">
              <li>Expert contractor vetting and verification</li>
              <li>Contract review and negotiation support</li>
              <li>Design and material consultation</li>
              <li>Independent inspections and quality assurance</li>
              <li>Dispute resolution and project completion</li>
            </ul>
          </div>
        </div>
        <div className="login-container">
          <div className="login-logo">
            <div className="shield-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
              </svg>
            </div>
            <h1>Aegis Shield</h1>
            <p className="tagline">Client Protection Portal</p>
          </div>

          <div className="login-buttons">
            <button
              className="login-btn client-btn"
              onClick={() => onLogin("client", "client1")}
            >
              <span className="btn-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </span>
              <span className="btn-text">
                <strong>Client Login</strong>
                <small>Access your project dashboard</small>
              </span>
            </button>

            <button
              className="login-btn admin-btn"
              onClick={() => onLogin("admin")}
            >
              <span className="btn-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
                </svg>
              </span>
              <span className="btn-text">
                <strong>Admin Login</strong>
                <small>Manage all client projects</small>
              </span>
            </button>
          </div>

          <p className="demo-note">
            This is a demo portal with mock data
          </p>
        </div>
      </div>
    </div>
  );
}

// Client Dashboard Component
function ClientDashboard({
  client,
  onLogout,
  onRequestFinalRecord
}: {
  client: Client;
  onLogout: () => void;
  onRequestFinalRecord: () => void;
}) {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  // Filter phases based on product type
  const visiblePhases = client.product === "ZEUS"
    ? client.phases
    : client.phases.filter(phase =>
        client.hestiaModules.some(mod => phase.modules.includes(mod))
      );

  const getFileIcon = (type: string) => {
    switch (type) {
      case "document": return "📄";
      case "image": return "🖼️";
      case "video": return "🎬";
      default: return "📎";
    }
  };

  return (
    <div className="dashboard client-dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <div className="logo-small">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
            </svg>
            <span>Aegis Shield</span>
          </div>
        </div>
        <div className="header-right">
          <span className="user-name">{client.name}</span>
          <button className="logout-btn" onClick={onLogout}>Logout</button>
        </div>
      </header>

      <main className="dashboard-content">
        {/* Welcome Section */}
        <section className="welcome-section">
          <h1>Welcome, {client.name.split(" ")[0]}!</h1>
          <div className="product-badge">
            <span className={`badge ${client.product.toLowerCase()}`}>
              {client.product === "ZEUS" ? "ZEUS Full Bundle" : "HESTIA A La Carte"}
            </span>
            {client.product === "HESTIA" && (
              <span className="modules-list">
                Modules: {client.hestiaModules.map(m => m.charAt(0).toUpperCase() + m.slice(1)).join(", ")}
              </span>
            )}
          </div>
        </section>

        {/* Progress Bar */}
        <section className="progress-section card">
          <h2>Project Progress</h2>
          <div className="progress-container">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${client.progress}%` }}
              />
            </div>
            <span className="progress-text">{client.progress}% Complete</span>
          </div>
        </section>

        {/* Phase Checklist */}
        <section className="phases-section card">
          <h2>Project Phases</h2>
          <div className="phases-list">
            {visiblePhases.map(phase => {
              const completedSteps = phase.steps.filter(s => s.completed).length;
              const totalSteps = phase.steps.length;
              const phaseProgress = Math.round((completedSteps / totalSteps) * 100);

              return (
                <div key={phase.id} className="phase-item">
                  <div className="phase-header">
                    <h3>{phase.name}</h3>
                    <span className="phase-progress">{completedSteps}/{totalSteps} steps</span>
                  </div>
                  <div className="phase-progress-bar">
                    <div className="phase-fill" style={{ width: `${phaseProgress}%` }} />
                  </div>
                  <ul className="steps-list">
                    {phase.steps.map(step => (
                      <li key={step.id} className={step.completed ? "completed" : ""}>
                        <span className="step-check">
                          {step.completed ? "✓" : "○"}
                        </span>
                        {step.name}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* File Upload Section */}
        <section className="upload-section card">
          <div className="section-header">
            <h2>Your Uploads</h2>
            <button className="upload-btn" onClick={() => setUploadModalOpen(true)}>
              + Upload File
            </button>
          </div>
          {client.clientFiles.length > 0 ? (
            <table className="files-table">
              <thead>
                <tr>
                  <th>File</th>
                  <th>Type</th>
                  <th>Uploaded</th>
                  <th>Size</th>
                </tr>
              </thead>
              <tbody>
                {client.clientFiles.map(file => (
                  <tr key={file.id}>
                    <td>
                      <span className="file-icon">{getFileIcon(file.type)}</span>
                      {file.name}
                    </td>
                    <td className="capitalize">{file.type}</td>
                    <td>{file.uploadedAt}</td>
                    <td>{file.size}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="empty-state">No files uploaded yet</p>
          )}
        </section>

        {/* Deliverables Section */}
        <section className="deliverables-section card">
          <h2>Deliverables from Aegis Shield</h2>
          {client.adminFiles.length > 0 ? (
            <table className="files-table">
              <thead>
                <tr>
                  <th>Document</th>
                  <th>Date</th>
                  <th>Size</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {client.adminFiles.map(file => (
                  <tr key={file.id}>
                    <td>
                      <span className="file-icon">{getFileIcon(file.type)}</span>
                      {file.name}
                    </td>
                    <td>{file.uploadedAt}</td>
                    <td>{file.size}</td>
                    <td>
                      <button className="download-btn">Download</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="empty-state">No deliverables available yet</p>
          )}
        </section>

        {/* Meeting Links */}
        <section className="meetings-section card">
          <h2>Scheduled Meetings</h2>
          {client.meetingLinks.length > 0 ? (
            <div className="meetings-list">
              {client.meetingLinks.map(meeting => (
                <div key={meeting.id} className="meeting-item">
                  <div className="meeting-info">
                    <strong>{meeting.title}</strong>
                    <span className="meeting-date">{meeting.date}</span>
                  </div>
                  <a href={meeting.url} target="_blank" rel="noopener noreferrer" className="join-btn">
                    Join Meeting
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-state">No meetings scheduled</p>
          )}
        </section>

        {/* Final Project Record */}
        <section className="final-record-section card">
          <h2>Final Project Record</h2>
          <p>Request a compiled package of all project documentation, files, and deliverables.</p>
          <div className="record-status">
            <span className="status-label">Status:</span>
            <span className={`status-badge ${client.finalRecordStatus}`}>
              {client.finalRecordStatus === "not_requested" && "Not Requested"}
              {client.finalRecordStatus === "requested" && "Requested - Pending"}
              {client.finalRecordStatus === "generated" && "Ready for Download"}
              {client.finalRecordStatus === "delivered" && "Delivered"}
            </span>
          </div>
          {client.finalRecordStatus === "not_requested" && (
            <button className="request-record-btn" onClick={onRequestFinalRecord}>
              Request Final Project Record
            </button>
          )}
          {client.finalRecordStatus === "generated" && (
            <button className="download-record-btn">
              Download Final Record (ZIP)
            </button>
          )}
        </section>
      </main>

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="modal-overlay" onClick={() => setUploadModalOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Upload File</h3>
            <div className="upload-area">
              <div className="upload-icon">📁</div>
              <p>Drag and drop files here or click to browse</p>
              <p className="upload-hint">Supports: PDF, Images, Videos, Documents</p>
              <input type="file" className="file-input" />
            </div>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setUploadModalOpen(false)}>Cancel</button>
              <button className="submit-btn" onClick={() => setUploadModalOpen(false)}>Upload</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Admin Panel Component
function AdminPanel({
  clients,
  onLogout,
  onUpdateClient
}: {
  clients: Client[];
  onLogout: () => void;
  onUpdateClient: (clientId: string, updates: Partial<Client>) => void;
}) {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

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
        </div>
        <div className="header-right">
          <span className="user-name">Administrator</span>
          <button className="logout-btn" onClick={onLogout}>Logout</button>
        </div>
      </header>

      <div className="admin-layout">
        {/* Client List Sidebar */}
        <aside className="client-sidebar">
          <div className="sidebar-header">
            <h2>Clients</h2>
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
                onClick={() => setSelectedClient(client)}
              >
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

              {/* Progress Management */}
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

              {/* Phase/Step Management */}
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
    </div>
  );
}

// ============ MAIN APP ============
function App() {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [currentClientId, setCurrentClientId] = useState<string | null>(null);
  const [clients, setClients] = useState<Client[]>(mockClients);

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
      />
    );
  }

  return <LoginPage onLogin={handleLogin} />;
}

export default App;
