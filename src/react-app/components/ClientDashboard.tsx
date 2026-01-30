import { useState } from "react";
import type { Client } from "../types";

interface ClientDashboardProps {
  client: Client;
  onLogout: () => void;
  onRequestFinalRecord: () => void;
}

export function ClientDashboard({
  client,
  onLogout,
  onRequestFinalRecord
}: ClientDashboardProps) {
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
          <div className="welcome-content">
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
          </div>
          {/* Progress - inline with welcome on desktop */}
          <div className="welcome-progress">
            <div className="progress-ring-container">
              <svg className="progress-ring" viewBox="0 0 100 100">
                <circle className="progress-ring-bg" cx="50" cy="50" r="42" />
                <circle 
                  className="progress-ring-fill" 
                  cx="50" cy="50" r="42"
                  style={{ strokeDashoffset: `${264 - (264 * client.progress) / 100}` }}
                />
              </svg>
              <span className="progress-ring-text">{client.progress}%</span>
            </div>
            <span className="progress-label">Complete</span>
          </div>
        </section>

        {/* Main Dashboard Grid */}
        <div className="client-dashboard-grid">
          {/* Main Content - Project Phases */}
          <div className="dashboard-main">
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
                        <span className="phase-progress">{completedSteps}/{totalSteps}</span>
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

            {/* Final Project Record - Below phases in main content */}
            <section className="final-record-section card">
              <div className="final-record-content">
                <div className="final-record-info">
                  <h2>Final Project Record</h2>
                  <p>Request a compiled package of all project documentation, files, and deliverables.</p>
                </div>
                <div className="final-record-actions">
                  <span className={`status-badge ${client.finalRecordStatus}`}>
                    {client.finalRecordStatus === "not_requested" && "Not Requested"}
                    {client.finalRecordStatus === "requested" && "Requested - Pending"}
                    {client.finalRecordStatus === "generated" && "Ready for Download"}
                    {client.finalRecordStatus === "delivered" && "Delivered"}
                  </span>
                  {client.finalRecordStatus === "not_requested" && (
                    <button className="request-record-btn" onClick={onRequestFinalRecord}>
                      Request Final Record
                    </button>
                  )}
                  {client.finalRecordStatus === "generated" && (
                    <button className="download-record-btn">
                      Download ZIP
                    </button>
                  )}
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar - Meetings, Uploads, Deliverables */}
          <aside className="dashboard-sidebar">
            {/* Scheduled Meetings */}
            <section className="meetings-section card compact">
              <h2>Scheduled Meetings</h2>
              {client.meetingLinks.length > 0 ? (
                <div className="meetings-list compact">
                  {client.meetingLinks.map(meeting => (
                    <div key={meeting.id} className="meeting-item compact">
                      <div className="meeting-info">
                        <strong>{meeting.title}</strong>
                        <span className="meeting-date">{meeting.date}</span>
                      </div>
                      <a href={meeting.url} target="_blank" rel="noopener noreferrer" className="join-btn compact">
                        Join
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-state compact">No meetings scheduled</p>
              )}
            </section>

            {/* Your Uploads */}
            <section className="upload-section card compact">
              <div className="section-header">
                <h2>Your Uploads</h2>
                <button className="upload-btn compact" onClick={() => setUploadModalOpen(true)}>
                  +
                </button>
              </div>
              {client.clientFiles.length > 0 ? (
                <div className="files-list compact">
                  {client.clientFiles.map(file => (
                    <div key={file.id} className="file-item compact">
                      <span className="file-icon">{getFileIcon(file.type)}</span>
                      <div className="file-info">
                        <span className="file-name">{file.name}</span>
                        <span className="file-meta">{file.size}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-state compact">No files uploaded</p>
              )}
            </section>

            {/* Deliverables from Aegis */}
            <section className="deliverables-section card compact">
              <h2>Deliverables</h2>
              {client.adminFiles.length > 0 ? (
                <div className="files-list compact">
                  {client.adminFiles.map(file => (
                    <div key={file.id} className="file-item compact">
                      <span className="file-icon">{getFileIcon(file.type)}</span>
                      <div className="file-info">
                        <span className="file-name">{file.name}</span>
                        <span className="file-meta">{file.size}</span>
                      </div>
                      <button className="download-btn compact">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-state compact">No deliverables yet</p>
              )}
            </section>
          </aside>
        </div>
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
