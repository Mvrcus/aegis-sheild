import { memo, useCallback } from "react";
import type { UserRole } from "../types";
import { 
  ShieldOutlineIcon, 
  UserIcon, 
  SettingsIcon, 
  ArrowRightIcon,
  CheckIcon,
  DocumentIcon,
  ClockIcon,
  ShieldIcon
} from "./ui/Icons";

interface LoginPageProps {
  onLogin: (role: UserRole, clientId?: string) => void;
}

// Memoized feature item to prevent re-renders
const FeatureItem = memo(function FeatureItem({ 
  icon: Icon, 
  title, 
  description 
}: { 
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div className="feature-item">
      <div className="feature-icon">
        <Icon />
      </div>
      <h4>{title}</h4>
      <p>{description}</p>
    </div>
  );
});

// Static features data - defined outside component to prevent recreation
const FEATURES = [
  { icon: CheckIcon, title: "Contractor Vetting", description: "Thorough background checks and verification" },
  { icon: DocumentIcon, title: "Contract Review", description: "Expert legal analysis and negotiation support" },
  { icon: ClockIcon, title: "Timeline Tracking", description: "Real-time project monitoring and updates" },
  { icon: ShieldIcon, title: "Quality Assurance", description: "Independent inspections at every phase" },
] as const;

export const LoginPage = memo(function LoginPage({ onLogin }: LoginPageProps) {
  // Memoized click handlers
  const handleClientLogin = useCallback(() => {
    onLogin("client", "client1");
  }, [onLogin]);

  const handleAdminLogin = useCallback(() => {
    onLogin("admin");
  }, [onLogin]);

  return (
    <div className="login-page">
      {/* Animated background elements */}
      <div className="bg-orb orb-1" />
      <div className="bg-orb orb-2" />
      <div className="bg-orb orb-3" />
      
      <div className="login-container">
        {/* Branding Section - Always visible, responsive layout */}
        <div className="login-header">
          <div className="brand-lockup">
            <div className="shield-icon">
              <ShieldOutlineIcon />
            </div>
            <div className="brand-text">
              <h1>Aegis Shield</h1>
              <p className="brand-subtitle">Client Protection Portal</p>
            </div>
          </div>
          
          <div className="value-prop">
            <h2>Protect Your Renovation Investment</h2>
            <p>Comprehensive protection from contractor vetting to project completion</p>
          </div>
        </div>

        {/* Login Actions */}
        <div className="login-card">
          <div className="card-header">
            <h3>Sign In</h3>
            <p>Choose your account type to continue</p>
          </div>

          <div className="login-options">
            <button
              className="login-option client-option"
              onClick={handleClientLogin}
            >
              <div className="option-icon">
                <UserIcon />
              </div>
              <div className="option-content">
                <div className="option-title">Client Portal</div>
                <div className="option-description">Track your renovation project</div>
              </div>
              <div className="option-arrow">
                <ArrowRightIcon />
              </div>
            </button>

            <button
              className="login-option admin-option"
              onClick={handleAdminLogin}
            >
              <div className="option-icon">
                <SettingsIcon />
              </div>
              <div className="option-content">
                <div className="option-title">Admin Console</div>
                <div className="option-description">Manage all client projects</div>
              </div>
              <div className="option-arrow">
                <ArrowRightIcon />
              </div>
            </button>
          </div>

          <div className="card-footer">
            <p className="demo-note">Demo Environment • Mock Data</p>
          </div>
        </div>

        {/* Feature Highlights - Visible on larger screens */}
        <div className="feature-grid">
          {FEATURES.map((feature, index) => (
            <FeatureItem
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
});
