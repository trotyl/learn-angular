import { Component, OnInit, Input, Attribute } from '@angular/core';

@Component({
  selector: 'app-template-syntax',
  templateUrl: './template-syntax.component.html',
  styleUrls: ['./template-syntax.component.css']
})
export class TemplateSyntaxComponent {
  content: string

  constructor(@Attribute('foo-bar') fooBar: string) {
    this.content = fooBar
  }

  avatarId = 6059170
}
