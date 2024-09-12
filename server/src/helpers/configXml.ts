// Function to escape special characters in XML
const escapeXML = (unsafe: string) => {
  return unsafe.replace(/&/g, "&amp;")
               .replace(/</g, "&lt;")
               .replace(/>/g, "&gt;")
               .replace(/"/g, "&quot;")
               .replace(/'/g, "&apos;");
};

// Create Jenkins Job XML with proper escaping
const createJenkinsJobXML = (pipelineScript: string) => {
  // Escape pipeline script to handle special characters
  const escapedPipelineScript = escapeXML(pipelineScript);
  
  return `
<?xml version='1.1' encoding='UTF-8'?>
<flow-definition plugin="workflow-job@2.40">
  <description></description>
  <keepDependencies>false</keepDependencies>
  <properties/>
  <definition class="org.jenkinsci.plugins.workflow.cps.CpsFlowDefinition" plugin="workflow-cps@2.87">
    <script>${escapedPipelineScript}</script>  <!-- Pipeline script goes here -->
    <sandbox>true</sandbox>
  </definition>
  <triggers/>
  <disabled>false</disabled>
</flow-definition>
  `.trim();
};

export { createJenkinsJobXML };
