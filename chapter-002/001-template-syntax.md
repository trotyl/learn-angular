# 模版语法

类似于其它很多 MV* 框架，Angular 也是基于模版来定义视图。Angular 的模版严格基于 HTML 语法[^1]，并且扩展了 HTML 的语义以实现更丰富的功能。

显然，我们的目的并不是学习 HTML，所以仅仅需要考虑 Angular 所扩展的部分及其所具备的语义。为了方便起见，我们再次使用 Angular CLI 创建一个新的 Angular 项目[^2]：

```bash
ng new learn-angular
```

## 插值／Interpolation

在建成的项目中，存在一个名为 `AppComponent` 的默认组件，我们可以发现在它的模版（`app.component.html`）中，有一处特殊的地方：

```html
<h1>Welcome to {{title}}!!</h1>
```

这里的 `{{title}}` 就是一个 **插值（Interpolation）** 语法。

既然叫做插值，某种意义上来说也就是字符串的拼接，所以假设上面的内容作为字符串模版的话，实现类似于：

```typescript
const { title } = context
const html = `<h1>Welcome to ${title}!!</h1>`
```

如果使用 Vritual DOM 实现，效果类似于：

```typescript
const element = createElement('h1', {}, `Welcome to ${title}!!`)
```

所以，不论如何，`Welcome to {{title}}!!` 部分都将作为一个内容整体称为 `h1` 元素的内容，而 `{{title}}` 会被某个名为 `title` 的变量所替换。

不过，在 Angular 中，插值语法是一个可配置内容，双花括号（`{{ }}`，Double Curly Braces）仅仅是默认的选项。

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
<h1>Welcome to %start%title%end%!!</h1>
```

虽然这里的新语法非常浮夸，也完全没有任何美感，不过现在我们的应用确实能够正常使用了。不过，虽然插值语法可以自由配置，但是大多数时候完全没有必要，在本文的其它部分以及其它文章中如无特殊说明的情况下均适用默认的插值语法。

上面我们在 Text Node 当中使用了插值语法，不过这并不是唯一能够使用插值的地方，事实上，Attribute Value 中也能进行插值。

由于我们的 `AppComponent` 已经被奇怪的语法所污染，这里我们创建一个新组件，通过 CLI 可以很方便地完成这一操作：

```bash
ng g c template-syntax
```

这里的 `g` 和 `c` 分别是 `generate` 和 `component` 的简写，完整的 CLI 命令列表可以参考：[Home · angular/angular-cli Wiki](https://github.com/angular/angular-cli/wiki)。

之后在组件模版中添加：

```html
<img src="https://avatars0.githubusercontent.com/u/{{ avatarId }}?v=3&s=460">
```

并在类定义中添加：

```typescript
/* ... */
export class TemplateSyntaxComponent {
  avatarId = 6059170
}
```

之后我们可以看到，什么都没有发生。是的，因为我们并没有任何地方使用这一组件，为此我们在 `AppComponent` 的模版中增加该组件 Selector 对应的元素：

```html
<app-template-syntax></app-template-syntax>
```

之后就能在应用中看到我们新增的图像了。

如果具备 AngularJS 基础的话，我们可能会怀疑这么做是否合适。在 AngularJS 中，如果我们直接在 `src` 中使用插值的话，会导致一个额外的无效请求，为此推荐使用 `ngSrc` 属性。而在 Angular 中，我们不再有次顾虑，所有插值操作都在实际 DOM 建立之前完成，所以上面的代码并没有任何不对的地方。

上面的模版代码中，大部分内容都是当作普通的 HTML 处理的，但是当使用了插值语法时，插值符号中的部分被称为 **模版表达式（Template Expression）**，其内容将不再作为字面值，而是作为 JavaScript[^4] 表达式进行处理，整个表达式的值会被转换成字符串与插值符号以外的内容相连接，从而产生实际内容。并且插值符号本身也不会出现在实际内容中，仅仅用于指示插值的存在。模版表达式的一个特性是无副作用，即对模版表达式的执行不会改变组件的状态，这是 Angular 的要求之一。

### 属性绑定／Property Binding

对于 DOM Element 而言，除了对其 HTML Attribute 进行插值外，我们也可以直接对其 Property 绑定表达式：

```html
<img [src]="'https://avatars0.githubusercontent.com/u/' + avatarId + '?v=3&s=460'">
```

或者

```html
<img bind-src="'https://avatars0.githubusercontent.com/u/' + avatarId + '?v=3&s=460'">
```

这样的情况下，HTML Attribute 所对应的 Value 部分直接作为模版表达式，而不再需要使用插值语法。

对于 **表达式属性绑定**，Angular 提供了两种方式，一种是使用方括号 `[]`，另一种是 `bind-` 前缀。通常来说，使用方括号要更加简洁美观[^5]，因此在没有特殊说明的情况下，我们的表达式属性绑定均使用方括号的语法来进行。

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

有一点需要注意的是，**属性绑定中使用的是 DOM Property 而非 HTML Attribute**，对于 img 的 src 来说，由于其 HTML Attribute 和 DOM Property 的形式完全相同，所以这里没有差异。

为此我们也可以使用更强大的功能，例如直接绑定 HTML 文档。例如在 `template-syntax.component.html` 中使用：

```html
<div [innerHTML]="content"></div>
```

以及在 `template-syntax.component.ts` 中定义相应的属性：

```typescript
content = `
  <ul>
    <li>1
    <li>2
    <li>3
  </ul>
`
```

这样[^6]就能在组件视图中添加一个列表元素。

除了 **表达式属性绑定**，我们也可以使用 **字面值属性绑定**，简单地说也就是不加方括号，看起来就类似于普通的 HTML Attribute，不过针对的不是 HTML Element，而仅限于 Angular Directive[^7]。

为此我们将 `template-syntax.component.ts` 调整为：

```typescript
/* ... */
export class TemplateSyntaxComponent {
  @Input()
  content: string
  /* ... */
}
```

其中 `Input` 是 `@angular/core` 中定义的一个 Decorator Factory，用于构造 Property Decorator。

这样我们为 `TemplateSyntaxComponent` 定义了一个 **输入属性（Input Property）**，这时如果我们刷新浏览器，会发现我们并没有看到任何额外内容，因为没有任何地方真的传递了 `content` 的内容。

为此我们修改 `app.component.html`，增加 `content` 这个实际上作为 Property 的 Attribute：

```html
<app-template-syntax content="<ul><li>1<li>2<li>3</ul>"></app-template-syntax>
```

接着就能在浏览器中重新观察到我们的列表了。

需要注意的是，这里因为绑定的内容就是 HTML Attribute Value 的字面值，所以并没有使用方括号语法。

如果使用方括号的话，就可以写成：

```html
<app-template-syntax [content]="'<ul><li>1<li>2<li>3</ul>'"></app-template-syntax>
```

因为这时的 HTML Attribute Value 是作为一个表达式，所以只有引号内的部分才是字符串。

我们可以认为：

```html
<element attr="value"></element>
```

等价于：

```html
<elemtn [attr]="'value'"></element>
```

因此对于本身可接受字符串类型的输入属性，我们可以不使用方括号进行绑定，例如常见的 [`RouterLink`](https://angular.io/api/router/RouterLink) 等。

实际上，对于 Angular Directive 的输入属性，我们也能够自定义外部使用时的 Property Name。例如，如果将 `template-syntax.component.ts` 再次调整为：

```typescript
/* ... */
export class TemplateSyntaxComponent {
  @Input('foo-bar')
  content: string
  /* ... */
}
```

那么 `content` 这个 Property 所对应的 HTML Attribute 就是 `foo-bar` 了，所以我们同样需要修改 `app.component.html` 为：

```html
<app-template-syntax foo-bar="<ul><li>1<li>2<li>3</ul>"></app-template-syntax>
```

以保证名称相对应。

目前为止，在 `app.component.html` 中，使用的 `content` 和 `foo-bar` 这两个 HTML Attribute 都是作为 `TemplateSyntaxComponent` 这个 Directive 的 Property。不过，我们也可以仅仅作为 Attribute 使用，修改 `template-syntax.component.ts` 为：

```typescript
/* ... */
export class TemplateSyntaxComponent {
  content: string

  constructor(@Attribute('foo-bar') fooBar: string) {
    this.content = fooBar
  }  
  /* ... */
}
```

我们可以发现应用仍然是正常工作的，不过我们这里用的是注入的 Attribute 而非绑定的 Property，所以外部模版中也无法使用 `[foo-bar]="..."` 的形式。另外，对于 Attribute 而言，只可能是字符串而不可能是别的类型。

### 特性绑定／Attribute Binding

*翻译 Property 和 Attribute 是一件很麻烦的事情，这里参照微软（Microsoft）的规范，将 Property 译为「属性」，将 Attribute 译为「特性」。*

上面我们介绍了属性（Property）的动态绑定方式，那如果我们需要动态绑定一个特性（Attribute）该怎么办呢？

一种办法是直接使用插值语法，这一点在上面已经介绍过，不过很多时候并不直观（也不美观）。

事实上，Angular 也允许我们直接将表达式绑定到特性上，仍然使用的方括号语法，不过需要一个额外的 `attr.` 前缀：

所以，我们能够将之前的用来绑定 `img` 对应 URL 的 `[src]` 直接修改为 `[attr.src]`，之前已经提到过 `src` 的 Property Name 和 Attribute Name 相同，而且不仅如此，其接收的内容也依然相同。

但如果我们妄图通过这样来的形式来绑定 `foo-bar` 的话，形如：

```html
<app-template-syntax [attr.foo-bar]="<ul><li>1<li>2<li>3</ul>"></app-template-syntax>
```

会发现这样并不能成功，这是由于依赖注入是一次性的，从而不受动态绑定内容的影响。

如果我们需要获取动态绑定的 Attribute，只能够使用 `ElementRef` 来动态获取，并不方便。所以对于指令间的交互，应当尽可能使用 Property。

### 事件绑定／Event Binding

除了属性绑定外，还有一个很方便的语法称为 **事件绑定（）**，使用圆括号 `()`或者 `on-` 前缀[^8]定义，我们可以为我们的图片绑定 `(click)` 事件：

```html
<img [src]="'https://avatars0.githubusercontent.com/u/' + avatarId + '?v=3&s=460'" (click)="avatarId = avatarId + 1">
```

或者

```html
<img bind-src="'https://avatars0.githubusercontent.com/u/' + avatarId + '?v=3&s=460'" on-click="avatarId = avatarId + 1">
```

事件绑定中的执行环境被称为 **模版语句（Template Statement）**，相比于模版表达式而言，允许了副作用的存在，例如我们这里使用的赋值操作。

当然，由于我无法得知之后的用户都用的什么头像，所以如果出现不适宜的内容也与本文无关哦。

### 双向绑定／Two-way Data Binding

不论是属性绑定还是事件绑定，数据[^9]的传递都是单向的。而有时候，为了使用上的编译，我们会把两者使用语法糖来结合，而结合后的语法，就是两者的语法之和。我们可以在图片之前增加一个 `input` 元素：

```html
<input type="number" [(ngModel)]="avatarId">
<br>
```

或

```html
<input type="number" bindon-ngModel="avatarId">
<br>
```

不过，这时候我们会看到控制台的报错：

```text
Can't bind to 'ngModel' since it isn't a known property of 'input'.
```

这是因为我们并没有任何指令定义了 `ngModel` 这个属性输入。

其实这里也是和 AngularJS 相比明显改善了的地方，在 Angular 模版中，属性绑定是 **强类型** 的，即所有指令都会定义自己所需的属性输入，而如果我们在某个地方使用了任何指令都没有定义过的属性，Angular 就能在编译时发现错误，有效地缩短了反馈时间，提高开发效率。

可是问题来了，为什么 Angular 自带的 `ngModel` 会找不到呢？

如果我们浏览 Angular 的 [API](https://angular.io/api)，就能发现 [NgModel](https://angular.io/api/forms/NgModel) 处于 `forms` 这个 package 当中，并由 [FormsModule](https://angular.io/api/forms/FormsModule) 所声明。

为此，如果我们需要使用 `ngModel` 的话，就必须要导入 `FormsModule` 这个 NgModule。为此，在 `app.module.ts` 中，添加相应的内容：

```typescript
/* ... */
import { FormsModule } from '@angular/forms'

/* ... */

@NgModule({
  /* ... */
  imports: [
    /* ... */
    FormsModule
  ],
  /* ... */
})
export class AppModule { }
```

现在我们就能看到页面中的输入框，其中的默认值就是我们初始化的 `avatarId` 的值。

如果我们修改该数值，就能看到图片发生变化。反过来，如果我们点击图片，也会看到该数值发生变化。

为此这种形式就叫做 **双向绑定**。

所以，刚刚究竟发生了些什么呢？

对于双向绑定的语法糖，编译器会首先将其拆分成独立的属性绑定和事件绑定，其中的事件名增加 `Change` 后缀，也就是说：

```html
<element [(xxx)]="prop"></element>
```

等价于：

```html
<element [xxx]="prop" (xxxChange)="prop = $event"></element>
```

所以说，双向绑定中的表达式必须可以同时作为左值和右值，实际可用的运算符非常有限，仅限于 [属性访问](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Property_accessors)。

由于双向绑定只是一个普通的语法糖，我们随时可以新建一个支持双向绑定的指令，但是出于工程上的考虑，大部分情况下往往会让自定义指令来支持 `ngModel`，从而复用相应逻辑，这部分内容会在表单部分覆盖。

上面我们已经提高过对于 **表达式属性绑定** 可以通过方括号语法（或 `bind-` 前缀）来完成，不过反过来并不成立，即使用方括号语法的绑定未必是 **表达式属性绑定**。

例如，我们可以通过 `[attr.foo]` 来将数据（只能是字符串）绑定到 `foo` Attribute 而非 `foo` Property 上。以及 `[class.bar]`，用来动态调整 `bar` 这个 class 的存在与否（所以 Value 部分只能是 Boolean）。



## 可能的疑惑

#### 为什么 AngularJS 中不适合在 src 属性中插值？

AngularJS 使用的是基于 DOM 的模版，也就是说，模版会先被浏览器渲染成 DOM 树，之后 AngularJS 通过 DOM API 来寻找使用了插值的地方并进行修改。而浏览器对 img 内容的获取是在页面渲染过程中自动进行的，所以在这种模式下，会产生对包含模版内容的错误地址（例如 https://avatars0.githubusercontent.com/u/{{avatarId}}?v=3&s=460）进行请求，从而引发不必要的错误。

#### 为什么属性绑定和事件绑定也叫输入绑定和输出绑定？

我们知道（不知道的下一节也会知道），指令的属性绑定和事件绑定分别使用 `@Input()` 和 `@Output()`（或元数据中的 `host` 属性）来定义，所以可以简单地意会为输入和输出。不过从功能上，属性绑定也是完全可以实现输出功能的，例如主动传入一个 `EventEmitter` 作为输入。

但是问题来了，这是只表明了 **输入** 和 **输出**，那么 **属性** 和 **事件** 的概念是哪里来的呢？

事实上，在现有的语法之前，Angular 使用过 `@Property()` 和 `@Event()` 作为装饰器的名称，之后才 [改为](https://github.com/angular/angular/pull/4435) 现有语法的，而且在语法的最终版本上也经过了很多激烈的讨论。除此之外，称做属性绑定和事件绑定也符合语义上的行为，便于理解。

#### 属性绑定和方括号语法之间有什么关系？

概率上的相关性。属性绑定不一定使用方括号语法（或 `bind-` 前缀，下同），方括号语法也不一定是属性绑定。

不过在日常交流时，很难要求用户保持绝对的严谨性，因此在其它地方，很可能会用属性绑定来指代方括号语法或者反之。

#### 方括号绑定的 target 是 Property 还是 Attribute？

在不使用 `attr.` 的情况下，绑定的都是 Property，不论是对 DOM Element 还是 Angular Directive。虽然话是这么说，不过由于太多用户分不清 HTML Attribute 和 DOM Property，也有个别特例对用户妥协了，比如 `htmlFor`，所以现在事实上也可以使用 `<label [for]="abc">` 这样的错误写法。详见：[feat(core): map for property to htmlFor](https://github.com/angular/angular/pull/10546)。

*Angular 团队内心 OS：这届用户水平真是不行。*

#### 不使用方括号绑定的 target 是 Property 还是 Attribute？

Angular Compiler 本身内部存有所有 HTML Element 可能的 Attribute 列表，对于已知的 HTML Element 的已知 Attribute Name 而言，绑定的 target 就是 HTML Attribute，虽然实现上也是通过自动翻译成对应的 DOM Property 完成的（在存在的情况下），因为直接修改 HTML Attribute 的性能较差。

而对于 Angular Directive 的情况，则由其定义本身决定。如果使用的是输入属性，则始终绑定的是 Property。不过除了通过 `@Input()` 修饰的属性获取之外，也可以通过 `@Attribute()` 修饰的参数注入，这时外部 HTML 中使用的 Attribute 将不对应这个 Directive 到 Property 而是仅仅作为 Attribute。

对于其它的情况，例如 Web Components 等（默认不允许，需要手动设定 schema 开关），绑定的 target 都是 HTML Attribute，通过 DOM 的 Attribute API 设置。因为映射关系未知（甚至可能不存在），显然无法转化成对 DOM Property 的操作。

#### Angular 是如何确定事件绑定的事件源是 DOM 事件还是用户声明事件的？

实际上 Angular 自始至终都无法得知事件绑定的事件来源，该内容会在下一节覆盖。

#### 什么情况下需要定义自己的双向绑定指令？

几乎任何时候都不需要，双向绑定的语义过于狭隘，有一个 Directive 支持的情况下基本足够。除非是在对运行时大小有严格要求，所以想用 NgModel 又不愿引入 FormsModule 的场景中。

#### 为什么没有提到 *foo 的 DSL 语法？

因为这部分内容过于复杂，需要单独开一节来讲述。

---

[^1]: HTML Attribute Name 中，`[]`、`()` 以及 `*` 都是合法的字符，只不过本身没有语义上的行为（即这样的 Attribute 不起作用）。类似的，HTML 不区分大小写也是语义上的行为，并不是语法上的要求，不论是使用大写或者小写字母都是合法的 HTML。

[^2]: 本文中所有的 Angular CLI 项目都以 `learn-angular` 作为项目名，实际使用时可以自行调整以避免命名冲突（如果需要保留原有项目的话），例如增加后缀变成 `learn-angular-1` 等等。

[^3]: ICU 的全称是 International Components for Unicode，主要提供了一系列用于 I18n 的规范和相应的工具，Angular 支持它的一个子集以用于 I18n 内容的处理，ICU Message 的规范可以参考：[Formatting Messages - ICU User Guide](http://userguide.icu-project.org/formatparse/messages)，一个制作精良的在线示例可以参考 [ICU Message Format for Translators](https://format-message.github.io/icu-message-format-for-translators/)。

[^4]: 模版表达式所支持的部分确切的说是 JavaScript 的子集以及一些额外扩展，存在一些语法限制，详情参见：[Angular - linkTemplate Syntax#Template expressions](https://angular.io/guide/template-syntax#template-expressions)

[^5]: 在属性本身为 camelCase 的情况下，使用 kebab-case 的前缀会让风格显得很奇怪，例如 `bind-ngClass="{ 'foo': true }"`，虽然也可以使用让属性本身使用 kebab-case，但那样需要额外的配置且增加认知成本。所以一般情况下 Angular 推荐使用 camelCase 来设计属性名，并且使用 `[]` 语法来进行表达式属性绑定。

[^6]: HTML 中 `<li>` 元素的 End Tag 是可选的，虽然一般项目中不会这么写，但还是有必要了解这么写仍然是正确的。

[^7]: Angular 中，Component 视为一类特殊的 Directive。这点与 AngularJS 类似。

[^8]: 使用 `on-` 前缀进行事件绑定时，要确保没有遗漏最后的连字符，否则将使用原生的事件绑定。

[^9]: 对于事件绑定而言，可能不产生数据，仅仅进行事件通知，例如使用 `EventEmitter<void>` 类型。
