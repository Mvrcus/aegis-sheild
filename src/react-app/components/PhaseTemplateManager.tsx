import { useState } from "react";
import type { PhaseTemplate, StepTemplate } from "../types";
import { AVAILABLE_MODULES } from "../data/mockData";

interface PhaseTemplateManagerProps {
  phaseTemplates: PhaseTemplate[];
  onUpdateTemplates: (templates: PhaseTemplate[]) => void;
}

export function PhaseTemplateManager({
  phaseTemplates,
  onUpdateTemplates,
}: PhaseTemplateManagerProps) {
  const [editingPhase, setEditingPhase] = useState<PhaseTemplate | null>(null);
  const [editingStep, setEditingStep] = useState<{ phaseId: string; step: StepTemplate | null } | null>(null);
  const [isAddingPhase, setIsAddingPhase] = useState(false);
  const [newPhaseName, setNewPhaseName] = useState("");
  const [newPhaseModules, setNewPhaseModules] = useState<string[]>([]);
  const [editPhaseName, setEditPhaseName] = useState("");
  const [editPhaseModules, setEditPhaseModules] = useState<string[]>([]);
  const [newStepName, setNewStepName] = useState("");
  const [editStepName, setEditStepName] = useState("");
  const [addingStepToPhase, setAddingStepToPhase] = useState<string | null>(null);

  const generateId = () => `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Add new phase
  const handleAddPhase = () => {
    if (!newPhaseName.trim()) return;

    const newPhase: PhaseTemplate = {
      id: generateId(),
      name: newPhaseName.trim(),
      modules: newPhaseModules,
      steps: [],
    };

    onUpdateTemplates([...phaseTemplates, newPhase]);
    setNewPhaseName("");
    setNewPhaseModules([]);
    setIsAddingPhase(false);
  };

  // Update phase
  const handleUpdatePhase = () => {
    if (!editingPhase || !editPhaseName.trim()) return;

    onUpdateTemplates(
      phaseTemplates.map(p =>
        p.id === editingPhase.id
          ? { ...p, name: editPhaseName.trim(), modules: editPhaseModules }
          : p
      )
    );
    setEditingPhase(null);
    setEditPhaseName("");
    setEditPhaseModules([]);
  };

  // Delete phase
  const handleDeletePhase = (phaseId: string) => {
    if (window.confirm("Are you sure you want to delete this phase? This cannot be undone.")) {
      onUpdateTemplates(phaseTemplates.filter(p => p.id !== phaseId));
    }
  };

  // Add step to phase
  const handleAddStep = (phaseId: string) => {
    if (!newStepName.trim()) return;

    const newStep: StepTemplate = {
      id: generateId(),
      name: newStepName.trim(),
    };

    onUpdateTemplates(
      phaseTemplates.map(p =>
        p.id === phaseId
          ? { ...p, steps: [...p.steps, newStep] }
          : p
      )
    );
    setNewStepName("");
    setAddingStepToPhase(null);
  };

  // Update step
  const handleUpdateStep = () => {
    if (!editingStep || !editStepName.trim()) return;

    onUpdateTemplates(
      phaseTemplates.map(p =>
        p.id === editingStep.phaseId
          ? {
              ...p,
              steps: p.steps.map(s =>
                s.id === editingStep.step?.id
                  ? { ...s, name: editStepName.trim() }
                  : s
              )
            }
          : p
      )
    );
    setEditingStep(null);
    setEditStepName("");
  };

  // Delete step
  const handleDeleteStep = (phaseId: string, stepId: string) => {
    if (window.confirm("Are you sure you want to delete this step?")) {
      onUpdateTemplates(
        phaseTemplates.map(p =>
          p.id === phaseId
            ? { ...p, steps: p.steps.filter(s => s.id !== stepId) }
            : p
        )
      );
    }
  };

  // Move step up/down
  const handleMoveStep = (phaseId: string, stepId: string, direction: "up" | "down") => {
    onUpdateTemplates(
      phaseTemplates.map(p => {
        if (p.id !== phaseId) return p;
        const idx = p.steps.findIndex(s => s.id === stepId);
        if (idx === -1) return p;
        if (direction === "up" && idx === 0) return p;
        if (direction === "down" && idx === p.steps.length - 1) return p;

        const newSteps = [...p.steps];
        const swapIdx = direction === "up" ? idx - 1 : idx + 1;
        [newSteps[idx], newSteps[swapIdx]] = [newSteps[swapIdx], newSteps[idx]];
        return { ...p, steps: newSteps };
      })
    );
  };

  // Move phase up/down
  const handleMovePhase = (phaseId: string, direction: "up" | "down") => {
    const idx = phaseTemplates.findIndex(p => p.id === phaseId);
    if (idx === -1) return;
    if (direction === "up" && idx === 0) return;
    if (direction === "down" && idx === phaseTemplates.length - 1) return;

    const newTemplates = [...phaseTemplates];
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    [newTemplates[idx], newTemplates[swapIdx]] = [newTemplates[swapIdx], newTemplates[idx]];
    onUpdateTemplates(newTemplates);
  };

  const openEditPhase = (phase: PhaseTemplate) => {
    setEditingPhase(phase);
    setEditPhaseName(phase.name);
    setEditPhaseModules(phase.modules);
  };

  const openEditStep = (phaseId: string, step: StepTemplate) => {
    setEditingStep({ phaseId, step });
    setEditStepName(step.name);
  };

  const toggleModule = (moduleId: string, isEdit: boolean) => {
    if (isEdit) {
      setEditPhaseModules(prev =>
        prev.includes(moduleId)
          ? prev.filter(m => m !== moduleId)
          : [...prev, moduleId]
      );
    } else {
      setNewPhaseModules(prev =>
        prev.includes(moduleId)
          ? prev.filter(m => m !== moduleId)
          : [...prev, moduleId]
      );
    }
  };

  return (
    <div className="phase-template-manager">
      <div className="template-header">
        <div>
          <h2>Phase & Step Templates</h2>
          <p className="template-subtitle">Manage the phases and steps that can be assigned to client projects</p>
        </div>
        <button className="add-phase-btn" onClick={() => setIsAddingPhase(true)}>
          + Add New Phase
        </button>
      </div>

      <div className="templates-list">
        {phaseTemplates.map((phase, phaseIndex) => (
          <div key={phase.id} className="template-phase-card">
            <div className="template-phase-header">
              <div className="phase-title-row">
                <div className="phase-order-controls">
                  <button
                    className="order-btn"
                    onClick={() => handleMovePhase(phase.id, "up")}
                    disabled={phaseIndex === 0}
                    title="Move up"
                  >
                    <span>^</span>
                  </button>
                  <button
                    className="order-btn"
                    onClick={() => handleMovePhase(phase.id, "down")}
                    disabled={phaseIndex === phaseTemplates.length - 1}
                    title="Move down"
                  >
                    <span>v</span>
                  </button>
                </div>
                <div className="phase-title-info">
                  <h3>{phase.name}</h3>
                  <span className="phase-module-tags">
                    {phase.modules.length > 0
                      ? phase.modules.map(m => AVAILABLE_MODULES.find(am => am.id === m)?.name || m).join(", ")
                      : "All modules (ZEUS)"}
                  </span>
                </div>
              </div>
              <div className="phase-actions">
                <button className="action-btn" onClick={() => openEditPhase(phase)}>Edit</button>
                <button className="action-btn danger icon-btn" onClick={() => handleDeletePhase(phase.id)} title="Delete phase">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14zM10 11v6M14 11v6"/>
                  </svg>
                </button>
              </div>
            </div>

            <div className="template-steps-list">
              {phase.steps.length === 0 ? (
                <p className="no-steps">No steps defined for this phase</p>
              ) : (
                phase.steps.map((step, stepIndex) => (
                  <div key={step.id} className="template-step-item">
                    <div className="step-order-controls">
                      <button
                        className="order-btn small"
                        onClick={() => handleMoveStep(phase.id, step.id, "up")}
                        disabled={stepIndex === 0}
                        title="Move up"
                      >
                        ^
                      </button>
                      <button
                        className="order-btn small"
                        onClick={() => handleMoveStep(phase.id, step.id, "down")}
                        disabled={stepIndex === phase.steps.length - 1}
                        title="Move down"
                      >
                        v
                      </button>
                    </div>
                    <span className="step-number">{stepIndex + 1}.</span>
                    <span className="step-name">{step.name}</span>
                    <div className="step-actions">
                      <button className="action-btn small" onClick={() => openEditStep(phase.id, step)}>Edit</button>
                      <button className="action-btn danger icon-btn" onClick={() => handleDeleteStep(phase.id, step.id)} title="Delete step">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14zM10 11v6M14 11v6"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {addingStepToPhase === phase.id ? (
              <div className="add-step-form">
                <input
                  type="text"
                  placeholder="Enter step name..."
                  value={newStepName}
                  onChange={e => setNewStepName(e.target.value)}
                  autoFocus
                  onKeyDown={e => e.key === "Enter" && handleAddStep(phase.id)}
                />
                <div className="form-actions">
                  <button className="cancel-btn" onClick={() => { setAddingStepToPhase(null); setNewStepName(""); }}>Cancel</button>
                  <button className="submit-btn" onClick={() => handleAddStep(phase.id)}>Add Step</button>
                </div>
              </div>
            ) : (
              <button className="add-step-btn" onClick={() => setAddingStepToPhase(phase.id)}>
                + Add Step
              </button>
            )}
          </div>
        ))}

        {phaseTemplates.length === 0 && (
          <div className="empty-templates">
            <p>No phase templates defined yet.</p>
            <p>Click "Add New Phase" to create your first phase template.</p>
          </div>
        )}
      </div>

      {/* Add Phase Modal */}
      {isAddingPhase && (
        <div className="modal-overlay" onClick={() => setIsAddingPhase(false)}>
          <div className="modal phase-modal" onClick={e => e.stopPropagation()}>
            <h3>Add New Phase</h3>
            <div className="form-group">
              <label>Phase Name</label>
              <input
                type="text"
                placeholder="e.g., Vetting Phase"
                value={newPhaseName}
                onChange={e => setNewPhaseName(e.target.value)}
                autoFocus
              />
            </div>
            <div className="form-group">
              <label>Associated Modules (HESTIA)</label>
              <p className="form-hint">Select which HESTIA modules this phase belongs to. Leave empty for ZEUS (all modules).</p>
              <div className="module-checkboxes">
                {AVAILABLE_MODULES.map(mod => (
                  <label key={mod.id} className="module-checkbox">
                    <input
                      type="checkbox"
                      checked={newPhaseModules.includes(mod.id)}
                      onChange={() => toggleModule(mod.id, false)}
                    />
                    <span>{mod.name}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => { setIsAddingPhase(false); setNewPhaseName(""); setNewPhaseModules([]); }}>Cancel</button>
              <button className="submit-btn" onClick={handleAddPhase} disabled={!newPhaseName.trim()}>Add Phase</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Phase Modal */}
      {editingPhase && (
        <div className="modal-overlay" onClick={() => setEditingPhase(null)}>
          <div className="modal phase-modal" onClick={e => e.stopPropagation()}>
            <h3>Edit Phase</h3>
            <div className="form-group">
              <label>Phase Name</label>
              <input
                type="text"
                value={editPhaseName}
                onChange={e => setEditPhaseName(e.target.value)}
                autoFocus
              />
            </div>
            <div className="form-group">
              <label>Associated Modules (HESTIA)</label>
              <p className="form-hint">Select which HESTIA modules this phase belongs to. Leave empty for ZEUS (all modules).</p>
              <div className="module-checkboxes">
                {AVAILABLE_MODULES.map(mod => (
                  <label key={mod.id} className="module-checkbox">
                    <input
                      type="checkbox"
                      checked={editPhaseModules.includes(mod.id)}
                      onChange={() => toggleModule(mod.id, true)}
                    />
                    <span>{mod.name}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => { setEditingPhase(null); setEditPhaseName(""); setEditPhaseModules([]); }}>Cancel</button>
              <button className="submit-btn" onClick={handleUpdatePhase} disabled={!editPhaseName.trim()}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Step Modal */}
      {editingStep && (
        <div className="modal-overlay" onClick={() => setEditingStep(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Edit Step</h3>
            <div className="form-group">
              <label>Step Name</label>
              <input
                type="text"
                value={editStepName}
                onChange={e => setEditStepName(e.target.value)}
                autoFocus
                onKeyDown={e => e.key === "Enter" && handleUpdateStep()}
              />
            </div>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => { setEditingStep(null); setEditStepName(""); }}>Cancel</button>
              <button className="submit-btn" onClick={handleUpdateStep} disabled={!editStepName.trim()}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
