import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WorkspaceProvider } from './context/WorkspaceContext';

// Components
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { FlowAgentDrawer } from './components/FlowAgentDrawer';
import { BriefToBuildModal } from './components/BriefToBuildModal';
import { CommandPalette } from './components/CommandPalette';
import { ToastContainer } from './components/Toast';

// Pages
import { LandingPage } from './pages/LandingPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { WorkspaceHome } from './pages/WorkspaceHome';
import { WorkPage } from './pages/WorkPage';
import { ClientsPage } from './pages/ClientsPage';
import { ClientDetailPage } from './pages/ClientDetailPage';
import { ProposalStudio } from './pages/ProposalStudio';
import { InvoiceStudio } from './pages/InvoiceStudio';
import { CommunicationStudio } from './pages/CommunicationStudio';
import { DocumentsPage } from './pages/DocumentsPage';
import { StudioSettingsPage } from './pages/StudioSettingsPage';

function AppLayout() {
  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col selection:bg-chartreuse selection:text-ink pb-20 md:pb-8">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <BottomNav />
      <FlowAgentDrawer />
      <BriefToBuildModal />
      <CommandPalette />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <WorkspaceProvider>
        <Routes>
          {/* Public Landing & Onboarding */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />

          {/* Authenticated Workspace */}
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<WorkspaceHome />} />
            <Route path="work" element={<WorkPage />} />
            <Route path="clients" element={<ClientsPage />} />
            <Route path="clients/:clientId" element={<ClientDetailPage />} />
            <Route path="documents" element={<DocumentsPage />} />
            <Route path="documents/proposals" element={<ProposalStudio />} />
            <Route path="documents/proposals/new" element={<ProposalStudio />} />
            <Route path="documents/invoices" element={<InvoiceStudio />} />
            <Route path="documents/invoices/new" element={<InvoiceStudio />} />
            <Route path="documents/communication" element={<CommunicationStudio />} />
            <Route path="studio" element={<StudioSettingsPage />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </WorkspaceProvider>
    </AuthProvider>
  );
}
