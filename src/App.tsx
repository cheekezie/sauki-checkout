import React, { Suspense } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';

import { ErrorBoundary } from './components/common/ErrorBoundary';
import ModalContainer from './components/modals/ModalContainer';
import { ComponentLoading } from './components/ui/LoadingSpinner';
import {
  AuthProvider,
  GlobalErrorProvider,
  ModalProvider,
  OnboardingProvider,
  OrgProvider,
  ToastProvider,
} from './contexts';
import ReactQueryProvider from './providers/ReactQueryProvider';

// Lazy load all page components for code splitting
const Checkout = React.lazy(() => import('./pages/Checkout'));

const NotFound = React.lazy(() => import('./pages/NotFound'));

// Add these imports at the top with other lazy imports

// Helper component to wrap lazy components with Suspense
const LazyRoute = ({ children }: { children: React.ReactElement }) => (
  <Suspense fallback={<ComponentLoading size='lg' fullScreen={true} />}>{children}</Suspense>
);

function App() {
  return (
    <ErrorBoundary>
      <GlobalErrorProvider>
        <Router>
          <ToastProvider>
            <ModalProvider>
              <AuthProvider>
                <OnboardingProvider>
                  <OrgProvider>
                    <ReactQueryProvider>
                      <Routes>
                        <Route
                          path='/'
                          element={
                            <LazyRoute>
                              <Checkout />
                            </LazyRoute>
                          }
                        />

                        {/* Catch-all for other Wildcard routes */}
                        <Route
                          path='*'
                          element={
                            <LazyRoute>
                              <NotFound />
                            </LazyRoute>
                          }
                        />
                      </Routes>
                      <ModalContainer />
                    </ReactQueryProvider>
                  </OrgProvider>
                </OnboardingProvider>
              </AuthProvider>
            </ModalProvider>
          </ToastProvider>
        </Router>
      </GlobalErrorProvider>
    </ErrorBoundary>
  );
}

export default App;
