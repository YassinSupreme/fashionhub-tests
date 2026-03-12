pipeline {
    agent none

    parameters {
        choice(
            name: 'TEST_ENV',
            choices: ['production', 'staging', 'local'],
            description: 'Target environment for the test run'
        )
        string(
            name: 'BASE_URL',
            defaultValue: '',
            description: 'Override the base URL directly (takes priority over TEST_ENV if set)'
        )
        choice(
            name: 'BROWSER',
            choices: ['all', 'chromium', 'firefox', 'webkit'],
            description: 'Browser(s) to run tests against'
        )
    }

    options {
        timestamps()
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '20'))
    }

    stages {
        stage('Checkout') {
            agent { label 'docker' }
            steps {
                checkout scm
            }
        }

        stage('Run Playwright Tests') {
            agent {
                docker {
                    image 'mcr.microsoft.com/playwright:v1.51.0-noble'
                    args '--ipc=host'
                }
            }
            steps {
                script {
                    def browserFlag = params.BROWSER == 'all' ? '' : "--project=${params.BROWSER}"
                    withEnv([
                        "TEST_ENV=${params.TEST_ENV}",
                        "BASE_URL=${params.BASE_URL}",
                        "CI=true"
                    ]) {
                        sh """
                            npm ci
                            npx playwright test ${browserFlag} --reporter=list,html
                        """
                    }
                }
            }
        }
    }

    post {
        always {
            node('docker') {
                publishHTML(target: [
                    allowMissing         : true,
                    alwaysLinkToLastBuild: true,
                    keepAll              : true,
                    reportDir            : 'playwright-report',
                    reportFiles          : 'index.html',
                    reportName           : 'Playwright HTML Report'
                ])
                archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
                archiveArtifacts artifacts: 'test-results/**', allowEmptyArchive: true
            }
        }
        failure {
            echo 'Tests failed — check the HTML report artifacts for trace and screenshots.'
        }
    }
}
