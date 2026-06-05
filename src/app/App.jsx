import { Suspense, lazy } from "react";
import AppShell from "components/layout/AppShell";
import PageLoader from "components/layout/PageLoader";
import AppRoutes from "routes";

import "App.css";
import "index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const Header = lazy(() => import("login/Header"));
const RunningText = lazy(() => import("updates/RunningText"));

const App = () => (
  <Suspense fallback={<PageLoader />}>
    <AppShell
      headerSlot={
        <Suspense fallback={null}>
          <Header />
        </Suspense>
      }
    >
      <Suspense fallback={<PageLoader />}>
        <RunningText />
      </Suspense>
      <div>
        <AppRoutes />
      </div>
    </AppShell>
  </Suspense>
);

export default App;
