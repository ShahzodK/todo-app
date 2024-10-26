import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appTaskCompleteness]',
  standalone: true
})
export class TaskCompletenessDirective implements OnChanges {
  @Input() appTaskCompleteness!: number;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnChanges(): void {
    const color = this.appTaskCompleteness ? 'mediumseagreen' : 'whitesmoke';
    this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', color);
  }
}
