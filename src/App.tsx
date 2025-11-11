import React, { Suspense } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import "./App.css";

import {
  AuthProvider,
  ToastProvider,
  ModalProvider,
  OnboardingProvider,
  OrgProvider,
  GlobalErrorProvider,
} from "./contexts";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import { ComponentLoading } from "./components/ui/LoadingSpinner";
import ModalContainer from "./components/modals/ModalContainer";
import ProtectedRoute from "./navigation/ProtectedRoute";
import ReactQueryProvider from "./providers/ReactQueryProvider";

// Lazy load all page components for code splitting
const Login = React.lazy(() => import("./pages/auth/Login"));
const RegisterSchool = React.lazy(() => import("./pages/auth/RegisterSchool"));
const CreatePin = React.lazy(() => import("./pages/auth/CreatePin"));
const Verification = React.lazy(() => import("./pages/auth/Verification"));

const AccountTypeSelection = React.lazy(() => import("./pages/onboarding/AccountTypeSelection"));
const SchoolTypeSelection = React.lazy(() => import("./pages/onboarding/SchoolTypeSelection"));
const SchoolSelection = React.lazy(() => import("./pages/onboarding/SchoolSelection"));
const PortalMembership = React.lazy(() => import("./pages/onboarding/PortalMembership"));
const PortalIdentification = React.lazy(() => import("./pages/onboarding/PortalIdentification"));
const AdminOTP = React.lazy(() => import("./pages/onboarding/AdminOTP"));
const AdminVerification = React.lazy(() => import("./pages/onboarding/AdminVerification"));
const PhoneVerification = React.lazy(() => import("./pages/onboarding/PhoneVerification"));
const TermsAndConditions = React.lazy(() => import("./pages/onboarding/TermsAndConditions"));
const SetPassPin = React.lazy(() => import("./pages/onboarding/SetPassPin"));
const ForgetPin = React.lazy(() => import("./pages/onboarding/ForgetPin"));
const ResetPin = React.lazy(() => import("./pages/onboarding/ResetPin"));

const Dashboard = React.lazy(() => import("./pages/dashboard/Dashboard"));
const StatisticsDashboard = React.lazy(() => import("./pages/dashboard/StatisticsDashboard"));
const Profile = React.lazy(() => import("./pages/dashboard/Profile"));
const Transactions = React.lazy(() => import("./pages/dashboard/transactions/Transactions"));
const Invoice = React.lazy(() => import("./pages/dashboard/transactions/Invoice"));
const Settlements = React.lazy(() => import("./pages/dashboard/transactions/Settlements"));
const Transfers = React.lazy(() => import("./pages/dashboard/transactions/Transfers"));
const Classes = React.lazy(() => import("./pages/dashboard/students-hub/Classes"));
const Students = React.lazy(() => import("./pages/dashboard/students-hub/Students"));
const SubClass = React.lazy(() => import("./pages/dashboard/students-hub/SubClass"));
const AdminAccounts = React.lazy(() => import("./pages/dashboard/AdminAccounts"));
const Parents = React.lazy(() => import("./pages/dashboard/Parents"));
const Wallet = React.lazy(() => import("./pages/dashboard/Wallet"));
const PaymentActivity = React.lazy(() => import("./pages/dashboard/PaymentActivity"));
const Subjects = React.lazy(() => import("./pages/dashboard/results-manager/Subjects"));
const Courses = React.lazy(() => import("./pages/dashboard/results-manager/Courses"));
const Exams = React.lazy(() => import("./pages/dashboard/results-manager/Exams"));
const Results = React.lazy(() => import("./pages/dashboard/results-manager/Results"));
const ClassResults = React.lazy(() => import("./pages/dashboard/results-manager/ClassResults"));
const StudentReport = React.lazy(() => import("./pages/dashboard/results-manager/StudentReport"));
const DashboardLayout = React.lazy(() => import("./navigation/DashboardLayout"));
const Groups = React.lazy(() => import("./pages/dashboard/organizations/Groups"));
const Organization = React.lazy(() => import("./pages/dashboard/organizations/Organizations"));
const Settings = React.lazy(() => import("./pages/dashboard/Settings"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

// Add these imports at the top with other lazy imports
const BusinessProfile = React.lazy(() => import("./pages/dashboard/business/BusinessProfile"));
const SubAccount = React.lazy(() => import("./pages/dashboard/business/SubAccount"));
const ActivityLogs = React.lazy(() => import("./pages/dashboard/ActivityLogs"));
const Sessions = React.lazy(() => import("./pages/dashboard/Sessions"));

// Helper component to wrap lazy components with Suspense
const LazyRoute = ({ children }: { children: React.ReactElement }) => (
  <Suspense fallback={<ComponentLoading size="lg" fullScreen={true} />}>
    {children}
  </Suspense>
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
                          {/* Auth routes */}
                          <Route path="/" element={<LazyRoute><Login /></LazyRoute>} />
                          <Route path="/auth" element={<LazyRoute><AccountTypeSelection /></LazyRoute>} />
                          <Route path="/login" element={<LazyRoute><Login /></LazyRoute>} />
                          <Route
                            path="/register"
                            element={<LazyRoute><AccountTypeSelection /></LazyRoute>}
                          />
                          <Route
                            path="/school-type"
                            element={<LazyRoute><SchoolTypeSelection /></LazyRoute>}
                          />
                          <Route
                            path="/school-selection"
                            element={<LazyRoute><SchoolSelection /></LazyRoute>}
                          />
                          <Route path="/admin-otp" element={<LazyRoute><AdminOTP /></LazyRoute>} />
                          <Route
                            path="/admin-verification"
                            element={<LazyRoute><AdminVerification /></LazyRoute>}
                          />
                          <Route
                            path="/phone-verification"
                            element={<LazyRoute><PhoneVerification /></LazyRoute>}
                          />
                          <Route path="/set-pass-pin" element={<LazyRoute><SetPassPin /></LazyRoute>} />
                          <Route
                            path="/portal-membership"
                            element={<LazyRoute><PortalMembership /></LazyRoute>}
                          />
                          <Route
                            path="/portal-identification"
                            element={<LazyRoute><PortalIdentification /></LazyRoute>}
                          />
                          <Route
                            path="/register-school"
                            element={<LazyRoute><RegisterSchool /></LazyRoute>}
                          />
                          <Route path="/verification" element={<LazyRoute><Verification /></LazyRoute>} />
                          <Route path="/forget-pin" element={<LazyRoute><ForgetPin /></LazyRoute>} />
                          <Route path="/reset-pin" element={<LazyRoute><ResetPin /></LazyRoute>} />
                          <Route path="/create-pin" element={<LazyRoute><CreatePin /></LazyRoute>} />
                          <Route
                            path="/terms-and-conditions"
                            element={<LazyRoute><TermsAndConditions /></LazyRoute>}
                          />

                          {/* Protected routes using guard */}
                          <Route
                            path="/dashboard"
                            element={
                              <ProtectedRoute>
                                <LazyRoute><DashboardLayout /></LazyRoute>
                              </ProtectedRoute>
                            }
                          >
                            <Route index element={<LazyRoute><Dashboard /></LazyRoute>} />
                            <Route
                              path="statistics"
                              element={<LazyRoute><StatisticsDashboard /></LazyRoute>}
                            />
                            <Route
                              path="invoice"
                              element={
                                <ProtectedRoute requiredPerm="fees.read">
                                  <LazyRoute><Invoice /></LazyRoute>
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="transactions"
                              element={
                                <ProtectedRoute requiredPerm="fees.read">
                                  <LazyRoute><Transactions /></LazyRoute>
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="transfers"
                              element={
                                <ProtectedRoute requiredPerm="fees.read">
                                  <LazyRoute><Transfers /></LazyRoute>
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="settlements"
                              element={
                                <ProtectedRoute requiredPerm="fees.read">
                                  <LazyRoute><Settlements /></LazyRoute>
                                </ProtectedRoute>
                              }
                            />
                            <Route path="profile" element={<LazyRoute><Profile /></LazyRoute>} />
                            <Route
                              path="classes"
                              element={
                                <ProtectedRoute requiredPerm="student.read">
                                  <LazyRoute><Classes /></LazyRoute>
                                </ProtectedRoute>
                              }
                            />
                            <Route path="subclass" element={<LazyRoute><SubClass /></LazyRoute>} />
                            <Route
                              path="students"
                              element={
                                <ProtectedRoute requiredPerm="student.read">
                                  <LazyRoute><Students /></LazyRoute>
                                </ProtectedRoute>
                              }
                            />
                            <Route path="students/wallet" element={<LazyRoute><Wallet /></LazyRoute>} />
                            <Route
                              path="students/payment-activity"
                              element={<LazyRoute><PaymentActivity /></LazyRoute>}
                            />
                            <Route path="parents" element={<LazyRoute><Parents /></LazyRoute>} />
                            <Route
                              path="admin-accounts"
                              element={
                                <ProtectedRoute requiredPerm="staff.read">
                                  <LazyRoute><AdminAccounts /></LazyRoute>
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="subjects"
                              element={
                                <ProtectedRoute requiredPerm="results.read">
                                  <LazyRoute><Subjects /></LazyRoute>
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="courses"
                              element={
                                <ProtectedRoute requiredPerm="results.read">
                                  <LazyRoute><Courses /></LazyRoute>
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="exams"
                              element={
                                <ProtectedRoute requiredPerm="results.read">
                                  <LazyRoute><Exams /></LazyRoute>
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="results"
                              element={
                                <ProtectedRoute requiredPerm="results.read">
                                  <LazyRoute><Results /></LazyRoute>
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="results/statistics"
                              element={
                                <ProtectedRoute requiredPerm="results.read">
                                  <LazyRoute><StatisticsDashboard /></LazyRoute>
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="results/class/:className"
                              element={
                                <ProtectedRoute requiredPerm="results.read">
                                  <LazyRoute><ClassResults /></LazyRoute>
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="results/student/:studentId"
                              element={
                                <ProtectedRoute requiredPerm="results.read">
                                  <LazyRoute><StudentReport /></LazyRoute>
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="organizations"
                              element={
                                <ProtectedRoute requiredPerm="organization.read">
                                  <LazyRoute><Organization /></LazyRoute>
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="groups"
                              element={
                                <ProtectedRoute requiredPerm="organization.read">
                                  <LazyRoute><Groups /></LazyRoute>
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="settings"
                              element={
                                <LazyRoute><Settings /></LazyRoute>
                              }
                            />
                            <Route
                              path="business-profile"
                              element={
                                <ProtectedRoute requiredPerm="organization.read">
                                  <LazyRoute><BusinessProfile /></LazyRoute>
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="sub-account"
                              element={
                                <ProtectedRoute requiredPerm="organization.read">
                                  <LazyRoute><SubAccount /></LazyRoute>
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="activity-logs"
                              element={<LazyRoute><ActivityLogs /></LazyRoute>}
                            />
                            <Route
                              path="sessions"
                              element={<LazyRoute><Sessions /></LazyRoute>}
                            />
                          </Route>

                          {/* Catch-all for dashboard routes - redirect to dashboard */}
                          <Route
                            path="/dashboard/*"
                            element={<Navigate to="/dashboard" replace />}
                          />

                          {/* Catch-all for other routes */}
                          <Route path="*" element={<LazyRoute><NotFound /></LazyRoute>} />
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
