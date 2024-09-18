import { Routes, Route } from 'react-router-dom';
import Home from './landing/pages/Home';
import About from './landing/pages/About';
import NotFound from './dashboard/pages/NotFound';
import LandingLayout from './landing/layout';
import DashboardLayout from './dashboard/layout';
import Deployments from './dashboard/pages/deployments';
import DeploymentDetails from './dashboard/pages/DeploymentDetail';
import DeploymentDetailsTable from './dashboard/pages/DeploymentDetailsTable';
import CreateDeploymentOrScanJob from './dashboard/pages/CreateDeploymentOrScanJob';

function App() {
  return (
    <>
      <Routes>
        <Route element={<LandingLayout />}>
          // Landing routes
          <Route index element={<Home />} />
          <Route path='about' element={<About />} />
        </Route>

        <Route element={<DashboardLayout />}>
          {/* Dashboard routes */}
          <Route path='/deploy' element={<CreateDeploymentOrScanJob />} />
          <Route path='/codescan' element={<CreateDeploymentOrScanJob />} />
          <Route path='/deployments' element={<Deployments />} />

          <Route
            path='/deployment/:name'
            element={<DeploymentDetailsTable />}
          />
          <Route
            path='/deployment/:jobName/:buildId'
            element={<DeploymentDetails />}
          />
        </Route>

        {/* Catch all routes */}
        <Route path='*' element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
