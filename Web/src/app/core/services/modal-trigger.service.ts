import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ModalTriggerService {
  private modalTrigger = new Subject<{ modalId: string; context?: string }>();
  modalTrigger$ = this.modalTrigger.asObservable();

  openModal(modalId: string, context?: string) {
    this.modalTrigger.next({ modalId, context });
  }
}
