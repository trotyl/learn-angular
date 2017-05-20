# 开发语言

当我们说到 Angular 的开发语言的时候，我们可能指：

1. Angular 源代码所使用的语言；
2. 基于 Angular 的项目所需要使用的语言。

大部分时候我们往往指代的是后者。

Angular 项目本身是用 TypeScript 或 Dart 开发的。咦，为什么是「或」？其实在 2.0.0-rc.5 版本之前，Angular 的 TypeScript 版本和 Dart 版本是共用的同一个 Code Base[^1]，绝大部分公共代码采用 TypeScript 编写，并编译[^2]成 Dart 代码，另有少部分非共用代码分别使用 TypeScript 和 Dart 实现。

之后由于各种原因，Angular 的 Dart 版本不再与 TypeScript 版本共用代码，从而成为了独立实现。不过事实上，除了 Google 的内部产品外，很少有其它项目会使用 Dart 版本的 Angular 来进行开发。

因此，在本书中，如无特殊说明，所有用到 Angular 的地方均指代 TypeScript 实现的版本。如果有 Dart 版本明显不一致的地方，会在脚注中表明（前提是我知道的话）。

在说到 TypeScript 之前，不得不提及的一门语言是 AtScript[^3]。

Angular 的一个重要设计理念就是 **Declarative（声明式）** 编程，为了落实这一理念，Angular 在 API 设计上的一个重大改进就是很大程度上基于[^4] `@Something` 的 **Annotation（注解）**／**Decorator（装饰器）** 语法。

那么，这个语法到底是 **Annotation** 还是 **Decorator** 呢？

事实上，在 Angular 早期设计的时候，ES6 都还不知道是不是 ES2015，更别说之后的各种语言提案。因此，AtScript 自行扩展一个叫做 **Metadata Annotation**[^5] 的语法，用于附加额外的 **Metadata**，实现也非常简单：

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

可以看出，所有的标注信息都被附加到运行时[^6]中，即具备 **Type Introspection（内省）** 的能力。当然，这么做仅仅是附加信息，本身并不能提供任何功能，而是由其它使用该内容的代码根据相应的数据来动态确定行为。这种方式非常类似于 Java 的 **Annotation** 或者 C# 的 **Attribute**。

随后在 NG-Conf 2015 上，Angular 团队宣布了迁移至 TypeScript 的消息[^7]。在 Angular 团队与 TypeScript 团队的合作计划中，TypeScript 将增加 **Metadata Annotation** 的语法以及对应的 **Introspection API**[^8]。

不过，这件事最后并没有发生。随着 ES2015 的正式发布，JavaScript 语言开始进入稳定的持续迭代发展阶段，TypeScript 也不再接受新的语言特性，而是仅仅提供对 JavaScript 语言特性的支持以及提供相应的类型检查。于是 TypeScript 最后增加了对语法相似（但是语义完全不同）的 **Decorator** 特性的支持（**Decorator** 本身是 JavaScript 的语言提案，并不是 TypeScript 的扩展内容），而 Angular 也将相应的 API 改用 **Decorator** 实现。不过对于一般用户而言，这个重大的改动似乎并没有什么实际影响（以及在 2015 年的时候实际上也没有多少用户存在）。

此外，为了解决 Angular 需要运行时获取构造函数参数信息的问题（关于 **Dependency Injection** 的内容会在之后的部分覆盖），TypeScript 提供了一个新的编译器选项 `emitDecoratorMetadata`，为具备 **Decorator** 的 Class 暴露构造函数参数信息，默认情况下是基于 **Metadata Reflection API**[^9] 所实现的，后者是一个还不是语言提案的「提案」。

// TODO

---

[^1]: 分离前 Dart 版实现的源码也位于 [angular/angular](https://github.com/angular/angular) 的 GitHub 当中，同时 [dart-lang/angular2](https://github.com/dart-lang/angular2) 充当编译后的纯 Dart 代码的存档。之后即作为 Dart 实现的源码 Repo 使用。

[^2]: Angular 团队自行开发了 TypeScript 到 Dart 的编译工具，详情参考：[Angular 2 Dart Transformer](https://docs.google.com/document/d/1Oe7m96QnOrilxpH1B5o9G_PnfBGovhH-n_o7RU6LYII/)，相应的实现在 [angular/ts2dart](https://github.com/angular/ts2dart)。

[^3]: AtScript 是专门为开发 Angular 所设计的语言，因此在 Angular 团队决定迁移到 TypeScript 之后，该语言即被宣布废弃。官网在 [AtScript Primer](http://atscript.org/)，扩展名为 `.ats`。

[^4]: 正如我们在第一节中尝试过的那样，Angular 并不要求使用 Decorator 语法，只是在使用该语法的情况下能够大量提高代码可读性，提高开发效率。

[^5]: Annotation 并不仅仅表示 `@Something` 这样的内容，这种情况下通常译作「注解」，AtScript 中叫做 Metadata Annotation；而 `name: string` 这样的内容一般叫做 Type Annotation，译作「类型标注」。

[^6]: AtScript 的一个独特的功能就是运行时的类型检查，这点和 TypeScript 纯粹的编译时检查不同，即便是直接使用编译后的 JavaScript 代码也同样能保证类型安全。

[^7]: Twitter 链接为：[ng-conf on Twitter: "AtScript is Typescript #ngconf"
](https://twitter.com/ngconf/status/573521849780305920)。

[^8]: 原计划中的 TypeScript Introspection API 设计文档：[TypeScript Introspection API](https://docs.google.com/document/d/1fvwKPz7z7O5gC5EZjTJBKotmOtAbd3mP5Net60k9lu8/edit#heading=h.v7s5x1d7wo5j)。

[^9]: 提案所在 Repo 为：[rbuckton/reflect-metadata](https://github.com/rbuckton/reflect-metadata)，文档在：[Metadata Proposal - ECMAScript](https://rbuckton.github.io/reflect-metadata/)。
