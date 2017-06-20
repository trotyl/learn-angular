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

---

[^1]: HTML Attribute Name 中，`[]`、`()` 以及 `*` 都是合法的字符，只不过本身没有语义上的行为（即这样的 Attribute 不起作用）。类似的，HTML 不区分大小写也是语义上的行为，并不是语法上的要求，不论是使用大写或者小写字母都是合法的 HTML。

[^2]: 本文中所有的 Angular CLI 项目都以 `learn-angular` 作为项目名，实际使用时可以自行调整以避免命名冲突（如果需要保留原有项目的话），例如增加后缀变成 `learn-angular-1` 等等。
