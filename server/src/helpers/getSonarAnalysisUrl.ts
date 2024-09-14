const extractSonarqubeDashboardUrl = (data: any) => {
  // Iterate over the array
  for (const item of data) {
    // Check if the object contains the 'sonarqubeDashboardUrl' key and it's not null
    if (item.sonarqubeDashboardUrl) {
      return item.sonarqubeDashboardUrl;
    }
  }
  return null; // Return null if no URL is found
};

export { extractSonarqubeDashboardUrl };
