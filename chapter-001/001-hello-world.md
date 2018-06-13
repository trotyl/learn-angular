# Hello World

从示例来学习是一种很有效的方式，毕竟人类的学习过程就是基于大规模的模式匹配。这里，我们将 *不使用任何开发工具和语言扩展*，从零开始打造一个 Angular 的 Hello World 应用。

既然承诺不使用任何开发工具，因此也就无法推荐编辑器，读者可以自己选择任何具备文本编辑功能的程序。

## HTML 入口

现在，我们需要建立一个 **HTML** 文件，为了简单起见，我们只使用必要的 HTML 标签<sup>*</sup>：

> **必要的 HTML 标签**：在 HTML 中，`<html>`、`<head>` 和 `<body>` 等都是可选标签，但是大部分情况下为了保持页面的结构清晰我们仍然会使用这些标签。详见：[HTML 5.1: 8. The HTML syntax](https://www.w3.org/TR/html/syntax.html#optional-tags)。

```html
<!DOCTYPE html>
<title>Hello Angular</title>
<ng-component>Loading...</ng-component>
```

用浏览器<sup>*</sup>打开这个 HTML 文件，我们能够看到一行（并不怎么好看的）`Loading...` 字样。

> **浏览器**：浏览器并不属于开发工具，只是普通的日常 App，所以并不违反上面不使用开发工具的承诺。当然，这里要求浏览器能够支持 ES2015。

这里使用了一个名为 `<ng-component>` 的元素，类似于 [Custom Elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements)。虽然现在还没有任何功能，不过最终我们会将其作为 Angular 应用的启动入口。

## 组件定义

我们知道（如果不知道那现在就知道了）Angular 使用 **组件化** 的方式来组织应用内容<sup>*</sup>，所以一个应用里面必须要有 **组件(Component)**。相比于 AngularJS 而言，Angular 的设计更加面向现代化的 JavaScript 语言特性，每个组件就是一个 **类(class)**，这里我们定义一个名为 `AppComponent`<sup>*</sup> 的类作为我们应用的 **根组件(Root Component)**<sup>*</sup>（也是唯一组件）：

> **组件化**：从技术角度而言 Angular 可用于视图无关应用（例如纯服务端应用或者命令行工具），这种情况下将不会用到组件。不过将 Angular 纯粹当作 DI 支持库来使用有过度浪费的嫌疑，一般并不推荐，本节暂不考虑这种情况。

> **AppComponent**：在 Angular 项目中，对于 Component 类型的 class 而言，其命名通常以 `Component` 结尾（不适用于组件库）。此外，对于应用的根元素，通常采用 `AppComponent` 作为其名称。不过这些都只是 Angular 团队推荐的代码风格，对功能不会产生任何影响。

> **根组件**：组件本身并不会有任何「作为根组件」的标记，任何作为根组件的组件也都可以同时作为内嵌组件使用，因此从技术角度而言将一个组件称为「根组件」是不严谨的。但在某个组件仅用作应用入口的情况下，通常会使用根组件指代。

*本文假设读者已经完全了解 ES2015，对于 ES2016+ 以及暂未进入规范的实验特性会专门说明。*

```javascript
class AppComponent { }
```

于是 HTML 文件将新增一个 inline `<script>` 标签：

```html
<!-- ... -->
<ng-component>Loading...</ng-component>
<!-- change start -->
<script>
class AppComponent { }
</script>
<!-- change end -->
```

如果我们现在刷新浏览器的话，就会发现 &mdash; 什么也没有发生（昨晚是一个平安夜）。

接下来我们使用 **Error-Driven Development** 的方式来进行开发，即：**写代码，运行，出了问题再修**。

这里我们可以简单思考一下，既然我们希望 `AppComponent` 作为一个组件（可复用的视图单元<sup>*</sup>），那么就需要定义它应该 *有什么样的视图*，以及要 *如何复用*。像 AngularJS 一样，Angular 仍然基于 **模【mú】版(Template)** 定义视图，为此，我们需要为我们的组件提供模板内容。

> **视图单元**：组件中可能包含自治的「视图逻辑」，由于本节内容尚未涉及「逻辑」，因此组件仅包含纯视图内容。

与 AngularJS 所不同的是，Angular 并不使用全局注册的 API，从而保证对 Tree-Shaking 的绝对友好。提供模板的方式很简单，直接把相应的 **元数据(Metadata)** 附加到类上即可。

如果我们要为一个类添加实例无关的固定内容，显然一个最简单的方式就是添加 **静态属性(Static Property)**，为此我们为 `AppComponent` 添加一个叫做 `annotations` 的静态属性<sup>*</sup>：

> **静态属性**：ES2015 中并没有提供值属性的语法，只有访问器属性和方法的声明语法。目前有一个 Stage 3 的 ES Proposal 中给出了类的值属性语法的相应提案，详情参见：[tc39/proposal-class-fields](https://github.com/tc39/proposal-class-fields)。静态属性支持被分离至[独立提案](https://github.com/tc39/proposal-static-class-features)中，目前仍然处于 Stage 3。

```javascript
/* change start */
const { Component } = ng.core
/* change end */

class AppComponent { }

/* change start */
AppComponent.annotations = [
  new Component({
    template: '<h1>Hello Angular</h1>'
  })
]
/* change end */
```

上面 `AppComponent` 的 `annotations` 静态属性被初始化为一个数组。显然，既然是复数名词，那么应当可以不止一项内容，而且从逻辑上也很容易知道，一个类型自然应该能够附加多项元数据<sup>*</sup>。目前我们的数组中只有一个元素，是一个 `ng.core.Component` 类型的实例，带有一个对象字面量作为参数。该对象具备一个 `template` 属性，其值即为我们所要定义的组件模版。

> **多项元数据**：由于实现上的限制，同一个类型无法在同一份 Angular 实现中承担不同职责，例如一个应用中不能有既是组件又是 NgModule 的类。

不过，当我们再次刷新浏览器，会看到控制台中出现了报错：

```text
Uncaught ReferenceError: ng is not defined
```

是的，我们并没有任何地方定义了 `ng` 这个全局变量。这时候我们就需要引入 Angular 本身的库代码了，在 HTML 中添加一个新的 `<script>` 标签：

```html
<!-- ... -->
<ng-component>Loading...</ng-component>
<!-- change start -->
<script src="https://unpkg.com/@angular/core"></script>
<!-- change end -->
<!-- ... -->
```

这里的 `unpkg.com` 是一个提供在线 NPM 包访问的 CDN 站点，也就是说，只要是 NPM public registry 里面的内容，都能通过该站点在线访问。因此无需使用 `npm install` 就能获取到 `@angular/core` 这个 scoped package<sup>*</sup> 中的内容，其 `main` 入口<sup>*</sup>设定为 UMD bundle，因此可以直接省略文件路径。完整的文件路径为 `https://unpkg.com/@angular/core/bundles/core.umd.js`。

> **scoped package**：[Scoped Packages](https://docs.npmjs.com/getting-started/scoped-packages) 是 NPM 提供的服务，用于提供自定义的命名空间从而解决全局名称冲突的问题。

> **main 入口**：位于 `package.json` 中的字段，[Node.js 的 Module Resolution 过程](https://nodejs.org/dist/latest-v10.x/docs/api/modules.html#modules_all_together)会自动根据其内容确定需要引入的实际文件，也被一些静态构建工具所支持。

可能需要注意的是，这里 `<script>` 标签的顺序很重要（先定义，后使用）。不过现在我们会发现，控制台出现了另一个错误：

```text
Uncaught TypeError: Cannot read property 'operators' of undefined
Uncaught TypeError: ng.core.Component is not a constructor
```

事实上，第二项报错只是因为第一项报错导致的初始化失败的副作用，不需要关心。

造成第一项报错的代码为：

```javascript
global.rxjs.operators
```

这里我们看到一个新的全局变量，叫做 `rxjs`。Rx 是 Reactive Extentions 的缩写，为微软研究院开发的基于 .Net Framework 的响应式编程(Reactive Programming)类库，我们这里使用的是相应的 JavaScript 语言移植版本<sup>*</sup>，因此也叫 RxJS。

> **Rx 的 JavaScript 语言移植版本**：由于并不存在官方，因此 RxJS 实际上存在不同实现。最初的主流实现位于 [Reactive-Extensions](https://github.com/Reactive-Extensions/rxjs/)，曾在 2.0 早期 Alpha 版本的 Angular 中使用；当前的主流实现位于 [ReactiveX](https://github.com/ReactiveX/rxjs/)，为当前版本的 Angular 所使用。由于维护者之间进行了合理交接，因此可以将两者视作新旧版本关系。

而这里 RxJS 是 Angular 的一个重要的第三方依赖，所以我们也需要一个额外的标签来引入 RxJS<sup>*</sup>：

> **引入 RxJS**：由于 `rxjs` 的 `main` 入口被设定为 CMD 的模块文件，无法在浏览器中使用，因此必须手动指定 UMD 文件路径。

```html
<!-- ... -->
<ng-component>Loading...</ng-component>
<!-- change start -->
<script src="https://unpkg.com/rxjs/bundles/rxjs.umd.js"></script>
<!-- change end -->
<script src="https://unpkg.com/@angular/core"></script>
<!-- ... -->
```

在这之后，我们就可以继续期待新的错误了。

然而遗憾的是，并没有新的错误出现，为什么呢？因为并没有任何代码来启动我们的应用，我们仅仅完成了一个组件定义而已。等等，组件定义真的完成了么？

前面说到，对于组件我们需要考虑两个问题：*有什么样的视图* 和 *如何复用*。*有什么样的视图* 这个问题我们已经解决了，那么要如何进行复用，或者说，如何确定什么时候使用这个组件呢？

为了保持和 Web Components 的一致性<sup>*</sup>，Angular 采用了自定义 **选择器(selector)** 的方式来配置何时应用该组件<sup>*</sup>，这里的选择器和之前的模板一样都是组件的元数据。

> **Web Components 一致性**：早期的 Angular 设计方案中也有过基于 Web Components 实现的方案，类似于现在的 Polymer。详情参见：[Angular 2: Emulated Components](https://docs.google.com/document/d/1NFmp2ptjFfzTEYf0OPcpkacRV2_7LgTIrP5nWfJQL0o/edit#heading=h.z2blzd2pdtwt)。

我们继续添加 `selector` 属性：

```javascript
/* change start */
const { Component } = ng.core
/* change end */

class AppComponent { }

AppComponent.annotations = [
  new Component({
    /* change start */
    selector: 'ng-component',
    /* change end */
    template: '<h1>Hello Angular</h1>',
  })
]
```

现在组件的定义已经完成了，接着来考虑如何启动应用。

## NgModule 定义

从 `2.0.0-rc.5` 版本开始，Angular 中新引入了一个 **NgModule** 的概念<sup>*</sup>，用于作为应用的基本组织单元。每个组件都必须从属于某个 NgModule。在启动之前，必须完成完成组件与 NgModule 的关联。

> **引入 NgModule**：实际上，只有 TypeScript 版本的 Angular 才引入了 NgModule 的概念，而 Dart 版本的 Angular 并不具备 NgModule 概念，仍然使用类似于 2.0.0-rc.4 及之前的方式进行开发。详情参考：[About AngularDart](https://webdev.dartlang.org/angular)。不过绝大多数情况下我们默认说的都是 Angular 的 TypeScript 实现。

与组件类似，NgModule 也是类，这里我们定义一个叫 `AppModule` 的 NgModule：

```javascript
const { Component/* change start */, NgModule/* change end */ } = ng.core

/* ... */

/* change start */
class AppModule { }

AppModule.annotations = [
  new NgModule({
    declarations: [
      AppComponent,
    ],
  })
]
/* change end */
```

这里我们提供的元数据与之前的不同，是一个 `ng.core.NgModule` 的实例。而其中的 `declarations` 属性用于声明从属于这个 NgModule 的类型<sup>*</sup>。

> **从属于 NgModule 的类型**：包括 **指令(Directive)** 和 **管道(Pipe)**，本节中用到的组件是一类特殊的指令。需要注意的依赖注入是完全不同的机制，与此无关，本节中暂不涉及。

由于 Angular 平台无关的设计理念，因此平台相关支持也以 NgModule 的方式提供。例如对于浏览器应用，需要引入 `BrowserModule`：

```javascript
const { Component, NgModule } = ng.core
/* change start */
const { BrowserModule } = ng.platformBrowser
/* change end */

/* ... */

AppModule.annotations = [
  new NgModule({
    /* change start */
    imports: [
      BrowserModule,
    ],
    /* change end */
    declarations: [
      AppComponent,
    ],
  })
]
```

其中 `imports` 属性是一个数组，用于指定这个 NgModule 所依赖的其它 NgModule，例如这里的 `BrowserModule`，其中包含了浏览器平台的相关基础设施（如 DOM 操作逻辑等）。

再次刷新浏览器，我们终于得到了新的错误：

```text
Uncaught TypeError: Cannot read property 'BrowserModule' of undefined
```

很容易就能知道，既然 `ng.core` 是通过 `@angular/core` 引入的，很显然 `ng.platformBrowser` 也需要通过单独的 **包(package)** 来引入，也就是 `@angular/platform-browser`。

为此我们添加一个新的 `<script>` 标签：

```html
<!-- ... -->
<script src="https://unpkg.com/@angular/core"></script>
<!-- change start -->
<script src="https://unpkg.com/@angular/platform-browser"></script>
<!-- change end -->
<!-- ... -->
```

又进入到了没有错误的状态，不过仍然什么也没有发生。现在已经有了 NgModule，我们可以考虑来启动我们的 Angular 应用。启动一个 Angular 应用有很多种方式，其中最简单的方式就是通过 NgModule 元数据中的 `bootstrap` 属性来设置自启动：

```javascript
/* ... */

AppModule.annotations = [
  new NgModule({
    imports: [
      BrowserModule,
    ],
    declarations: [
      AppComponent,
    ],
    /* change start */
    bootstrap: [
      AppComponent,
    ],
    /* change end */
  })
]
```

这样就将 `AppComponent` 设置为 `AppModule` 的自启动组件。那么又要如何启动 `AppModule` 这个 NgModule 呢？

## 应用启动

我们首先尝试使用 `platformBrowser` 提供的 API：

```javascript
const { Component, NgModule } = ng.core
const { BrowserModule/* change start */, platformBrowser/* change end */ } = ng.platformBrowser

/* ... */

/* change start */
platformBrowser().bootstrapModule(AppModule)
/* change end */
```

这时会出现错误：

```text
Uncaught TypeError: Cannot read property 'DOCUMENT' of undefined
Uncaught TypeError: Cannot read property 'ɵPLATFORM_BROWSER_ID' of undefined
Uncaught TypeError: ng.platformBrowser.platformBrowser is not a function
```

第三个错误其实是前两个错误引发的结果，并不需要关心。检查报错位置：

```javascript
var DOCUMENT$1 = /* here */common.DOCUMENT;

/* and */

var INTERNAL_BROWSER_DYNAMIC_PLATFORM_PROVIDERS = [
    platformBrowser.ɵINTERNAL_BROWSER_PLATFORM_PROVIDERS,
    {
        provide: core.COMPILER_OPTIONS,
        useValue: { providers: [{ provide: compiler.ResourceLoader, useClass: ResourceLoaderImpl, deps: [] }] },
        multi: true
    },
    { provide: core.PLATFORM_ID, useValue: /* here */common.ɵPLATFORM_BROWSER_ID },
];
```

所以问题在于 `common` 的缺失。检查 UMD 文件头：

```javascript
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/compiler'), require('@angular/core'), require('@angular/common'), require('@angular/platform-browser')) :
	typeof define === 'function' && define.amd ? define('@angular/platform-browser-dynamic', ['exports', '@angular/compiler', '@angular/core', '@angular/common', '@angular/platform-browser'], factory) :
	(factory((global.ng = global.ng || {}, global.ng.platformBrowserDynamic = {}),global.ng.compiler,global.ng.core,global.ng.common,global.ng.platformBrowser));
}(this, (function (exports,compiler,core,common,platformBrowser) { /* ... */ }
```

可以快速确定 `common` 在 Global fallback 模式<sup>*</sup>下即为 `ng.common`，由 `@angular/common` 这个 package 提供。

> **Global fallback 模式**：UMD 格式提供 CommonJS、AMD 和全局变量三种模块化方案的支持，由于全局变量仅仅在不支持 CommonJS 以及 AMD 的情况下使用，因此可以视作 fallback。

继续添加一个 `<script>` 标签：

```html
<!-- ... -->
<script src="https://unpkg.com/@angular/core"></script>
<!-- change start -->
<script src="https://unpkg.com/@angular/common"></script>
<!-- change end -->
<script src="https://unpkg.com/@angular/platform-browser"></script>
```

正如我们所期望的那样，新的错误为：

```text
StaticInjectorError(Platform: core)[CompilerFactory]: 
  NullInjectorError: No provider for CompilerFactory!
```

很明显，我们缺少 `CompilerFactory` 这个内容。事实上，Angular 和 AngularJS 很大的一点不同是，AngularJS 的模版是基于 DOM 的，HTML 内容会被交给浏览器解析，随后 AngularJS 遍历 DOM 节点来实现自己的功能扩展；而 Angular 中的模版是平台无关的，HTML 内容会被事先编译成视图相关的 JavaScript 代码<sup>*</sup>，而浏览器永远也见不到模版的 HTML 内容。

> **Angular 的模版编译**：2.0 的早期 Alpha 版本中采用过基于浏览器的 Parser 实现，之后被废弃。此后均使用平台无关的自有实现。

因此，Angular 使用了一个功能强大的模版编译器，在不依靠预处理工具的情况下，便需要在浏览器中引入这个编译器，位于 `@angular/compiler`：

```html
<!-- ... -->
<script src="https://unpkg.com/@angular/common"></script>
<!-- change start -->
<script src="https://unpkg.com/@angular/compiler"></script>
<!-- change end -->
<script src="https://unpkg.com/@angular/platform-browser"></script>
<!-- ... -->
```

不过，很遗憾的是，这次错误并没有消失也没有变化。事实上，`@angular/platform-browser` 的 API 仅仅适用于对已经预编译过的 NgModule<sup>*</sup>，而对于无构建工具的在线运行，我们需要使用另一个 API，位于 `@angular/platform-browser-dynamic`。其中的 `PlatformBrowserDynamic` 能够在运行时融合 `PlatformBrowser` 和 `Compiler`，提供运行时动态编译的功能。因此，继续添加一个 `<script>` 标签：

> **@angular/platform-browser 的适用范围**：从技术上而言不同平台仅仅是包含 Provider 的多寡，因此只要能够自行提供 Compiler 实现，仍然可以在 @angular/platform-browser 中使用 JIT 编译方式。

```html
<!-- ... -->
<script src="https://unpkg.com/@angular/platform-browser"></script>
<!-- change start -->
<script src="https://unpkg.com/@angular/platform-browser-dynamic"></script>
<!-- change end -->
<!-- ... -->
```

并将我们的启动代码修改为：

```javascript
/* ... */

/* change start */
const { platformBrowserDynamic } = ng.platformBrowserDynamic
/* change end */

/* ... */

/* change start */
platformBrowserDynamic().bootstrapModule(AppModule)
/* change end */
```

在此之后，我们得到了最后一个错误（八年抗战到最后一年了？）：

```text
Error: In this configuration Angular requires Zone.js
```

这里就十分浅显易懂了，而且解决方案就是如其所述<sup>*</sup>，修改启动配置为：

> **In this configuration Angular requires Zone.js**：实际上显然还有另一种方案，就是引入 Zone.js。此处出于教学目的暂不使用以便于理解 Zone.js 的作用。当前实现中不使用 Zone.js 的方式[仍然存在 BUG](https://github.com/angular/angular/issues/23428)，会产生额外报错。

```javascript
platformBrowserDynamic().bootstrapModule(AppModule/* change start */, { ngZone: 'noop' }/* change end */)
```

之后，我们就能看到我们想要的内容：

```text
Hello Angular
```

## 内容精简

最后，我们可以尝试移除 `AppComponent` 的 `selector`：

```javascript
AppComponent.annotations = [
  new Component({
    /* change start */
    /* change end */
    template: '<h1>Hello Angular</h1>',
  })
]
```

发现应用仍然能够继续工作，这是因为组件默认的 `selector` 即为 `ng-component`，实际应用中并不推荐使用默认选择器。

## 总结

至此，我们在没有使用任何开发工具或语言扩展的情况下，完成了一个最为传统的（只使用 `<script>` 标签引入内容）的 Hello World for Angular 的版本。

## 代码归档

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

<script>
const { Component, NgModule } = ng.core
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
</script>
```

## 在线示例

<iframe src="https://embed.plnkr.co/8CopS7kPXKLB9827KG2M?deferRun" width="100%" height="600px" frameborder="0"></iframe>

## 可能的疑惑

#### Angular 是否能够使用 JavaScript 开发？

要不要再看一遍呢？

#### Angular 是否不推荐使用 JavaScript 开发？

是的，强烈不推荐。

#### 为什么 AppComponent 和 AppModule 类内部没有内容？

因为这只是 Hello World。

#### 是否能够以不用 ES2015（类）的方式使用？

可以，后文中会提及。

#### Angular 是否能够使用 CDN 引入？

要不要再看一遍呢？

#### Angular 是否提供官方 CDN 站点？

不提供，而且也不推荐运行时引入的方式。Angular 的设计理念就是对构建友好，为此具备极佳的 Tree-Shaking 支持，构建后大小与构建前差异很大。

#### Angular 需要多少外部依赖？

1 个或 2 个，取决于是否使用 Zone.js，这里在没有使用 Zone.js 的情况下仅需要 RxJS 一个依赖。

#### Angular 的元数据有几种提供方式？

后文中会提及。

#### NgModule 的意义是什么？

后文中会提及。

#### Angular 有哪些启动方式？

后文中会提及。
