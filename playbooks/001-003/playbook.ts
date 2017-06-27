import { playbook, stage } from '../utils'

playbook('learn-angular-001-003', (env) => {
  
  const PATH_PREFIX = 'learn-angular-ci'
  env.usePrefix(PATH_PREFIX)
  
  stage('Creating new Angular CLI project', () => {
    env.exec(`rm -rf ${PATH_PREFIX}`)
    env.exec(`ng new --skip-install ${PATH_PREFIX}`)
    env.cd(PATH_PREFIX)
  })

  stage('Installing dependencies via Yarn', () => {
    env.install()
  })

  stage('Building project using AOT', () => {
    env.exec('ng build --aot')
  })

  stage('Modifying tsconfig.app.json for separated path', () => {
    env.setUpFiles({
      'separated/tsconfig.app.json': `src/tsconfig.app.json`
    })
  })

  stage('Compiling project using ngc for separated path', () => {
    env.exec('./node_modules/.bin/ngc -p src/tsconfig.app.json')
  })

  stage('Checking ngc results for separated path', () => {
    env.assertFileExists(`out-aot/app/app.component.ngfactory.ts`)
    env.assertFileExists(`out-tsc/app/app/app.component.js`)
    env.echo('AOT Compilation works')
  })

  stage('Modifying tsconfig.app.json for unified path', () => {
    env.modifyJson('src/tsconfig.app.json', {
      compilerOptions: {
        outDir: '.',
        target: 'es2015'
      },
      angularCompilerOptions: null,
    })
  })

  stage('Compiling project using ngc for unified path', () => {
    env.exec('./node_modules/.bin/ngc -p src/tsconfig.app.json')
    env.exec('./node_modules/.bin/ngc -p src/tsconfig.app.json')
  })

  stage('Checking ngc results for separated path', () => {
    env.assertFileExists(`src/app/app.component.ngfactory.js`)
    env.echo('AOT Compilation works')
  })

  stage('Modifying main.js', () => {
    env.replaceInFile('src/main.js',
      [/platformBrowserDynamic/g, 'platformBrowser'],
      [/platform-browser-dynamic/g, 'platform-browser'],
      [`import { environment } from './environments/environment'`, ''],
      [`environment.production`, 'true']
    )
  })

  stage('Bundling app using Webpack', () => {
    env.exec('webpack src/main.js out-webpack/bundle.js')
  })

  stage('Checking webpack results', () => {
    env.assertFileExists(`out-webpack/bundle.js`)
    env.echo('Webpack bundle generated')
  })
}, __dirname)
