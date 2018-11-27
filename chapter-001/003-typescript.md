# TypeScript

// TODO: everything

当我们说到 Angular 的开发语言的时候，我们可能指：

1. Angular 源代码所使用的语言；
2. 基于 Angular 的项目所需要使用的语言。

大部分时候我们往往指代的是后者。

Angular 项目本身是用 TypeScript<sup>*</sup> 或 Dart<sup>*</sup> 开发的。咦，为什么是「或」？其实在 `2.0.0-rc.5` 版本之前，Angular 的 TypeScript 版本和 Dart 版本是共用的同一个 Code Base<sup>*</sup>，绝大部分公共代码采用 TypeScript 编写，并编译<sup>*</sup>成 Dart 代码，另有少部分非共用代码分别使用 TypeScript 和 Dart 实现。

> **TypeScript**：TypeScript 是 Microsoft 推出的一门基于 JavaScript 语言扩展的类 JavaScript 语言，用于增强 JavaScript 工程中的静态类型检查效果。官网为：[TypeScript - JavaScript that scales](http://www.typescriptlang.org/)，语言规范为：[TypeScript Language Specification（不是最新）](https://github.com/Microsoft/TypeScript/blob/master/doc/spec.md)。在本文中，我们可能不严格区分 TypeScript 这门语言与其 [官方实现](https://github.com/Microsoft/TypeScript)。

> **Dart**：Dart 是 Google 推出的一门通用编程语言，主要面向 Web 开发。官网为：[Dart programming language | Dart](https://www.dartlang.org/)，语言规范为：[Standard ECMA-408](http://www.ecma-international.org/publications/standards/Ecma-408-arch.htm)。在本文中，我们可能不严格区分 Dart 这门语言与其 [官方实现](https://github.com/dart-lang/sdk)。

> **同一 Code Base**：分离前 Dart 版实现的源码也位于 [angular/angular](https://github.com/angular/angular) 的 GitHub 当中，同时 [dart-lang/angular2](https://github.com/dart-lang/angular2) 充当编译后的纯 Dart 代码的存档。之后即作为 Dart 实现的源码 Repo 使用。

> **编译至 Dart**：Angular 团队自行开发了 TypeScript 到 Dart 的编译工具，详情参考：[Angular 2 Dart Transformer](https://docs.google.com/document/d/1Oe7m96QnOrilxpH1B5o9G_PnfBGovhH-n_o7RU6LYII/)，相应的实现在 [angular/ts2dart](https://github.com/angular/ts2dart)。

之后由于各种原因，Angular 的 Dart 版本不再与 TypeScript 版本共用代码，从而成为了独立实现。不过事实上，除了 Google 的内部产品外，很少有其它项目会使用 Dart 版本的 Angular 来进行开发。

因此，在本书中，如无特殊说明，所有用到 Angular 的地方均指代 TypeScript 实现的版本。如果有 Dart 版本明显不一致的地方，会在脚注中表明（前提是我知道的话）。

在说到 TypeScript 之前，不得不提及的一门语言是 AtScript<sup>*</sup>。

> **AtScript**：AtScript 是专门为开发 Angular 所设计的语言，因此在 Angular 团队决定迁移到 TypeScript 之后，该语言即被宣布废弃。官方文档在 [AtScript Primer](https://docs.google.com/document/d/11YUzC-1d0V1-Q3V0fQ7KSit97HnZoKVygDxpWzEYW0U/edit)，扩展名仍为 `.js`。

Angular 的一个重要设计理念就是 **声明式(Declarative)** 编程，为了落实这一理念，Angular 在 API 设计上的一个重大改进就是很大程度上基于<sup>*</sup> `@Something` 的 **注解(Annotation)**／**装饰器(Decorator)** 的声明语法。

> **基于装饰器**：正如我们在上一节中尝试过的那样，Angular 并不要求使用 Decorator 语法，只是在使用该语法的情况下能够大量提高代码可读性，提高开发效率。

那么，这个语法到底是注解还是装饰器呢？

事实上，在 Angular 早期设计的时候，ES6 都还不知道是不是 ES2015，更不用说之后的各种语言提案。因此，AtScript 自行扩展一个叫做 **Metadata Annotation**<sup>*</sup> 的语法，用于附加额外的元数据，实现也非常简单：

> **Metadata Annotation**：Annotation 并不仅仅指代 `@Something` 这样的语法，这种情况下被 AtScript 中叫做 Metadata Annotation，通常译作「注解」；而 `name: string` 也是 Annotation，更具体一点称为 Type Annotation，通常译作「类型标注」。

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

可以看出，所有的标注信息都被附加到运行时<sup>*</sup>中，即具备 **内省(Type Introspection)** 的能力。当然，这么做仅仅是附加信息，本身并不能提供任何功能，而是由其它使用该内容的代码根据相应的数据来动态确定行为。这种方式非常类似于 Java 的 **Annotation** 或者 C# 的 **Attribute**。

> **运行时类型标注**：AtScript 的一个独特的功能就是运行时的类型检查，这点和 TypeScript 纯粹的编译时检查不同，即便是直接使用编译后的 JavaScript 代码也同样能保证类型安全性。

随后在 NG-Conf 2015 上，Angular 团队宣布了迁移至 TypeScript 的消息<sup>*</sup>。在 Angular 团队与 TypeScript 团队的合作计划中，TypeScript 将增加 **Metadata Annotation** 的语法以及对应的 **Introspection API**<sup>*</sup>。

> **迁移至 TypeScript**：Twitter 链接为 [ng-conf on Twitter: "AtScript is Typescript #ngconf"
](https://twitter.com/ngconf/status/573521849780305920)。

> **Introspection API**：原计划中的 TypeScript Introspection API 设计文档：[TypeScript Introspection API](https://docs.google.com/document/d/1fvwKPz7z7O5gC5EZjTJBKotmOtAbd3mP5Net60k9lu8/edit#heading=h.v7s5x1d7wo5j)。

不过，这件事最后并未发生。随着 ES2015 的正式发布，JavaScript 语言开始进入稳定的持续迭代发展阶段，TypeScript 也不再接受新的语言特性，而是仅仅提供对 JavaScript 语言特性的支持以及提供相应的类型检查。于是 TypeScript 最后增加了对语法相似（但是语义完全不同）的装饰器特性的支持（装饰器本身是 JavaScript 的语言提案，并不是 TypeScript 的扩展内容），而 Angular 也将相应的 API 改用装饰器实现<sup>*</sup>。不过对于一般用户而言，这个重大的改动似乎并没有什么实际影响（以及在 2015 年的时候实际上也没有多少用户存在）。

> **改用装饰器实现**：AtScript 原有的 Metadata Annotation 的功能基本可以通过 JavaScript 的 Decorator 模拟实现，改动后的 Re-design 文档可以参见：[Decorators vs Metadata Annotations](https://docs.google.com/document/d/1QchMCOhxsNVQz2zNvmzy8ibDMPT46MLf79X1QiDc_fU/edit)。

此外，为了解决 Angular 需要运行时获取构造函数参数信息的问题（关于 **依赖注入(Dependency Injection)** 的内容会在之后的部分详述），TypeScript 提供了一个新的编译器选项 `emitDecoratorMetadata`，为具备装饰器的类暴露构造函数参数信息，默认情况下是基于 **Metadata Reflection API**<sup>*</sup> 所实现的，后者是一个还没有提交的「语言提案」。

> **Metadata Reflection API**：所在 Repo 为 [rbuckton/reflect-metadata](https://github.com/rbuckton/reflect-metadata)，文档位于 [Metadata Proposal - ECMAScript](https://rbuckton.github.io/reflect-metadata/)。目前并未提交给 TC39，所以不属于任何 Stage。

于是现在我们解决了第一个问题，Angular（我们所关心的那个实现）是使用 TypeScript 所开发的。那么接下来的另一个问题是，基于 Angular 的项目是否需要使用 TypeScript 开发呢？

是也不是。在上一节中我们已经尝试过使用 Pure JavaScript 来开发一个简单的 Angular 应用，所以使用 JavaScript 来开发在技术上是切实可行的。但是我们知道，TypeScript 具备很多优势，例如提供了编译时的静态类型检查，提供了最新的（以及提案中的）的 JavaScript 语言特性的转译支持，提供了完善的语言服务集成等等。

不过其实这些都不是重点，最重要的地方时，Angular 的静态编译工具是基于 TypeScript 封装实现的，也就是说，在不使用 TypeScript 工具链的情况<sup>*</sup>下，便无法在开发时使用 Angular 的模版编译器<sup>*</sup>，从而无法构建出适合生产环境使用的发行版本。

> **无法 AOT 的情况**：更确切地说 AOT 编译的限制还有必须使用 Decorator 语法。

> **开发时编译**：对于 Angular 而言，在应用执行前（通常为开发时）预先编译模版内容的方式叫做 AOT（Ahead-of-time）编译，在应用执行过程中（运行时）编译模版内容的方式叫做 JIT（Just-in-time）编译，如无特殊说明，本文中的编译方式均指代 Angular 模版编译器的编译方式。

所以说，就目前的客观事实下，如果想用 Angular 开发实际项目，那么就应该使用 TypeScript。
