# [^5]Learn Angular the hard way

早在 2009 年，谷歌发布了 AngularJS[^1]，引发了 Web 开发模式的重大变革，其创新性的双向数据绑定让开发 Web 应用的难度极大简化，开发效率极大地提高，同时也大大推进了前后端分离的浪潮。

虽然具备着重大的历史意义，但随着时间的推移，AngularJS 中的很多设计及实现也逐渐演变为历史负担，其中的缺陷也不断显现出来，其中的问题包括但不仅限于性能问题、缺乏跨平台运行能力以及臃肿的 API 设计等。

与其同时，Web 前端开发环境也在不断演进。过去，人们往往靠着手动引入 `<script>` 标签以及控制引入顺序来完成「链接[^2]」过程；而现在，JavaScript 语言提供了标准的模块系统，需要引入的文件由依赖关系自动确定[^3]。过去，JavaScript 的语法十分匮乏，程序开发中需要引入大量的语法噪音；而现在，随着 ECMAScript 2015、ECMAScript 2016、ECMAScript 2017[^4] 的发布，JavaScript 不仅引入了（表面上的）面向对象支持，还引入了 Promise 以简化异步操作等，大大降低了 Web 应用的开发成本。前端开发领域已经由原先的网页脚本逐步转变为一套完整的工程实践。

为此，谷歌于 2016 年正式发布了 Angular 框架，作为 AngularJS 的后继者，在保持了 AngularJS 开发风格的基础上，不仅解决了 AngularJS 现有的遗留问题，同时扩展了开发领域[^5]并且提供了更完善的功能和性能支持。

本书的目的在于对 Angular 提供超过官方文档的详细介绍以及完整剖析，同时会尽可能保证绝对的严谨性，不会为了简化内容而混淆概念，需要特别注意的部分以及相关的外部内容都会在脚注中给出。

因此，**本书并不是快速入门（QuickStart），而是慢速入门（SlowStart），请根据自己的实际需要阅读**。

---

[^1]: 谷歌于 2009 年发布的 JavaScript 框架叫做 AngularJS，官网为 [angularjs.org](https://angularjs.org)，代码库为 [angular/angular.js](https://github.com/angular/angular.js)；而 2016 年发布的 JavaScript 开发平台叫做 Angular，官网为 [angular.io](https://angular.io)，代码库为 [angular/angular](https://github.com/angular/angular)。关于两者名称的使用可以参考 [Branding Guidelines for Angular and AngularJS](http://angularjs.blogspot.hk/2017/01/branding-guidelines-for-angular-and.html)。

[^2]: 对于支持多文件的开发语言来说，从源代码到可执行文件往往需要经历「[编译](https://en.wikipedia.org/wiki/Compiler)」（Compilation）和「[链接](https://en.wikipedia.org/wiki/Linker_(computing)\)」（Linking）两个步骤，而 JavaScript 虽然没有显式的「链接」过程，但实际的「链接」过程（文件间的交互）是通过 JavaScript 引擎提供的全局作用域来完成的，先引入的文件暴露某个变量从而供后引入的文件使用，因此对文件的引入顺序也会有严格要求。

[^3]: 目前浏览器对 ES Module 的 [原生支持](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) 仍然不够完善（本文写作时只有 Safari、Firefox 和 Edge 提供支持，且后两者需要手动开启），因此往往需要借助构建工具来预处理源代码从而模拟出相同的行为。常用的构建工具有 Webpack、Rollup 和 SystemJS 等。

[^4]: ECMAScript 2017，简称 ES2017 或 ES8，已经通过 TC39 表决通过并提交到 ECMA，正式发布时间预期为 2017 年第二季度到第三季度间。更多详细内容可以参见 [ECMA, TC39 Meeting Notes](https://github.com/rwaldron/tc39-notes/blob/master/es8/2017-03/summary.md)。

[^5]: Angular 的定位为开发平台而非 Web 框架，例如 Angular 也可用于移动端应用的开发等，可以参考 [NativeScript](https://www.nativescript.org/)、[ionic](http://ionicframework.com/) 等。

