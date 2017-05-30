import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MaterialModule} from '../material/material.module';

import {AuthGuard} from './auth.guard';
import {UnauthGuard} from './unauth.guard';
import {AuthService} from './auth.service';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        MaterialModule
    ],
    providers: [
        AuthGuard,
        AuthService,
        UnauthGuard
    ]
})

export class AuthModule {}

export {AuthGuard};
export {AuthService};
export {UnauthGuard};
