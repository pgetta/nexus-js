String version = env.BRANCH_NAME
String commitId = env.GIT_COMMIT
Boolean isRelease = version ==~ /v\d+\.\d+\.\d+.*/
Boolean isPR = env.CHANGE_ID != null

pipeline {
    agent any

    environment {
        NPM_NEXUS_TOKEN = credentials('npm-nexus-token')
    }

    stages {
        stage('Start Pipeline') {
            steps{
                sh 'echo "Pipeline starting with environment:"'
                sh 'printenv'
            }
        }

        stage('Checkout and Install dependencies') {
            steps {
                checkout scm
                sh 'make install'
            }
        }

        stage('Build packages') {
            steps {
                sh 'make build'
            }
        }

        stage('Review') {
            parallel {
                stage('Lint') {
                    steps {
                        sh 'make lint'
                    }
                }
                stage('Test') {
                    steps {
                        sh 'make test'
                        sh "npm run codecov -- --token=\"`oc get secrets codecov-secret --template='{{.data.nexus_sdk_js}}' | base64 -d`\""
                    }
                }
            }
        }

        stage('Publish to npm') {
            when {
                expression { isRelease }
            }
            steps {
                sh 'echo "//registry.npmjs.org/:_authToken=${NPM_NEXUS_TOKEN}" > .npmrc && npx lerna publish from-package --yes'
            }
        }
    }
}
