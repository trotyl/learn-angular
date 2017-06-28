import { playbook, stage } from 'anorexia'
import { assert } from 'chai'

playbook('learn-angular-001-002', (env) => {

  stage('Adding app files with static properties', () => {
    env.setUpFiles({
      'static-property/app.component.js': 'app.component.js',
      'static-property/app.module.js': 'app.module.js',
      'static-property/main.js': 'main.js',
    })
  })

  stage('Installing dependencies by Yarn', () => {
    env.install(
      '@angular/core',
      '@angular/common',
      '@angular/compiler',
      '@angular/platform-browser',
      '@angular/platform-browser-dynamic',
      'rxjs',
    )
  })

  stage('Bundling app using Webpack', () => {
    env.exec('webpack main.js bundle-0.js')
  })

  stage('Checking webpack results', () => {
    env.assertFileExists('./bundle-0.js')
    env.echo('Webpack bundle generated')
  })

  stage('Transpile JavaScripts using tsc for static properties', () => {
    env.exec('tsc --allowJs --outDir dist-0 --target es2015 main.js')
  })

  stage('Checking tsc results for static properties', () => {
    assert.isTrue(env.fileExists('./dist-0/app.component.js'))
    env.echo('TypeScript Compilation works')
  })

  stage('Modifying source files with Decorator', () => {
    env.removeFiles('app.component.js', 'app.module.js')
    env.setUpFiles({
      'decorators/app.component.js': 'app.component.js',
      'decorators/app.module.js': 'app.module.js',
    })
  })

  stage('Transpile JavaScripts using tsc for Decorators', () => {
    env.exec('tsc --allowJs --outDir dist-1 --target es2015 --experimentalDecorators main.js')
  })

  stage('Bundling app using Webpack', () => {
    env.exec('webpack dist-1/main.js bundle-1.js')
  })

  stage('Checking webpack results', () => {
    assert.isTrue(env.fileExists('./bundle-1.js'))
    env.echo('Webpack bundle generated')
  })

  stage('Upgrading source files to TypeScript', () => {
    env.renameFiles({
      'app.component.js': 'app.component.ts',
      'app.module.js': 'app.module.ts',
      'main.js': 'main.ts',
    })
  })

  stage('Transpile TypeScripts using tsc', () => {
    env.exec('tsc --target es2015 --experimentalDecorators --moduleResolution node main.ts')
  })

  stage('Bundling app using Webpack', () => {
    env.exec('webpack main.js bundle-2.js')
  })

  stage('Checking webpack results', () => {
    assert.isTrue(env.fileExists('./bundle-2.js'))
    env.echo('Webpack bundle generated')
  })
}, __dirname)
