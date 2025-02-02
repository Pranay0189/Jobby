pipeline {
    environment {
        scannerHome = tool "SonarScanner"
    }
    agent any
    
    tools {
        nodejs "NODEJS"
    }
    
    stages {
        stage ("Checkout") {
            steps {
                git branch: "main", url: "https://github.com/Pranay0189/Jobby.git"
            }
        }
        
        stage ("Install Dependencies") {
            steps {
                sh "npm install"
            }
        }
        
        stage ("code analysis") {
            steps {
                withSonarQubeEnv("SonarQube") {
                    sh '''${scannerHome}/bin/sonar-scanner -Dsonar.projectKey=Jobby-App \
                    -Dsonar.projectName=Jobby-App \
                    -Dsonar.sources=src/ \
                    '''
                }
            }
        }
        stage ("docker login") {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerCredentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                    '''
                }
            }
        }
        stage ("build image") {
            steps {
                sh "docker build -t tony878/jobby-app:${BUILD_NUMBER} ."
            }
        }
        stage ("docker push") {
            steps {
                sh 'docker push tony878/jobby-app:${BUILD_NUMBER}'
            }
        }
    }
}