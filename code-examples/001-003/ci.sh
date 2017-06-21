echo "Starting check for 001-003"
cd code-examples/001-003

echo "Creating new Angular CLI project"
rm -rf learn-angular-ci
ng new --skip-install learn-angular-ci
cd learn-angular-ci

echo "Installing dependencies by Yarn"
yarn install

echo "Building project using AOT"
ng build --aot
ng build -prod

echo "Modifying tsconfig.app.json for separated path"
echo "{
  \"extends\": \"../tsconfig.json\",
  \"compilerOptions\": {
    \"outDir\": \"../out-tsc/app\",
    \"module\": \"es2015\",
    \"baseUrl\": \"\",
    \"types\": []
  },
  \"exclude\": [
    \"test.ts\",
    \"**/*.spec.ts\"
  ],
  \"angularCompilerOptions\": {
    \"genDir\": \"../out-aot\"
  }
}" > src/tsconfig.app.json

echo "Compiling project using ngc for separated path"
./node_modules/.bin/ngc -p src/tsconfig.app.json

echo "Checking ngc results for separated path"
if [ ! -f ./out-aot/app/app.component.ngfactory.ts ]; then
    echo "app.component.ngfactory.ts not found in out-aot!"
    exit 1
fi
if [ ! -f ./out-tsc/app/app/app.component.js ]; then
    echo "app.component.js not found in out-tsc!"
    exit 1
fi
echo "AOT Compilation works"

echo "Modifying tsconfig.app.json for unified path"
echo "{
  \"extends\": \"../tsconfig.json\",
  \"compilerOptions\": {
    \"outDir\": \".\",
    \"target\": \"es2015\",
    \"module\": \"es2015\",
    \"baseUrl\": \"\",
    \"types\": []
  },
  \"exclude\": [
    \"test.ts\",
    \"**/*.spec.ts\"
  ]
}" > src/tsconfig.app.json

echo "Compiling project using ngc for unified path"
./node_modules/.bin/ngc -p src/tsconfig.app.json
./node_modules/.bin/ngc -p src/tsconfig.app.json

echo "Checking ngc results for separated path"
if [ ! -f ./src/app/app.component.ngfactory.js ]; then
    echo "app.component.ngfactory.js not found in src!"
    exit 1
fi
echo "AOT Compilation works"

echo "Modifying main.js"
echo "\
import { enableProdMode } from '@angular/core';
import { platformBrowser } from '@angular/platform-browser';
import { AppModuleNgFactory } from './app/app.module.ngfactory';
import { environment } from './environments/environment';

enableProdMode();

platformBrowser().bootstrapModuleFactory(AppModuleNgFactory);
" > src/main.js

echo "Bundling app using Webpack"
webpack src/main.js out-webpack/bundle.js
echo "Bundle generated"

echo "All process checked"
