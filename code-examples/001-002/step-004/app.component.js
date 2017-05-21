import { Component } from '@angular/core'

export class AppComponent { }

AppComponent.annotations = [
  new Component({
    selector: 'main',
    template: '<h1>Hello Angular</h1>',
  })
]
