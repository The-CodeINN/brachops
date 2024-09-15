const escapeXML = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};


const generatePipeline = (imageName: string, projectType: ".NET Core" | "Node.js", envVars: Record<string, string>): string => {
  // Escape imageName for XML
  const escapedImageName = escapeXML(imageName);

  // Escape environment variables for XML
  const envVarsScript = Object.keys(envVars).map((key) => {
    return `export ${escapeXML(key)}=${escapeXML(envVars[key])}`;
  }).join(' && ');

  const commonPipelineStages = `
    stage('Check Docker Image on Docker Hub') {
      steps {
        script {
          withDockerRegistry(credentialsId: 'docker-cred', toolName: 'docker') {
            def imageExistsOnHub = sh(script: "docker manifest inspect \${IMAGE_NAME}", returnStatus: true)
            if (imageExistsOnHub != 0) {
              error 'Image does not exist on Docker Hub'
            } else {
              echo 'Image exists on Docker Hub'
            }
          }
        }
      }
    }
    stage('Pull Docker Image') {
      steps {
        script {
          withDockerRegistry(credentialsId: 'docker-cred', toolName: 'docker') {
            def imageExistsLocally = sh(script: "docker image inspect \${IMAGE_NAME}", returnStatus: true)
            if (imageExistsLocally != 0) {
              echo 'Image does not exist locally, pulling from Docker Hub'
              sh "docker pull \${IMAGE_NAME}"
            } else {
              echo 'Image already exists locally'
            }
          }
        }
      }
    }
  `.trim();
  // Please note this script does not work as expected, it is just a placeholder
  const dotNetCorePipeline = `
    stage('Deploy Web App To Kubernetes') {
      steps {
        withCredentials([ string(credentialsId: 'my_kubernetes', variable: 'api_token') ]) {
          script {
            sh '''
              ${envVarsScript}
              cd ..
              envsubst < deployment.yaml | kubectl --token $api_token --server http://127.0.0.1:43113 --insecure-skip-tls-verify=true apply -f -
              envsubst < service.yaml | kubectl --token $api_token --server http://127.0.0.1:43113 --insecure-skip-tls-verify=true apply -f -
            '''
          }
        }
      }
    }
  `.trim();

  // Please note this script does not work as expected, it is just a placeholder
  const nodeJsPipeline = `
    stage('Run Node.js Container') {
      steps {
        withCredentials([ string(credentialsId: 'my_kubernetes', variable: 'api_token') ]) {
          script {
            withDockerRegistry(credentialsId: 'docker-cred', toolName: 'docker') {
              sh '''
                ${envVarsScript}
                docker run -d -p 8082:3000 -e NODE_ENV=production \${IMAGE_NAME}
                tail -f /dev/null
              '''
            }
          }
        }
      }
    }
  `.trim();

  const projectSpecificPipeline = projectType === ".NET Core" ? dotNetCorePipeline : nodeJsPipeline;

  return `
pipeline {
  agent any
  environment {
    IMAGE_NAME = "${escapedImageName}"
    KUBECONFIG = '/home/jenkins/.kube/config'
  }
  stages {
    ${commonPipelineStages}
    ${projectSpecificPipeline}
  }
}
  `.trim();
};


export { generatePipeline };
