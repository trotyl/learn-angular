# 模版语法

类似于其它很多 MV* 框架，Angular 也是基于模版来定义视图。Angular 的模版严格基于 HTML 语法[^1]，并且扩展了 HTML 的语义以实现更丰富的功能。

显然，我们的目的并不是学习 HTML，所以仅仅需要考虑 Angular 所扩展的部分。为了方便起见，我们再次使用 Angular CLI 创建一个新的 Angular 项目[^2]：

```bash
ng new learn-angular
```

在建成的项目中，存在一个名为 `AppComponent` 的默认组件，我们可以发现在它的模版（`app.component.html`）中，有一处特殊的地方：

```html
<h1>
  Welcome to {{title}}!!
</h1>
```

这里的 `{{title}}` 就是一个 **插值（Interpolation）** 语法。不过，确切的说，插值语法是一个可配置内容，双花括号（`{{ }}`）仅仅是默认的选项。

打开 `app.component.ts`，在 `AppComponent` 的元数据中增加一项 `interpolation` 属性：

```typescript
@Component({
  /* ... */
  interpolation: ['%start%', '%end%'],
})
export class AppComponent { /* ... */ }
```

再次启动应用，我们会发现现在浏览器控制台有报错：

```text
Unexpected character "EOF" (Do you have an unescaped "{" in your template? Use "{{ '{' }}") to escape it.)
```

这个提示确实非常不友好，出现这个报错是由于除了（可选的）双花括号语法用于插值外，Angular 模版中还有单花括号（`{ }`）语法用于 ICU Format[^3]，所以在双括号不用于插值后，我们原有的绑定就变成了一个非法的 ICU Format。解决起来也非常简单，把 `app.component.html` 模版里的双花括号替换成新的插值语法即可：

```html
<h1>
  Welcome to %start%title%end%!!
</h1>
```

虽然这里的新语法非常浮夸，也完全没有任何美感，不过现在我们的应用确实能够正常使用了。不过，虽然插值语法可以自由配置，但是大多数时候完全没有必要，在本文的其它部分以及其它文章中如无特殊说明的情况下均适用默认的插值语法。

上面我们在 Text Node 当中使用了插值语法，不过这并不是唯一能够使用插值的地方，事实上，Attribute Value 中也能进行插值。

由于我们的 `AppComponent` 已经被奇怪的语法所污染，这里我们创建一个新组件，通过 CLI 可以很方便地完成这一操作：

```bash
ng g c interpolation
```

这里的 `g` 和 `c` 分别是 `generate` 和 `component` 的简写，完整的 CLI 命令列表可以参考：[Home · angular/angular-cli Wiki](https://github.com/angular/angular-cli/wiki)。

之后在组件模版中添加：

```html
<img src="{{ avatar }}">
```

并在类定义中添加：

```typescript
/* ... */
export class InterpolationComponent {
  avatar = 'https://avatars0.githubusercontent.com/u/6059170?v=3&s=460'
}
```

之后我们可以看到，什么都没有发生。是的，因为我们并没有任何地方使用这一组件，为此我们在 `AppComponent` 的模版中增加该组件 Selector 对应的元素：

```html
<app-interpolation></app-interpolation>
```

之后就能在应用中看到我们新增的图像了。

如果具备 AngularJS 基础的话，我们可能会怀疑这么做是否合适。在 AngularJS 中，如果我们直接在 `src` 中使用插值的话，会导致一个额外的无效请求，为此推荐使用 `ngSrc` 属性。而在 Angular 中，我们不再有次顾虑，所有插值操作都在实际 DOM 建立之前完成，所以上面的代码并没有任何不对的地方，除了不好看。



---

[^1]: HTML Attribute Name 中，`[]`、`()` 以及 `*` 都是合法的字符，只不过本身没有语义上的行为（即这样的 Attribute 不起作用）。类似的，HTML 不区分大小写也是语义上的行为，并不是语法上的要求，不论是使用大写或者小写字母都是合法的 HTML。

[^2]: 本文中所有的 Angular CLI 项目都以 `learn-angular` 作为项目名，实际使用时可以自行调整以避免命名冲突（如果需要保留原有项目的话），例如增加后缀变成 `learn-angular-1` 等等。

[^3]: ICU 的全称是 International Components for Unicode，主要提供了一系列用于 I18n 的规范和相应的工具，Angular 支持它的一个子集以用于 I18n 内容的处理，ICU Message 的规范可以参考：[Formatting Messages - ICU User Guide](http://userguide.icu-project.org/formatparse/messages)，一个制作精良的在线示例可以参考 [ICU Message Format for Translators](https://format-message.github.io/icu-message-format-for-translators/)。
