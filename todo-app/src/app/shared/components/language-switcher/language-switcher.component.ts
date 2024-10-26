import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';
import { NgFor, NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    TranslateModule
  ],
  templateUrl: './language-switcher.component.html',
  styleUrl: './language-switcher.component.scss'
})
export class LanguageSwitcherComponent {
  @ViewChild('langDropdown') langDropdown!: ElementRef;
  public env = environment;
  public currentLang = localStorage.getItem('lang');
  constructor(
              public translate: TranslateService,
            ) {}
  public updateLanguage(language: string) {
    this.translate.use(language);
    localStorage.setItem('lang', language);
  }

}
