import { useState, useCallback, useMemo, memo } from "react";
import type { PhaseTemplate, StepTemplate } from "../types";
import { AVAILABLE_MODULES } from "../data/mockData";
import { generateId } from "../utils/helpers";
import { TrashIcon } from "./ui/Icons";
import { Modal } from "./ui/Modal";

interface PhaseTemplateManagerProps {
  phaseTemplates: PhaseTemplate[];
  onUpdateTemplates: (templates: PhaseTemplate[]) => void;
}

// Memoized step item component
const StepItem = memo(function StepItem({
  step,
  stepIndex,
  isLast,
  onMoveUp,
  onMoveDown,
  onEdit,
  onDelete,
}: {
  step: StepTemplate;
  stepIndex: number;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="template-step-item">
      <div className="step-order-controls">
        <button
          className="order-btn small"
          onClick={onMoveUp}
          disabled={stepIndex === 0}
          title="Move up"
        >
          ^
        </button>
        <button
          className="order-btn small"
          onClick={onMoveDown}
          disabled={isLast}
          title="Move down"
        >
          v
        </button>
      </div>
      <span className="step-number">{stepIndex + 1}.</span>
      <span className="step-name">{step.name}</span>
      <div className="step-actions">
        <button className="action-btn small" onClick={onEdit}>Edit</button>
        <button className="action-btn danger icon-btn" onClick={onDelete} title="Delete step">
          <TrashIcon />
        </button>
      </div>
    </div>
  );
});

export const PhaseTemplateManager = memo(function PhaseTemplateManager({
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

  // Memoized module names lookup
  const moduleNameLookup = useMemo(() => {
    const lookup: Record<string, string> = {};
    AVAILABLE_MODULES.forEach(mod => {
      lookup[mod.id] = mod.name;
    });
    return lookup;
  }, []);

  // Add new phase
  const handleAddPhase = useCallback(() => {
    if (!newPhaseName.trim()) return;

    const newPhase: PhaseTemplate = {
      id: generateId("phase"),
      name: newPhaseName.trim(),
      modules: newPhaseModules,
      steps: [],
    };

    onUpdateTemplates([...phaseTemplates, newPhase]);
    setNewPhaseName("");
    setNewPhaseModules([]);
    setIsAddingPhase(false);
  }, [newPhaseName, newPhaseModules, phaseTemplates, onUpdateTemplates]);

  // Update phase
  const handleUpdatePhase = useCallback(() => {
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
  }, [editingPhase, editPhaseName, editPhaseModules, phaseTemplates, onUpdateTemplates]);

  // Delete phase
  const handleDeletePhase = useCallback((phaseId: string) => {
    if (window.confirm("Are you sure you want to delete this phase? This cannot be undone.")) {
      onUpdateTemplates(phaseTemplates.filter(p => p.id !== phaseId));
    }
  }, [phaseTemplates, onUpdateTemplates]);

  // Add step to phase
  const handleAddStep = useCallback((phaseId: string) => {
    if (!newStepName.trim()) return;

    const newStep: StepTemplate = {
      id: generateId("step"),
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
  }, [newStepName, phaseTemplates, onUpdateTemplates]);

  // Update step
  const handleUpdateStep = useCallback(() => {
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
  }, [editingStep, editStepName, phaseTemplates, onUpdateTemplates]);

  // Delete step
  const handleDeleteStep = useCallback((phaseId: string, stepId: string) => {
    if (window.confirm("Are you sure you want to delete this step?")) {
      onUpdateTemplates(
        phaseTemplates.map(p =>
          p.id === phaseId
            ? { ...p, steps: p.steps.filter(s => s.id !== stepId) }
            : p
        )
      );
    }
  }, [phaseTemplates, onUpdateTemplates]);

  // Move step up/down
  const handleMoveStep = useCallback((phaseId: string, stepId: string, direction: "up" | "down") => {
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
  }, [phaseTemplates, onUpdateTemplates]);

  // Move phase up/down
  const handleMovePhase = useCallback((phaseId: string, direction: "up" | "down") => {
    const idx = phaseTemplates.findIndex(p => p.id === phaseId);
    if (idx === -1) return;
    if (direction === "up" && idx === 0) return;
    if (direction === "down" && idx === phaseTemplates.length - 1) return;

    const newTemplates = [...phaseTemplates];
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    [newTemplates[idx], newTemplates[swapIdx]] = [newTemplates[swapIdx], newTemplates[idx]];
    onUpdateTemplates(newTemplates);
  }, [phaseTemplates, onUpdateTemplates]);

  const openEditPhase = useCallback((phase: PhaseTemplate) => {
    setEditingPhase(phase);
    setEditPhaseName(phase.name);
    setEditPhaseModules(phase.modules);
  }, []);

  const openEditStep = useCallback((phaseId: string, step: StepTemplate) => {
    setEditingStep({ phaseId, step });
    setEditStepName(step.name);
  }, []);

  const toggleModule = useCallback((moduleId: string, isEdit: boolean) => {
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
  }, []);

  const handleCloseAddPhase = useCallback(() => {
    setIsAddingPhase(false);
    setNewPhaseName("");
    setNewPhaseModules([]);
  }, []);

  const handleCloseEditPhase = useCallback(() => {
    setEditingPhase(null);
    setEditPhaseName("");
    setEditPhaseModules([]);
  }, []);

  const handleCloseEditStep = useCallback(() => {
    setEditingStep(null);
    setEditStepName("");
  }, []);

  const handleCancelAddStep = useCallback(() => {
    setAddingStepToPhase(null);
    setNewStepName("");
  }, []);

  const handleOpenAddPhase = useCallback(() => {
    setIsAddingPhase(true);
  }, []);

  // Get module display names
  const getModuleNames = useCallback((modules: string[]) => {
    if (modules.length === 0) return "All modules (ZEUS)";
    return modules.map(m => moduleNameLookup[m] || m).join(", ");
  }, [moduleNameLookup]);

  return (
    <div className="phase-template-manager">
      <div className="template-header">
        <div>
          <h2>Phase & Step Templates</h2>
          <p className="template-subtitle">Manage the phases and steps that can be assigned to client projects</p>
        </div>
        <button className="add-phase-btn" onClick={handleOpenAddPhase}>
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
                    {getModuleNames(phase.modules)}
                  </span>
                </div>
              </div>
              <div className="phase-actions">
                <button className="action-btn" onClick={() => openEditPhase(phase)}>Edit</button>
                <button className="action-btn danger icon-btn" onClick={() => handleDeletePhase(phase.id)} title="Delete phase">
                  <TrashIcon />
                </button>
              </div>
            </div>

            <div className="template-steps-list">
              {phase.steps.length === 0 ? (
                <p className="no-steps">No steps defined for this phase</p>
              ) : (
                phase.steps.map((step, stepIndex) => (
                  <StepItem
                    key={step.id}
                    step={step}
                    stepIndex={stepIndex}
                    isLast={stepIndex === phase.steps.length - 1}
                    onMoveUp={() => handleMoveStep(phase.id, step.id, "up")}
                    onMoveDown={() => handleMoveStep(phase.id, step.id, "down")}
                    onEdit={() => openEditStep(phase.id, step)}
                    onDelete={() => handleDeleteStep(phase.id, step.id)}
                  />
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
                  <button className="cancel-btn" onClick={handleCancelAddStep}>Cancel</button>
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
      <Modal isOpen={isAddingPhase} onClose={handleCloseAddPhase} title="Add New Phase" className="phase-modal">
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
          <button className="cancel-btn" onClick={handleCloseAddPhase}>Cancel</button>
          <button className="submit-btn" onClick={handleAddPhase} disabled={!newPhaseName.trim()}>Add Phase</button>
        </div>
      </Modal>

      {/* Edit Phase Modal */}
      <Modal isOpen={!!editingPhase} onClose={handleCloseEditPhase} title="Edit Phase" className="phase-modal">
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
          <button className="cancel-btn" onClick={handleCloseEditPhase}>Cancel</button>
          <button className="submit-btn" onClick={handleUpdatePhase} disabled={!editPhaseName.trim()}>Save Changes</button>
        </div>
      </Modal>

      {/* Edit Step Modal */}
      <Modal isOpen={!!editingStep} onClose={handleCloseEditStep} title="Edit Step">
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
          <button className="cancel-btn" onClick={handleCloseEditStep}>Cancel</button>
          <button className="submit-btn" onClick={handleUpdateStep} disabled={!editStepName.trim()}>Save Changes</button>
        </div>
      </Modal>
    </div>
  );
});
