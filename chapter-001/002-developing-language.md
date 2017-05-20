# 开发语言

当我们说到 Angular 的开发语言的时候，我们可能指：

1. Angular 源代码所使用的语言；
2. 基于 Angular 的项目所需要使用的语言。

大部分时候我们往往指代的是后者。

Angular 项目本身是用 **TypeScript** 或 **Dart** 开发的。咦，为什么是「或」？其实在 2.0.0-rc.5 版本之前，Angular 的 **TypeScript** 版本和 **Dart** 版本是共用的同一个 Code Base[^1]，绝大部分公共代码采用 **TypeScript** 编写，并编译[^2]成 **Dart** 代码，另有少部分非共用代码分别使用 **TypeScript** 和 **Dart** 实现。

之后由于各种原因，Angular 的 **Dart** 版本不再与 **TypeScript** 版本共用代码，从而成为了独立实现。不过事实上，除了 Google 的内部产品外，很少有其它项目会使用 Dart 版本的 Angular 来进行开发。

因此，在本书中，如无特殊说明，所有用到 Angular 的地方均指代 TypeScript 实现的版本。如果有 Dart 版本明显不一致的地方，会在脚注中表明（如果我知道的话）。

在说到 TypeScript 之前，不得不提及的一门语言是 AtScript。

---

[^1]: 分离前 Dart 版实现的源码也位于 [angular/angular](https://github.com/angular/angular) 的 GitHub 当中，同时 [dart-lang/angular2](https://github.com/dart-lang/angular2) 充当编译后的纯 Dart 代码的存档。之后即作为 Dart 实现的源码 Repo 使用。

[^2]: Angular 团队自行开发了 TypeScript 到 Dart 的编译工具，详情参考：[Angular 2 Dart Transformer](https://docs.google.com/document/d/1Oe7m96QnOrilxpH1B5o9G_PnfBGovhH-n_o7RU6LYII/)。
