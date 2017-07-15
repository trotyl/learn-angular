import { playbook, stage } from 'anorexia'
import { assert } from 'chai'

playbook('learn-angular-001-002', (host) => {

  const { yarn, system, file } = host.extensions

  stage('Adding app files with static properties', () => {
    host.setUpFiles({
      [`./fixtures/static-property/app.component.js`]: 'app.component.js',
      [`./fixtures/static-property/app.module.js`]: 'app.module.js',
      [`./fixtures/static-property/main.js`]: 'main.js',
    })
  })

  stage('Installing dependencies by Yarn', () => {
    yarn.install(
      '@angular/core',
      '@angular/common',
      '@angular/compiler',
      '@angular/platform-browser',
      '@angular/platform-browser-dynamic',
      'rxjs',
    )
  })

  stage('Bundling app using Webpack', () => {
    system.exec('webpack main.js bundle-0.js')
  })

  stage('Checking webpack results', () => {
    assert.isTrue(file.exists('./bundle-0.js'))
    system.echo('Webpack bundle generated')
  })

  stage('Transpile JavaScripts using tsc for static properties', () => {
    system.exec('tsc --allowJs --outDir dist-0 --target es2015 main.js')
  })

  stage('Checking tsc results for static properties', () => {
    assert.isTrue(file.exists('./dist-0/app.component.js'))
    system.echo('TypeScript Compilation works')
  })

  stage('Modifying source files with Decorator', () => {
    file.remove('app.component.js', 'app.module.js')
    host.setUpFiles({
      [`./fixtures/decorators/app.component.js`]: 'app.component.js',
      [`./fixtures/decorators/app.module.js`]: 'app.module.js',
    })
  })

  stage('Transpile JavaScripts using tsc for Decorators', () => {
    system.exec('tsc --allowJs --outDir dist-1 --target es2015 --experimentalDecorators main.js')
  })

  stage('Bundling app using Webpack', () => {
    system.exec('webpack dist-1/main.js bundle-1.js')
  })

  stage('Checking webpack results', () => {
    assert.isTrue(file.exists('./bundle-1.js'))
    system.echo('Webpack bundle generated')
  })

  stage('Upgrading source files to TypeScript', () => {
    file.rename({
      'app.component.js': 'app.component.ts',
      'app.module.js': 'app.module.ts',
      'main.js': 'main.ts',
    })
  })

  stage('Transpile TypeScripts using tsc', () => {
    system.exec('tsc --target es2015 --experimentalDecorators --moduleResolution node main.ts')
  })

  stage('Bundling app using Webpack', () => {
    system.exec('webpack main.js bundle-2.js')
  })

  stage('Checking webpack results', () => {
    assert.isTrue(file.exists('./bundle-2.js'))
    system.echo('Webpack bundle generated')
  })
}, __dirname)
