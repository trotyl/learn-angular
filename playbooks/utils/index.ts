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

export class Environment {
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

  assertFileExists(filepath: string): void {
    const absoluteFilepath = path.join(this.workspace, filepath)
    if (!fs.existsSync(absoluteFilepath)) {
      throw new Error(`${filepath} not found!`)
    }
  }
}

export function stage(name: string, task: () => void): void {
  shell.echo(name)
  task()
}

export function playbook(name: string, task: (env: Environment) => void, dirname: string): void {
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
