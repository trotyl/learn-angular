# 依赖注入

**依赖注入（Dependency Injection，DI）** 是面向对象编程当中的一项常用实践，也是 Angular 中的重要概念之一。

所谓 **依赖注入（Dependency Injection）**，也就是 **注入依赖（Injecting Dependency）** 这个动名词组的名词形式，或者称之为 **依赖的注入**。**依赖注入** 是用来实现 **控制反转（）** 的一个常用手段。

不论是 AngularJS 还是 Angular 都为依赖注入提供了 First-class 的支持。依赖注入有多种实现手段，对于 class 而言，Angular 中所使用的构造器注入的方式，即所有依赖于 class 创建时传入。

## 基本概念

依赖注入本身并不是一个复杂的过程，对于 Angular 中的实现而言，可以简单归纳为：

+ 所有 Consumer 的建立都托管给 Angular 进行；
+ 每个 Consumer 需要声明相应的依赖（提供 Token）；
+ 当有 Consumer 建立时，查找其依赖对应的 Provider；
+ 如果一个 Provider 同时也是 Consumer，递归该过程；
+ 获取所有依赖后，使用这些依赖初始化 Consumer；

通过依赖注入，我们可以获得了一些优势：

+ 所有的类型高度解耦，方便测试及复用；
+ 减少了不必要的初始化代码，保证了关注点分离；
+ 保证了扩平台支持，不受限于具体实现。

简单地说，Angular 中的依赖注入就是一个查表的过程，以某个 Token 作为 Key 并告知给 Angular，随后由 Angular 自动返回该 Key 所对应的 Value。这也是 Spring Framework 的一个明显区别，在 Angular 的依赖注入中 Class 并无任何特殊性，因此也不具备任何形如 AntoScan 的过程，所有 Token 对应内容的注册都必须手动完成。

## 适用范围

所有经由 Angular 托管的内容都可以使用依赖注入，更确切地说，既可以依赖于其它内容，**也可以作为其它内容的依赖**。

许多的 Angular 用户都有一个明显的误解，认为：*被注入的内容 == 使用 `@Injectable()` 标注的类*。这种理解是完全错误的。

#### 第一个误解：被注入的内容需要 `@Injectable()` 标注

`Injectable()` 最初发布[^1] 在 2.0.0-alpha.14 版本中，出现于 Angular 团队宣布与 TypeScript 合作[^2] 的 12 天后。

之所以需要 `Injectable()`，是由于 TypeScript 中 `emitDecoratorMetadata` 参数只会对具备装饰器的类在运行时暴露构造函数的参数信息。

**因此，当该类不需要构造函数的参数信息，即该类型不依赖于其它类型时，`Injectable()` 是不需要的。**

即便存在构造函数的参数信息，我们也仍然可以像 AngularJS 那样主动提供的话，例如：

```typescript
class Foo {
    static ctorParameters() {
        return [Bar, Baz]
    }

    constructor(private bar: Bar, private baz: Baz) { }
}
```

**因此，当该类通过其它方式暴露了依赖信息时，`Injectable()` 是不需要的。**

此外，由于只是 TypeScript 实现上的要求，因此实现上而言这个装饰器是没有任何意义的[^3]，我们完全可以使用任何其它的 Angular 或非 Angular 装饰器进行替代。

**因此，当该类已经具备其它装饰器（例如 `Component()`、`Pipe()` 等）时，不再需要声明额外的 `Injectable()`。**

特别需要强调的是，`Component()`、`Directive()` 和 `Pipe()` 等等内容，也可以作为普通的依赖（被注入方）使用，例如在需要在逻辑代码中格式化日期时就可以注入 [`DatePipe`](https://angular.io/api/common/DatePipe)，而无需为此引入额外的第三方内容。从语义上而言，所有其它的装饰器工厂都是 `Injectable` 的子类[^5]。

另外，只有使用 JIT 的编译方式时才会直接用到 TypeScript[^4]，也只有 TypeScript 需要 `Injectable()`。

**因此，在使用 Angular Compiler 的情况下，不论是 JIT 还是 AOT，都不需要 `Injectable()` 标注。**

随着 5.x 版本开始 JIT 将被不推荐使用，Angular CLI 也会将 AOT 作为所有情况下的默认选项，`Injectable()` 也完全失去了存在的意义。

`Injectable` 的名称也极具误导性，并不表示一个类型可用于依赖注入，Angular 团队曾经就是否改名 [进行过相关讨论](https://github.com/angular/angular/issues/4404)，但并未得到一致的结果。

#### 第二个误解：被注入的内容一定要是类（的实例）

这里涉及到两个部分，



---

[^1]: 引入 `Injectable` 的 Commit 为 [feat(di): Add the `@Injectable` annotation](https://github.com/angular/angular/commit/8e8abb24c452a94d6023a8a13065e09f27defd90)，对应的 PR 为 [feat(di): Add the `@Injectable` annotation](https://github.com/angular/angular/pull/986)。

[^2]: 官方宣布于 [ng-conf on Twitter: "AtScript is Typescript #ngconf"](https://twitter.com/ngconf/status/573521849780305920)。

[^3]: Angular 团队曾经计划将 `Injectable` 作为强制要求以提升代码规范，例如在 [Require all injectable Types to have @Injectable annotation](https://github.com/angular/angular/issues/2020)、[[4.x] Don't allow injecting classes without @Injectable](https://github.com/angular/angular/issues/13820)，不过最终并未出现。

[^4]: 直接使用 TypeScript 编译只能实现 JIT，但使用 JIT 并不一定非要直接使用 TypeScript 编译。所有（合格）的 Angular 库都是经过 Angular Compiler 编译后发布的，但发布过程中并不编译模版。发布后的 JavaScript 代码不会具备任何 Decorator 的实现内容（即不会出现 `__decorate`），但仍可用于 JIT 开发中。

[^5]: 在 [早期版本中](https://github.com/angular/angular/blob/cb83f1678acc345eb712ab0e87cb52e8bf573b35/modules/angular2/src/core/annotations/annotations.js#L14) 实现上真的就是 `Injectable` 的子类，而不仅仅是语义上的行为。
