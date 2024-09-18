const ScanCodePipeline = (
  jobName: string,
  gitUrl: string,
  buildPath: string,
  projectType: "DotNetCore" | "NodeJs"
) => {
  const dotNetCorePipeline = `
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
                    dotnet sonarscanner begin /k:"${jobName}" /n:"BrachOps-${jobName}"
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
                    def rootFolder = sh(script: "dirname \${PROJECT_PATH}", returnStdout: true).trim()
                    sh "trivy fs --format table -o trivy-fs-report.html \${rootFolder}"
                }
            }
        }
        `.trim();

  const nodeJsPipeline = `
    stage('Git Checkout') {
        steps {
            echo 'Checking out source code from Git...'
            git branch: 'main', url: "\${GIT_URL}"
        }
    }
    
    stage('Install Dependencies') {
        steps {
            echo 'Installing packages...'
            sh ''' 
            cd \${PROJECT_PATH}
            npm install
            '''
        }
    }

    stage('Install SonarScanner') {
        steps{
            script {
                def scannerInstalled = sh(script: "npm list -g | grep sonarqube-scanner", returnStatus: true)
                if(scannerInstalled != 0) {
                    echo 'Installing SonarScanner...'
                    sh 'npm install -g sonarqube-scanner'
                } else {
                    echo 'SonarScanner already installed'
                }
            }
        }
    }

    stage('SonarQube Begin Analysis') {
        steps {
            withSonarQubeEnv('sonarqube') {
                echo 'Running SonarQube Analysis...'
                sh '''
                export PATH="$PATH:$HOME/.nvm"
                sonar-scanner \\
                -Dsonar.projectKey="${jobName}" \\
                -Dsonar.projectName="BrachOps-${jobName}" \\
                -Dsonar.sources=.
                '''
            }
        }
    }

    stage('File System Scan') {
        steps {
            script {
                def rootFolder = sh(script: "dirname \${PROJECT_PATH}", returnStdout: true).trim()
                sh "trivy fs --format table -o trivy-fs-report.html \${rootFolder}"
            }
        }    
    }
  `.trim();

  const tools = projectType === "NodeJs" ? 'tools {nodejs "node"}\n' : "";

  const projectSpecificPipeline =
    projectType === "DotNetCore" ? dotNetCorePipeline : nodeJsPipeline;
  return `
pipeline {
  agent any

  ${tools}

  environment {
    IMAGE_NAME = "${jobName}"
    GIT_URL = "${gitUrl}"
    PROJECT_PATH = "${buildPath}"
  }

  stages {
    ${projectSpecificPipeline}
    }

  post {
    success {
        echo 'Pipeline completed successfully.'
    }
    failure {
        echo 'Pipeline failed.'
    }
    always {
        cleanWs() // Clean up workspace after build
        }
    }
}
  `.trim();
};

export { ScanCodePipeline };
