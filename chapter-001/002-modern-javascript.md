# 现代化的 JavaScript 语言

上一节中我们已经使用 ES2015 完成了 Angular 的 Hello World，本节中会使用现代化的 JavaScript 语言特性进行重构。

## 分离 JavaScript 文件

首先，我们将 JavaScript 文件从 HTML 文件中分离，命名为 `main.js`，内容为：

```javascript
/* main.js */
const { Component, NgModule, enableProdMode } = ng.core
const { BrowserModule } = ng.platformBrowser
const { platformBrowserDynamic } = ng.platformBrowserDynamic

class AppComponent { }

AppComponent.annotations = [
  new Component({
    template: '<h1>Hello Angular</h1>',
  })
]

class AppModule { }

AppModule.annotations = [
  new NgModule({
    imports: [
      BrowserModule,
    ],
    declarations: [
      AppComponent,
    ],
    bootstrap: [
      AppComponent,
    ],
  })
]

platformBrowserDynamic().bootstrapModule(AppModule, { ngZone: 'noop' })
```

相应的 HTML 中的内容为：

```html
<!DOCTYPE html>
<title>Hello Angular</title>
<ng-component>Loading...</ng-component>
<script src="https://unpkg.com/rxjs/bundles/rxjs.umd.js"></script>
<script src="https://unpkg.com/@angular/core"></script>
<script src="https://unpkg.com/@angular/common"></script>
<script src="https://unpkg.com/@angular/compiler"></script>
<script src="https://unpkg.com/@angular/platform-browser"></script>
<script src="https://unpkg.com/@angular/platform-browser-dynamic"></script>
<script src="./main.js"></script>
```

现在，我们有了单独的 JavaScript 文件。

## 模块化 JavaScript 文件

将所有代码放在一个 JavaScript 文件中显然不利于后期维护，为此我们借助自 ES2015 开始引入的 Module 特性，将 `main.js` 拆分为多个 Module 形式的 JavaScript 文件：

+ 将 AppComponent 的相关内容提取到 `app.component.js` 中；
+ 将 AppModule 的相关内容提取到 `app.module.js` 中；
+ 将剩下的内容保留在 `main.js` 中。

之后我们得到：

```javascript
/* app.component.js */
const { Component } = ng.core

class AppComponent { }

AppComponent.annotations = [
  new Component({
    template: '<h1>Hello Angular</h1>',
  })
]

export { AppComponent }

/* app.module.js */
import { AppComponent } from './app.component.js'

const { NgModule } = ng.core
const { BrowserModule } = ng.platformBrowser

class AppModule { }

AppModule.annotations = [
  new NgModule({
    imports: [
      BrowserModule,
    ],
    declarations: [
      AppComponent,
    ],
    bootstrap: [
      AppComponent,
    ],
  })
]

export { AppModule }

/* main.js */
import { AppModule } from './app.module.js'

const { platformBrowserDynamic } = ng.platformBrowserDynamic

platformBrowserDynamic().bootstrapModule(AppModule, { ngZone: 'noop' })
```

同时修改 HTML 中 `main.js` 的 `type`：

```html
<!-- ... -->
<!-- change start -->
<script src="./main.js" type="module"></script>
<!-- change end -->
```

这时候需要进一步确认浏览器支持，选项有：

1. 安装最新版本的 Chrome<sup>*</sup> (>= 61.0)；
2. 安装最新版本的 Firefox<sup>*</sup> (>= 60.0)；
3. 安装最新版本的 Safari<sup>*</sup> (>= 10.1)；
4. 安装最新版本的 Edge<sup>*</sup> (>= 16)。

> **Chome**：的下载地址 [Chrome Web Browser](https://www.google.com/chrome/)。

> **Firefox**：下载地址 [Download Firefox — Free Web Browser](https://www.mozilla.org/en-US/firefox/new/)。

> **Safari**：下载地址 [Apple - Support - Downloads](https://support.apple.com/downloads/safari)。

> **Edge**：下载地址 [Web Browser for Desktop & Mobile | Microsoft Edge](https://www.microsoft.com/en-us/windows/microsoft-edge)。

这里可以看出的好消息是四大主流浏览器都提供了 ES Module 的原生支持，坏消息是仍然有大量用户使用的不是最新版本。

然后再次用刚刚准备好的浏览器打开我们的 `index.html` 文件，发现出现了一条报错（以 Chrome 为例）：

```text
Access to Script at 'file:///.../main.js' from origin 'null' has been blocked by CORS policy: Invalid response. Origin 'null' is therefore not allowed access.
```

这是因为使用 `file://` 协议的时候对于 **Origin（源）** 的判断上会有些问题（当然从安全层面而言是完全正确的处理），任何一个 Web 前端工程师都应该知道相应的解决方案 —— 启动服务器。

我们可以使用：

```bash
yarn global add http-server
```

来快速安装<sup>*</sup>一个静态文件服务器（如果有其它的 Server 或者其它的包管理器，自行调整即可，对结果没有影响）。

> **Yarn**：一款 Facebook 推出的包管理器，基于 NPM Registry，相比 NPM 而言对功能和性能进行了一些增强。官网为 [Yarn](https://yarnpkg.com/)。

这时我们在 `index.html` 所在的路径使用 `http-server` 启动一个服务器，然后在浏览器中访问 `http://localhost:8080/`（以自己的实际端口为准），又一次得到了同样的内容：

```text
Hello Angular
```

目前为止我们使用的都是能够直接在浏览器中运行的没有使用任何预处理的普通 JavaScript。

## 模块化依赖

更进一步，借助预处理工具，我们把外部依赖也改用 Module 的形式引入，不再使用 `ng` 全局变量：

```javascript
/* app.component.js */

/* change start */
import { Component } from '@angular/core'
/* change end */

class AppComponent { }
/* ... */

/* app.module.js */
import { AppComponent } from './app.component.js'
/* change start */
import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
/* change end */

class AppModule { }
/* ... */

/* main.js */
import { AppModule } from './app.module.js'
/* change start */
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'
/* change end */

platformBrowserDynamic().bootstrapModule(AppModule, { ngZone: 'noop' })
```

这里能够很清晰地看出 **模块(Module)** 的组成方式，分为：

+ 导入；
+ 内容；
+ 导出。

三个部分<sup>*</sup>，实际项目中不一定按照顺序书写。

> **模块组成部分**：按照规范，一个 Module 可以既没有 `import`，也没有 `export`，但这种情况下仍然和 Script 有本质区别。由于规范并未指定区分 Module 和 Script 的方式，而是由实现自行决定，最终 Web 使用 `<script>` 标签的 `type` 属性进行区分，而 Node.js 中通过 `.mjs` 与 `.js` 的扩展名区分。

为了能够运行，去除 HTML 中的所有 `<script>` 标签，并添加：

```html
<!DOCTYPE html>
<title>Hello Angular</title>
<ng-component>Loading...</ng-component>
<!-- change start -->
<script src="https://unpkg.com/systemjs"></script>
<script>
  SystemJS.import('./main.js')
</script>
<!-- change end -->
```

这时候会得到：

```text
Error: Unable to dynamically transpile ES module
   A loader plugin needs to be configured via `SystemJS.config({ transpiler: 'transpiler-module' })`.
```

这里的错误内容浅显易懂，但在处理这个错误之前，我们首先可能会有疑问，为什么在浏览器已经原生支持了 ES Module 的情况下，会需要使用预处理工具？

由于这个话题内容太大，因此直接提供外部链接作为答案：[为什么 ES Module 的浏览器支持没有意义](https://zhuanlan.zhihu.com/p/25046637)。

这里我们按照错误要求，提供自定义的转译工具：

```html
<!DOCTYPE html>
<title>Hello Angular</title>
<ng-component>Loading...</ng-component>
<script src="https://unpkg.com/systemjs"></script>
<!-- change start -->
<script>
  System.config({
    transpiler: 'ts',
    packages: {
      "ts": {
        "main": "lib/plugin.js"
      },
      "typescript": {
        "main": "lib/typescript.js",
        "meta": {
          "lib/typescript.js": {
            "exports": "ts"
          }
        }
      }
    },
    paths: {
      'npm:': 'https://unpkg.com/',
      'github:': 'https://raw.githubusercontent.com/',
    },
    map: {
      'typescript': 'npm:typescript',
      'ts': 'github:frankwallis/plugin-typescript/master',
      'rxjs': 'npm:rxjs/index.js',
      'rxjs/operators': 'npm:rxjs/operators/index.js',
      '@angular/core': 'npm:@angular/core',
      '@angular/common': 'npm:@angular/common',
      '@angular/compiler': 'npm:@angular/compiler',
      '@angular/platform-browser': 'npm:@angular/platform-browser',
      '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic',
    },
  })
</script>
<!-- change end -->
<script>
  SystemJS.import('./main.js')
</script>
```

看似内容很多，其实只有两点：

1. 使用 TypeScript 作为转译工具<sup>*</sup>，基于 [plugin-typescript](https://github.com/frankwallis/plugin-typescript) 实现；
2. 提供模块名称映射，使用 `unpkg.com` 提供的 CDN 作为依赖源。

> **使用 TypeScript 转译**：此处仅需要处理 ES Module，因此 TypeScript 并不是必须要求，也可以使用 Babel 等工具。

## 静态属性

有了 TypeScript 作为转译工具，我们便可以使用浏览器中尚未实现的 ES 特性，例如静态属性，现在将元数据位置移到类的内部：

```javascript
/* app.component.js */

/* ... */
class AppComponent {
  /* change start */
  static annotations = [
    new Component({
      template: '<h1>Hello Angular</h1>',
    })
  ]
  /* change end */
}

/* change start */
/* change end */
export { AppComponent }

/* app.module.js */

/* ... */
class AppModule {
  /* change start */
  static annotations = [
    new NgModule({
      imports: [
        BrowserModule,
      ],
      declarations: [
        AppComponent,
      ],
      bootstrap: [
        AppComponent,
      ],
    })
  ]
  /* change end */
}

/* change start */
/* change end */
export { AppModule }
```

上面用到的语法就是当前 Stage 3 的[静态属性](https://github.com/tc39/proposal-static-class-features)，在 TypeScript 中已经得到支持。

## 精简导出语法

不过我们仅仅需要导出类型本身，单独列出 `export` 未免过于繁琐，为此可以把 `export` 声明<sup>*</sup> inline 化，得到：

> **export 声明**：ES 规范中 `import` 和 `export` 这类内容并不属于 **语句(Statement)**，类似于「import 语句」是完全错误的说法。这里使用 TypeScript AST 使用的 `ExportDeclaration` 进行称呼。

```javascript
/* app.component.js */

/* ... */
/* change start */export /* change end */class AppComponent {
  /* ... */
}

/* change start */
/* change end */
/* EOF */

/* app.module.js */

/* ... */
/* change start */export /* change end */class AppModule {
  /* ... */
}

/* change start */
/* change end */
/* EOF */
```

这样代码组织上会显得更加简洁，不过仍然还有发展空间。

## 装饰器

由于元数据都是静态内容，使用命令式的属性赋值仍然存在语法噪音，为此将此改为更加偏向声明式的 **装饰器(Decorator)** 语法：

> **静态属性改为装饰器**：将静态属性改为 Decorator 的过程前后文件的语义是发生了变化的，在 JavaScript 语言层面并不等价，只是在 Angular 的功能实现上等价。

```javascript
/* app.component.js */

/* ... */
/* change start */
@Component({
  template: '<h1>Hello Angular</h1>',
})
/* change end */
export class AppComponent {
  /* change start */
  /* change end */
}

/* app.module.js */

/* ... */
/* change start */
@NgModule({
  imports: [
    BrowserModule,
  ],
  declarations: [
    AppComponent,
  ],
  bootstrap: [
    AppComponent,
  ],
})
/* change end */
export class AppModule {
  /* change start */
  /* change end */
}
```

之后会得到：

```text
plugin.js:406 TypeScript [Error] Experimental support for decorators is a feature that is subject to change in a future release. Set the 'experimentalDecorators' option to remove this warning. (TS1219)
```

这是由于装饰器在 TypeScript 中仍然作为实验特性<sup>*</sup>，需要主动开启：

> **装饰器实验特性**：[装饰器特性](https://github.com/tc39/proposal-decorators)目前仍处于 Stage 2，而 TypeScript 实现的为更加早期版本的提案内容，详情参见 [TypeScript中的装饰器(Decorators)的本质是什么（或者说它具体做了什么工作）？](https://www.zhihu.com/question/68257128/answer/261502855)。

```html
<!-- ... -->
<script>
  System.config({
    transpiler: 'ts',
    /* change start */
    typescriptOptions: {
      experimentalDecorators: true,
    },
    /* change end */
    /* ... */
  })
</script>
<!-- ... -->
```

刷新浏览器，发现一切正常。

## 总结

现在我们就成功地将整个项目 Script 形式的单文件 JavaScript 逐步迁移成了 Module 形式的多文件 JavaScript，并且通过现代化的 JavaScript 语言特性让内容更加清晰易懂。目前我们 **并没有用到任何 TypeScript 语言** 的内容，仅仅是使用到了 TypeScript 工具来作为 JavaScript 的降级编译器。

## 代码归档

#### index.html

```html
<!DOCTYPE html>
<title>Hello Angular</title>
<ng-component>Loading...</ng-component>
<script src="https://unpkg.com/systemjs"></script>
<script>
  System.config({
    transpiler: 'ts',
    typescriptOptions: {
      experimentalDecorators: true,
    },
    packages: {
      "ts": {
        "main": "lib/plugin.js"
      },
      "typescript": {
        "main": "lib/typescript.js",
        "meta": {
          "lib/typescript.js": {
            "exports": "ts"
          }
        }
      }
    },
    paths: {
      'npm:': 'https://unpkg.com/',
      'github:': 'https://raw.githubusercontent.com/',
    },
    map: {
      'typescript': 'npm:typescript',
      'ts': 'github:frankwallis/plugin-typescript/master',
      'rxjs': 'npm:rxjs/index.js',
      'rxjs/operators': 'npm:rxjs/operators/index.js',
      '@angular/core': 'npm:@angular/core',
      '@angular/common': 'npm:@angular/common',
      '@angular/compiler': 'npm:@angular/compiler',
      '@angular/platform-browser': 'npm:@angular/platform-browser',
      '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic',
    },
  })
</script>
<script>
  SystemJS.import('./main.js')
</script>
```

#### app.component.js

```javascript
import { Component } from '@angular/core'

@Component({
  template: '<h1>Hello Angular</h1>',
})
export class AppComponent {
}
```

#### app.module.js

```javascript
import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { AppComponent } from './app.component.js'

@NgModule({
  imports: [
    BrowserModule,
  ],
  declarations: [
    AppComponent,
  ],
  bootstrap: [
    AppComponent,
  ],
})
export class AppModule {
}
```

#### main.js

```javascript
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'
import { AppModule } from './app.module.js'

platformBrowserDynamic().bootstrapModule(AppModule, { ngZone: 'noop' })
```

## 在线示例

<iframe src="https://embed.plnkr.co/Szg6wAQIFWD9Jl2Sbb1x?deferRun" width="100%" height="600px" frameborder="0"></iframe>

## 可能的疑惑

#### 为什么 Dart 版本的 Angular 没有流行起来？

因为 Dart 没有流行起来。

#### 现在是否还有办法使用 AtScript？

Github 上有一个 PlayGround 的 Repo：[angular/atscript-playground](https://github.com/angular/atscript-playground)。

#### Angular 的编译器是如何工作的？

会在后文中覆盖。

#### 既然 AOT 编译的要求是 TypeScript 工具和 Decorator 语法，那是否可以对使用 Decorator 语法的 JavaScript 文件进行 AOT 编译？

理论上可行，Decorator 本身是（提案中的）JavaScript 语言特性，但是 TypeScript 工具对 JavaScript 文件的支持（Salsa）与 TypeScript 文件的支持略有差异，需要使用额外的构建步骤将 `.js` 文件转制为 `.ts` 文件，另外可能还需要设置忽略相应的类型检查错误。

另外，不建议在没有相关实力的情况下主动踩坑。

#### 既然 JIT 编译也会在运行时生成相应的 JavaScript 文件，那是否可以将浏览器中所生成的 JavaScript 文件拷贝出来当做源码使用，从而避免运行时编译？

理论上可行，JIT 编译除了输出的语言级别和使用的模块机制外，与 AOT 编译的结果并无本质差异。但这样做会导致模版中的内容无法被正确地进行类型检查，可能产生不必要的错误隐患。

另外，不建议在没有相关实力的情况下主动踩坑。

#### 为什么 file 协议会有跨域问题？

Web 开发基础不在本书的覆盖范围内。请自行搜索其它外部资源。

#### 为什么 TypeScript 工具的 JavaScript 支持部分叫做 Salsa？

内部项目代号，大家后来习惯了就都这么叫。

#### 哪里能查到 TypeScript CLI 的所有编译器选项？

这里：[Compiler Options · TypeScript](http://www.typescriptlang.org/docs/handbook/compiler-options.html)。
