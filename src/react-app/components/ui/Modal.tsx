import { memo, useCallback, useEffect, type ReactNode, type MouseEvent } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}

export const Modal = memo(function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children,
  className = ""
}: ModalProps) {
  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

  const handleOverlayClick = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleContentClick = useCallback((e: MouseEvent) => {
    e.stopPropagation();
  }, []);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className={`modal ${className}`} onClick={handleContentClick}>
        <h3>{title}</h3>
        {children}
      </div>
    </div>
  );
});

// Specific modal for file uploads
interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  hint?: string;
}

export const UploadModal = memo(function UploadModal({
  isOpen,
  onClose,
  title = "Upload File",
  hint = "Supports: PDF, Images, Videos, Documents"
}: UploadModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="upload-area">
        <div className="upload-icon">📁</div>
        <p>Drag and drop files here or click to browse</p>
        <p className="upload-hint">{hint}</p>
        <input type="file" className="file-input" />
      </div>
      <div className="modal-actions">
        <button className="cancel-btn" onClick={onClose}>Cancel</button>
        <button className="submit-btn" onClick={onClose}>Upload</button>
      </div>
    </Modal>
  );
});
