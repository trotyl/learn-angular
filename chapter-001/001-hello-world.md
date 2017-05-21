# Hello World

从示例来学习是一种很有效的方式，毕竟人类的学习过程就是基于大规模的模式匹配。这里，我们将 *不使用任何开发工具和语言扩展*，从零开始打造一个 Angular 的 Hello World 应用。

既然说了不使用任何开发工具，这里当然也就没法推荐编辑器了，读者可以自己选择任何具备文本编辑功能的程序。

现在，我们需要建立一个 **HTML** 文件，为了简单起见，我们只使用必要的 HTML 标签[^1]：

```html
<!DOCTYPE html>
<title>Hello Angular</title>
<main>TODO</main>
```

用浏览器[^2]打开这个 HTML 文件，我们能够看到一行（一点也不好看的）`TODO` 字样。

我们知道（如果不知道那现在就知道了），Angular 使用 **组件化** 的方式来组织应用，所以一个应用里面必须要有 **Component（组件）**。相比于 AngularJS 而言，Angular 的设计更加面向现代 JavaScript 语言，每一样组件就是一个 **JavaScript Class（类）**，这里我们新建一个叫做定义一个叫做 `AppComponent`[^3] 的 **Class** 作为我们应用的 **Root Component（根组件）**[^4]（也是唯一组件）：

```javascript
class AppComponent { }
```

于是整个 HTML[^5] 现在变为：

```html
<!DOCTYPE html>
<title>Hello Angular</title>
<main>TODO</main>
<script>
class AppComponent { }
</script>
```

如果我们现在刷新浏览器的话，就会发现——什么也没有发生（昨晚是一个平安夜）。

接下来我们使用 **Error-Driven Development** 的方式来进行开发，即先写代码，跑起来，看出了什么问题再来修。

这里我们可以简单思考一下，既然我们希望 `AppComponent` 作为一个组件（可复用的视图单元），那么就需要定义它应该 *有什么样的视图*，以及要 *如何复用*。像 AngularJS 一样，Angular 仍然采用基于 **Template（模【mú】版）** 的方式来定义视图，为此，我们需要为我们的 **Component** 提供 **Template** 内容。

与 AngularJS 所不同的是，Angular 并不提供相应的全局注册 API。提供 **Template** 的方式很简单，直接把相应的 **Metadata（元数据）** 附加到 **Class** 中即可。

如果我们要为一个类添加实例无关的固定内容，显然一个最简单的方式就是添加 **Static Property（静态属性）**，为此我们为 `AppComponent` 添加一个叫做 `annotations` 的静态属性[^6]：

```javascript
class AppComponent { }

AppComponent.annotations = [
  new ng.core.Component({
    template: '<h1>Hello Angular</h1>'
  })
]
```

上面我们 `AppComponent` 的 `annotations` 静态属性初始化为一个数组，显然，既然是复数名词，那么显然不止一个内容，而且从逻辑上也很容易知道，一个类型自然应该能够附加多组 **Metadata**。目前我们的数组中只有一个元素，是一个 `ng.core.Component` 类型的实例，带有一个匿名对象作为参数。该匿名对象具备一个 `template` 属性，其值即为我们所要定义的组件模版。

不过，当我们再次刷新浏览器，我们会看到控制台出现了报错：

```text
Uncaught ReferenceError: ng is not defined
```

是的，我们并没有任何地方定义了 `ng` 这个全局变量，这时候我们就需要引入 Angular 本身的库代码了，我们在 HTML 中添加一个新的 `<script>` 标签：

```html
<!DOCTYPE html>
<title>Hello Angular</title>
<main>TODO</main>
<script src="https://unpkg.com/@angular/core@4.1.3/bundles/core.umd.js"></script>
<script>
// Original scripts here ...
</script>
```

那么这里的 `core.umd.js` 是什么呢？分段解释就是：

+ `https` 是一个 URI Scheme，废话不多说；
+ `unpkg.com` 是一个提供在线 NPM 包访问的 CDN 站点，也就是说，只要是 NPM public registry 里面的内容，都能通过该站点在线访问；
+ `@angular/core` 是 NPM 里一个 Scoped Package[^7]，Angular 采用模块化的方式发布，这里是 Angular 的核心运行时（平台无关）部分对应的 Package；
+ `4.1.3` 是本文写作时 Angular 的最新稳定版本；
+ `bundles` 是发布内容中 UMD 文件所在的文件夹，用于适配不同的模块系统（以及不使用模块系统）的情况；
+ `core.umd.js` 是该模块中唯一的 umd 文件。

可能需要注意的是，这里 `<script>` 标签的顺序很重要。不过现在我们会发现，控制台出现了另一个错误：

```text
Uncaught TypeError: Cannot read property 'Observable' of undefined
Uncaught TypeError: ng.core.Component is not a constructor
```

事实上，第二项报错只是因为第一项报错导致的初始化失败的副作用，不需要关心。

造成第一项报错的代码为：

```javascript
global.Rx.Observable
```

这里我们看到一个新的全局变量，叫做 `Rx`。那么这里的 `Rx` 是什么东西呢？Rx 是 Reactive Extentions 的缩写，为微软研究院开发的基于 .Net Framework 的 Reactive Programming（响应式编程）类库，我们这里使用的是 JavaScript 语言的移植版本，因此也叫 RxJS。

而这里 RxJS 是 Angular 的一个重要的第三方依赖，所以我们也需要一个额外的标签来引入 RxJS：

```html
<!DOCTYPE html>
<title>Hello Angular</title>
<main>TODO</main>
<script src="https://unpkg.com/rxjs@5.4.0/bundles/Rx.js"></script>
<script src="https://unpkg.com/@angular/core@4.1.3/bundles/core.umd.js"></script>
<script>
// Original scripts here ...
</script>
```

在这之后，我们就可以继续期待新的错误了。正如我们所期望的那样，新的错误为：

```text
Uncaught reflect-metadata shim is required when using class decorators
```

这里说的是我们需要使用一个 Polyfill。然而事实上并不需要，因为 Angular 不是人工智能，只是机械地检查预设条件，所以只要在浏览器编译的情况下，Angular 就会检测当前环境是否具备 **Metadata Reflection API**[^8] 相关的功能。

因为我们比 Angular 聪明很多，所以并不需要真的引入这个 Polyfill，简单地骗一骗 Angular 就好了，为此我们增加一个 `<script>` 标签，提供一个假的 `Reflect.getOwnMetadata` 定义：

```html
<!DOCTYPE html>
<title>Hello Angular</title>
<main>TODO</main>
<script>
Reflect.getOwnMetadata = () => {}
</script>
<script src="https://unpkg.com/rxjs@5.4.0/bundles/Rx.js"></script>
<script src="https://unpkg.com/@angular/core@4.1.3/bundles/core.umd.js"></script>
<script>
// Original scripts here ...
</script>
```

然后继续。

然而遗憾的是，并没有新的错误出现，为什么呢？因为并没有任何代码来启动我们的应用，我们仅仅完成了一个组件定义而已。等等，组件定义真的完成了么？

前面说到，对于组件我们需要考虑两个问题：*有什么样的视图* 和 *如何复用*。*有什么样的视图* 这个问题我们已经解决了，那么要如何进行复用，或者说，如何确定什么时候使用这个组件呢？

为了保持和 Web Components 的一致性[^9]，Angular 采用了自定义 **Selector（选择器）** 的方式来配置何时应用该组件，这里的 **Selector** 和之前的 **Template** 一样都是 **Component** 的 **Metadata**。

我们继续添加 `selector` 属性：

```javascript
class AppComponent { }

AppComponent.annotations = [
  new ng.core.Component({
    selector: 'main',
    template: '<h1>Hello Angular</h1>',
  })
]
```

现在组件的定义已经完成了，接着来考虑如何启动应用。

从 2.0.0-rc.5 版本开始，Angular 中新引入了一个 **NgModule** 的概念[^10]，用于充当应用的基本可分割单元。每个 **Component** 都必须所属于某个 **NgModule**。

和 **Component** 类似，每一样 **NgModule** 也是一个 **JavaScript Class**，这里我们定义一个叫 `AppModule` 的 **NgModule**：

```javascript
class AppComponent { }

AppComponent.annotations = [
  //...
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
  })
]
```

这里我们提供的 **Metadata** 与之前的不同，是一个 `ng.core.NgModule` 类型的实例，其参数中用到了 `imports` 属性和 `declarations` 属性。`imports` 属性是一个数组，用于指定这个 **NgModule** 所依赖的其它 **NgModule**，例如所有面向 Web 的 Angular App 都需要在 **Root NgModule** 中依赖 `BrowserModule`，其中包含了浏览器平台的相关基础设施（如操作 DOM 的工具等）；`declarations` 属性还是一个数组，用于声明所有该模块的视图层相关内容，包括 **Components**、**Directives** 以及 **Pipes**。

再次刷新浏览器，我们终于得到了新的错误：

```text
Uncaught TypeError: Cannot read property 'BrowserModule' of undefined
```

很容易就能知道，既然 `ng.core` 是通过 `@angular/core` 引入的，很显然 `ng.platformBrowser` 也需要通过单独的 **Package** 来引入，也就是 `@angular/platform-browser`。

为此我们添加一个新的 `<script>` 标签：

```html
<!DOCTYPE html>
<title>Hello Angular</title>
<main>TODO</main>
<script>
Reflect.getOwnMetadata = () => {}
</script>
<script src="https://unpkg.com/rxjs@5.4.0/bundles/Rx.js"></script>
<script src="https://unpkg.com/@angular/core@4.1.3/bundles/core.umd.js"></script>
<script src="https://unpkg.com/@angular/platform-browser@4.1.3/bundles/platform-browser.umd.js"></script>
<script>
// Original scripts here ...
</script>
```

这样我们上面的错误就解决了，现在又是一个新的错误：

```text
Uncaught TypeError: Cannot read property 'PlatformLocation' of undefined
```

错误来源是：

```javascript
_angular_common.PlatformLocation
```

结合 UMD 文件头：

```javascript
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/common'), require('@angular/core')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/common', '@angular/core'], factory) :
	(factory((global.ng = global.ng || {}, global.ng.platformBrowser = global.ng.platformBrowser || {}),global.ng.common,global.ng.core));
}(this, (function (exports,_angular_common,_angular_core)
```

`_angular_common` 就指的是 `@angular/common` 这个 **Package**，这个是包含了 Angular 的通用类库代码的部分。

如果我们具备 AngularJS 基础的话，应该知道 `PlatformLocation` 是一个 **Service（服务）**，而这些 Angular 内置的基础 **Service** 等内容就包含在 `@angular/common` 这个 **Package** 当中。除了 **Service** 内容外，`@angular/common` 还包含有基本的 **Directive（指令）**、**Pipe（管道）** 等。

继续添加一个 `<script>` 标签：

```html
<!DOCTYPE html>
<title>Hello Angular</title>
<main>TODO</main>
<script>
Reflect.getOwnMetadata = () => {}
</script>
<script src="https://unpkg.com/rxjs@5.4.0/bundles/Rx.js"></script>
<script src="https://unpkg.com/@angular/core@4.1.3/bundles/core.umd.js"></script>
<script src="https://unpkg.com/@angular/common@4.1.3/bundles/common.umd.js"></script>
<script src="https://unpkg.com/@angular/platform-browser@4.1.3/bundles/platform-browser.umd.js"></script>
<script>
// Original scripts here ...
</script>
```

又进入到了没有错误的状态，不过仍然什么也没有发生。现在已经有了 **NgModule**，我们可以考虑来启动我们的 Angular 应用。启动一个 Angular 应用有很多种方式，其中最简单的方式就是通过 **NgModule** 的 **Metadata** 中的 `bootstrap` 属性来设置：

```javascript
class AppComponent { }

AppComponent.annotations = [
  //...
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
```

这样就将 `AppComponent` 设置为 `AppModule` 的自启动组件。那么又要如何启动 `AppModule` 这个 **NgModule** 呢？

我们首先尝试使用 `platformBrowser` 提供的 API：

```javascript
class AppComponent { }

AppComponent.annotations = [
  //...
]

class AppModule { }

AppModule.annotations = [
  //...
]

ng.platformBrowser.platformBrowser().bootstrapModule(AppModule)
```

这时会出现错误：

```text
Uncaught Error: No provider for CompilerFactory!
```

很明显，我们缺少 `CompilerFactory` 这个内容。事实上，Angular 和 AngularJS 很大的一点不同是，AngularJS 的模版是基于 DOM 的，HTML 内容会被交给浏览器解析，随后 AngularJS 遍历 DOM 节点来实现自己的功能扩展；而 Angular 中的模版是平台无关的，HTML 内容会被事先编译成视图相关的 JavaScript 代码，而浏览器永远也见不到模版的 HTML 内容。

因此，Angular 使用了一个功能强大的模版编译器，在不依靠预处理工具的情况下，我们只能在浏览器里引入这个编译器，位于 `@angular/compiler`：

```html
<!DOCTYPE html>
<title>Hello Angular</title>
<main>TODO</main>
<script>
Reflect.getOwnMetadata = () => {}
</script>
<script src="https://unpkg.com/rxjs@5.4.0/bundles/Rx.js"></script>
<script src="https://unpkg.com/@angular/core@4.1.3/bundles/core.umd.js"></script>
<script src="https://unpkg.com/@angular/common@4.1.3/bundles/common.umd.js"></script>
<script src="https://unpkg.com/@angular/compiler@4.1.3/bundles/compiler.umd.js"></script>
<script src="https://unpkg.com/@angular/platform-browser@4.1.3/bundles/platform-browser.umd.js"></script>
<script>
// Original scripts here ...
</script>
```

不过，很遗憾的是，这次错误并没有消失也没有变化。事实上，`@angular/platform-browser` 的 API 仅仅适用于对已经预编译过的 **NgModule**，而对于无构建工具的在线运行，我们需要使用另一个 API，位于 `@angular/platform-browser-dynamic`。`PlatformBrowserDynamic` 能够在运行时融合 `PlatformBrowser` 和 `Compiler`，提供运行时动态编译的功能。因此，继续添加一个 `<script>` 标签：

```html
<!DOCTYPE html>
<title>Hello Angular</title>
<main>TODO</main>
<script>
Reflect.getOwnMetadata = () => {}
</script>
<script src="https://unpkg.com/rxjs@5.4.0/bundles/Rx.js"></script>
<script src="https://unpkg.com/@angular/core@4.1.3/bundles/core.umd.js"></script>
<script src="https://unpkg.com/@angular/common@4.1.3/bundles/common.umd.js"></script>
<script src="https://unpkg.com/@angular/compiler@4.1.3/bundles/compiler.umd.js"></script>
<script src="https://unpkg.com/@angular/platform-browser@4.1.3/bundles/platform-browser.umd.js"></script>
<script src="https://unpkg.com/@angular/platform-browser-dynamic@4.1.3/bundles/platform-browser-dynamic.umd.js"></script>
<script>
// Original scripts here ...
</script>
```

并将我们的启动代码修改为：

```javascript
class AppComponent { }

AppComponent.annotations = [
  //...
]

class AppModule { }

AppModule.annotations = [
  //...
]

ng.platformBrowserDynamic.platformBrowserDynamic().bootstrapModule(AppModule)
```

在此之后，我们得到了最后一个错误（八年抗战到最后一年了？）：

```text
Error: Angular requires Zone.js prolyfill[^11].
```

这里就十分浅显易懂了，而且解决方案就是如其所述，添加一个 Zone.js 的 `<script>` 标签：

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
<script>
// Original scripts here ...
</script>
```

之后，我们就能看到我们想要的内容：

```text
Hello Angular
```

完整的 HTML 文件内容如下：

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
<script>
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
</script>
```

至此，我们在没有使用任何开发工具或语言扩展的情况下，完成了一个最为传统的（只使用 `<script>` 标签引入内容）的 Hello World for Angular 的版本。

## 可能的疑惑

#### Angular 是否能够使用 JavaScript 开发？

你有没有动手？

#### Angular 是否不推荐使用 JavaScript 开发？

是的。

#### 为什么 AppComponent 和 AppModule 类内部没有内容？

因为这只是 Hello World。

#### 是否能够以不用 ES2015（类）的方式使用？

可以，后文中会提及。

#### Angular 是否能够使用 CDN 引入？

你有没有动手？

#### Angular 是否提供官方 CDN 站点？

不提供，而且也不推荐运行时引入的方式。

#### @angular 的 Scope 里有多少 Packages？

目前仍在维护的有 22 个，不同平台不同需求下需要用到的内容不同，另外很大一部分为工具，不属于运行时依赖，详见：[@angular](https://www.npmjs.com/~angular)。

#### Angular 需要多少外部依赖？

1 个或 2 个，取决于是否把 Zone.js 当作 Angular 的一部分。

#### Angular 是否需要用到 Metadata Reflection API？

只有在同时使用 **Decorator 语法** 和 **JIT 编译** 方式的情况下才会用到。

#### Angular 的元数据有几种提供方式？

后文中会提及。

#### NgModule 的意义是什么？

后文中会提及。

#### Angular 有哪些启动方式？

后文中会提及。

---

[^1]: 在 HTML 中，`<html>`、`<head>` 和 `<body>` 等都是可选标签，但是大部分情况下为了保持页面的结构清晰我们仍然会使用这些标签。详见：[HTML 5.1: 8. The HTML syntax](https://www.w3.org/TR/html/syntax.html#optional-tags)。

[^2]: 浏览器并不属于开发工具，只是普通的日常 App，所以并不违反我们上面不使用开发工具的承诺。当然，这里要求浏览器能够支持 ES2015。

[^3]: 在 Angular 项目中，对于 Component 类型的 JavaScript class 而言，其命名通常以 Component 结尾。此外，对于应用的根元素，通常采用 AppComponent 作为其名称。不过这些都 Angular 团队推荐的代码风格，对实现并不会造成任何影响。

[^4]: 组件本身并不会有任何「作为根组件」的标记，而设计根组件的一个常用方式是通过 NgModule 的相关 Metadata，其它设置方式会在之后的部分覆盖。

[^5]: 之后我们所有自己写的 JavaScript 代码都在这个 `<script>` 标签中，如无特殊情况不再特别说明。

[^6]: ES2015 中并没有提供值属性的语法，只有访问器属性和方法的声明语法。目前有一个 Stage 2 的 ES Proposal 中给出了类的值属性语法的相应提案，详情参见：[tc39/proposal-class-public-fields](https://github.com/tc39/proposal-class-public-fields)。

[^7]: Scope Packages 是 NPM 提供的服务，用于提供自定义的命名空间从而解决全局名称冲突的问题。详情参见：[scope | npm Documentation](https://docs.npmjs.com/misc/scope)。

[^8]: Metadata Reflection API 所在 Repo 为：[rbuckton/reflect-metadata](https://github.com/rbuckton/reflect-metadata)，文档在：[Metadata Proposal - ECMAScript](https://rbuckton.github.io/reflect-metadata/)。目前并未提交给 TC39，所以不属于任何 Stage。

[^9]: 早期的 Angular 设计方案中也有过基于 Web Components 实现的方案，类似于现在的 Polymer。详情参见：[Angular 2: Emulated Components](https://docs.google.com/document/d/1NFmp2ptjFfzTEYf0OPcpkacRV2_7LgTIrP5nWfJQL0o/edit#heading=h.z2blzd2pdtwt)。

[^10]: 实际上，只有 TypeScript 实现的 Angular 才引入了 NgModule 的概念，而 Dart 版本的 Angular 并没有 NgModule，仍然使用类似于 2.0.0-rc.4 及之前的方式进行开发。详情参考：[About AngularDart](https://webdev.dartlang.org/angular)。不过绝大多数情况下我们默认说的都是 Angular 的 TypeScript 实现。

[^11]: Prolifill = Probably a polyfill，由于 Zone API 仍然处于 Stage 0，也就是说仅仅在 tc39 留档。而 Stage 1 开始才属于语言提案，Stage 4 之后才进入语言规范中。所以 Zone API 仅仅是可能作为未来标准的 Polyfill。关于 Polyfill、Ponyfill 和 Prolifill 的辨析可以参考：[Polyfill, Ponyfill & Prollyfill](https://kikobeats.com/polyfill-ponyfill-and-prollyfill/)。
