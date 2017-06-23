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

这里的 `{{title}}` 就是一个 **插值（Interpolation）** 语法。不过，确切的说，插值语法是一个可配置内容，双花括号（`{{ }}`，Double Curly Braces）仅仅是默认的选项。

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
<img src="https://avatars0.githubusercontent.com/u/{{ avatarId }}?v=3&s=460">
```

并在类定义中添加：

```typescript
/* ... */
export class InterpolationComponent {
  avatarId = 6059170
}
```

之后我们可以看到，什么都没有发生。是的，因为我们并没有任何地方使用这一组件，为此我们在 `AppComponent` 的模版中增加该组件 Selector 对应的元素：

```html
<app-interpolation></app-interpolation>
```

之后就能在应用中看到我们新增的图像了。

如果具备 AngularJS 基础的话，我们可能会怀疑这么做是否合适。在 AngularJS 中，如果我们直接在 `src` 中使用插值的话，会导致一个额外的无效请求，为此推荐使用 `ngSrc` 属性。而在 Angular 中，我们不再有次顾虑，所有插值操作都在实际 DOM 建立之前完成，所以上面的代码并没有任何不对的地方。

上面的模版代码中，大部分内容都是当作普通的 HTML 处理的，但是当使用了插值语法时，插值符号中的部分被称为 **模版表达式（Template Expression）**，其内容将不再作为字面值，而是作为 JavaScript[^4] 表达式进行处理，整个表达式的值会被转换成字符串与插值符号以外的内容相连接，从而产生实际内容。并且插值符号本身也不会出现在实际内容中，仅仅用于指示插值的存在。模版表达式的一个特性是无副作用，即对模版表达式的执行不会改变组件的状态，这是 Angular 的要求之一。

除此之外，我们也可以直接绑定表达式：

```html
<img [src]="'https://avatars0.githubusercontent.com/u/' + avatarId + '?v=3&s=460'">
```

或者

```html
<img bind-src="'https://avatars0.githubusercontent.com/u/' + avatarId + '?v=3&s=460'">
```

这样的情况下，HTML Attribute 所对应的 Value 部分直接作为模版表达式，而不再需要使用插值语法。

对于表达式属性绑定，Angular 提供了两种方式，一种是使用方括号 `[]`，另一种是 `bind-` 前缀。通常来说，使用方括号要更加简洁美观[^5]，因此在没有特殊说明的情况下，我们的表达式属性绑定均使用方括号的语法来进行。

这里也是和 AngularJS 有一定的区别的地方。在 AngularJS 中，一个属性值作为字面值还是表达式执行是由指令本身所预设的，通过 DDO 中的 `scope` 或 `bindToController` 属性中使用相应的符号[^5] 来决定。而在 Angular 中，使用了更为通用的模版设计，组件本身仅仅要求属性存在与否，而使用者可以根据需实际情况选择使用的方式。

那么我们可能会好奇的是：

```html
<element attr="{{value}}">
```

与

```html
<element [attr]="value">
```

是否等价呢？

不过答案的否定的。

事实上，我们可以认为：

```html
<element attr="{{value}}">
```

等价于：

```html
<element [attr]="value.toString()">
```

即 **使用插值的 Attribute Value 所对应的属性绑定结果一定是字符串**。而属性绑定本身（对于 Angular Directive 而言）可以是任何类型，并且 Angular 会对属性绑定进行类型检查，确保输入的类型相符。

除了属性绑定外，还有一个很方便的语法称为 **事件绑定（）**，使用圆括号 `()`或者 `on-` 前缀[^6]定义，我们可以为我们的图片绑定 `(click)` 事件：

```html
<img [src]="'https://avatars0.githubusercontent.com/u/' + avatarId + '?v=3&s=460'" (click)="avatarId = avatarId + 1">
```

或者

```html
<img bind-src="'https://avatars0.githubusercontent.com/u/' + avatarId + '?v=3&s=460'" on-click="avatarId = avatarId + 1">
```

当然，由于我无法得知之后的用户都用的什么头像，所以如果出现不适宜的内容也与本文无关哦。

## 可能的疑惑

#### 为什么 AngularJS 中不适合在 src 属性中插值？

AngularJS 使用的是基于 DOM 的模版，也就是说，模版会先被浏览器渲染成 DOM 树，之后 AngularJS 通过 DOM API 来寻找使用了插值的地方并进行修改。而浏览器对 img 内容的获取是在页面渲染过程中自动进行的，所以在这种模式下，会产生对包含模版内容的错误地址（例如 https://avatars0.githubusercontent.com/u/{{avatarId}}?v=3&s=460）进行请求，从而引发不必要的错误。

#### 为什么属性绑定和事件绑定也叫输入绑定和输出绑定？

我们知道（不知道的下一节也会知道），指令的属性绑定和事件绑定分别使用 `@Input()` 和 `@Output()`（或元数据中的 `host` 属性）来定义，所以可以简单地意会为输入和输出。不过从功能上，属性绑定也是完全可以实现输出功能的，例如主动传入一个 `EventEmitter` 作为输入。

但是问题来了，这是只表明了 **输入** 和 **输出**，那么 **属性** 和 **事件** 的概念是哪里来的呢？

事实上，在现有的语法之前，Angular 使用过 `@Property()` 和 `@Event()` 作为装饰器的名称，之后才 [改为](https://github.com/angular/angular/pull/4435) 现有语法的，而且在语法的最终版本上也经过了很多激烈的讨论。除此之外，称做属性绑定和事件绑定也符合语义上的行为，便于理解。

#### Angular 是如何确定事件绑定的事件源是 DOM 事件还是用户声明事件的？

实际上 Angular 自始至终都无法得知事件绑定的事件来源，该内容会在下一节覆盖。

---

[^1]: HTML Attribute Name 中，`[]`、`()` 以及 `*` 都是合法的字符，只不过本身没有语义上的行为（即这样的 Attribute 不起作用）。类似的，HTML 不区分大小写也是语义上的行为，并不是语法上的要求，不论是使用大写或者小写字母都是合法的 HTML。

[^2]: 本文中所有的 Angular CLI 项目都以 `learn-angular` 作为项目名，实际使用时可以自行调整以避免命名冲突（如果需要保留原有项目的话），例如增加后缀变成 `learn-angular-1` 等等。

[^3]: ICU 的全称是 International Components for Unicode，主要提供了一系列用于 I18n 的规范和相应的工具，Angular 支持它的一个子集以用于 I18n 内容的处理，ICU Message 的规范可以参考：[Formatting Messages - ICU User Guide](http://userguide.icu-project.org/formatparse/messages)，一个制作精良的在线示例可以参考 [ICU Message Format for Translators](https://format-message.github.io/icu-message-format-for-translators/)。

[^4]: 模版表达式所支持的部分确切的说是 JavaScript 的子集以及一些额外扩展，存在一些语法限制，详情参见：[Angular - linkTemplate Syntax#Template expressions](https://angular.io/guide/template-syntax#template-expressions)

[^5]: 在属性本身为 camelCase 的情况下，使用 kebab-case 的前缀会让风格显得很奇怪，例如 `bind-ngClass="{ 'foo': true }"`，虽然也可以使用让属性本身使用 kebab-case，但那样需要额外的配置且增加认知成本。所以一般情况下 Angular 推荐使用 camelCase 来设计属性名，并且使用 `[]` 语法来进行表达式属性绑定。

[^6]: 使用 `on-` 前缀进行事件绑定时，要确保没有遗漏最后的连字符，否则将使用原生的事件绑定。
