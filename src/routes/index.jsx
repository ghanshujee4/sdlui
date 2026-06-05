import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ROUTES } from "constants/routes";
import PageLoader from "components/layout/PageLoader";
import AdminProtectedRoute from "components/routing/AdminProtectedRoute";
import StudentLayout from "layouts/StudentLayout";

const ChatBox = lazy(() => import("chat/ChatBox"));
const Dashboard = lazy(() => import("dashboard/Dashboard"));
const DashboardChart = lazy(() => import("charts/DashboardChart"));
const Login = lazy(() => import("login/Login"));
const AdminLogin = lazy(() => import("login/AdminLogin"));
const MailManager = lazy(() => import("utils/MailManager"));
const MultiSelect = lazy(() => import("MultiSelect"));
const PaymentDashboard = lazy(() => import("charts/PaymentDashboard"));
const Payments = lazy(() => import("payments/Payments"));
const OverduePayments = lazy(() => import("payments/OverduePayments"));
const RequestsApproval = lazy(() => import("dashboard/RequestsApproval"));
const SeatBooking = lazy(() => import("SeatBooking"));
const SeatFullInfoPage = lazy(() => import("dashboard/SeatFullInfoPage"));
const StudentRegistration = lazy(() => import("StudentRegistration"));
const VideoGenerationBox = lazy(() => import("utils/VideoGenerationBox"));
const PaymentQR = lazy(() => import("utils/PaymentQR"));
const AppGame = lazy(() => import("dashboard/AppGame"));
const LibraryPolicy = lazy(() => import("sdl/LibraryPolicy"));
const ShiftSeatChangeRequest = lazy(() =>
  import("dashboard/ShiftSeatChangeRequest")
);
const MyRequests = lazy(() => import("dashboard/MyRequests"));
const Counter = lazy(() => import("Counter"));
const ResetPassword = lazy(() => import("hooks/ResetPassword"));
const AdminDashboard = lazy(() => import("dashboard/AdminDashboard"));

const withSuspense = (element) => (
  <Suspense fallback={<PageLoader />}>{element}</Suspense>
);

const AppRoutes = () => (
  <Routes>
    <Route path={ROUTES.home} element={withSuspense(<StudentRegistration />)} />
    <Route path={ROUTES.login} element={withSuspense(<Login />)} />
    <Route path={ROUTES.adminLogin} element={withSuspense(<AdminLogin />)} />
    <Route path={ROUTES.seatBooking} element={withSuspense(<SeatBooking />)} />
    <Route
      path={ROUTES.adminDashboard}
      element={withSuspense(
        <AdminProtectedRoute>
          <AdminDashboard />
        </AdminProtectedRoute>
      )}
    />
    <Route
      path={ROUTES.overduePayments}
      element={withSuspense(<OverduePayments />)}
    />
    <Route
      path={ROUTES.requestsApproval}
      element={withSuspense(<RequestsApproval />)}
    />
    <Route
      path={ROUTES.paymentDashboard}
      element={withSuspense(<PaymentDashboard />)}
    />
    <Route
      path="/dashboard/:userId"
      element={withSuspense(
        <StudentLayout>
          <Dashboard />
        </StudentLayout>
      )}
    />
    <Route path={ROUTES.multiselect} element={withSuspense(<MultiSelect />)} />
    <Route
      path="/payments/:userId"
      element={withSuspense(<Payments />)}
    />
    <Route
      path={ROUTES.seatFullInfo}
      element={withSuspense(<SeatFullInfoPage />)}
    />
    <Route
      path={ROUTES.chartDashboard}
      element={withSuspense(<DashboardChart />)}
    />
    <Route path={ROUTES.chatBox} element={withSuspense(<ChatBox />)} />
    <Route path={ROUTES.mailManager} element={withSuspense(<MailManager />)} />
    <Route
      path={ROUTES.videoGeneration}
      element={withSuspense(<VideoGenerationBox />)}
    />
    <Route
      path={ROUTES.libraryPolicy}
      element={withSuspense(<LibraryPolicy />)}
    />
    <Route
      path={ROUTES.shiftSeatRequest}
      element={withSuspense(<ShiftSeatChangeRequest />)}
    />
    <Route
      path="/my-requests/:userId"
      element={withSuspense(<MyRequests />)}
    />
    <Route
      path="/PaymentQR/:id/:amount"
      element={withSuspense(<PaymentQR />)}
    />
    <Route path={ROUTES.game} element={withSuspense(<AppGame />)} />
    <Route path={ROUTES.counter} element={withSuspense(<Counter />)} />
    <Route
      path={ROUTES.resetPassword}
      element={withSuspense(<ResetPassword />)}
    />
    <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
  </Routes>
);

export default AppRoutes;
