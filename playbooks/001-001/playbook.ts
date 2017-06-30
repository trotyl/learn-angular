import { playbook, stage } from 'anorexia'
import { assert } from 'chai'

playbook('learn-angular-001-001', async (env) => {

  const moduleName = 'AppModule'
  const componentName = 'AppComponent'
  const mainFile = 'inline.js'
  const entryHtmlFile = 'index.html'

  const { angular: ng, javascript: js } = env.extensions

  ng.usePlatformServer({
    modulePath: mainFile,
    moduleName,
    componentPath: mainFile,
    componentName,
    htmlPath: entryHtmlFile,
  })

  js.useModule('commonjs')

  stage('Installing dependencies', () => {
    env.install(
      '@angular/animations',
      '@angular/core',
      '@angular/common',
      '@angular/compiler',
      '@angular/http',
      '@angular/platform-browser',
      '@angular/platform-browser-dynamic',
      '@angular/platform-server',
      'core-js',
      'rxjs',
      'zone.js',
    )
  })

  stage('Add JavaScript file', () => {
    env.setUpFiles({
      [mainFile]: mainFile,
      [entryHtmlFile]: entryHtmlFile,
    })
  })

  stage('Remove bootstrap code', () => {
    env.replaceInFile(mainFile, 
      [`ng.platformBrowserDynamic.platformBrowserDynamic().bootstrapModule(AppModule)`, '']
    )
  })

  stage('Prepare for server-side rendering', () => {
    env.replaceInFile(mainFile, 
      [`ng.platformBrowser.BrowserModule`, `ng.platformBrowser.BrowserModule.withServerTransition({appId: 'none'})`]
    )
  })

  stage('Add export', () => {
    js.addModuleExports(mainFile, moduleName, componentName)
  })

  await stage('Check render result', async () => {
    const html = await ng.renderToHtml()
    assert.match(html, /Hello Angular/)
    env.echo('App works')
  })
}, __dirname)
