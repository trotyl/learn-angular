# CLI 工具

在本章前面的内容中，我们已经体验了纯粹的手写 JavaScript 代码的方式[^1]，也介绍了使用 TypeScript 编译并通过 Webpack 打包的简单构建步骤。随着项目规模的不断增大、性能要求的不断增高，传统的手写 JavaScript 方式已经很难满足现代工程项目的需要。

为此，我们需要使用大量的工具，以及使用工具来管理用到的工具。

就上一节中的例子而言，为了减少构建所需的步骤，我们可以把 `tsc` 和 `webpack` 的命令写在同一个 NPM Script 中，这样构建时就只需要使用一条命令；实际上，我们还可以做得更好，例如直接使用 Webpack 的 Loader 来处理 TypeScript 文件，而我们只需要操作 Webpack；不过，对于开发人员而言，每个项目自行编写 Webpack 配置文件仍然过于繁琐，鉴于大部分的 Angular 项目所使用的构建方式都极其相似，我们可以直接使用封装好的 Angular CLI 工具来构造和构建 Angular 项目。

在此之前我们可能好奇的一个问题是：**Angular 的构建方式是什么？**

实际上，这里依然是两个问题，即：

1. Angular 项目本身的构建方式是什么？
2. 使用 Angular 的最终应用需要什么样的构建方式？

对于第一个问题，虽然我们可能不会直接用到，但是仍然有了解的必要。官方的 Angular 模块（的主体部分）有 4 个发布版本[^2]：

+ ES2015 版本的 FESM[^3] 格式文件；
+ ES5 版本[^4]的 FESM 格式文件；
+ ES2015 版本的 UMD[^5] 格式文件；
+ ES5 版本的 UMD 格式文件。

其中，ES2015 的 FESM 格式是使用 Angular Compiler（命令行下为 `ngc`）编译的，对应的 `tsconfig` 文件（以 `@angular/core` 为例）位于：[angular/packages/core/tsconfig-build.json](https://github.com/angular/angular/blob/master/packages/core/tsconfig-build.json)；而 ES2015 的 UMD 格式是使用 Rollup.js[^6] 构建的，对应的 `rollup.config` 文件（以 `@angular/core` 为例）位于：[angular/packages/core/rollup.config.js](https://github.com/angular/angular/blob/master/packages/core/rollup.config.js)；至于 ES5 版本的文件，不再采用上述工具重新构建，而是直接使用 ES2015 版本的文件降级编译而成，该过程通过 TypeScript Compiler（命令行下为 `tsc`）实现。

Angular 的每个构建后的 Package 有专门的 Repo，例如 `@angular/core` 的 Repo 位于：[angular/core-builds: @angular/core build artifacts](https://github.com/angular/core-builds)，和 NPM Registry 上不同的是，这个 Repo 提供对应到每个 Commit 的版本，而 NPM Registry 中只会按照发布计划每周发布一次带有语义化版本号的相应版本。

另外，Angular 团队目前已有引入谷歌官方 Bazel[^7] 构建工具的计划[^8]。

接下来就是另一个我们更为关心的问题，我们使用 Angular 开发的最终应用需要使用什么样的构建方式呢？

事实上，除了 `ngc` 之外，其它步骤都没有任何特殊要求，选择自己熟悉的构建方案即可。

不过，即便不考虑 `ngc`，从零构造一个同时具备调试和生产环境构建方案也有不小的成本，更不用说对 `ngc` 的整合。为此，对于简单项目而言，我们可以直接使用 Angular 团队所提供的解决方案——Angular CLI。

现在我们将完全抛弃之前的成果，本节及之后的内容都会基于 Angular CLI 来进行。

首先我们需要安装 Angular CLI，这里以 yarn 为例：

```bash
yarn global add @angular/cli
```

紧接着我们可以使用 `ng` 命令来快速创建项目：

```bash
ng new --skip-install learn-angular
```

这条命令应当能够在 1 秒之内完成。要注意的是这里我们使用了 `--skip-install` 选项，这个参数很重要，这样做能够帮助我们了解 Angular CLI 的职责，仅仅是根据预设的模版创建项目。

当然，现在的项目显然是不能用的，不过我们在 `package.json` 中定义了一些依赖，我们需要安装这些依赖[^9]：

```bash
yarn install
```

需要注意的是，安装 NPM 上的依赖与 Angular CLI 并无直接关联，如果无法正常安装的话，那可能是一些众所周知的其它原因所导致。

安装完成之后（并且安装成功的情况下），我们可以使用 Angular CLI 内置的调试服务器来启动服务：

```bash
ng serve --aot
```

Angular 使用将 HTML 模版编译成 JavaScript 代码的方式来实现视图层的相关操作，而 AOT（Ahead-of-Time）编译是指在开发时就进行该编译步骤，而后直接将编译后的代码打包到最终发行文件中，避免了运行时引入编译器影响传输文件大小和启动时间。

而在之后的版本中[^10]，Angular CLI 将会把 AOT 设定为默认的调试启动方式，从而避免某些情况下 JIT 和 AOT 编译行为的不一致性影响开发体验。

不过，现在我们所生成的代码都在内存当中。不过对于生产环境，我们并不会使用 Webpack Dev Server 作为应用服务器，为此我们需要把生成的静态文件取出。为此我们可以使用另一个命令：

```bash
ng build -prod
```

注意这里 `-prod` 正确的写法是单横杠[^11]，作为 `--target=production` 的 Alias。

然后我们可以在 `dist` 目录中得到全部的静态文件内容，拷贝到服务器相应的静态文件目录中即可正常工作。

最后，Angular CLI 提供的功能仍然有限，我们可能需要定制化部分构建方式。为此我们可以将 Angular CLI 项目转化为普通的 Webpack 项目：

```bash
ng eject
```

这样就能看到对应的 `webpack.config.js` 文件[^12]并对其进行任意修改。

其实 Angular CLI 还有其它的很多功能，我们可以通过 `ng help` 来浏览全部可用命令。

不过一个很严峻的问题是，在没有 Angular CLI 的情况下，我们要如何构建一个使用了 Angular 的最终应用呢？

前面我们已经提到过，除了 `ngc` 之外，其它的步骤都没有任何的特殊性，因此，我们只要能够自行完成 `ngc` 就足够了。

现在我们对 `src/tsconfig.app.json` 文件增加一部分内容：

```json
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "outDir": "../out-tsc/app",
    "module": "es2015",
    "baseUrl": "",
    "types": []
  },
  "exclude": [
    "test.ts",
    "**/*.spec.ts"
  ],
  "angularCompilerOptions": {
    "genDir": "../out-aot"
  }
}
```

上面的配置中增加了 `angularCompilerOptions` 的部分内容，其中带有一个 `genDir` 属性，用于指定 AOT 编译时的输出目录[^13]。

然后执行以下命令（for *nix）：

```bash
./node_modules/.bin/ngc -p src/tsconfig.app.json
```

这样就会出现 `out-aot` 和 `out-tsc` 两个文件夹。

`out-aot` 中的内容为 Angular Compiler 所生成的额外内容，核心内容为 Component 与 NgModule 的 NgFactory 文件，所有 HTML 模版中的信息都转移至此，因此我们不再需要用到 HTML 模版文件。

`out-tsc` 中的内容为 Angular Compiler 将原有的 TypeScript 代码编译为 JavaScript 的结果，可能与 TypeScript 自身的编译结果略有差异。

然后我们将 `out-aot` 中的内容合流到 `out-tsc` 当中：

// TODO

## 可能的疑惑

#### 为什么要使用 FESM 格式的文件？

参见 [The cost of small modules | Read the Tea Leaves](https://nolanlawson.com/2016/08/15/the-cost-of-small-modules/)。

#### ngc 相对于 tsc 而言有哪些扩展配置？

会在后文中详述。

#### Angular 为什么不使用 Webpack 进行打包？

Webpack 在打包过程中会引入额外的内容，增加不必要的运行时大小，基本只适用于最终应用，不适合类库。


// TODO

---

[^1]: 这里的手写 JavaScript 代码指的是直接将开发人员书写的项目源码作为生产环境运行时中所实际使用的执行内容。

[^2]: Angular 相关 Package 的发布格式规范可以参见：[Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/edit)。

[^3]: FESM 为 Flattened ES Module 的缩写，即单文件形式的 ES Module，不再依赖自身的子路径，有利于提升构建速度。

[^4]: 从概念上而言 ES Module 是 ES2015 开始才引入的，ES5 并不支持 Module 的语法，所以准确地说这种方式是在 ES2015 格式下使用（除模块外）兼容 ES5 的语法子集。不过由于模块化本身和其它语言特性相正交，加之构建工具的实际支持情况也与语言版本无关，所以通常被成为 ES5 版本的 ES Module 也并无大碍。

[^5]: UMD 的全称为 Universal Module Definition，是一种通用的发行格式，能够兼容 [CommonJS 规范](http://wiki.commonjs.org/wiki/CommonJS) 和 [AMD 规范](https://github.com/amdjs/amdjs-api/wiki/AMD)，以及在不具备模块系统的情况下 Fallback 到全局变量实现。「官方」规范在：[umdjs/umd: UMD (Universal Module Definition) patterns for JavaScript modules that work everywhere.](https://github.com/umdjs/umd)。

[^6]: Rollup.js 为一款面向 ES Module 的打包工具，也可通过插件来支持其它模块格式或内联预处理步骤。官网为：[rollup.js • guide](https://rollupjs.org/)，Github 地址为：[rollup/rollup: Next-generation ES6 module bundler](https://github.com/rollup/rollup)。

[^7]: Bazel 为谷歌推出的通用构建工具。官网为：[Home - Bazel](https://bazel.build/)，Github 地址为：[bazelbuild/bazel: a fast, scalable, multi-language and extensible build system](https://github.com/bazelbuild/bazel)。

[^8]: 目前已有引入 Bazel 的 PR：[build: Introduce Bazel build rules by alexeagle · Pull Request #16972 · angular/angular](https://github.com/angular/angular/pull/16972)。概念上而言该工具的功能与当前使用的编译及打包工具相正交，并不会发生取代的情况。

[^9]: 这里并没有给出 `cd` 的步骤，如果没有能力自行切换工作路径的话，那可能不是特别适合当前的练习。

[^10]: 目前将 AOT 设定为默认选项的方案仅仅在路线图中，可能于 2.x 的版本中正式引入。当前几乎唯一的 Blocker 就是 Angular Compiler 还不具备增量编译模式，使得每次改动所需要的重新编译时间较长。

[^11]: 不过目前使用 `--prod` 的形式也能正常工作，官方文档中也对此存在不一致的地方，相关 Tracker 在 [ng build prod confusion: --prod vs -prod (one vs two dashes)](https://github.com/angular/angular-cli/issues/6383)。

[^12]: 不过需要注意的是，`ng eject` 只能够根据参数生成某个特定方式的 Webpack 配置，如果需要得到一个通用的 Webpack 项目，可能需要多次进行 `ng eject` 然后提取 Webpack 配置中的通用部分。

[^13]: 这里 `genDir` 的配置并不是必须的，但如果不配置该项的话 AOT 编译的结果会直接在原目录中产生，影响代码结构和自动化工具的识别。
