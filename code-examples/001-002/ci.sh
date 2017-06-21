echo "Starting check for 001-002"
cd code-examples/001-002

echo "Creating new directory"
rm -rf learn-angular-ci
mkdir learn-angular-ci
cd learn-angular-ci

echo "Adding app files with static properties"
echo "\
import { Component } from '@angular/core'

export class AppComponent { }

AppComponent.annotations = [
  new Component({
    selector: 'main',
    template: '<h1>Hello Angular</h1>',
  })
]
" > app.component.js
echo "\
import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { AppComponent } from './app.component'

export class AppModule { }

AppModule.annotations = [
  new NgModule({
    imports: [
      BrowserModule,
    ],
    declarations: [
      AppComponent,
    ],
    bootstrap: [
      AppComponent,
    ],
  })
]
" > app.module.js
echo "\
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'
import { AppModule } from './app.module'

platformBrowserDynamic().bootstrapModule(AppModule)
" > main.js

echo "Installing dependencies by Yarn"
yarn add @angular/core @angular/common @angular/compiler @angular/platform-browser @angular/platform-browser-dynamic rxjs

echo "Bundling app using Webpack"
webpack main.js bundle-0.js

echo "Checking webpack results"
if [ ! -f ./bundle-0.js ]; then
    echo "bundle-0.js not found!"
    exit 1
fi
echo "Webpack bundle generated"

echo "Transpile JavaScripts using tsc for static properties"
tsc --allowJs --outDir dist-0 --target es2015 main.js

echo "Checking tsc results for static properties"
if [ ! -f ./dist-0/app.component.js ]; then
    echo "app.component.js not found in dist-0!"
    exit 1
fi
echo "TypeScript Compilation works"

echo "Modifying source files with Decorator"
echo "\
import { Component } from '@angular/core'

@Component({
  selector: 'main',
  template: '<h1>Hello Angular</h1>',
})
export class AppComponent { }
" > app.component.js
echo "\
import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { AppComponent } from './app.component'

@NgModule({
  imports: [
    BrowserModule,
  ],
  declarations: [
    AppComponent,
  ],
  bootstrap: [
    AppComponent,
  ],
})
export class AppModule { }
" > app.module.js

echo "Transpile JavaScripts using tsc for Decorators"
tsc --allowJs --outDir dist-1 --target es2015 --experimentalDecorators main.js

echo "Bundling app using Webpack"
webpack dist-1/main.js bundle-1.js

echo "Checking webpack results"
if [ ! -f ./bundle-1.js ]; then
    echo "bundle-1.js not found!"
    exit 1
fi
echo "Webpack bundle generated"

echo "Upgrading source files to TypeScript"
mv app.component.js app.component.ts
mv app.module.js app.module.ts
mv main.js main.ts

echo "Transpile TypeScripts using tsc"
tsc --target es2015 --experimentalDecorators --moduleResolution node main.ts

echo "Bundling app using Webpack"
webpack main.js bundle-2.js

echo "Checking webpack results"
if [ ! -f ./bundle-2.js ]; then
    echo "bundle-2.js not found!"
    exit 1
fi
echo "Webpack bundle generated"

echo "All process checked"
