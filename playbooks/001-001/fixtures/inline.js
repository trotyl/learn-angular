class AppComponent { }

AppComponent.annotations = [
  new ng.core.Component({
    selector: 'main',
    template: '<h1>Hello Angular</h1>',
  })
]

class AppModule { }

AppModule.annotations = [
  new ng.core.NgModule({
    imports: [
      ng.platformBrowser.BrowserModule,
    ],
    declarations: [
      AppComponent,
    ],
    bootstrap: [
      AppComponent,
    ],
  })
]

ng.platformBrowserDynamic.platformBrowserDynamic().bootstrapModule(AppModule)
