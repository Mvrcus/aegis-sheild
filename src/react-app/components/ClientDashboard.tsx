import { useState, useCallback, useMemo, memo } from "react";
import type { Client, Phase } from "../types";
import { getFileIcon, capitalize } from "../utils/helpers";
import { ShieldIcon, DownloadIcon } from "./ui/Icons";
import { UploadModal } from "./ui/Modal";

interface ClientDashboardProps {
  client: Client;
  onLogout: () => void;
  onRequestFinalRecord: () => void;
}

// Memoized phase card component
const PhaseCard = memo(function PhaseCard({ phase }: { phase: Phase }) {
  const completedSteps = phase.steps.filter(s => s.completed).length;
  const totalSteps = phase.steps.length;
  const phaseProgress = Math.round((completedSteps / totalSteps) * 100);

  return (
    <div className="phase-item">
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
});

// Memoized file item component
const FileItem = memo(function FileItem({ 
  file, 
  showDownload = false 
}: { 
  file: { id: string; name: string; type: string; size: string }; 
  showDownload?: boolean;
}) {
  return (
    <div className="file-item compact">
      <span className="file-icon">{getFileIcon(file.type)}</span>
      <div className="file-info">
        <span className="file-name">{file.name}</span>
        <span className="file-meta">{file.size}</span>
      </div>
      {showDownload && (
        <button className="download-btn compact">
          <DownloadIcon />
        </button>
      )}
    </div>
  );
});

// Memoized meeting item component
const MeetingItem = memo(function MeetingItem({ 
  meeting 
}: { 
  meeting: { id: string; title: string; date: string; url: string };
}) {
  return (
    <div className="meeting-item compact">
      <div className="meeting-info">
        <strong>{meeting.title}</strong>
        <span className="meeting-date">{meeting.date}</span>
      </div>
      <a href={meeting.url} target="_blank" rel="noopener noreferrer" className="join-btn compact">
        Join
      </a>
    </div>
  );
});

export const ClientDashboard = memo(function ClientDashboard({
  client,
  onLogout,
  onRequestFinalRecord
}: ClientDashboardProps) {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  // Memoized visible phases based on product type
  const visiblePhases = useMemo(() => {
    if (client.product === "ZEUS") return client.phases;
    return client.phases.filter(phase =>
      client.hestiaModules.some(mod => phase.modules.includes(mod))
    );
  }, [client.phases, client.product, client.hestiaModules]);

  // Memoized modules display string
  const modulesDisplay = useMemo(() => 
    client.hestiaModules.map(capitalize).join(", "),
    [client.hestiaModules]
  );

  // Memoized first name
  const firstName = useMemo(() => 
    client.name.split(" ")[0],
    [client.name]
  );

  // Memoized status text
  const statusText = useMemo(() => {
    switch (client.finalRecordStatus) {
      case "not_requested": return "Not Requested";
      case "requested": return "Requested - Pending";
      case "generated": return "Ready for Download";
      case "delivered": return "Delivered";
      default: return "";
    }
  }, [client.finalRecordStatus]);

  // Callbacks
  const handleOpenUploadModal = useCallback(() => {
    setUploadModalOpen(true);
  }, []);

  const handleCloseUploadModal = useCallback(() => {
    setUploadModalOpen(false);
  }, []);

  return (
    <div className="dashboard client-dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <div className="logo-small">
            <ShieldIcon />
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
            <h1>Welcome, {firstName}!</h1>
            <div className="product-badge">
              <span className={`badge ${client.product.toLowerCase()}`}>
                {client.product === "ZEUS" ? "ZEUS Full Bundle" : "HESTIA A La Carte"}
              </span>
              {client.product === "HESTIA" && (
                <span className="modules-list">
                  Modules: {modulesDisplay}
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
                {visiblePhases.map(phase => (
                  <PhaseCard key={phase.id} phase={phase} />
                ))}
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
                    {statusText}
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
                    <MeetingItem key={meeting.id} meeting={meeting} />
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
                <button className="upload-btn compact" onClick={handleOpenUploadModal}>
                  +
                </button>
              </div>
              {client.clientFiles.length > 0 ? (
                <div className="files-list compact">
                  {client.clientFiles.map(file => (
                    <FileItem key={file.id} file={file} />
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
                    <FileItem key={file.id} file={file} showDownload />
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
      <UploadModal
        isOpen={uploadModalOpen}
        onClose={handleCloseUploadModal}
      />
    </div>
  );
});
