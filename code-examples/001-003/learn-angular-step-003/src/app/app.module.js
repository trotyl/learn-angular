import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
export class AppModule {
}
AppModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    AppComponent
                ],
                imports: [
                    BrowserModule,
                    FormsModule,
                    HttpModule
                ],
                providers: [],
                bootstrap: [AppComponent]
            },] },
];
/** @nocollapse */
AppModule.ctorParameters = () => [];
//# sourceMappingURL=app.module.js.map