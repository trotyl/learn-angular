import { playbook, stage } from 'anorexia'

playbook('learn-angular-001-001', async (env) => {

  env.usePlatformServer({
    modulePath: 'inline.js',
    moduleName: 'AppModule',
    componentPath: 'inline.js',
    componentName: 'AppComponent',
    htmlPath: 'index.html'
  })

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
      'inline.js': 'inline.js',
      'index.html': 'index.html',
    })
  })

  stage('Remove bootstrap code', () => {
    env.replaceInFile('inline.js', 
      [`ng.platformBrowserDynamic.platformBrowserDynamic().bootstrapModule(AppModule)`, '']
    )
  })

  stage('Prepare for server-side rendering', () => {
    env.replaceInFile('inline.js', 
      [`ng.platformBrowser.BrowserModule`, `ng.platformBrowser.BrowserModule.withServerTransition({appId: 'none'})`]
    )
  })

  stage('Add export', () => {
    env.appendFile('inline.js', `\nexports.AppModule = AppModule\n`)
    env.appendFile('inline.js', `\nexports.AppComponent = AppComponent\n`)
  })

  await stage('Check render result', async () => {
    const html = await env.renderToHtml()
    env.assertPatternInText(html, /Hello Angular/)
    env.echo('App works')
  })
}, __dirname)
