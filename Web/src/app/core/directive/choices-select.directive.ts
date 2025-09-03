import { Directive, ElementRef, Input, type AfterViewInit } from '@angular/core'
import Choices, { Options as ChoiceOption } from 'choices.js'

export type SelectOptions = Partial<ChoiceOption>

@Directive({
  selector: '[choicesSelect]',
  standalone: true,
})
export class ChoiceSelectInputDirective implements AfterViewInit {
  @Input() className?: string
  @Input() onChange?: (text: string) => void
  @Input() options?: SelectOptions

  constructor(private eleRef: ElementRef) {}

  ngAfterViewInit(): void {
    const choices = new Choices(this.eleRef.nativeElement, {
      ...this.options,
      placeholder: true,
      allowHTML: true,
      shouldSort: false,
    })

    // Expose for parent components to control (e.g., clear on form reset)
    ;(this.eleRef.nativeElement as any).__choices = choices

    choices.passedElement.element.addEventListener('change', (e: Event) => {
      if (!(e.target instanceof HTMLSelectElement)) return
      if (this.onChange) {
        this.onChange(e.target.value)
      }
    })
  }
}
