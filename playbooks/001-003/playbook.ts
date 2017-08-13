import { playbook, stage } from 'anorexia'
import { assert } from 'chai'

playbook('learn-angular-001-003', (host) => {

  const { file, json, system, text, yarn } = host.extensions
  
  const PATH_PREFIX = 'learn-angular-ci'
  host.usePrefix(PATH_PREFIX)
  
  stage('Creating new Angular CLI project', () => {
    system.exec(`rm -rf ${PATH_PREFIX}`)
    system.exec(`ng new --skip-install ${PATH_PREFIX}`)
    system.cd(PATH_PREFIX)
  })

  stage('Installing dependencies via Yarn', () => {
    yarn.install()
  })

  stage('Building project using AOT', () => {
    system.exec('ng build --aot')
  })

  stage('Modifying tsconfig.app.json for separated path', () => {
    host.setUpFiles({
      [`./fixtures/tsconfig.app.json`]: `src/tsconfig.app.json`
    })
  })

  stage('Compiling project using ngc for separated path', () => {
    system.exec('./node_modules/.bin/ngc -p src/tsconfig.app.json')
  })

  stage('Checking ngc results for separated path', () => {
    assert.isTrue(file.exists(`out-aot/app/app.component.ngfactory.ts`))
    assert.isTrue(file.exists(`out-tsc/app/app/app.component.js`))
    system.echo('AOT Compilation works')
  })

  stage('Modifying tsconfig.app.json for unified path', () => {
    json.modify('src/tsconfig.app.json', {
      compilerOptions: {
        outDir: '.',
        target: 'es2015'
      },
      angularCompilerOptions: {
        alwaysCompileGeneratedCode: true,
        genDir: null
      },
    })
  })

  stage('Compiling project using ngc for unified path', () => {
    system.exec('./node_modules/.bin/ngc -p src/tsconfig.app.json')
  })

  stage('Checking ngc results for unified path', () => {
    assert.isTrue(file.exists(`src/app/app.component.ngfactory.js`))
    system.echo('AOT Compilation works')
  })

  stage('Modifying main.js', () => {
    text.replaceInFile('src/main.js',
      [/platformBrowserDynamic/g, 'platformBrowser'],
      [/platform-browser-dynamic/g, 'platform-browser'],
      [`import { environment } from './environments/environment'`, ''],
      [`environment.production`, 'true']
    )
  })

  stage('Bundling app using Webpack', () => {
    system.exec('webpack src/main.js out-webpack/bundle.js')
  })

  stage('Checking webpack results', () => {
    assert.isTrue(file.exists(`out-webpack/bundle.js`))
    system.echo('Webpack bundle generated')
  })
}, __dirname)
