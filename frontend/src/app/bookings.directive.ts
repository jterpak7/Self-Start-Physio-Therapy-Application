import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[bookingSlot]'
})
export class BookingsDirective {
    
    private nativeElement : Node;

  constructor(private element: ElementRef, private renderer: Renderer2) { }
  

}
