import { Component, OnInit, Input, Attribute, HostBinding, HostListener } from '@angular/core';

@Component({
  selector: 'app-template-syntax',
  templateUrl: './template-syntax.component.html',
  styleUrls: ['./template-syntax.component.css']
})
export class TemplateSyntaxComponent {
  content: string

  @HostBinding('class.foo')
  foo = true

  @HostListener('mouseover')
  onMouseOver(): void {
    this.avatarId = Math.floor(Math.random() * 1e6)
  }

  constructor(@Attribute('foo-bar') fooBar: string) {
    this.content = fooBar
  }

  avatarId = 6059170
}
