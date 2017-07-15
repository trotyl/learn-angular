import { playbook, stage } from 'anorexia'
import { assert } from 'chai'

playbook('learn-angular-002-001', (host) => {

  const { file, system, text, yarn } = host.extensions
  
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

  stage('Modifying custom interpolation delimiter', () => {
    text.replaceInFile(`src/app/app.component.ts`, 
      [/styleUrls: ['\.\/app.component.css']/, `styleUrls: ['./app.component.css'],\ninterpolation: ['%start%', '%end%']`]
    )
  })

  stage('Modifying interpolation usage', () => {
    text.replaceInFile(`src/app/app.component.html`, 
      [/{{title}}/, `%start%title%end%`]
    )
  })

  stage('Building project using AOT', () => {
    system.exec('ng build --aot')
  })

  stage('Checking ng build result', () => {
    assert.isTrue(file.exists(`dist/main.bundle.js`))
    system.echo('AOT Compilation works')
  })

  stage('Generating component', () => {
    system.exec('ng g c data-binding')
  })

  stage('Checking ng build result', () => {
    assert.isTrue(file.exists(`src/app/data-binding/data-binding.component.ts`))
    system.echo('AOT Compilation works')
  })

  stage('Generating component', () => {
    text.appendEnd(`src/app/app.component.html`, `<img src="https://avatars0.githubusercontent.com/u/{{ avatarId }}?v=3&s=460">`)
  })

  // stage('Compiling project using ngc for separated path', () => {
  //   env.exec('./node_modules/.bin/ngc -p src/tsconfig.app.json')
  // })



  // stage('Modifying tsconfig.app.json for unified path', () => {
  //   env.modifyJson('src/tsconfig.app.json', {
  //     compilerOptions: {
  //       outDir: '.',
  //       target: 'es2015'
  //     },
  //     angularCompilerOptions: null,
  //   })
  // })

  // stage('Compiling project using ngc for unified path', () => {
  //   env.exec('./node_modules/.bin/ngc -p src/tsconfig.app.json')
  //   env.exec('./node_modules/.bin/ngc -p src/tsconfig.app.json')
  // })

  // stage('Checking ngc results for separated path', () => {
  //   assert.isTrue(env.fileExists(`src/app/app.component.ngfactory.js`))
  //   env.echo('AOT Compilation works')
  // })

  // stage('Modifying main.js', () => {
  //   env.replaceInFile('src/main.js',
  //     [/platformBrowserDynamic/g, 'platformBrowser'],
  //     [/platform-browser-dynamic/g, 'platform-browser'],
  //     [`import { environment } from './environments/environment'`, ''],
  //     [`environment.production`, 'true']
  //   )
  // })

  // stage('Bundling app using Webpack', () => {
  //   env.exec('webpack src/main.js out-webpack/bundle.js')
  // })

  // stage('Checking webpack results', () => {
  //   assert.isTrue(env.fileExists(`out-webpack/bundle.js`))
  //   env.echo('Webpack bundle generated')
  // })
}, __dirname)
