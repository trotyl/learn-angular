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
    env.setUpFiles({
      [mainFile]: mainFile,
      [entryHtmlFile]: entryHtmlFile,
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
    env.echo('App works')
  })
}, __dirname)
