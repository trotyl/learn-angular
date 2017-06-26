import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-template-syntax',
  templateUrl: './template-syntax.component.html',
  styleUrls: ['./template-syntax.component.css']
})
export class TemplateSyntaxComponent {
  @Input()
  content: string

  avatarId = 6059170
}
