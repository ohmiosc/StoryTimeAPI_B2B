#!/usr/bin/env groovy
def getWorkspace() {
    pwd().replace("%2F", "_")
}
pipeline {
  agent any
  parameters {
    booleanParam(
      name: 'REGISTRY',
      defaultValue: false,
      description: "Requiere construir o no Registry in ECR")
    booleanParam(
      name: 'CREATE_STACK',
      defaultValue: false,
      description: "Requiere construir o no el Stack")
    booleanParam(
      name: 'UPDATE_STACK',
      defaultValue: false,
      description: "Actualizar Stack")
    choice(
      name: 'MIGRATIONS',
      choices: "false\nmigrate\nrollback",
      description: "Indica si se ejecutaran migraciones de DB")
    choice(
      name: 'MEMORY_SIZE',
      choices:"128\n256\n512\n768\n1024\n2048",
      description: "Cantidad de memoria asignada al contenedor")
    choice(
      name: 'DESIRED_COUNT',
      choices:"1\n2\n3\n4\n5\n10",
      description: "Numero de instancias por incremento")
    text(name: 'MIN_SCALING',     defaultValue: '1',  description: 'Minimo de contenedores disponibles')
    text(name: 'MAX_SCALING',     defaultValue: '2',  description: 'Maximo de contenedores disponibles')
    text(name: 'HTTPS_PRIORITY',  defaultValue: '15', description: 'Prioridad de listener Https en el ALB: dev=43')

  options {
    ansiColor('xterm')
    disableConcurrentBuilds()
  }
//

environment {
    AWS_ACCESS_KEY_ID = credentials('AWS_ACCESS_KEY_ID')
    AWS_SECRET_ACCESS_KEY = credentials('AWS_SECRET_ACCESS_KEY')
    AWS_DEFAULT_REGION = credentials('AWS_DEFAULT_REGION')
}
try {
  node('linux') {
    wrap([$class: 'AnsiColorBuildWrapper', 'colorMapName': 'XTerm', 'defaultFg': 1, 'defaultBg': 2]) {
      ws(getWorkspace()) {
        workspace = pwd()

        deleteDir()

        checkout([
          $class: 'GitSCM',
          branches: scm.branches,
          extensions: scm.extensions + [[$class: 'CheckoutOption', timeout: 60], [$class: 'CloneOption', reference: '', timeout: 60]],
          userRemoteConfigs: scm.userRemoteConfigs
        ])

        stash name: 'nodejs', includes: "src/aws-lambda-nodejs/**/*"
        stash name: 'deployment', includes: "deployment/**/*"
        stash name: 'client.api.tests', includes: "src/client-api-tests/**/*"
        stash name: 'python', includes: "src/aws-lambda-python/**/*"

      }
    }
  }
  stage('Build') {
     parallel(
      'nodejs': {
        node('node') {
          unstash 'nodejs'
          sh "sudo rm -f kantoo.api.nodejs.zip"
          sh "cd src/aws-lambda-nodejs && sudo npm install && sudo npm run build"
          sh "cd src/aws-lambda-nodejs && sudo rm -r node_modules && sudo npm install --production"
          sh "whoami"
          sh "sudo zip -r -q kantoo.api.nodejs.zip src/aws-lambda-nodejs"
          stash name: 'nodejs_dist', includes: "kantoo.api.nodejs.zip"
        }
      }
    )
  }

  stage('Terraform') {
    node('docker') {
       sh "whoami"
//         sh "ls"
//         unstash 'nodejs_dist'
        unstash 'deployment'

        sh "sudo unzip -q -o kantoo.api.nodejs.zip -d src/aws-lambda-nodejs"
        sh "ls -r"

        docker
          .image('hashicorp/terraform')
          .withRun() { c->
            sh 'cd ./deployment && sudo chmod u+x deploy.sh && ./deploy.sh'
          }
      }
  }

  currentBuild.result = 'SUCCESS'
} catch (e) {
  currentBuild.result = 'FAILURE'
  throw e
} finally {
  if (env.TF_VAR_env_name == "prod" || env.TF_VAR_env_name == "qa") {
    node {
      println currentBuild.result  // this prints null
    }
  }
}
  }
}
