// shared.ts
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
 import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';

export const SHARED_IMPORTS = [
  CommonModule,
  RouterModule,
  FormsModule,
  ReactiveFormsModule,
  TranslateDirective,
  TranslatePipe
 ];


 