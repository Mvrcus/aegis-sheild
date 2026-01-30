import type { UserRole } from "../types";

interface LoginPageProps {
  onLogin: (role: UserRole, clientId?: string) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  return (
    <div className="login-page">
      {/* Animated background elements */}
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>
      <div className="bg-orb orb-3"></div>
      
      <div className="login-container">
        {/* Branding Section - Always visible, responsive layout */}
        <div className="login-header">
          <div className="brand-lockup">
            <div className="shield-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 7v5M12 16h.01" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
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
              onClick={() => onLogin("client", "client1")}
            >
              <div className="option-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="option-content">
                <div className="option-title">Client Portal</div>
                <div className="option-description">Track your renovation project</div>
              </div>
              <div className="option-arrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </button>

            <button
              className="login-option admin-option"
              onClick={() => onLogin("admin")}
            >
              <div className="option-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 1v6m0 6v6M1 12h6m6 0h6" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="m4.93 4.93 4.24 4.24m5.66 0 4.24-4.24M4.93 19.07l4.24-4.24m5.66 0 4.24 4.24" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="option-content">
                <div className="option-title">Admin Console</div>
                <div className="option-description">Manage all client projects</div>
              </div>
              <div className="option-arrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </button>
          </div>

          <div className="card-footer">
            <p className="demo-note">Demo Environment • Mock Data</p>
          </div>
        </div>

        {/* Feature Highlights - Visible on larger screens */}
        <div className="feature-grid">
          <div className="feature-item">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 11l3 3L22 4" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h4>Contractor Vetting</h4>
            <p>Thorough background checks and verification</p>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 2v6h6M16 13H8m8 4H8m2-8H8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h4>Contract Review</h4>
            <p>Expert legal analysis and negotiation support</p>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h4>Timeline Tracking</h4>
            <p>Real-time project monitoring and updates</p>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h4>Quality Assurance</h4>
            <p>Independent inspections at every phase</p>
          </div>
        </div>
      </div>
    </div>
  );
}
