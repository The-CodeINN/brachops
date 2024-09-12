const generatePipeline = (imageName: string, projectType: ".NET Core" | "Node.js"): string => {
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
        withCredentials([
          string(credentialsId: 'postgres_user', variable: 'POSTGRES_USER'),
          string(credentialsId: 'postgres_password', variable: 'POSTGRES_PASSWORD'),
          string(credentialsId: 'postgres_db', variable: 'POSTGRES_DB'),        
          string(credentialsId: 'postgres_host', variable: 'POSTGRES_HOST'),
          string(credentialsId: 'postgres_port', variable: 'POSTGRES_PORT'),
          string(credentialsId: 'vault_addr', variable: 'VAULT_ADDR'),
          string(credentialsId: 'vault-tok', variable: 'VAULT_TOKEN'),
          string(credentialsId: 'my_kubernetes', variable: 'api_token')
        ]) {
          script {
            sh '''
              envsubst < infra/k8s/server/deployment.yaml | kubectl --token $api_token --server http://127.0.0.1:45269 --insecure-skip-tls-verify=true apply -f -
              envsubst < infra/k8s/server/service.yaml | kubectl --token $api_token --server http://127.0.0.1:45269 --insecure-skip-tls-verify=true apply -f -
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
        withCredentials([
          string(credentialsId: 'postgres_user', variable: 'POSTGRES_USER'),
          string(credentialsId: 'postgres_password', variable: 'POSTGRES_PASSWORD'),
          string(credentialsId: 'postgres_db', variable: 'POSTGRES_DB'),
          string(credentialsId: 'postgres_host', variable: 'POSTGRES_HOST'),
          string(credentialsId: 'postgres_port', variable: 'POSTGRES_PORT'),
          string(credentialsId: 'vault_addr', variable: 'VAULT_ADDR'),
          string(credentialsId: 'vault_token', variable: 'VAULT_TOKEN')
        ]) {
          script {
            withDockerRegistry(credentialsId: 'docker-cred', toolName: 'docker') {
              sh "docker run -d -p 8082:3000 -e NODE_ENV=production \${IMAGE_NAME}"
              sh "tail -f /dev/null"
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
    IMAGE_NAME = "${imageName}"
  }
  stages {
    ${commonPipelineStages}
    ${projectSpecificPipeline}
  }
}
  `.trim();
};

export { generatePipeline };
