import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  interpolation: ['%start%', '%end%'],
})
export class AppComponent {
  title = 'app';
}
