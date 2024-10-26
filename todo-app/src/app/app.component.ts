import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingComponent } from './shared/components/loading/loading.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { LanguageSwitcherComponent } from './shared/components/language-switcher/language-switcher.component';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    LoadingComponent,
    MatToolbarModule,
    MatIconModule,
    LanguageSwitcherComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'todo-app';

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    const usedLanguage = localStorage.getItem('lang')
    if(usedLanguage && environment.LANGUAGES.some((lang) => lang === usedLanguage)) {
      this.translate.use(usedLanguage)
    }
    else {
      localStorage.setItem('lang', environment.DEFAULT_LOCALE);
      this.translate.use(environment.DEFAULT_LOCALE);
    }
  }
}
