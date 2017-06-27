import * as fs from 'fs'
import * as path from 'path'
import * as shell from 'shelljs'

function walk(dir: string): string[] {
  const handles = fs.readdirSync(dir)

  return handles.map(handle => {
    const filepath = path.join(dir, handle)
    const stat = fs.lstatSync(filepath)
    if (stat.isFile()) {
      return [filepath]
    } else if (stat.isDirectory()) {
      return walk(filepath)
    } else {
      return [] as string[]
    }
  }).reduce((allPaths, currentPaths) => [...allPaths, ...currentPaths], [])
}

class Environment {
  private map = new Map<string, string>()

  constructor(private source: string, private workspace: string) {

    const fixturesPath = path.join(source, 'fixtures')
    walk(fixturesPath)
      .map(filename => ({ filename, content: fs.readFileSync(filename, 'utf8') }))
      .map(({ filename, content: value }) => ({ key: path.relative(fixturesPath, filename), value }))
      .forEach(({ key, value }) => this.map.set(key, value))
  }

  setUpFiles(hash: { [fixture: string]: string }): void {
    Object.keys(hash)
      .forEach(fixture => {
        const outFile = path.join(this.workspace, hash[fixture])
        fs.writeFileSync(outFile, this.map.get(fixture))
      })
  }

  removeFiles(list: string[]): void {
    list.forEach(filepath => {
      const fullPath = path.join(this.workspace, filepath)
      fs.unlinkSync(fullPath)
    })
  }

  renameFiles(hash: { [src: string]: string }): void {
    const srcSet = Object.keys(hash)
    srcSet.forEach(src => {
      const absoluteSrc = path.join(this.workspace, src)
      const absoluteDist = path.join(this.workspace, hash[src])
      fs.writeFileSync(absoluteDist, fs.readFileSync(absoluteSrc, 'utf8'))
    })
    this.removeFiles(srcSet)
  }
}

function stage(name: string, task: () => void): void {
  shell.echo(name)
  task()
}

function checkFileExists(path: string): void {
  if (!fs.existsSync(path)) {
    throw new Error(`${path} not found!`)
  }
}

function playbook(name: string, task: (env: Environment) => void, dirname: string): void {
  shell.echo(`Starting playbook for ${name}`)

  const WORKSPACE_ROOT = '/tmp/workspaces'
  const WORKSPACE_DIR = path.join(WORKSPACE_ROOT, name)

  shell.echo(`Creating workspace ${name}`)
  shell.mkdir('-p', WORKSPACE_DIR)
  shell.rm('-rf', WORKSPACE_DIR)
  shell.mkdir(WORKSPACE_DIR)
  shell.cd(WORKSPACE_DIR)

  task(new Environment(dirname, WORKSPACE_DIR))
  shell.echo('Playbook passed')
}


playbook('learn-angular-001-002', (env) => {

  stage('Adding app files with static properties', () => {
    env.setUpFiles({
      'static-property/app.component.js': 'app.component.js',
      'static-property/app.module.js': 'app.module.js',
      'static-property/main.js': 'main.js',
    })
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
    env.removeFiles(['app.component.js', 'app.module.js'])
    env.setUpFiles({
      'decorators/app.component.js': 'app.component.js',
      'decorators/app.module.js': 'app.module.js',
    })
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
    env.renameFiles({
      'app.component.js': 'app.component.ts',
      'app.module.js': 'app.module.ts',
      'main.js': 'main.ts',
    })
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
}, __dirname)
