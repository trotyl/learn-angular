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

另外，Angular 团队目前已有引入谷歌官方 Bazel[^7] 构建工具的计划[^8]，

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
