import { useState, useCallback, useMemo, memo } from "react";
import type { Client, Phase, Step } from "../types";
import { getFileIcon, capitalize } from "../utils/helpers";
import { ShieldIcon, DownloadIcon, UploadIcon, CalendarIcon, CheckCircleIcon, ArrowRightIcon, FileIcon, ClockIcon, ChevronRightIcon } from "./ui/Icons";
import { UploadModal } from "./ui/Modal";

// Step Detail Modal
const StepDetailModal = memo(function StepDetailModal({
  step,
  phaseName,
  stepNumber,
  onClose
}: {
  step: Step;
  phaseName: string;
  stepNumber: number;
  onClose: () => void;
}) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal step-detail-modal" onClick={e => e.stopPropagation()}>
        <div className="step-detail-header">
          <div className="step-detail-badge">
            <span className={`step-status-badge ${step.completed ? 'completed' : 'in-progress'}`}>
              {step.completed ? 'Completed' : 'In Progress'}
            </span>
            <span className="step-phase-label">{phaseName} • Step {stepNumber}</span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>
        <h3 className="step-detail-title">{step.name}</h3>
        {step.description ? (
          <div className="step-detail-content">
            <p>{step.description}</p>
          </div>
        ) : (
          <div className="step-detail-empty">
            <p>No additional details available for this step yet.</p>
          </div>
        )}
        <div className="modal-actions">
          <button className="submit-btn" onClick={onClose}>Got it</button>
        </div>
      </div>
    </div>
  );
});

interface ClientDashboardProps {
  client: Client;
  onLogout: () => void;
  onRequestFinalRecord: () => void;
}

// Helper to find current phase and next action
function findCurrentPhaseAndAction(phases: Phase[]): { 
  currentPhase: Phase | null; 
  currentPhaseIndex: number;
  nextStep: Step | null;
  completedPhases: Phase[];
  upcomingPhases: Phase[];
} {
  let currentPhase: Phase | null = null;
  let currentPhaseIndex = -1;
  let nextStep: Step | null = null;
  const completedPhases: Phase[] = [];
  const upcomingPhases: Phase[] = [];

  for (let i = 0; i < phases.length; i++) {
    const phase = phases[i];
    const allComplete = phase.steps.every(s => s.completed);
    const hasIncomplete = phase.steps.some(s => !s.completed);

    if (allComplete) {
      completedPhases.push(phase);
    } else if (hasIncomplete && !currentPhase) {
      currentPhase = phase;
      currentPhaseIndex = i;
      nextStep = phase.steps.find(s => !s.completed) || null;
    } else {
      upcomingPhases.push(phase);
    }
  }

  return { currentPhase, currentPhaseIndex, nextStep, completedPhases, upcomingPhases };
}

// Action card for what to do next
const ActionCard = memo(function ActionCard({ 
  icon, 
  title, 
  description, 
  actionLabel, 
  onAction,
  variant = "primary"
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
  variant?: "primary" | "success" | "info";
}) {
  return (
    <div className={`action-card action-card-${variant}`}>
      <div className="action-card-icon">{icon}</div>
      <div className="action-card-content">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <button className={`action-card-btn action-btn-${variant}`} onClick={onAction}>
        {actionLabel}
        <ArrowRightIcon />
      </button>
    </div>
  );
});

// Compact phase indicator for completed/upcoming phases
const PhaseIndicator = memo(function PhaseIndicator({ 
  phase, 
  status 
}: { 
  phase: Phase; 
  status: "completed" | "upcoming" | "current";
}) {
  const completedSteps = phase.steps.filter(s => s.completed).length;
  const totalSteps = phase.steps.length;

  return (
    <div className={`phase-indicator phase-indicator-${status}`}>
      <div className="phase-indicator-icon">
        {status === "completed" ? (
          <CheckCircleIcon />
        ) : status === "current" ? (
          <div className="phase-current-dot" />
        ) : (
          <div className="phase-upcoming-dot" />
        )}
      </div>
      <div className="phase-indicator-content">
        <span className="phase-indicator-name">{phase.name}</span>
        {status === "completed" && (
          <span className="phase-indicator-status">Complete</span>
        )}
        {status === "current" && (
          <span className="phase-indicator-progress">{completedSteps}/{totalSteps} steps</span>
        )}
      </div>
    </div>
  );
});

// Truncate text helper
function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

// Current phase detail card
const CurrentPhaseCard = memo(function CurrentPhaseCard({ 
  phase,
  phaseNumber,
  totalPhases,
  onStepClick
}: { 
  phase: Phase;
  phaseNumber: number;
  totalPhases: number;
  onStepClick: (step: Step, stepNumber: number) => void;
}) {
  const completedSteps = phase.steps.filter(s => s.completed).length;
  const totalSteps = phase.steps.length;
  const phaseProgress = Math.round((completedSteps / totalSteps) * 100);

  return (
    <div className="current-phase-card">
      <div className="current-phase-header">
        <div className="current-phase-badge">
          <span className="phase-number">Phase {phaseNumber} of {totalPhases}</span>
        </div>
        <h2>{phase.name}</h2>
        {phase.description && (
          <p className="current-phase-description">{phase.description}</p>
        )}
        <div className="current-phase-progress">
          <div className="progress-bar-wrapper">
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: `${phaseProgress}%` }} />
            </div>
            <span className="progress-percentage">{phaseProgress}%</span>
          </div>
        </div>
      </div>
      
      <div className="current-phase-steps">
        <h4>Steps in this phase</h4>
        <ul className="phase-steps-list">
          {phase.steps.map((step, index) => {
            const isCurrentStep = !step.completed && index === phase.steps.findIndex(s => !s.completed);
            const hasDescription = !!step.description;
            
            return (
              <li 
                key={step.id} 
                className={`phase-step-item ${step.completed ? "completed" : ""} ${hasDescription ? "clickable" : ""}`}
                onClick={() => hasDescription && onStepClick(step, index + 1)}
                role={hasDescription ? "button" : undefined}
                tabIndex={hasDescription ? 0 : undefined}
              >
                <div className="step-indicator">
                  {step.completed ? (
                    <CheckCircleIcon />
                  ) : (
                    <span className="step-number">{index + 1}</span>
                  )}
                </div>
                <div className="step-content">
                  <div className="step-name-row">
                    <span className="step-name">{step.name}</span>
                    {isCurrentStep && (
                      <span className="step-current-badge">Current</span>
                    )}
                  </div>
                  {hasDescription && (
                    <p className="step-preview">{truncateText(step.description!, 80)}</p>
                  )}
                </div>
                {hasDescription && (
                  <div className="step-arrow">
                    <ChevronRightIcon />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
});

// File section with context
const FileSection = memo(function FileSection({
  title,
  description,
  files,
  emptyMessage,
  showUpload,
  onUpload,
  showDownload
}: {
  title: string;
  description: string;
  files: Array<{ id: string; name: string; type: string; size: string }>;
  emptyMessage: string;
  showUpload?: boolean;
  onUpload?: () => void;
  showDownload?: boolean;
}) {
  return (
    <div className="file-section-card">
      <div className="file-section-header">
        <div>
          <h3>{title}</h3>
          <p className="file-section-description">{description}</p>
        </div>
        {showUpload && onUpload && (
          <button className="upload-btn-compact" onClick={onUpload}>
            <UploadIcon />
            Upload
          </button>
        )}
      </div>
      
      {files.length > 0 ? (
        <ul className="file-section-list">
          {files.map(file => (
            <li key={file.id} className="file-section-item">
              <span className="file-icon-small">{getFileIcon(file.type)}</span>
              <div className="file-details">
                <span className="file-name">{file.name}</span>
                <span className="file-size">{file.size}</span>
              </div>
              {showDownload && (
                <button className="file-download-btn">
                  <DownloadIcon />
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div className="file-section-empty">
          <FileIcon />
          <p>{emptyMessage}</p>
        </div>
      )}
    </div>
  );
});

// Helper to check if meeting is today
function isMeetingToday(dateString: string): boolean {
  // Parse date like "Jan 25, 2026 at 2:00 PM" or similar formats
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Remove "at" for easier parsing
  const cleanDateStr = dateString.replace(' at ', ' ');
  
  // Try to parse the meeting date
  const meetingDate = new Date(cleanDateStr);
  if (!isNaN(meetingDate.getTime())) {
    meetingDate.setHours(0, 0, 0, 0);
    return meetingDate.getTime() === today.getTime();
  }
  
  // Fallback: check if date string contains today's formatted date
  const todayStr = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  return dateString.includes(todayStr);
}

// Generate calendar URL (Google Calendar)
function generateCalendarUrl(meeting: { title: string; date: string; url: string }): string {
  // Remove "at" for easier parsing
  const cleanDateStr = meeting.date.replace(' at ', ' ');
  const meetingDate = new Date(cleanDateStr);
  
  // Fallback to current date if parsing fails
  if (isNaN(meetingDate.getTime())) {
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(meeting.title)}&details=${encodeURIComponent(`Join meeting: ${meeting.url}`)}`;
  }
  
  const startTime = meetingDate.toISOString().replace(/-|:|\.\d{3}/g, '');
  // Default 1 hour meeting
  const endDate = new Date(meetingDate.getTime() + 60 * 60 * 1000);
  const endTime = endDate.toISOString().replace(/-|:|\.\d{3}/g, '');
  
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: meeting.title,
    dates: `${startTime}/${endTime}`,
    details: `Join meeting: ${meeting.url}`,
    location: meeting.url
  });
  
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

// Meeting card
const MeetingCard = memo(function MeetingCard({
  meetings
}: {
  meetings: Array<{ id: string; title: string; date: string; url: string }>;
}) {
  if (meetings.length === 0) return null;

  return (
    <div className="meetings-card">
      <div className="meetings-card-header">
        <CalendarIcon />
        <h3>Upcoming Meetings</h3>
      </div>
      <ul className="meetings-list-compact">
        {meetings.map(meeting => {
          const isToday = isMeetingToday(meeting.date);
          
          return (
            <li key={meeting.id} className={`meeting-item-compact ${isToday ? 'meeting-today' : ''}`}>
              <div className="meeting-details">
                <strong>{meeting.title}</strong>
                <span className="meeting-date">
                  {isToday && <span className="meeting-today-badge">Today</span>}
                  {meeting.date}
                </span>
              </div>
              <div className="meeting-actions-group">
                <a href={meeting.url} target="_blank" rel="noopener noreferrer" className="meeting-join-btn meeting-join-now">
                  Join
                </a>
                {!isToday && (
                  <a 
                    href={generateCalendarUrl(meeting)} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="meeting-calendar-link"
                    title="Add to Calendar"
                  >
                    <CalendarIcon />
                  </a>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
});

export const ClientDashboard = memo(function ClientDashboard({
  client,
  onLogout,
  onRequestFinalRecord
}: ClientDashboardProps) {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedStep, setSelectedStep] = useState<{ step: Step; phaseName: string; stepNumber: number } | null>(null);

  // Filter phases based on product type
  const visiblePhases = useMemo(() => {
    if (client.product === "ZEUS") return client.phases;
    return client.phases.filter(phase =>
      client.hestiaModules.some(mod => phase.modules.includes(mod))
    );
  }, [client.phases, client.product, client.hestiaModules]);

  // Find current phase and next action
  const { currentPhase, currentPhaseIndex, nextStep, completedPhases, upcomingPhases } = useMemo(
    () => findCurrentPhaseAndAction(visiblePhases),
    [visiblePhases]
  );

  const firstName = useMemo(() => client.name.split(" ")[0], [client.name]);
  
  const modulesDisplay = useMemo(() => 
    client.hestiaModules.map(capitalize).join(", "),
    [client.hestiaModules]
  );

  // Determine what action to show
  const hasNewDeliverables = client.adminFiles.length > 0;
  const hasUpcomingMeeting = client.meetingLinks.length > 0;
  const needsUpload = client.clientFiles.length === 0;

  // Status text for final record
  const statusText = useMemo(() => {
    switch (client.finalRecordStatus) {
      case "not_requested": return "Available when project completes";
      case "requested": return "Being prepared...";
      case "generated": return "Ready for download!";
      case "delivered": return "Delivered";
      default: return "";
    }
  }, [client.finalRecordStatus]);

  const handleOpenUploadModal = useCallback(() => {
    setUploadModalOpen(true);
  }, []);

  const handleCloseUploadModal = useCallback(() => {
    setUploadModalOpen(false);
  }, []);

  // Determine the primary action message
  const getPrimaryAction = () => {
    if (hasUpcomingMeeting) {
      const nextMeeting = client.meetingLinks[0];
      const isToday = isMeetingToday(nextMeeting.date);
      
      return {
        type: "meeting" as const,
        title: isToday ? "Your meeting is today!" : "You have an upcoming meeting",
        description: `${nextMeeting.title} scheduled for ${nextMeeting.date}`,
        action: () => window.open(nextMeeting.url, "_blank"),
        actionLabel: "Join Meeting"
      };
    }
    
    if (hasNewDeliverables && client.adminFiles.length > 0) {
      return {
        type: "deliverable" as const,
        title: "New documents ready for review",
        description: "Aegis Shield has uploaded new analysis or reports for you to review.",
        action: () => document.getElementById("deliverables-section")?.scrollIntoView({ behavior: "smooth" }),
        actionLabel: "View Documents"
      };
    }

    if (needsUpload && nextStep) {
      return {
        type: "upload" as const,
        title: "Upload your project documents",
        description: "Help us protect your project by uploading contracts, photos, or other relevant files.",
        action: handleOpenUploadModal,
        actionLabel: "Upload Files"
      };
    }

    if (nextStep) {
      return {
        type: "step" as const,
        title: `Current step: ${nextStep.name}`,
        description: "We're working on this step. We'll update you when there's progress or if we need anything from you.",
        action: () => {},
        actionLabel: "View Progress"
      };
    }

    return null;
  };

  const primaryAction = getPrimaryAction();

  return (
    <div className="dashboard client-dashboard client-dashboard-v2">
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

      <main className="dashboard-content client-content-v2">
        {/* Welcome & Context Section */}
        <section className="welcome-hero">
          <div className="welcome-hero-content">
            <div className="welcome-text">
              <h1>Welcome back, {firstName}</h1>
              <p className="welcome-subtitle">
                Your project is <strong>{client.progress}% complete</strong>.
                {client.progress < 100 
                  ? " Here's what's happening and what you can do next."
                  : " Your project is almost ready for final delivery!"}
              </p>
            </div>
            <div className="product-indicator">
              <span className={`product-badge-pill ${client.product.toLowerCase()}`}>
                {client.product === "ZEUS" ? "ZEUS Full Bundle" : "HESTIA"}
              </span>
              {client.product === "HESTIA" && (
                <span className="modules-indicator">{modulesDisplay}</span>
              )}
            </div>
          </div>
          
          {/* Progress visualization */}
          <div className="progress-visual">
            <svg className="progress-circle" viewBox="0 0 120 120">
              <circle 
                className="progress-circle-bg" 
                cx="60" cy="60" r="52" 
                fill="none" 
                strokeWidth="8"
              />
              <circle 
                className="progress-circle-fill" 
                cx="60" cy="60" r="52" 
                fill="none" 
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 52}`}
                strokeDashoffset={`${2 * Math.PI * 52 * (1 - client.progress / 100)}`}
              />
            </svg>
            <div className="progress-circle-text">
              <span className="progress-value">{client.progress}%</span>
              <span className="progress-label">Complete</span>
            </div>
          </div>
        </section>

        {/* Primary Action Card - What to do next */}
        {primaryAction && primaryAction.type !== "step" && (
          <section className="action-section">
            <ActionCard
              icon={
                primaryAction.type === "meeting" ? <CalendarIcon /> :
                primaryAction.type === "deliverable" ? <FileIcon /> :
                <UploadIcon />
              }
              title={primaryAction.title}
              description={primaryAction.description}
              actionLabel={primaryAction.actionLabel}
              onAction={primaryAction.action}
              variant={
                primaryAction.type === "meeting" ? "info" :
                primaryAction.type === "deliverable" ? "success" :
                "primary"
              }
            />
          </section>
        )}

        {/* Main Content Grid */}
        <div className="client-main-grid">
          {/* Left Column - Progress & Phases */}
          <div className="client-progress-column">
            {/* Phase Journey */}
            <section className="phase-journey-section">
              <h2 className="section-title">
                <ClockIcon />
                Your Project Journey
              </h2>
              
              {/* Completed Phases - Collapsed */}
              {completedPhases.length > 0 && (
                <div className="phases-completed">
                  <span className="phases-group-label">Completed</span>
                  {completedPhases.map(phase => (
                    <PhaseIndicator key={phase.id} phase={phase} status="completed" />
                  ))}
                </div>
              )}

              {/* Current Phase - Expanded */}
              {currentPhase && (
                <div className="phase-current-wrapper">
                  <span className="phases-group-label current-label">You are here</span>
                  <CurrentPhaseCard 
                    phase={currentPhase} 
                    phaseNumber={currentPhaseIndex + 1}
                    totalPhases={visiblePhases.length}
                    onStepClick={(step, stepNumber) => setSelectedStep({ 
                      step, 
                      phaseName: currentPhase.name, 
                      stepNumber 
                    })}
                  />
                </div>
              )}

              {/* Upcoming Phases - Collapsed */}
              {upcomingPhases.length > 0 && (
                <div className="phases-upcoming">
                  <span className="phases-group-label">Coming up</span>
                  {upcomingPhases.map(phase => (
                    <PhaseIndicator key={phase.id} phase={phase} status="upcoming" />
                  ))}
                </div>
              )}
            </section>

            {/* Final Record - Only show when relevant */}
            {(client.progress >= 80 || client.finalRecordStatus !== "not_requested") && (
              <section className="final-record-card">
                <div className="final-record-header">
                  <h3>Final Project Record</h3>
                  <span className={`final-record-status status-${client.finalRecordStatus}`}>
                    {statusText}
                  </span>
                </div>
                <p className="final-record-description">
                  A complete archive of your project including all documents, analysis, and deliverables.
                </p>
                {client.finalRecordStatus === "not_requested" && client.progress >= 80 && (
                  <button className="request-record-btn" onClick={onRequestFinalRecord}>
                    Request Final Record
                  </button>
                )}
                {client.finalRecordStatus === "generated" && (
                  <button className="download-record-btn">
                    <DownloadIcon />
                    Download Complete Record
                  </button>
                )}
              </section>
            )}
          </div>

          {/* Right Column - Files & Meetings */}
          <div className="client-files-column">
            {/* Upcoming Meetings */}
            <MeetingCard meetings={client.meetingLinks} />

            {/* Deliverables from Aegis Shield */}
            <div id="deliverables-section">
              <FileSection
                title="From Aegis Shield"
                description="Reports, analysis, and documents we've prepared for you"
                files={client.adminFiles}
                emptyMessage="No deliverables yet. We'll upload documents here as your project progresses."
                showDownload
              />
            </div>

            {/* Your Uploads */}
            <FileSection
              title="Your Documents"
              description="Contracts, photos, videos, and other files you've shared with us"
              files={client.clientFiles}
              emptyMessage="Upload contracts, photos, or videos to help us protect your project."
              showUpload
              onUpload={handleOpenUploadModal}
            />
          </div>
        </div>
      </main>

      {/* Upload Modal */}
      <UploadModal
        isOpen={uploadModalOpen}
        onClose={handleCloseUploadModal}
      />

      {/* Step Detail Modal */}
      {selectedStep && (
        <StepDetailModal
          step={selectedStep.step}
          phaseName={selectedStep.phaseName}
          stepNumber={selectedStep.stepNumber}
          onClose={() => setSelectedStep(null)}
        />
      )}
    </div>
  );
});
