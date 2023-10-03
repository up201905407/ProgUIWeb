import { Directive, HostListener, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})

export class HighlightDirective {
  constructor(private el: ElementRef, private renderer: Renderer2) { }

  @HostListener('focus')
  onFocus() {
    // Change the background color when the field is focused
    this.renderer.addClass(this.el.nativeElement, 'bg-focused');
  }

  @HostListener('blur')
  onBlur() {
    // Remove the background color when the field loses focus
    this.renderer.removeClass(this.el.nativeElement, 'bg-focused');
  }
}

