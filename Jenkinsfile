pipeline {
  agent any
  tools {
    nodejs 'nodejs_14.2.0'
  }
  stages {
    stage('Startup') {
      steps {
        script {
          sh 'npm install'
        }
      }
    }
    stage('Test') {
      steps {
        script {
          sh 'npm run lint'
          sh 'npm run coverage'
        }
      }
      post {
        always {
          junit 'junit.xml'
        }
      }
    }
    stage('Build') {
      steps {
        script {
          sh 'npm run clean'
          sh 'npm run build:prod'
          sh 'npm pack'
        }
      }
    }
  }
}
def uploadArtifact(server) {
  def uploadSpec = """{
            "files": [
              {
                "pattern": "continuous-test-code-coverage-guide*.tgz",
                "target": "npm-stable/"
              }
           ]
          }"""
  server.upload(uploadSpec)
  def buildInfo = Artifactory.newBuildInfo()
  server.upload spec: uploadSpec, buildInfo: buildInfo
  server.publishBuildInfo buildInfo
}