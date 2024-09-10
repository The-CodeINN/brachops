const generateGitPipeline = (imageName: string, gitUrl: string) => {
  return `
pipeline {
  agent any

  environment {
    IMAGE_NAME = "${imageName}"
    GIT_URL = "${gitUrl}"
    PROJECT_PATH = 'server/quizzie/quizzie.csproj'
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
                   dotnet sonarscanner begin /k:"quizzie" /n:"quizzie"
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

    stage('Fetch SonarQube Report URL') {
            steps {
                script {
                    def sonarReportFile = 'path_to_workspace/.sonarqube/out/.sonar/report-task.txt'
                    def sonarTaskUrl = sh(script: "grep '^ceTaskUrl=' \${sonarReportFile} | cut -d '=' -f 2", returnStdout: true).trim()
                    echo "SonarQube analysis report URL: \${sonarTaskUrl}"
                    
                    // Return this URL to the user (e.g., through an API or UI)
                }
            }
        }

    stage('File System Scan') {
        steps {
            sh "trivy fs --format table -o trivy-fs-report.html server/quizzie"
            }
        }
    }
}
  `.trim();
};

export { generateGitPipeline };
