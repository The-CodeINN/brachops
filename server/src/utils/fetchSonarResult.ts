import axios from "axios";
import config from "config";

async function fetchSonarQubeResults(projectKey: string) {
  const sonarqubeUrl = config.get<string>("SONARQUBE_URL");
  const apiToken = config.get<string>("SONARQUBE_API_TOKEN");

  try {
    const response = await axios.get(`${sonarqubeUrl}/api/measures/component`, {
      params: {
        component: projectKey,
        metricKeys: "bugs,vulnerabilities,code_smells,coverage",
      },
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching SonarQube results:", error);
    throw error;
  }
}
