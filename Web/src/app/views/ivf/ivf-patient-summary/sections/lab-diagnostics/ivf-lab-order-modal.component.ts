import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ivf-lab-order-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styles: [`
    .modal-backdrop-custom { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1050; }
    .modal-custom { position: fixed; inset: 0; z-index: 1060; display: flex; align-items: center; justify-content: center; }
    .modal-dialog-custom { width: min(1100px, 95vw); }
    .h-56 { max-height: 56vh; }
  `],
  template: `
    <div *ngIf="open">
      <div class="modal-backdrop-custom" (click)="onCancel()"></div>
      <div class="modal-custom">
        <div class="modal-dialog-custom">
          <div class="card shadow">
            <div class="card-header d-flex justify-content-between align-items-center">
              <div>
                <div class="fw-bold">{{ mode === 'edit' ? 'Modify Order' : 'New Order' }}</div>
                <div class="small text-muted">MRN: {{ mrNo || '-' }}</div>
              </div>
              <button type="button" class="btn-close" (click)="onCancel()"></button>
            </div>
            <div class="card-body">

              <ul class="nav nav-tabs small mb-2">
                <li class="nav-item"><button class="nav-link" [class.active]="tab==='inv'" (click)="tab='inv'">Investigations</button></li>
                <li class="nav-item"><button class="nav-link" [class.active]="tab==='fav'" (click)="tab='fav'">My Favorite</button></li>
                <li class="nav-item"><button class="nav-link" [class.active]="tab==='search'" (click)="tab='search'">Search</button></li>
                <li class="nav-item"><button class="nav-link" [class.active]="tab==='popular'" (click)="tab='popular'">Popular Test</button></li>
              </ul>

              <div class="row g-3 align-items-start">
                <div class="col-md-7">
                  <div class="border rounded p-2 h-56 overflow-auto">
                    <div class="mb-2 position-sticky top-0 bg-white pb-2">
                      <input class="form-control form-control-sm" placeholder="Search by name or CPT" [(ngModel)]="search" />
                    </div>
                    <div class="form-check" *ngFor="let t of filteredCatalogue()">
                      <input class="form-check-input" type="checkbox" [id]="'t-'+t.id" [(ngModel)]="t.checked" (change)="onCatalogueToggle(t)">
                      <label class="form-check-label text-truncate" [attr.for]="'t-'+t.id">{{ t.name }} ({{t.cpt}})</label>
                      <span class="badge bg-light text-muted ms-2">Internal</span>
                    </div>
                  </div>
                </div>
                <div class="col-md-5">
                  <div class="border rounded p-2 h-56 overflow-auto">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                      <div class="fw-semibold">Selected tests</div>
                      <button class="btn btn-sm btn-outline-secondary" (click)="clearAll()" [disabled]="selected.length===0">Clear all</button>
                    </div>
                    <div class="d-flex flex-wrap gap-2">
                      <div class="badge bg-secondary d-inline-flex align-items-center gap-2 p-2" *ngFor="let s of selected; let i=index">
                        <span class="text-truncate" style="max-width:220px">{{ s.name }} ({{ s.cpt }})</span>
                        <div class="btn-group btn-group-sm">
                          <button class="btn btn-light py-0" (click)="moveUp(i)" title="Move up">↑</button>
                          <button class="btn btn-light py-0" (click)="moveDown(i)" title="Move down">↓</button>
                          <button class="btn btn-light py-0" (click)="removeById(s.id)" title="Remove">×</button>
                        </div>
                      </div>
                    </div>
                    <div *ngIf="selected.length===0" class="text-muted text-center py-3">No test selected</div>
                  </div>
                </div>
              </div>

              <div class="mt-3">
                <div class="fw-bold mb-2">Per-investigation details</div>
                <div class="table-responsive">
                  <table class="table table-sm table-bordered align-middle mb-0">
                    <thead class="table-light">
                      <tr>
                        <th style="width:18%">Test</th>
                        <th style="width:14%">Ref. Physician</th>
                        <th style="width:14%">Notify Role</th>
                        <th style="width:14%">Receiver</th>
                        <th style="width:12%">Order Site</th>
                        <th style="width:12%">Site Type</th>
                        <th>Comments</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let s of selected">
                        <td class="text-truncate">{{ s.name }} ({{ s.cpt }})</td>
                        <td>
                          <select class="form-select form-select-sm" [(ngModel)]="details[s.id].refPhysician">
                            <option [ngValue]="null">Select...</option>
                            <option *ngFor="let p of physicians" [ngValue]="p">{{ p }}</option>
                          </select>
                        </td>
                        <td>
                          <select class="form-select form-select-sm" [(ngModel)]="details[s.id].notifyRole">
                            <option *ngFor="let r of roles" [ngValue]="r">{{ r }}</option>
                          </select>
                        </td>
                        <td><input class="form-control form-control-sm" [(ngModel)]="details[s.id].receiverName"></td>
                        <td><input class="form-control form-control-sm" [(ngModel)]="details[s.id].orderSite"></td>
                        <td><input class="form-control form-control-sm" [(ngModel)]="details[s.id].siteType"></td>
                        <td><input class="form-control form-control-sm" [(ngModel)]="details[s.id].comments"></td>
                      </tr>
                      <tr *ngIf="selected.length===0">
                        <td colspan="7" class="text-center text-muted">No test selected</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
            <div class="card-footer d-flex justify-content-end gap-2">
              <button class="btn btn-secondary" (click)="onCancel()">Cancel</button>
              <button class="btn btn-primary" (click)="onSave()">{{ mode === 'edit' ? 'Save' : 'Order' }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class IvfLabOrderModalComponent {
  @Input() open = false;
  @Input() mrNo: string | null = null;
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() orderId?: string | number;

  @Output() cancel = new EventEmitter<void>();
  @Output() save = new EventEmitter<{ tests: any[]; details: any }>();

  tab: 'inv' | 'fav' | 'search' | 'popular' = 'inv';

  physicians = ['Dr A', 'Dr B'];
  roles = ['Physician', 'Nurse'];

  catalogue = [
    { id: 1, name: 'E2', cpt: '76376', checked: false },
    { id: 2, name: 'FSH', cpt: '76377', checked: false },
    { id: 3, name: 'CBC', cpt: '76378', checked: false },
  ];

  selected: Array<{ id: number; name: string; cpt: string }> = [];
  // Per-test details keyed by test id
  details: Record<number, any> = {};
  search = '';

  form: any = {
    refPhysician: null,
    notifyRole: 'Physician',
    receiverName: '',
    orderSite: '',
    siteType: '',
    comments: '',
    applyAll: false,
  };

  applyAllChecked = false;

  onCancel() { this.cancel.emit(); }

  filteredCatalogue() {
    const q = (this.search || '').toLowerCase().trim();
    if (!q) return this.catalogue;
    return this.catalogue.filter(c => c.name.toLowerCase().includes(q) || c.cpt.toLowerCase().includes(q));
  }

  onCatalogueToggle(t: any) {
    if (t.checked) {
      if (!this.selected.some(s => s.id === t.id)) {
        this.selected = [...this.selected, { id: t.id, name: t.name, cpt: t.cpt }];
        if (!this.details[t.id]) this.details[t.id] = this.defaultDetails();
      }
    } else {
      this.removeById(t.id);
    }
  }

  moveUp(i: number) { if (i > 0) { [this.selected[i-1], this.selected[i]] = [this.selected[i], this.selected[i-1]]; } }
  moveDown(i: number) { if (i < this.selected.length - 1) { [this.selected[i+1], this.selected[i]] = [this.selected[i], this.selected[i+1]]; } }
  removeAt(i: number) { const removed = this.selected.splice(i, 1)[0]; this.selected = [...this.selected]; this.setChecked(removed?.id, false); delete this.details[removed?.id]; }
  removeById(id: number) { this.selected = this.selected.filter(s => s.id !== id); this.setChecked(id, false); delete this.details[id]; }
  clearAll() { this.selected.forEach(s => this.setChecked(s.id, false)); this.selected = []; this.details = {}; }
  private setChecked(id: number, v: boolean) { const c = this.catalogue.find(x => x.id === id); if (c) c.checked = v; }

  onSave() {
    const perTests = this.selected.map(s => ({ ...s, details: this.details[s.id] || this.defaultDetails() }));
    this.save.emit({ tests: perTests, details: this.form });
  }

  applyAll() {
    if (!this.applyAllChecked) return;
    this.selected.forEach(s => {
      this.details[s.id] = { ...this.details[s.id], ...this.form };
    });
  }

  private defaultDetails() {
    return {
      refPhysician: this.form.refPhysician ?? null,
      notifyRole: this.form.notifyRole ?? 'Physician',
      receiverName: this.form.receiverName ?? '',
      orderSite: this.form.orderSite ?? '',
      siteType: this.form.siteType ?? '',
      comments: this.form.comments ?? ''
    };
  }
}
