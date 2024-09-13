const generateGitPipeline = (jobName: string, gitUrl: string, buildPath: string) => {
  return `
pipeline {
  agent any

  environment {
    IMAGE_NAME = "${jobName}"
    GIT_URL = "${gitUrl}"
    PROJECT_PATH = "${buildPath}"
  }

  stages {
    stage('Git Checkout') {
        steps {
            echo 'Checking out source code from Git...'
            git branch: 'main', url: "\${GIT_URL}"
        }
    }
    
    stage('Restore Packages') {
        steps {
            echo 'Installing packages...'
            sh 'dotnet restore \${PROJECT_PATH}'
        }
    }

    stage('Install SonarQube Scanner') {
        steps {
            script {
                def scannerInstalled = sh(script: 'dotnet tool list -g | grep dotnet-sonarscanner', returnStatus: true)
                if (scannerInstalled == 0) {
                    echo 'SonarQube Scanner already installed'
                } else {
                    echo 'Installing SonarScanner...'
                    sh 'dotnet tool install --global dotnet-sonarscanner'
                }
            }
        }
    }

    stage('SonarQube Begin Analysis') {
        steps {
            withSonarQubeEnv('sonarqube') {
                sh '''
                   export PATH="$PATH:$HOME/.dotnet/tools"
                   dotnet sonarscanner begin /k:"${jobName}" /n:"brachops"
                '''
            }
        }
    }

    stage('Build Solution') {
        steps {
            echo 'Building the project...'
            sh 'dotnet build \${PROJECT_PATH} --configuration Release'
        }
    }

    stage('SonarQube End Analysis') {
        steps {
            withSonarQubeEnv('sonarqube') {
                sh '''
                    export PATH="$PATH:$HOME/.dotnet/tools"
                    dotnet sonarscanner end
                '''
            }
        }
    }

    stage('File System Scan') {
        steps {
            script {
                def rootFolder = sh(script: "dirname ${buildPath}", returnStdout: true).trim()
                sh "trivy fs --format table -o trivy-fs-report.html \${rootFolder}"
                }
            }
        }
    }
}
  `.trim();
};

export { generateGitPipeline };
