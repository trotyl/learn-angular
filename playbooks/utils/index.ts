import * as fs from 'fs'
import * as path from 'path'
import * as shell from 'shelljs'

export class Environment {
  constructor(private fixture: string, private workspace: string) { }

  assertFileExists(filepath: string): void {
    const absoluteFilepath = path.join(this.workspace, filepath)
    if (!fs.existsSync(absoluteFilepath)) {
      throw new Error(`${filepath} not found!`)
    }
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

  setUpFiles(hash: { [src: string]: string }): void {
    Object.keys(hash)
      .forEach(src => {
        const absoluteSrc = path.join(this.fixture, src)
        const absoluteDist = path.join(this.workspace, hash[src])
        fs.writeFileSync(absoluteDist, fs.readFileSync(absoluteSrc))
      })
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

  const FIXTURE_DIR= path.join(dirname, 'fixtures')

  task(new Environment(FIXTURE_DIR, WORKSPACE_DIR))
  shell.echo('Playbook passed')
}
