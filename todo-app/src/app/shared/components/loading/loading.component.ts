import { AfterContentChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { LoadingService } from '../../services/loading.service';
import { Observable } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [
    NgIf,
    MatProgressSpinnerModule,
    AsyncPipe
  ],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingComponent {
  public loading$: Observable<boolean>;

  constructor(private loadingService: LoadingService) {
    this.loading$ = this.loadingService.loading$;
  }
}
