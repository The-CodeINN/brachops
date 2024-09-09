import { Routes, Route } from "react-router-dom";
import Home from "./landing/pages/Home";
import About from "./landing/pages/About";
import NotFound from "./dashboard/pages/NotFound";
import PublicLayout from "./landing/layout";
import PrivateLayout from "./dashboard/layout";
import CreateDeployment from "./dashboard/pages/CreateDeployment";
import CodeScan from "./dashboard/pages/CodeScan";

function App() {
  return (
    <>
      <Routes>
        <Route element={<PublicLayout />}>
          // Landing routes
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
        </Route>

        <Route element={<PrivateLayout />}>
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
