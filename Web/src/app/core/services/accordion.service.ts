import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccordionService {
  private activePanel = new BehaviorSubject<string | null>(null);
  activePanel$ = this.activePanel.asObservable();

  toggle(panelId: string) {
    //  
    this.activePanel.next(panelId);
  }
}
