// this is not being used anywhere for now 
import fs from 'fs';
import path from 'path';

interface DeploymentConfig {
  imageName: string;
  envVariables?: Record<string, string>;
}

const generateDeploymentYaml = (config: DeploymentConfig): string => {
  const templatePath = path.join(__dirname, 'templates', 'deployment.yaml');
  let template = fs.readFileSync(templatePath, 'utf-8');

  // Replace image name
  template = template.replace('{{IMAGE_NAME}}', config.imageName);

  // Generate environment variables
  let envVars = '';
  if (config.envVariables) {
    for (const [key, value] of Object.entries(config.envVariables)) {
      envVars += `        - name: ${key}\n          value: "${value}"\n`;
    }
  }

  // Replace environment variables placeholder
  template = template.replace('{{ENV_VARS}}', envVars || '');

  return template;
};

export default generateDeploymentYaml;
