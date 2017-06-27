import * as fs from 'fs'
import * as shell from 'shelljs'

function stage(name: string, task: () => void): void {
  shell.echo(name)
  task()
}

function checkFileExists(path: string): void {
  if (!fs.existsSync(path)) {
    throw new Error(`${path} not found!`)
  }
}

function playbook(name: string, path: string, task: () => void): void {
  const pwd = shell.pwd()

  shell.echo(`Starting playbook for ${name}`)
  shell.cd(path)

  task()
  shell.echo('Playbook passed')

  shell.cd(pwd)
}

function initWorkspace(name: string): void {
  shell.echo(`Creating workspace ${name}`)
  shell.rm('-rf', name)
  shell.mkdir(name)
  shell.cd(name)
}

playbook('001-002', 'code-examples/001-002', () => {
  initWorkspace('learn-angular-ci')

  stage('Adding app files with static properties', () => {
    const appComponentJs = `\
import { Component } from '@angular/core'

export class AppComponent { }

AppComponent.annotations = [
  new Component({
    selector: 'main',
    template: '<h1>Hello Angular</h1>',
  })
]
`
    const appModuleJs = `\
import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { AppComponent } from './app.component'

export class AppModule { }

AppModule.annotations = [
  new NgModule({
    imports: [
      BrowserModule,
    ],
    declarations: [
      AppComponent,
    ],
    bootstrap: [
      AppComponent,
    ],
  })
]
`
    const mainJs = `\
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'
import { AppModule } from './app.module'

platformBrowserDynamic().bootstrapModule(AppModule)
`

    fs.writeFileSync('app.component.js', appComponentJs)
    fs.writeFileSync('app.module.js', appModuleJs)
    fs.writeFileSync('main.js', mainJs)
  })

  stage('Installing dependencies by Yarn', () => {
    shell.exec('yarn add @angular/core @angular/common @angular/compiler @angular/platform-browser @angular/platform-browser-dynamic rxjs')
  })

  stage('Bundling app using Webpack', () => {
    shell.exec('webpack main.js bundle-0.js')
  })

  stage('Checking webpack results', () => {
    checkFileExists('./bundle-0.js')
    shell.echo('Webpack bundle generated')
  })

  stage('Transpile JavaScripts using tsc for static properties', () => {
    shell.exec('tsc --allowJs --outDir dist-0 --target es2015 main.js')
  })

  stage('Checking tsc results for static properties', () => {
    checkFileExists('./dist-0/app.component.js')
    shell.echo('TypeScript Compilation works')
  })

  stage('Modifying source files with Decorator', () => {
    const appComponentJs = `\
import { Component } from '@angular/core'

@Component({
  selector: 'main',
  template: '<h1>Hello Angular</h1>',
})
export class AppComponent { }
`
    const appModuleJs = `\
import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { AppComponent } from './app.component'

@NgModule({
  imports: [
    BrowserModule,
  ],
  declarations: [
    AppComponent,
  ],
  bootstrap: [
    AppComponent,
  ],
})
export class AppModule { }
`
    fs.writeFileSync('app.component.js', appComponentJs)
    fs.writeFileSync('app.module.js', appModuleJs)
  })

  stage('Transpile JavaScripts using tsc for Decorators', () => {
    shell.exec('tsc --allowJs --outDir dist-1 --target es2015 --experimentalDecorators main.js')
  })

  stage('Bundling app using Webpack', () => {
    shell.exec('webpack dist-1/main.js bundle-1.js')
  })

  stage('Checking webpack results', () => {
    checkFileExists('./bundle-1.js')
    shell.echo('Webpack bundle generated')
  })

  stage('Upgrading source files to TypeScript', () => {
    shell.mv('app.component.js', 'app.component.ts')
    shell.mv('app.module.js', 'app.module.ts')
    shell.mv('main.js', 'main.ts')
  })

  stage('Transpile TypeScripts using tsc', () => {
    shell.exec('tsc --target es2015 --experimentalDecorators --moduleResolution node main.ts')
  })

  stage('Bundling app using Webpack', () => {
    shell.exec('webpack main.js bundle-2.js')
  })

  stage('Checking webpack results', () => {
    checkFileExists('./bundle-2.js')
    shell.echo('Webpack bundle generated')
  })
})
