# 开发语言

当我们说到 Angular 的开发语言的时候，我们可能指：

1. Angular 源代码所使用的语言；
2. 基于 Angular 的项目所需要使用的语言。

大部分时候我们往往指代的是后者。

Angular 项目本身是用 TypeScript[^1] 或 Dart[^2] 开发的。咦，为什么是「或」？其实在 2.0.0-rc.5 版本之前，Angular 的 TypeScript 版本和 Dart 版本是共用的同一个 Code Base[^3]，绝大部分公共代码采用 TypeScript 编写，并编译[^4]成 Dart 代码，另有少部分非共用代码分别使用 TypeScript 和 Dart 实现。

之后由于各种原因，Angular 的 Dart 版本不再与 TypeScript 版本共用代码，从而成为了独立实现。不过事实上，除了 Google 的内部产品外，很少有其它项目会使用 Dart 版本的 Angular 来进行开发。

因此，在本书中，如无特殊说明，所有用到 Angular 的地方均指代 TypeScript 实现的版本。如果有 Dart 版本明显不一致的地方，会在脚注中表明（前提是我知道的话）。

在说到 TypeScript 之前，不得不提及的一门语言是 AtScript[^5]。

Angular 的一个重要设计理念就是 **Declarative（声明式）** 编程，为了落实这一理念，Angular 在 API 设计上的一个重大改进就是很大程度上基于[^6] `@Something` 的 **Annotation（注解）**／**Decorator（装饰器）** 语法。

那么，这个语法到底是 **Annotation** 还是 **Decorator** 呢？

事实上，在 Angular 早期设计的时候，ES6 都还不知道是不是 ES2015，更别说之后的各种语言提案。因此，AtScript 自行扩展一个叫做 **Metadata Annotation**[^7] 的语法，用于附加额外的 **Metadata**，实现也非常简单：

```typescript
/* AtScript */
@Component()
class MyApp {
  server: Server;
  @Bind('name') name: string
  @Event('foo') fooFn: Function

  @Inject()
  constructor(@parent server: Server) { }

  greet(): string { }
}
```

等价于：

```javascript
/* JavaScript in ES2015 */
class MyApp() {
  constructor(server) { }

  greet(): string { }
}

MyApp.properties = {
  server: { is: Server },
  name: { is: String, annotate: [new Bind('name'] },
  fooFn: { is: Function, annotate: [new Event('foo')] },
}

MyApp.annotations = [
  new Component(), 
  new Inject(),
]

MyApp.parameters = [
  { is: Server, annotate: [parent] },
]

MyApp.prototype.greet.returns = String
```

可以看出，所有的标注信息都被附加到运行时[^8]中，即具备 **Type Introspection（内省）** 的能力。当然，这么做仅仅是附加信息，本身并不能提供任何功能，而是由其它使用该内容的代码根据相应的数据来动态确定行为。这种方式非常类似于 Java 的 **Annotation** 或者 C# 的 **Attribute**。

随后在 NG-Conf 2015 上，Angular 团队宣布了迁移至 TypeScript 的消息[^9]。在 Angular 团队与 TypeScript 团队的合作计划中，TypeScript 将增加 **Metadata Annotation** 的语法以及对应的 **Introspection API**[^10]。

不过，这件事最后并没有发生。随着 ES2015 的正式发布，JavaScript 语言开始进入稳定的持续迭代发展阶段，TypeScript 也不再接受新的语言特性，而是仅仅提供对 JavaScript 语言特性的支持以及提供相应的类型检查。于是 TypeScript 最后增加了对语法相似（但是语义完全不同）的 **Decorator** 特性的支持（**Decorator** 本身是 JavaScript 的语言提案，并不是 TypeScript 的扩展内容），而 Angular 也将相应的 API 改用 **Decorator** 实现[^11]。不过对于一般用户而言，这个重大的改动似乎并没有什么实际影响（以及在 2015 年的时候实际上也没有多少用户存在）。

此外，为了解决 Angular 需要运行时获取构造函数参数信息的问题（关于 **Dependency Injection** 的内容会在之后的部分覆盖），TypeScript 提供了一个新的编译器选项 `emitDecoratorMetadata`，为具备 **Decorator** 的 Class 暴露构造函数参数信息，默认情况下是基于 **Metadata Reflection API** 所实现的，后者是一个还不是语言提案的「提案」。

于是现在我们解决了第一个问题，Angular（的我们所关心的那个实现）是使用 TypeScript 所开发的。那么接下来的另一个问题是，基于 Angular 的项目是否需要使用 TypeScript 开发呢？

是也不是。在上一节中我们已经尝试过使用 Pure JavaScript 来开发一个简单的 Angular 应用，所以使用 JavaScript 来开发在技术上是切实可行的。但是我们知道，TypeScript 具备很多优势，例如提供了编译时的静态类型检查，提供了最新的（以及提案中的）的 JavaScript 语言特性的转译支持，提供了完善的语言服务集成等等。

不过其实这些都不是重点，最重要的地方时，Angular 的静态编译工具是基于 TypeScript 封装实现的，也就是说，在不使用 TypeScript 工具链[^12]的情况下，便无法在开发时使用 Angular 的模版编译器[^13]，从而无法构建出适合生产环境使用的发行版本。

所以说，就目前的客观事实下，如果想用 Angular 开发实际项目，那么就应该使用 TypeScript。

为此，我们现在就开始将我们上一节中完成 的 Hello World 项目迁移到使用 TypeScript 的方式。

首先，我们将 JavaScript 文件从 HTML 文件中分离，命名为 `main.js`，内容为：

```javascript
/* main.js */
class AppComponent { }

AppComponent.annotations = [
  new ng.core.Component({
    selector: 'main',
    template: '<h1>Hello Angular</h1>',
  })
]

class AppModule { }

AppModule.annotations = [
  new ng.core.NgModule({
    imports: [
      ng.platformBrowser.BrowserModule,
    ],
    declarations: [
      AppComponent,
    ],
    bootstrap: [
      AppComponent,
    ],
  })
]

ng.platformBrowserDynamic.platformBrowserDynamic().bootstrapModule(AppModule)
```

相应的 HTML 中的内容为：

```html
<!DOCTYPE html>
<title>Hello Angular</title>
<main>TODO</main>
<script>
Reflect.getOwnMetadata = () => {}
</script>
<script src="https://unpkg.com/zone.js@0.8.10/dist/zone.js"></script>
<script src="https://unpkg.com/rxjs@5.4.0/bundles/Rx.js"></script>
<script src="https://unpkg.com/@angular/core@4.1.3/bundles/core.umd.js"></script>
<script src="https://unpkg.com/@angular/common@4.1.3/bundles/common.umd.js"></script>
<script src="https://unpkg.com/@angular/compiler@4.1.3/bundles/compiler.umd.js"></script>
<script src="https://unpkg.com/@angular/platform-browser@4.1.3/bundles/platform-browser.umd.js"></script>
<script src="https://unpkg.com/@angular/platform-browser-dynamic@4.1.3/bundles/platform-browser-dynamic.umd.js"></script>
<script src="./main.js"></script>
```

现在，我们有了单独的 JavaScript 文件。不过，将所有代码放在一个 JavaScript 文件中显然不利于后期维护，为此我们借助自 ES2015 开始引入的 Module 特性，将 `main.js` 拆分为多个 Module 形式的 JavaScript 文件：

+ 将 AppComponent 的相关内容提取到 `app.component.js` 中；
+ 将 AppModule 的相关内容提取到 `app.module.js` 中；
+ 将剩下的内容保留在 `main.js` 中。

之后我们得到：

```javascript
/* app.component.js */
class AppComponent { }

AppComponent.annotations = [
  new ng.core.Component({
    selector: 'main',
    template: '<h1>Hello Angular</h1>',
  })
]

export { AppComponent }

/* app.module.js */
import { AppComponent } from './app.component.js'

class AppModule { }

AppModule.annotations = [
  new ng.core.NgModule({
    imports: [
      ng.platformBrowser.BrowserModule,
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

ng.platformBrowserDynamic.platformBrowserDynamic().bootstrapModule(AppModule)
```

```html
<!DOCTYPE html>
<title>Hello Angular</title>
<main>TODO</main>
<script>
Reflect.getOwnMetadata = () => {}
</script>
<script src="https://unpkg.com/zone.js@0.8.10/dist/zone.js"></script>
<script src="https://unpkg.com/rxjs@5.4.0/bundles/Rx.js"></script>
<script src="https://unpkg.com/@angular/core@4.1.3/bundles/core.umd.js"></script>
<script src="https://unpkg.com/@angular/common@4.1.3/bundles/common.umd.js"></script>
<script src="https://unpkg.com/@angular/compiler@4.1.3/bundles/compiler.umd.js"></script>
<script src="https://unpkg.com/@angular/platform-browser@4.1.3/bundles/platform-browser.umd.js"></script>
<script src="https://unpkg.com/@angular/platform-browser-dynamic@4.1.3/bundles/platform-browser-dynamic.umd.js"></script>
<script src="./main.js" type="module"></script>
```

和上一节中不同，现在我们确实需要使用到 **开发工具** 级别的浏览器了，选项有：

1. 安装最新版本的 Chrome Canary[^14] (>= 60.0)，进入 `chrome://flags`，开启 `Experimental Web Platform features` 这个开关；
2. 安装最新版本的 Firefox Beta / Firefox Developer / Firefox Nightly[^15] (>= 54.0)，进入 `about:config`，开启 `dom.moduleScripts.enabled` 这个开关；
3. 安装最新版本的 Safari[^16] (>= 10.1)，什么准备操作也不用做。

然后再次用刚刚准备好的浏览器打开我们的 `index.html` 文件，发现出现了一条报错（以 Chrome 为例）：

```text
Access to Script at 'file:///Users/zjyu/GitBook/Library/Import/learn-angular/code-examples/001-002/step-002/main.js' from origin 'null' has been blocked by CORS policy: Invalid response. Origin 'null' is therefore not allowed access.
```

这是因为使用 `file://` 协议的时候对于 **Origin（域）** 的判断上会有些问题，任何一个 Web 前端工程师都应该知道相应的解决方案 —— 开一个 Server。

我们可以使用 `yarn global add http-server`[^17] 来快速安装一个静态文件服务器（如果有其它的 Server 或者其它的包管理器，自行调整即可，对结果没有影响）。

这时我们在 `index.html` 所在的路径使用 `http-server` 启动一个服务器，然后在浏览器中访问 `http://localhost:8080/`（以自己的实际端口为准），又一次得到了同样的内容：

```text
Hello Angular
```

这样就完成了 **模块化** 的过程，不过需要注意的是，**目前为止我们使用的都是能够直接在浏览器中运行的没有使用任何预处理的普通的 JavaScript**。

如果我们熟悉 ES Module 的话，为了美观，我们可以把 `export` 部分[^18] inline 化，得到：

```javascript
/* app.component.js */
export class AppComponent { }

AppComponent.annotations = [
  new ng.core.Component({
    selector: 'main',
    template: '<h1>Hello Angular</h1>',
  })
]

/* app.module.js */
import { AppComponent } from './app.component.js'

export class AppModule { }

AppModule.annotations = [
  new ng.core.NgModule({
    imports: [
      ng.platformBrowser.BrowserModule,
    ],
    declarations: [
      AppComponent,
    ],
    bootstrap: [
      AppComponent,
    ],
  })
]
```

这样代码组织上会显得更加简洁。

之后，我们更进一步，借助预处理工具，把外部依赖也改用 Module 的形式引入，并且最后只引入一个 JavaScript 文件。首先将 JavaScript 文件修改为：

```javascript
/* app.component.js */
import { Component } from '@angular/core'

export class AppComponent { }

AppComponent.annotations = [
  new Component({
    selector: 'main',
    template: '<h1>Hello Angular</h1>',
  })
]

/* app.module.js */
import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { AppComponent } from './app.component'

export class AppModule { }

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

/* main.js */
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'
import { AppModule } from './app.module'

platformBrowserDynamic().bootstrapModule(AppModule)
```

这样，我们就可以告别冗长的 `ng.moduleName.localName` 全局访问形式了，代码更为直观。

接下来我们还需要进行打包，为了和之后的内容接轨，我们使用 Webpack[^19] 来作为打包工具。

我们可以使用 `yarn global add webpack` 在全局安装 Webpack 的命令行工具。

然后使用 `webpack main.js bundle.js`，即指定 `main.js` 为入口文件，`bundle.js` 为打包后的输出文件。这是我们会看到一些错误：

```text
ERROR in ./main.js
Module not found: Error: Can't resolve '@angular/platform-browser-dynamic' in '/Users/zjyu/GitBook/Library/Import/learn-angular/code-examples/001-002/step-004'
 @ ./main.js 1:0-74

ERROR in ./app.module.js
Module not found: Error: Can't resolve '@angular/core' in '/Users/zjyu/GitBook/Library/Import/learn-angular/code-examples/001-002/step-004'
 @ ./app.module.js 1:0-40
 @ ./main.js

ERROR in ./app.module.js
Module not found: Error: Can't resolve '@angular/platform-browser' in '/Users/zjyu/GitBook/Library/Import/learn-angular/code-examples/001-002/step-004'
 @ ./app.module.js 2:0-57
 @ ./main.js

ERROR in ./app.component.js
Module not found: Error: Can't resolve '@angular/core' in '/Users/zjyu/GitBook/Library/Import/learn-angular/code-examples/001-002/step-004'
 @ ./app.component.js 1:0-41
 @ ./app.module.js
 @ ./main.js
```

简单地说，就是我们缺少了 `@angular/core`、`@angular/platform-browser` 和 `@angular/platform-browser-dynamic` 这几个包，虽然我们在 `index.html` 中手动引入了，但是 Webpack 仅仅根据 JavaScript 文件进行处理，是无法知晓的。事实上，这三个仅仅是我们所直接引用的，还有很多背后所依赖的 Packages。

为了简单起见，我们直接给出完整的安装列表：

```bash
yarn add @angular/core@4.1.3 @angular/common@4.1.3 @angular/compiler@4.1.3 @angular/platform-browser@4.1.3 @angular/platform-browser-dynamic@4.1.3 rxjs@5.4.0
```

然后重新使用打包命令：

```bash
webpack main.js bundle.js
```

成功得到打包后的 `bundle.js` 文件，随后我们将 `index.html` 中的内容改为：

```html
<!DOCTYPE html>
<title>Hello Angular</title>
<main>TODO</main>
<script>
Reflect.getOwnMetadata = () => {}
</script>
<script src="https://unpkg.com/zone.js@0.8.10/dist/zone.js"></script>
<script src="./bundle.js"></script>
```

启动服务器，刷新浏览器，又能重新见到我们的 `Hello Angular` 内容。

剩下的内容还有什么呢？对了，迁移到 TypeScript 版本。

首先，我们先迁移到 TypeScript 的工具链上，不过要注意，在更改后缀名之前，我们仍然使用的是 JavaScript 语言。全局安装 TypeScript CLI 工具的命令为：

```bash
yarn global add typescript@2.3.2
```

接着在不改动 JavaScript 文件的前提下，先试试 `tsc` 命令的效果：

```bash
tsc main.js
```

当然，我们还是继续秉承 EDD 的开发方式，我们现在出现的错误是：

```text
error TS6054: File 'main.js' has unsupported extension. The only supported extensions are '.ts', '.tsx', '.d.ts'.
```

这里是说，`main.js` 并不符合 TypeScript 的后缀要求。不过，我们本来也就用的不是 TypeScript 文件，所以加上 `allowJs` 选项：

```bash
tsc --allowJs main.js
```

现在错误变了，为：

```text
error TS5055: Cannot write file '/Users/zjyu/GitBook/Library/Import/learn-angular/code-examples/001-002/step-005/app.component.js' because it would overwrite input file.
  Adding a tsconfig.json file will help organize projects that contain both TypeScript and JavaScript files. Learn more at https://aka.ms/tsconfig.
error TS5055: Cannot write file '/Users/zjyu/GitBook/Library/Import/learn-angular/code-examples/001-002/step-005/app.module.js' because it would overwrite input file.
  Adding a tsconfig.json file will help organize projects that contain both TypeScript and JavaScript files. Learn more at https://aka.ms/tsconfig.
error TS5055: Cannot write file 'main.js' because it would overwrite input file.
  Adding a tsconfig.json file will help organize projects that contain both TypeScript and JavaScript files. Learn more at https://aka.ms/tsconfig.
```

这又是什么意思呢？

简单地说，我们知道 TypeScript 文件会被编译为 JavaScript 文件，编译后后缀名由 `.ts` 变为 `.js`。那么如果直接编译 `.js` 文件呢？直接把源文件覆盖掉么？这样显然是不行的，为此我们需要指定输出目录：

```bash
tsc --allowJs --outDir dist main.js
```

输出到 `dist` 目录的话，总不用担心把源文件给覆盖掉了，不过现在又有一些其它问题：

```text
node_modules/@angular/common/src/directives/ng_class.d.ts(48,34): error TS2304: Cannot find name 'Set'.
node_modules/@angular/compiler/src/aot/compiler.d.ts(48,32): error TS2304: Cannot find name 'Map'.
node_modules/@angular/compiler/src/compile_metadata.d.ts(369,20): error TS2304: Cannot find name 'Set'.
node_modules/@angular/compiler/src/compile_metadata.d.ts(371,28): error TS2304: Cannot find name 'Set'.
node_modules/@angular/compiler/src/compile_metadata.d.ts(373,15): error TS2304: Cannot find name 'Set'.
node_modules/@angular/compiler/src/compile_metadata.d.ts(375,23): error TS2304: Cannot find name 'Set'.
node_modules/@angular/compiler/src/compile_metadata.d.ts(377,17): error TS2304: Cannot find name 'Set'.
node_modules/@angular/compiler/src/compile_metadata.d.ts(379,25): error TS2304: Cannot find name 'Set'.
node_modules/@angular/compiler/src/output/output_ast.d.ts(444,63): error TS2304: Cannot find name 'Set'.
node_modules/@angular/core/src/change_detection/differs/default_iterable_differ.d.ts(28,32): error TS2304: Cannot find name 'Iterable'.
node_modules/@angular/core/src/change_detection/differs/default_keyvalue_differ.d.ts(24,16): error TS2304: Cannot find name 'Map'.
node_modules/@angular/core/src/change_detection/differs/default_keyvalue_differ.d.ts(32,16): error TS2304: Cannot find name 'Map'.
node_modules/@angular/core/src/change_detection/differs/iterable_differs.d.ts(15,48): error TS2304: Cannot find name 'Iterable'.
node_modules/@angular/core/src/change_detection/differs/keyvalue_differs.d.ts(23,18): error TS2304: Cannot find name 'Map'.
node_modules/@angular/core/src/di/reflective_provider.d.ts(87,123): error TS2304: Cannot find name 'Map'.
node_modules/@angular/core/src/di/reflective_provider.d.ts(87,165): error TS2304: Cannot find name 'Map'.
node_modules/@angular/platform-browser/src/browser/browser_adapter.d.ts(79,33): error TS2304: Cannot find name 'Map'.
node_modules/@angular/platform-browser/src/dom/dom_adapter.d.ts(97,42): error TS2304: Cannot find name 'Map'.
node_modules/@angular/platform-browser/src/dom/shared_styles_host.d.ts(11,30): error TS2304: Cannot find name 'Set'.
node_modules/@angular/platform-browser/src/dom/shared_styles_host.d.ts(22,30): error TS2304: Cannot find name 'Set'.
node_modules/rxjs/Observable.d.ts(69,60): error TS2693: 'Promise' only refers to a type, but is being used as a value here.
```

虽然看着很长，其实信息只有一点，就是缺少一些 ES2015 中新增内容的类型定义。事实上，TypeScript 不仅支持编译到 JavaScript，还能设定不同的 JavaScript 级别，默认为 ES5。然后，在输出 ES5 的情况下，TypeScript 会发现我们使用了 ES2015 的内容，由于这些内容不是语法，只是 API，所以是不会通过转译实现的，而是要自行添加相应的 Polyfill。

TypeScript 为我们提供了两种内置的解决方案，一种是保持输出级别为 ES5，但是告诉 TypeScript 我们能够自行解决 Polyfill 的问题：

```bash
tsc --allowJs --outDir dist --lib es2015,dom main.js
```

这里通过 `lib` 选项指定需要引入的类型定义文件[^20]。另一种方案是将输出级别改为 ES2015，如果我们的目标平台较为先进的话：

```bash
tsc --allowJs --outDir dist --target es2015 main.js
```

我们这里选择后者，因为仅仅是作为教学目的。

由于 TypeScript 自带了对最新（以及比最新还要更新）的 JavaScript 语言特性，我们现在可以直接在 JavaScript 文件中使用更多的语法糖，例如 Decorator。

我们将 JavaScript 文件修改为使用 Decorator 的版本[^21]：

```javascript
/* app.component.js */
import { Component } from '@angular/core'

@Component({
  selector: 'main',
  template: '<h1>Hello Angular</h1>',
})
export class AppComponent { }

/* app.module.js */
import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { AppComponent } from './app.component'

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
export class AppModule { }
```

相比于手动属性赋值而言，这样又更加简洁直观了不少。

然而当我们再次尝试使用 `tsc` 编译的时候，发现了新的错误：

```text
app.component.js(7,14): error TS1219: Experimental support for decorators is a feature that is subject to change in a future release. Set the 'experimentalDecorators' option to remove this warning.
app.module.js(16,14): error TS1219: Experimental support for decorators is a feature that is subject to change in a future release. Set the 'experimentalDecorators' option to remove this warning.
```

这里是在说 Decorator 默认是不提供支持的，想要用的话自己加开关。所以很简单，加上开关就好了：

```bash
tsc --allowJs --outDir dist --target es2015 --experimentalDecorators main.js
```

成功编译文件。然后重新使用 Webpack 打包，注意路径的改动：

```bash
webpack dist/main.js bundle.js
```

刷新浏览器，我们在浏览器中看到了一个错误：

```text
Uncaught TypeError: Reflect.defineMetadata is not a function
```

这个是因为我们在上一节中提供了一个假的 Metadata Reflection API，因为当时还不需要用到。不过现在是真的需要了，为此我们加上对应的 Polyfill：

```html
<!DOCTYPE html>
<title>Hello Angular</title>
<main>TODO</main>
<script src="https://unpkg.com/core-js@2.4.1/client/shim.js"></script>
<script src="https://unpkg.com/zone.js@0.8.10/dist/zone.js"></script>
<script src="./bundle.js"></script>
```

重新看到了我们的 `Hello Angular`。

最后，我们将 JavaScript 文件改成 TypeScript 文件，并不需要改动内容，仅仅是修改后缀名为 `.ts`：

```typescript
/* app.component.ts */
import { Component } from '@angular/core'

@Component({
  selector: 'main',
  template: '<h1>Hello Angular</h1>',
})
export class AppComponent { }

/* app.module.ts */
import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { AppComponent } from './app.component'

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
export class AppModule { }

/* main.ts */
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'
import { AppModule } from './app.module'

platformBrowserDynamic().bootstrapModule(AppModule)
```

同样使用 `tsc` 编译，不过已经不需要 `allowJs` 和 `ourDir` 选项了：

```bash
tsc --target es2015 --experimentalDecorators main.ts
```

不过这次又有点小问题：

```text
app.component.ts(1,27): error TS2307: Cannot find module '@angular/core'.
app.module.ts(1,26): error TS2307: Cannot find module '@angular/core'.
app.module.ts(2,31): error TS2307: Cannot find module '@angular/platform-browser'.
main.ts(1,40): error TS2307: Cannot find module '@angular/platform-browser-dynamic'.
```

为什么明明没有动 `node_modules` 目录，就找不到相应的模块了呢？这其实是 TypeScript 一个历史遗留问题，我们简单增加一个参数即可解决：

```bash
tsc --target es2015 --experimentalDecorators --moduleResolution node main.ts
```

随后重新打包：

```bash
webpack main.js bundle.js
```

刷新浏览器，发现一切正常。现在我们就成功地将整个项目 Script 形式的单文件 JavaScript 逐步迁移成了 Module 形式的多文件 TypeScript。不过目前我们 **并没有用到任何 TypeScript 语言** 的内容，仅仅是将 JavaScript 文件改了后缀名而已。

## 可能的疑惑

#### 为什么 Dart 版本的 Angular 没有流行起来？

因为 Dart 没有流行起来。

#### 现在是否还有办法使用 AtScript？

Github 上有一个 PlayGround 的 Repo：[angular/atscript-playground](https://github.com/angular/atscript-playground)。

#### Angular 的编译器是如何工作的？

会在后文中覆盖。

#### 既然 AOT 编译的要求是 TypeScript 工具和 Decorator 语法，那是否可以对使用 Decorator 语法的 JavaScript 文件进行 AOT 编译？

理论上可行，Decorator 本身是（提案中的）JavaScript 语言特性，但是 TypeScript 工具对 JavaScript 文件的支持（Salsa）与 TypeScript 文件的支持略有差异，需要使用额外的构建步骤将 `.js` 文件重命名为 `.ts` 文件，另外可能还需要设置忽略相应的类型检查错误。

另外，不建议在没有相关实力的情况下主动踩坑。

#### 既然 JIT 编译也会在运行时生成相应的 JavaScript 文件，那是否可以将浏览器中所生成的 JavaScript 文件拷贝出来当做源码使用，从而避免运行时编译？

理论上可行，JIT 编译除了输出的语言级别和使用的模块机制外，与 AOT 编译的结果并无本质差异。但这样做会导致模版中的内容无法被正确地进行类型检查，可能产生不必要的错误隐患。

另外，不建议在没有相关实力的情况下主动踩坑。

#### 明明 Edge 浏览器也提供了 ES Module 支持，为什么不给出相应的选项？

因为我现在手上用的是 Mac。

#### 为什么不在浏览器原生模块化的步骤中把外部依赖也使用 Module 的形式引入？

HTML 规范所实现的 ES Module 的 Runtime Semantics: HostResolveImportedModule 过程与目前所有的模块使用方式都不兼容，详情参考：[为什么 ES Module 的浏览器支持没有意义 - 知乎专栏](https://zhuanlan.zhihu.com/p/25046637)。

#### 为什么 file 协议会有跨域问题？

Web 开发基础不在本书的覆盖范围内。请自行搜索其它外部资源。

#### 为什么不直接写成 inline export 的形式？

import, content, export 的三段式结构的表达形式更为清晰，且对原有内容几乎没有任何改动，有助于理解模块的本质。

#### ES Module 到底有多少种 import 和 export 语法？

JavaScript 语言基础不在本书的覆盖范围内。请自行搜索其它外部资源。

#### 为什么要用 Webpack 做示例？

因为 CLI 用的就是 Webpack。

#### 为什么 TypeScript 工具的 JavaScript 支持部分叫做 Salsa？

内部项目代号，大家后来习惯了就都这么叫。

#### 为什么使用 TypeScript 工具编译 JavaScript 代码时不需要 --moduleResolution 选项？

因为 TypeScript 默认对 JavaScript 代码不进行类型检查，因此虽然同样无法正确识别 `@angular/core` 的位置，鉴于其不会对编译结果造成影响（模块名原样保留），所以不会妨碍编译过程。另外，TypeScript 2.3 版本开始增加了一个 `--checkJs` 的选项用于提供对 JavaScript 文件的类型检查。

#### 哪里能查到 TypeScript CLI 的所有编译器选项？

这里：[Compiler Options · TypeScript](http://www.typescriptlang.org/docs/handbook/compiler-options.html)。

---

[^1]: TypeScript 是 Microsoft 推出的一门基于 JavaScript 语言扩展的类 JavaScript 语言，用于增强 JavaScript 工程中的静态类型检查效果。官网为：[TypeScript - JavaScript that scales](http://www.typescriptlang.org/)，语言规范为：[TypeScript Language Specification（不是最新）](https://github.com/Microsoft/TypeScript/blob/master/doc/spec.md)。在本文中，我们可能不严格区分 TypeScript 这门语言与其 [官方实现](https://github.com/Microsoft/TypeScript)。

[^2]: Dart 是 Google 推出的一门通用编程语言，主要面向 Web 开发。官网为：[Dart programming language | Dart](https://www.dartlang.org/)，语言规范为：[Standard ECMA-408](http://www.ecma-international.org/publications/standards/Ecma-408-arch.htm)。在本文中，我们可能不严格区分 Dart 这门语言与其 [官方实现](https://github.com/dart-lang/sdk)。

[^3]: 分离前 Dart 版实现的源码也位于 [angular/angular](https://github.com/angular/angular) 的 GitHub 当中，同时 [dart-lang/angular2](https://github.com/dart-lang/angular2) 充当编译后的纯 Dart 代码的存档。之后即作为 Dart 实现的源码 Repo 使用。

[^4]: Angular 团队自行开发了 TypeScript 到 Dart 的编译工具，详情参考：[Angular 2 Dart Transformer](https://docs.google.com/document/d/1Oe7m96QnOrilxpH1B5o9G_PnfBGovhH-n_o7RU6LYII/)，相应的实现在 [angular/ts2dart](https://github.com/angular/ts2dart)。

[^5]: AtScript 是专门为开发 Angular 所设计的语言，因此在 Angular 团队决定迁移到 TypeScript 之后，该语言即被宣布废弃。官网在 [AtScript Primer](http://atscript.org/)，扩展名为 `.ats`。

[^6]: 正如我们在第一节中尝试过的那样，Angular 并不要求使用 Decorator 语法，只是在使用该语法的情况下能够大量提高代码可读性，提高开发效率。

[^7]: Annotation 并不仅仅表示 `@Something` 这样的内容，这种情况下通常译作「注解」，AtScript 中叫做 Metadata Annotation；而 `name: string` 这样的内容一般叫做 Type Annotation，译作「类型标注」。

[^8]: AtScript 的一个独特的功能就是运行时的类型检查，这点和 TypeScript 纯粹的编译时检查不同，即便是直接使用编译后的 JavaScript 代码也同样能保证类型安全。

[^9]: Twitter 链接为：[ng-conf on Twitter: "AtScript is Typescript #ngconf"
](https://twitter.com/ngconf/status/573521849780305920)。

[^10]: 原计划中的 TypeScript Introspection API 设计文档：[TypeScript Introspection API](https://docs.google.com/document/d/1fvwKPz7z7O5gC5EZjTJBKotmOtAbd3mP5Net60k9lu8/edit#heading=h.v7s5x1d7wo5j)。

[^11]: AtScript 原有的 Metadata Annotation 的功能基本可以通过 JavaScript 的 Decorator 模拟实现，改动后的 Re-design 文档可以参见：[Decorators vs Metadata Annotations](https://docs.google.com/document/d/1QchMCOhxsNVQz2zNvmzy8ibDMPT46MLf79X1QiDc_fU/edit)。

[^12]: 更确切地说 AOT 编译的限制还有必须使用 Decorator 语法。

[^13]: 对于 Angular 而言，在开发时预先编译模版内容叫做 AOT（Ahead-of-time）编译，在运行时编译模版内容叫做 JIT（Just-in-time）编译，如无特殊说明，本文中的编译方式均指代 Angular 模版编译器的编译方式。

[^14]: Chome Canary 的下载地址：[Chrome Browser](https://www.google.com/chrome/browser/canary.html)。

[^15]: Firefox Nightly 的下载地址：[Try New Browser Features in Pre-Release Versions | Firefox](https://www.mozilla.org/en-US/firefox/channel/desktop/)。

[^16]: Safari 的下载地址：[Apple - Support - Downloads](https://support.apple.com/downloads/safari)。

[^17]: Yarn 是一款 Facebook 推出的包管理器，基于 NPM Registry，相比 NPM 而言对功能和性能进行了一些增强。官网为：[Yarn](https://yarnpkg.com/)。

[^18]: 就语言规范的定义而言，`import` 和 `export` 这类语法形式构成的内容并不属于 **Statement（语句）**。

[^19]: Webpack 是一个通用的 JavaScript 模块打包器，官网为：[webpack](https://webpack.js.org/)。

[^20]: TypeScript 编译器的 `lib` 选项仅仅添加的是类型定义，用于通过类型检查，并不会添加实际的运行时内容。

[^21]: 将静态属性改为 Decorator 的过程前后文件的语义是发生了变化的，在 JavaScript 语言层面并不等价，只是在 Angular 的功能实现上基本等价。
