import { Routes, Route } from "react-router-dom";
import Home from "./landing/pages/Home";
import About from "./landing/pages/About";
import NotFound from "./dashboard/pages/NotFound";
import CreateDeployment from "./dashboard/pages/CreateDeployment";
import CodeScan from "./dashboard/pages/CodeScan";
import LandingLayout from "./landing/layout";
import DashboardLayout from "./dashboard/layout";

function App() {
  return (
    <>
      <Routes>
        <Route element={<LandingLayout />}>
          // Landing routes
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
        </Route>

        <Route element={<DashboardLayout />}>
          {/* Dashboard routes */}
          <Route path="/create-deployment" element={<CreateDeployment />} />
          <Route path="/codescan" element={<CodeScan />} />
        </Route>

        {/* Catch all routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
