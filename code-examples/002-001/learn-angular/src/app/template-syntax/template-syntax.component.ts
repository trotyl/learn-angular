import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-template-syntax',
  templateUrl: './template-syntax.component.html',
  styleUrls: ['./template-syntax.component.css']
})
export class TemplateSyntaxComponent {
  avatarId = 6059170
  htmlStr = `
    <ul>
      <li>1
      <li>2
      <li>3
    </ul>
  `
}
