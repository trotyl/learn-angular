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

  stage('Checking ng generate result', () => {
    assert.isTrue(file.exists(`src/app/data-binding/data-binding.component.ts`))
    system.echo('AOT Compilation works')
  })

  stage('Add element in template', () => {
    text.appendEnd(`src/app/data-binding/data-binding.component.html`, `<img src="https://avatars0.githubusercontent.com/u/{{ avatarId }}?v=3&s=460">`)
  })

  stage('Add property in component', () => {
    text.appendBefore(`src/app/data-binding/data-binding.component.ts`, `constructor()`, `avatarId = 6059170\n  `)
  })

  stage('Add component usage in parent', () => {
    text.appendEnd(`src/app/app.component.html`, `<app-data-binding></app-data-binding>`)
  })

  stage('Building project using AOT', () => {
    file.remove(`dist/main.bundle.js`)
    system.exec('ng build --aot')
  })

  stage('Checking ng build result', () => {
    assert.isTrue(file.exists(`dist/main.bundle.js`))
    system.echo('AOT Compilation works')
  })

  stage('Add element in template', () => {
    text.appendEnd(`src/app/data-binding/data-binding.component.html`, `<img [src]="'https://avatars0.githubusercontent.com/u/' + avatarId + '?v=3&s=460'">`)
    text.appendEnd(`src/app/data-binding/data-binding.component.html`, `<img bind-src="'https://avatars0.githubusercontent.com/u/' + avatarId + '?v=3&s=460'">`)
  })

  stage('Building project using AOT', () => {
    file.remove(`dist/main.bundle.js`)
    system.exec('ng build --aot')
  })

  stage('Checking ng build result', () => {
    assert.isTrue(file.exists(`dist/main.bundle.js`))
    system.echo('AOT Compilation works')
  })
  
}, __dirname)
