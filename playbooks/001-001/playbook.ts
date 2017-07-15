import { playbook, stage } from 'anorexia'
import { assert } from 'chai'

playbook('learn-angular-001-001', async (host) => {
  
  const { angular: ng, javascript: js, yarn, system } = host.extensions

  const moduleName = 'AppModule'
  const componentName = 'AppComponent'
  const mainFile = 'inline.js'
  const entryHtmlFile = 'index.html'

  ng.usePlatformServer({
    modulePath: mainFile,
    moduleName,
    componentPath: mainFile,
    componentName,
    htmlPath: entryHtmlFile,
  })

  js.useModule('commonjs')

  stage('Installing dependencies', () => {
    yarn.install(
      ng.packages.animations,
      ng.packages.core,
      ng.packages.common,
      ng.packages.compiler,
      ng.packages.http,
      ng.packages.platformBrowser,
      ng.packages.platformBrowserDynamic,
      ng.packages.platformServer,
      'core-js',
      'rxjs',
      'zone.js',
    )
  })

  stage('Add JavaScript file', () => {
    host.setUpFiles({
      [`./fixtures/${mainFile}`]: mainFile,
      [`./fixtures/${entryHtmlFile}`]: entryHtmlFile,
    })
  })

  stage('Prepare for server-side rendering', () => {
    ng.disableBootstrap(mainFile)
    ng.enableServerTransition(mainFile)
  })

  stage('Add export', () => {
    js.addModuleExports(mainFile, moduleName, componentName)
  })

  await stage('Check render result', async () => {
    const html = await ng.renderToHtml()
    assert.match(html, /Hello Angular/)
    system.echo('App works')
  })
}, __dirname)
