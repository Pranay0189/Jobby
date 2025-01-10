pipeline {
    agent any

    tools {
        nodejs "NODEJS"   
    }

    environment{
        registryCredentials: "ecr:ap-south-1:awscreds"
        imageName = "423623861221.dkr.ecr.ap-south-1.amazonaws.com/jobby-appa"
        appRegistry = "https://423623861221.dkr.ecr.ap-south-1.amazonaws.com"
    }
    stages {
        stage ("clone code") {
            steps {
                git branch: "master" url:"https://github.com/Pranay0189/Jobby.git"
            }
        }

        stage ("Install Dependencies") {
            steps {
                sh "npm install"
            }
        }

        stage ("Build") {
            steps {
                sh "npm run build"
            }
            post {
                success {
                    echo "Build Success"
                }
            }
        }

        stage ("Docker Build") {
            steps {
                script {
                    dockerImage = docker.build ( imageName + ":$BUILD_NUMBER", "./Dockerfile")
                }
            }
        }

        stage ("Upload Image") {
            steps {
                script {
                    docker.withRegistry ( appRegistry, registryCredentials ) {
                        dockerImage.push("$BUILD_NUMBER")
                        dockerImage.push("latest")
                    }
                }
            }
        }
    }
}