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
  styleUrl: './language-switcher.component.scss',
})
export class LanguageSwitcherComponent implements OnInit {
  @ViewChild('langDropdown') langDropdown!: ElementRef;
  public readonly env = environment;
  public currentLang!: string;
  constructor(
              public translate: TranslateService,
            ) {}

  ngOnInit(): void {
    const usedLanguage = localStorage.getItem('lang');
    if(usedLanguage && environment.LANGUAGES.some((lang) => lang === usedLanguage)) {
      this.currentLang = usedLanguage;
      this.translate.use(usedLanguage)
    }
    else {
      localStorage.setItem('lang', environment.DEFAULT_LOCALE);
      this.currentLang = localStorage.getItem('lang') || environment.DEFAULT_LOCALE;
      this.translate.use(environment.DEFAULT_LOCALE);
    };
  }

  public updateLanguage(language: string) {
    this.translate.use(language);
    localStorage.setItem('lang', language);
  }

}
