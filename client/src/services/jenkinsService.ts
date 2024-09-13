import axios from 'axios';

export const baseUrl = import.meta.env.VITE_BACKEND_URL;

class DeploymentService {
  static async getDeployments() {
    const data = await axios.get(`${baseUrl}/jenkins/info`);
    return data.data;
  }
}

export { DeploymentService };
