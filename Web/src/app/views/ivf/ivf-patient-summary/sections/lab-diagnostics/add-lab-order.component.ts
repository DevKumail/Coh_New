import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IVFApiService } from '@/app/shared/Services/IVF/ivf.api.service';
import { LucideAngularModule, ChevronDown, ChevronRight, ChevronUp, X } from 'lucide-angular';

@Component({
  selector: 'app-add-lab-order',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  styles: [`
    .h-56 { max-height: 56vh; }
    .tree-toggle { font-size: 18px; line-height: 1; color: #0d6efd; width: 22px; height: 22px; display: inline-flex; align-items: center; justify-content: center; text-decoration: none; }
    .tree-toggle:hover { text-decoration: none; color: #0a58ca; }
    .tree-toggle:focus { box-shadow: none; }
    .move-btn { font-size: 16px; line-height: 1; }
    .btn-link { text-decoration: none; }
    .btn-link:hover { text-decoration: none; opacity: 0.8; }
  `],
  template: `
    <div class="card shadow">
      <div class="card-header d-flex justify-content-between align-items-center">
        <div>
          <div class="fw-bold">{{ mode === 'edit' ? 'Modify Order' : 'New Order' }}</div>
          <div class="small text-muted">MRN: {{ mrNo || '-' }}</div>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-secondary btn-sm" (click)="onCancel()">Back</button>
          <button class="btn btn-primary btn-sm" (click)="onSave()">{{ mode === 'edit' ? 'Save' : 'Order' }}</button>
        </div>
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
              <ng-container *ngIf="!isLoadingTree; else treeLoading">
                <ng-container *ngTemplateOutlet="treeTpl; context: { $implicit: filteredTree() }"></ng-container>
              </ng-container>
              <ng-template #treeLoading>
                <div class="text-muted small">Loading...</div>
              </ng-template>
              <ng-template #treeTpl let-nodes>
                <ul class="list-unstyled mb-0">
                  <li *ngFor="let n of nodes" class="mb-1">
                    <div class="d-flex align-items-center gap-2">
                      <button *ngIf="n.children?.length" class="btn btn-sm btn-link p-0 tree-toggle" (click)="toggleExpand(n.id)" [attr.aria-label]="isExpanded(n.id) ? 'Collapse' : 'Expand'">
                        <i-lucide [img]="isExpanded(n.id) ? ChevronDown : ChevronRight" [size]="16"></i-lucide>
                      </button>
                      <span *ngIf="!n.children?.length" style="width:22px"></span>
                      <input *ngIf="n.selectable" class="form-check-input" type="checkbox" [checked]="isSelected(n.id)" (change)="onLeafToggle(n, $event)">
                      <span class="text-truncate">{{ n.label }}<span *ngIf="n.cptCode"> ({{ n.cptCode }})</span></span>
                    </div>
                    <div *ngIf="n.children?.length && isExpanded(n.id)" class="ms-4">
                      <ng-container *ngTemplateOutlet="treeTpl; context: { $implicit: n.children }"></ng-container>
                    </div>
                  </li>
                </ul>
              </ng-template>
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
                  <div class="d-flex gap-1">
                    <button class="btn btn-link text-white p-0 move-btn" (click)="moveUp(i)" title="Move up">
                      <i-lucide [img]="ChevronUp" [size]="14"></i-lucide>
                    </button>
                    <button class="btn btn-link text-white p-0 move-btn" (click)="moveDown(i)" title="Move down">
                      <i-lucide [img]="ChevronDown" [size]="14"></i-lucide>
                    </button>
                    <button class="btn btn-link text-white p-0" (click)="removeById(s.id)" title="Remove">
                      <i-lucide [img]="X" [size]="14"></i-lucide>
                    </button>
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
                  <th style="width:14%">Material</th>
                  <th style="width:10%">Status</th>
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
                  <td class="text-truncate">{{ s.sampleTypeName || '-' }}</td>
                  <td>{{ s.status || 'New' }}</td>
                  <td>
                    <select class="form-select form-select-sm" [(ngModel)]="details[s.id].refPhysicianId">
                      <option [ngValue]="null">Select...</option>
                      <option *ngFor="let p of physicians" [ngValue]="p.id">{{ p.name }}</option>
                    </select>
                  </td>
                  <td>
                    <select class="form-select form-select-sm" [(ngModel)]="details[s.id].notifyRoleId" (ngModelChange)="onNotifyRoleChange(s.id, $event)">
                      <option *ngFor="let r of roles" [ngValue]="r.id">{{ r.name }}</option>
                    </select>
                  </td>
                  <td>
                    <select class="form-select form-select-sm" [(ngModel)]="details[s.id].receiverId">
                      <option [ngValue]="null">Select...</option>
                      <option *ngFor="let rec of getReceiverOptions(details[s.id]?.notifyRoleId)" [ngValue]="rec.id">{{ rec.name }}</option>
                    </select>
                  </td>
                  <td><input class="form-control form-control-sm" [(ngModel)]="details[s.id].orderSite"></td>
                  <td><input class="form-control form-control-sm" [(ngModel)]="details[s.id].siteType"></td>
                  <td><input class="form-control form-control-sm" [(ngModel)]="details[s.id].comments"></td>
                </tr>
                <tr *ngIf="selected.length===0">
                  <td colspan="9" class="text-center text-muted">No test selected</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AddLabOrderComponent implements OnInit, OnChanges {
  // Lucide icons
  readonly ChevronDown = ChevronDown;
  readonly ChevronRight = ChevronRight;
  readonly ChevronUp = ChevronUp;
  readonly X = X;

  @Input() mrNo: string | null = null;
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() orderId?: string | number;
  @Input() initialOrder?: any;

  @Output() cancel = new EventEmitter<void>();
  @Output() save = new EventEmitter<{ tests: any[]; details: any; header?: any }>();

  tab: 'inv' | 'fav' | 'search' | 'popular' = 'inv';

  physicians: Array<{ id: number; name: string }> = [];
  nurses: Array<{ id: number; name: string }> = [];
  roles: Array<{ id: number; name: string }> = [];

  tree: any[] = [];
  isLoadingTree = false;
  expandedIds = new Set<number>();

  selected: Array<{ id: number; name: string; cpt: string; sampleTypeId?: number | null; sampleTypeName?: string; status?: string }> = [];
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

  constructor(private ivfApi: IVFApiService) {}

  ngOnInit(): void {
    this.loadTree();
    this.loadRefPhysicians();
    this.loadNurses();
    this.loadNotifyRoles();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialOrder'] && this.initialOrder) {
      this.prefillFromInitial(this.initialOrder);
    }
  }

  onCancel() { this.cancel.emit(); }

  loadTree() {
    this.isLoadingTree = true;
    this.ivfApi.getLabTestsTree(23).subscribe({
      next: (res: any) => {
        this.tree = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
        (this.tree || []).forEach((n: any) => this.expandedIds.add(n.id));
      },
      error: () => {},
      complete: () => { this.isLoadingTree = false; }
    });
  }

  filteredTree() {
    const q = (this.search || '').toLowerCase().trim();
    if (!q) return this.tree;
    const filterFn = (nodes: any[]): any[] => {
      return (nodes || []).map(n => {
        const match = (n.label || '').toLowerCase().includes(q) || (n.cptCode || '').toLowerCase().includes(q);
        const child = filterFn(n.children || []);
        if (match || child.length) {
          return { ...n, children: child };
        }
        return null as any;
      }).filter(Boolean);
    };
    return filterFn(this.tree);
  }

  private loadRefPhysicians() {
    this.ivfApi.getRefPhysicians(1).subscribe({
      next: (rows: any[]) => { this.physicians = Array.isArray(rows) ? rows : []; },
      error: () => {}
    });
  }

  private loadNurses() {
    this.ivfApi.getRefPhysicians(7).subscribe({
      next: (rows: any[]) => { this.nurses = Array.isArray(rows) ? rows : []; },
      error: () => {}
    });
  }

  private loadNotifyRoles() {
    this.ivfApi.getNotifyRoles().subscribe({
      next: (rows: any[]) => { this.roles = Array.isArray(rows) ? rows : []; },
      error: () => {}
    });
  }

  getReceiverOptions(roleId: number | null | undefined) {
    if (roleId === 1) return this.physicians;
    if (roleId === 7) return this.nurses;
    return [];
  }

  onNotifyRoleChange(testId: number, roleId: number) {
    if (!this.details[testId]) return;
    // Clear receiver when role changes
    this.details[testId].receiverId = null;
    // Fetch fresh refs based on role
    if (roleId === 1) this.fetchRefByEmployeeType(1);
    else if (roleId === 7) this.fetchRefByEmployeeType(7);
  }

  private fetchRefByEmployeeType(employeeTypeId: number) {
    this.ivfApi.getRefPhysicians(employeeTypeId).subscribe({
      next: (rows: any[]) => {
        const list = Array.isArray(rows) ? rows : [];
        if (employeeTypeId === 1) this.physicians = list;
        else if (employeeTypeId === 7) this.nurses = list;
      },
      error: () => {}
    });
  }

  isSelected(id: number) { return this.selected.some(s => s.id === id); }
  isExpanded(id: number) { return this.expandedIds.has(id); }
  toggleExpand(id: number) { if (this.expandedIds.has(id)) this.expandedIds.delete(id); else this.expandedIds.add(id); }

  onLeafToggle(n: any, ev: any) {
    const checked = !!ev?.target?.checked;
    if (checked) {
      if (!this.selected.some(s => s.id === n.id)) {
        const item = {
          id: n.id,
          name: n.label,
          cpt: n.cptCode || '',
          sampleTypeId: n.sampleTypeId ?? null,
          sampleTypeName: n.sampleTypeName || '',
          status: 'New'
        };
        this.selected = [...this.selected, item];
        if (!this.details[n.id]) this.details[n.id] = this.defaultDetails();
      }
    } else {
      this.removeById(n.id);
    }
  }

  moveUp(i: number) { if (i > 0) { [this.selected[i-1], this.selected[i]] = [this.selected[i], this.selected[i-1]]; } }
  moveDown(i: number) { if (i < this.selected.length - 1) { [this.selected[i+1], this.selected[i]] = [this.selected[i], this.selected[i+1]]; } }
  removeAt(i: number) { const removed = this.selected.splice(i, 1)[0]; this.selected = [...this.selected]; delete this.details[removed?.id]; }
  removeById(id: number) { this.selected = this.selected.filter(s => s.id !== id); delete this.details[id]; }
  clearAll() { this.selected = []; this.details = {}; }

  onSave() {
    const perTests = this.selected.map(s => ({
      ...s,
      details: {
        status: this.mapStatusToBackend(s.status || 'New'),
        ...(this.details[s.id] || this.defaultDetails())
      }
    }));
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

  private prefillFromInitial(order: any) {
    const details = Array.isArray(order?.details) ? order.details : [];
    this.selected = [];
    this.details = {};
    details.forEach((d: any) => {
      const id = Number(d.labTestId);
      const cpt = d.cptCode || '';
      const name = cpt || `Test ${id}`;
      if (!this.selected.some(s => s.id === id)) {
        this.selected.push({ id, name, cpt, status: this.mapStatusFromBackend(d.status) });
      }
      this.details[id] = {
        refPhysicianId: d.referralId ?? null,
        notifyRoleId: null,
        receiverId: null,
        orderSite: d.sendToLabId ?? '',
        siteType: '',
        comments: d.pComments ?? ''
      };
    });
  }

  private mapStatusToBackend(ui: string): string {
    const s = (ui || '').toLowerCase();
    if (s === 'new') return 'NEW';
    if (s === 'open') return 'OPEN';
    if (s === 'in progress') return 'IN_PROGRESS';
    if (s === 'sample collected') return 'SAMPLE_COLLECTED';
    if (s === 'completed') return 'COMPLETED';
    if (s === 'cancel') return 'CANCEL';
    return 'NEW';
  }

  private mapStatusFromBackend(api: string | null | undefined): string {
    const s = (api || '').toUpperCase();
    if (s === 'NEW') return 'New';
    if (s === 'OPEN') return 'Open';
    if (s === 'IN_PROGRESS') return 'In Progress';
    if (s === 'SAMPLE_COLLECTED') return 'Sample Collected';
    if (s === 'COMPLETED') return 'Completed';
    if (s === 'CANCEL') return 'Cancel';
    return 'New';
  }

}
