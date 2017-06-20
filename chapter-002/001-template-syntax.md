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

虽然这里的新语法非常浮夸，也完全没有美感，不过现在我们的应用确实能够正常使用了。不过，虽然插值语法可以自由配置，但是大多数时候完全没有必要，在本文的其它部分以及其它文章中如无特殊说明的情况下均适用默认的插值语法。



---

[^1]: HTML Attribute Name 中，`[]`、`()` 以及 `*` 都是合法的字符，只不过本身没有语义上的行为（即这样的 Attribute 不起作用）。类似的，HTML 不区分大小写也是语义上的行为，并不是语法上的要求，不论是使用大写或者小写字母都是合法的 HTML。

[^2]: 本文中所有的 Angular CLI 项目都以 `learn-angular` 作为项目名，实际使用时可以自行调整以避免命名冲突（如果需要保留原有项目的话），例如增加后缀变成 `learn-angular-1` 等等。

[^3]: ICU 的全称是 International Components for Unicode，主要提供了一系列用于 I18n 的规范和相应的工具，Angular 支持它的一个子集以用于 I18n 内容的处理，ICU Message 的规范可以参考：[Formatting Messages - ICU User Guide](http://userguide.icu-project.org/formatparse/messages)，一个制作精良的在线示例可以参考 [ICU Message Format for Translators](https://format-message.github.io/icu-message-format-for-translators/)。
