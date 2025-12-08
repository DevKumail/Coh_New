import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { IVFApiService } from '@/app/shared/Services/IVF/ivf.api.service';
import { PatientBannerService } from '@/app/shared/Services/patient-banner.service';
import { SharedService } from '@/app/shared/Services/Common/shared-service';
import { Page } from '@/app/shared/enum/dropdown.enum';
import Swal from 'sweetalert2';
import { ClinicalApiService } from '@/app/views/clinical/clinical.api.service';
import { AddLabOrderComponent } from '@/app/views/ivf/ivf-patient-summary/male-sections/lab-diagnostics/add-lab-order.component';
import { IvfOrderCompletionComponent } from '@/app/shared/components/ivf-order-completion/ivf-order-completion.component';

@Component({
  selector: 'app-cycle-overview',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FullCalendarModule, HttpClientModule, NgbDropdownModule, AddLabOrderComponent, IvfOrderCompletionComponent],
  templateUrl: './cycle-overview.component.html',
  styleUrls: ['./cycle-overview.component.scss']
})
export class CycleOverviewComponent {

  constructor(
    private modalService: NgbModal,
    private api: IVFApiService,
    private sharedservice: SharedService,
    private patientBanner: PatientBannerService,
    private clinicalApiService: ClinicalApiService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private http: HttpClient) { }


  // Patient context
  mrNo: string | null = null;
  cycleId: any;
  // Mock data for UI display
  AllDropdownValues: any = [];
  dropdowns: any = [];
  // Keep dynamic medications list (rendered as resources)
  private medsResources: Array<{ id: string; title: string; eventColor: string; order: number }> = [
    // { id: 'gonad', title: 'Gonad F Pun [IVF]', eventColor: '#87CEEB', order: 5 },
    // { id: 'ovitrelle', title: 'Ovitrelle [ivg]', eventColor: '#FFA500', order: 6 },
    // { id: 'progesterone-mg', title: 'Progesterone [mg]', eventColor: '#90EE90', order: 7 },
    // { id: 'oestrogen', title: 'Oestrogen [mg]', eventColor: '#FF69B4', order: 8 },
    // { id: 'estradiol', title: 'Estradiol [mg]', eventColor: '#FFFF00', order: 9 },
  ];

  // FullCalendar Options
  calendarOptions: any = {
    plugins: [resourceTimelinePlugin, interactionPlugin, dayGridPlugin],
    initialView: 'resourceTimelineMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'resourceTimelineMonth'
    },
    height: 'auto',
    resourceAreaWidth: '250px', // Width for resources column
    slotMinWidth: 50, // Minimum width for each day slot
    eventMinHeight: 25, // Minimum height for events to show text
    displayEventTime: false, // Don't show time on events
    displayEventEnd: false, // Don't show end time
    // Force resource rows order using a numeric 'order' field on each resource
    resourceOrder: 'order',
    resources: [],
    events: [],
    eventClick: this.handleEventClick.bind(this),
    eventContent: this.renderEventContent.bind(this),
    eventDidMount: this.handleEventDidMount.bind(this),
    resourceLabelDidMount: this.handleResourceLabelDidMount.bind(this),
    dateClick: this.handleDateClick.bind(this),
    dayHeaderDidMount: this.handleDayHeaderDidMount.bind(this),
    dayCellDidMount: this.handleDayCellDidMount.bind(this),
    viewDidMount: this.handleViewDidMount.bind(this),
    datesSet: this.handleDatesSet.bind(this)
  };

  ngOnInit() {
    this.loadCalendarEvents();
    this.rebuildResources();
    this.getAlldropdown();
    this.medicationSubtypes = this.medsResources.map(r => r.title);
    // default select today
    const today = new Date();
    this.selectedDate = today.toISOString().slice(0, 10);
    this.updateHighlightBg();

    // Read cycleId from query params instead of shared context
    this.route.queryParamMap.subscribe((qp) => {
      const idStr = qp.get('cycleId');
      const id = Number(idStr);
      if (Number.isFinite(id) && id > 0) {
        this.fetchOverviewData(id);
        this.cycleId = id 
      }
    });

    // Load MRN from patient banner (table2[0].mrNo pattern used elsewhere)
    try {
      const pdata = this.patientBanner.getPatientData();
      this.mrNo = pdata?.table2?.[0]?.mrNo || null;
    } catch {
      this.mrNo = null;
    }
  }

 

  private parseIds(val: any): number[] {
    try {
      if (Array.isArray(val)) {
        return val.map((x: any) => Number(x)).filter((n: any) => Number.isFinite(n));
      }
      const s = String(val || '').trim();
      if (!s) return [];
      return s
        .split(/[,\s]+/)
        .map((x: string) => Number(x))
        .filter((n: number) => Number.isFinite(n));
    } catch { return []; }
  }

  // Store payload from service for dynamic labels/options
  getAllDropdown(payload: { [key: string]: Array<{ valueId: number; name: string }> }) {
    this.dropdowns = payload || {};
  }

  getfrequency: any = []
  GetRoute: any = []
  roles: Array<{ roleId: number; roleName: string }> = []
  receivers: Array<{ employeeId: number; fullName: string }> = []


  getAlldropdown() {
    this.sharedservice.getDropDownValuesByName(Page.IVFEpisodeOverview).subscribe((res: any) => {
      this.AllDropdownValues = res;
      this.getAllDropdown(res);
    })

    // this.clinicalApiService.GetEMRRoute().then((res: any) => {
    //   this.GetRoute = res.result
    // })

    this.clinicalApiService.GetFrequency().then((res: any) => {
      this.getfrequency = res.result
    })

    this.clinicalApiService.GetEMRRoute().then((res: any) => {
      this.GetRoute = res.result
    })

    // Load Roles for Receiver section
    this.api.getAllRoles().subscribe({
      next: (res: any) => {
        this.roles = Array.isArray(res?.roles) ? res.roles : (Array.isArray(res) ? res : []);
      },
      error: () => { this.roles = []; }
    })

  }



  // Helper to read dropdown options by key
  options(key: string) {
    return (this.dropdowns && this.dropdowns[`IVFEpisodeOverview:${key}`]) || [];
  }

  private mapEventNameToId(name: string | null | undefined): number | null {
    const arr = this.options('Events');
    const nm = String(name || '').trim();
    const found = Array.isArray(arr) ? arr.find((o: any) => String(o?.name).trim() === nm) : undefined;
    return Number.isFinite(found?.valueId) ? Number(found.valueId) : null;
  }

  private getAppId(): number | null {
    try {
      const v = this.patientBanner.getSelectedVisit();
      const id = Number((v?.appId ?? v?.appointmentId ?? v?.id));
      return Number.isFinite(id) && id > 0 ? id : null;
    } catch {
      return null;
    }
  }

  private overviewData: any = null;
  overviewId: number | null = null;
  labInvestigationTypeId: number = 5;

  private fetchOverviewData(id: number) {
    this.api.getOverviewByEpisodeId(id).subscribe({
      next: (res) => {
        this.overviewData = res;
        const oid = Number((res as any)?.overviewId);
        this.overviewId = Number.isFinite(oid) ? oid : null;
        // Bind into calendar/resources if response carries calendar-like payload
        this.bindFromPayload(res as any);
      },
      error: (err) => {
        // console.error('Failed to load Overview data', err);
      }
    });
  }

  // Reset all dynamic calendar data/resources
  private resetCalendarBinding() {
    this.calendarData = [];
    this.medsResources = [];
    this.medResourceDrugMap = {} as any;
    this.rebuildResources();
    this.rebindEvents();
  }

  // Public entry to bind the UI from given payload structure
  bindFromPayload(payload: any) {
    try {
      if (!payload) return;
      const cal = Array.isArray(payload?.calender) ? payload.calender : [];
      // Clear existing before binding
      this.resetCalendarBinding();
      // Pre-populate Medication resource rows from payload.resources[0].allMedications
      try {
        const resArr = Array.isArray(payload?.resources) ? payload.resources : [];
        const allMeds = Array.isArray(resArr?.[0]?.allMedications) ? resArr[0].allMedications : [];
        let ord = 3;
        for (const m of allMeds) {
          const name = String(m?.drugName || '').trim();
          const idNum = Number(m?.drugId || 0);
          if (!name) continue;
          const slug = 'med-' + name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
          if (!this.medsResources.some(r => r.id === slug)) {
            this.medsResources.push({ id: slug, title: name, eventColor: '#5bc0de', order: ord++ });
            if (Number.isFinite(idNum) && idNum > 0) this.medResourceDrugMap[slug] = idNum;
          }
        }
        this.medicationSubtypes = this.medsResources.map(r => r.title);
      } catch { }
      const eventsToAdd: EventInput[] = [];

      // Add LMP event from dateOfLmp if present
      try {
        const lmpDate = payload?.dateOfLmp;
        if (lmpDate) {
          const lmpISO = new Date(lmpDate).toISOString();
          eventsToAdd.push({
            resourceId: 'events',
            title: 'LMP',
            start: lmpISO,
            backgroundColor: '#FF6B6B',
            extendedProps: { description: 'LMP (Last Menstrual Period)' }
          } as any);
        }
      } catch { }

      // Helper: add event row entries
      const pushEventMarker = (title: string, startISO: string, endISO?: string) => {
        if (!title || !startISO) return;
        eventsToAdd.push({
          resourceId: 'events',
          title,
          start: startISO,
          end: endISO || undefined,
          backgroundColor: '#0066cc',
          extendedProps: { description: `${title} added` }
        } as any);
      };

      // Helper: ensure medication resource row exists and return its id
      const ensureMedResource = (name: string, drugId?: number): string | null => {
        const title = String(name || '').trim();
        if (!title) return null;
        const slug = 'med-' + title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        if (!this.medsResources.some(r => r.id === slug)) {
          const nextOrder = (this.medsResources.length ? Math.max(...this.medsResources.map(r => r.order || 0)) + 1 : 3);
          this.medsResources.push({ id: slug, title, eventColor: '#5bc0de', order: nextOrder });
          if (Number.isFinite(Number(drugId)) && Number(drugId) > 0) this.medResourceDrugMap[slug] = Number(drugId);
          this.medicationSubtypes = this.medsResources.map(r => r.title);
        }
        return slug;
      };

      // Helper: iterate dates inclusive
      const eachDate = (start: string, end: string): string[] => {
        try {
          const s = new Date(start);
          const e = new Date(end || start);
          if (isNaN(s.getTime()) || isNaN(e.getTime())) return [];
          const out: string[] = [];
          const d = new Date(s);
          while (d <= e) {
            out.push(d.toISOString().slice(0, 10));
            d.setDate(d.getDate() + 1);
          }
          return out;
        } catch { return []; }
      };

      for (const block of cal) {
        // Events row
        const evs = Array.isArray(block?.events) ? block.events : [];
        for (const ev of evs) {
          const title = String(ev?.eventType || '').trim();
          const s = ev?.eventStartDate ? new Date(ev.eventStartDate).toISOString() : '';
          const e = ev?.eventEndDate ? new Date(ev.eventEndDate).toISOString() : undefined;
          if (title && s) pushEventMarker(title, s, e);
        }

        // Medications
        const meds = Array.isArray(block?.medications) ? block.medications : [];
        for (const m of meds) {
          const medName = String(m?.drugName || '').trim();
          const rid = ensureMedResource(medName, Number(m?.drugId || 0) || undefined);
          if (!rid) continue;
          const doseTitle = String(m?.dose || '0').trim() || '0';
          const start = m?.startDate ? String(m.startDate) : '';
          const stop = m?.stopDate ? String(m.stopDate) : start;
          const bgColor = this.drugColor(m) || '#5bc0de';
          // Render as one continuous bar: startDate .. stopDate (inclusive)
          const startDay = start ? String(start).slice(0, 10) : '';
          const stopDay = stop ? String(stop).slice(0, 10) : startDay;
          if (startDay) {
            const endExclusive = this.addOneDayISO(stopDay); // inclusive stop -> exclusive end
            eventsToAdd.push({
              resourceId: rid,
              title: doseTitle,
              start: startDay,
              end: endExclusive,
              backgroundColor: bgColor,
              extendedProps: {
                type: 'medication-dose',
                medicationName: medName,
                dose: doseTitle,
                date: startDay,
                start: startDay,
                end: stopDay,
                route: m?.routeName || m?.routeId || '',
                frequency: m?.frequency || '',
                quantity: m?.quantity || '',
                refills: m?.additionalRefills || '',
                samples: m?.samples || '',
                substitution: m?.substitution || '',
                instructions: m?.instructions || '',
                indications: m?.indications || '',
                medicationId: m?.medicationId || null,
                color: m?.color || '',
                applicationDomainName: m?.applicationDomainName || [],
                timeDetails: m?.timeDetails || []
              }
            } as any);
          }
        }

        // Ultrasound icons (placed on Examination row by createdDate)
        const usArr = Array.isArray((block as any)?.ultraSound) ? (block as any).ultraSound : [];
        for (const u of usArr) {
          const rawCreated = String((u as any)?.createdDate || '').trim();
          if (!rawCreated) continue;
          // Expecting format like '12/05/2025 09:17:58' -> treat as MM/DD/YYYY
          const [datePart] = rawCreated.split(' ');
          const pieces = (datePart || '').split('/');
          if (pieces.length !== 3) continue;
          const mNum = Number(pieces[0]);
          const dNum = Number(pieces[1]);
          const yNum = Number(pieces[2]);
          if (!Number.isFinite(dNum) || !Number.isFinite(mNum) || !Number.isFinite(yNum)) continue;
          
          // Format as YYYY-MM-DD directly without timezone conversion
          const startDay = `${yNum}-${String(mNum).padStart(2, '0')}-${String(dNum).padStart(2, '0')}`;
          const endExclusive = this.addOneDayISO(startDay);
          eventsToAdd.push({
            resourceId: 'orders',
            title: 'US',
            start: startDay,
            end: endExclusive,
            backgroundColor: '#6c757d',
            extendedProps: {
              type: 'ultrasound',
              reportId: (u as any)?.ivfLabOrderSetId,
              orderSetId: (u as any)?.orderSetId,
              orderSetDetailId: (u as any)?.orderSetDetailId,
              labResultId: (u as any)?.labResultId ?? (u as any)?.labTestId,
              createdDate: rawCreated
            }
          } as any);
        }
      }

      // Apply to calendar/resources
      // Important: set events first so resource filtering can see them
      this.calendarData = eventsToAdd;
      this.rebuildResources();
      this.rebindEvents();
    } catch { }
  }

  handleResourceLabelDidMount(arg: any) {
    const id = arg.resource?.id;
    const target = ['events', 'divider-meds', 'divider-hormones', 'orders', 'divider-ultrasound'];
    if (id && target.includes(id)) {
      const el: HTMLElement = arg.el;
      el.style.backgroundColor = '#D0D0D0';
      el.style.fontWeight = '700';
      el.style.color = '#333';
    }
    // Inject [+] button into Medication divider only
    if (id === 'divider-meds') {
      const el: HTMLElement = arg.el;
      // ensure we can absolutely position the button
      el.style.position = 'relative';
      // avoid duplicates
      if (!el.querySelector('.med-add-btn')) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn btn-sm btn-link med-add-btn';
        btn.title = 'Add medication';
        btn.style.position = 'absolute';
        btn.style.right = '6px';
        btn.style.top = '8px';
        btn.style.padding = '0 6px';
        btn.style.lineHeight = '1';
        btn.textContent = '+';
        btn.style.height = '20px';
        btn.style.width = '20px';
        btn.style.fontSize = 'xx-large';
        btn.style.color = '#333';
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.openAddMedModal();
        });
        el.appendChild(btn);
      }
    }
    // Inject [+] button into Hormones divider to open Lab Order UI (type 25)
    if (id === 'divider-hormones') {
      const el: HTMLElement = arg.el;
      el.style.position = 'relative';
      if (!el.querySelector('.hormone-add-btn')) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn btn-sm btn-link hormone-add-btn';
        btn.title = 'Add hormone lab order';
        btn.style.position = 'absolute';
        btn.style.right = '6px';
        btn.style.top = '8px';
        btn.style.padding = '0 6px';
        btn.style.lineHeight = '1';
        btn.textContent = '+';
        btn.style.height = '20px';
        btn.style.width = '20px';
        btn.style.fontSize = 'xx-large';
        btn.style.color = '#333';
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.labInvestigationTypeId = 25;
          this.openLabOrderCreateModal(this.selectedDate || new Date().toISOString().slice(0, 10));
        });
        el.appendChild(btn);
      }
    }
    // Inject delete icon into each Medication resource row
    if (id && this.medsResources.some(r => r.id === id)) {
      const el: HTMLElement = arg.el as HTMLElement;
      el.style.position = 'relative';
      // Ensure long medication names truncate with ellipsis and show full in tooltip
      try {
        const res = this.medsResources.find(r => r.id === id);
        if (res) {
          el.style.whiteSpace = 'nowrap';
          el.style.overflow = 'hidden';
          el.style.textOverflow = 'ellipsis';
          el.title = res.title;
        }
      } catch { }
      // avoid duplicates
      if (!el.querySelector('.med-del-btn')) {
        const del = document.createElement('button');
        del.type = 'button';
        del.className = 'btn btn-sm btn-link med-del-btn';
        del.title = 'Delete medication row';
        del.style.position = 'absolute';
        del.style.right = '0px';
        del.style.top = '-1px';
        del.style.padding = '0';
        del.style.lineHeight = '1';
        del.style.height = '20px';
        del.style.width = '20px';
        del.style.display = 'flex';
        del.style.alignItems = 'center';
        del.style.justifyContent = 'center';
        del.style.fontSize = 'xx-large';
        del.style.color = '#dc3545';
        // show a cross like the + add medication button
        del.textContent = '×';
        del.addEventListener('click', (e) => {
          e.stopPropagation();
          this.deleteMedicationResource(String(id));
        });
        el.appendChild(del);
      }
    }
  }

  // Keep a reusable array so we can append new items from the Add modal
  private calendarData: EventInput[] = [];
  newMedName: string = '';
  // Map resourceId -> drugId for medication rows
  private medResourceDrugMap: Record<string, number> = {};
  // Currently visible range in the calendar (ISO date strings, end exclusive)
  private visibleStart: string | null = null;
  private visibleEnd: string | null = null;
  drugs: Array<
    {
      drugId: number;
      drugName: string;
      dose?: string;
      packageSize?: string;
      packageName?: string;
      unit?: string;
      dosageForm?: string;
      form?: string;
      applicationDomain?: string;
      code?: string;
      drugCode?: string;
      greenRainCode?: string;
      GreenRainCode?: string;
      OldGreenRainCode?: string;
      genericName?: string;
      colour?: string;
      color?: string;
      colorHex?: string;
    }> = [];
  selectedDrugId: number | null = null;
  drugsPage = 1;
  drugsRowsPerPage = 10;
  drugsHasMore = true;
  drugsLoading = false;
  medSearch: string = '';
  private medSearchDebounce: any;
  addMedName: string = '';
  private selectedDate: string | null = null;
  private bgEvents: EventInput[] = [];
  private skipMedResetOnce: boolean = false;
  private editingMedicationId: number | null = null;

  private rebindEvents() {
    this.calendarOptions = { ...this.calendarOptions, events: [...this.calendarData, ...this.bgEvents] };
  }

  private rebuildResources() {
    // Headings + any dynamically added medication rows under Medication
    const staticTop = [
      { id: 'events', title: 'Events', eventColor: '#0066cc', order: 1 },
      { id: 'divider-meds', title: 'Medication', eventColor: '#eee', order: 2 },
    ];
    // Filter medication rows to only those with events in the visible range (if set)
    const medsBase = this.filterMedsByVisibleRange();
    const medsSorted = [...medsBase]
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((r, idx) => ({ id: r.id, title: r.title, eventColor: r.eventColor, order: 3 + idx }));
    const staticBottom = [
      { id: 'divider-hormones', title: 'Hormones', eventColor: '#eee', order: 3 + medsSorted.length },
      { id: 'orders', title: 'Examination', eventColor: '#6c757d', order: 4 + medsSorted.length },
      { id: 'divider-ultrasound', title: 'Follicle US', eventColor: '#eee', order: 5 + medsSorted.length },
    ];
    this.calendarOptions = { ...this.calendarOptions, resources: [...staticTop, ...medsSorted, ...staticBottom] };
  }

  addMedicationRow(name: string, drugId?: number) {
    const title = String(name || '').trim();
    if (!title) return;
    const slug = 'med-' + title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    if (this.medsResources.some(r => r.id === slug || r.title.toLowerCase() === title.toLowerCase())) return;
    const nextOrder = (this.medsResources.length ? Math.max(...this.medsResources.map(r => r.order || 0)) + 1 : 3);
    this.medsResources.push({ id: slug, title, eventColor: '#5bc0de', order: nextOrder });
    if (Number.isFinite(drugId)) {
      this.medResourceDrugMap[slug] = Number(drugId);
    }
    this.medicationSubtypes = this.medsResources.map(r => r.title);
    this.rebuildResources();
  }

  loadCalendarEvents() {
    const events: EventInput[] = [];

    // Save and bind
    this.calendarData = events;
    this.rebindEvents();
  }

  renderEventContent(arg: any) {
    const { event } = arg;
    const props = event.extendedProps || {};
    const resId = (event as any).getResources ? (event as any).getResources()[0]?.id : (event as any)?._def?.resourceIds?.[0];

    // Icons for lab
    if (props.type === 'lab-order') {
      return {
        html: `<div class="event-icon" style="font-size: 20px; cursor: pointer; text-align: center;">${event.title}</div>`
      };
    }

    // Ultrasound: show image from assets/images/ultra.png
    if (props.type === 'ultrasound') {
      return {
        html: `
          <div class="event-icon" style="cursor:pointer; text-align:center; display:flex; align-items:center; justify-content:center;">
            <img src="assets/images/ultra.png"
                 alt="Ultrasound"
                 style="width:32px;height:32px;object-fit:contain;display:inline-block;" />
          </div>
        `
      };
    }

    // Numeric boxes for doses/hormones/US metrics
    if (props.type === 'medication-dose' || props.type === 'hormone-level' || props.type === 'ultrasound-metric') {
      return {
        html: `<div class="dose-label" style="font-weight:600;font-size:13px;color:#000;text-align:center;padding:2px 4px;cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${event.title}</div>`
      };
    }

    // Events row markers - show short titles
    if (resId === 'events') {
      return {
        html: `<div style="font-weight:700;font-size:12px;color:#000;text-align:center;width:100%;height:100%;display:flex;align-items:center;justify-content:center;">${event.title}</div>`
      };
    }

    // Default: allow built-in rendering
    return undefined as any;
  }

  handleEventDidMount(info: any) {
    const props = info.event.extendedProps || {};
    if (props.description) {
      info.el.title = props.description;
    } else if (props.type === 'medication-dose') {
      const doseOnly = String(props.dose || '').trim();
      info.el.title = doseOnly;
    } else if (props.type === 'hormone-level') {
      info.el.title = `${props.hormoneName}: ${props.value}${props.status ? `\nStatus: ${props.status}` : ''}${props.notes ? `\n${props.notes}` : ''}`;
    } else if (props.type === 'lab-order') {
      info.el.title = `Lab Order: ${props.testName}\nStatus: ${props.status}`;
    } else if (props.type === 'ultrasound') {
      info.el.title = `Ultrasound Report #${props.reportId}\nClick for details`;
    } else if (props.type === 'ultrasound-metric') {
      info.el.title = `${props.metric}: ${props.value}${props.date ? `\nDate: ${props.date}` : ''}`;
    }
  }

  handleEventClick(info: any) {
    const event = info.event;
    const props = event.extendedProps;

    if (props.type === 'lab-order') {
      this.openLabOrderModal(props);
    } else if (props.type === 'ultrasound') {
      this.openUltrasoundCompletion(props);
    } else if (props.type === 'medication-dose') {
      this.openMedicationDoseModal({ ...props, start: event.startStr, end: event.endStr });
    } else if (props.type === 'hormone-level') {
      this.openHormoneLevelModal(props);
    }
  }

  openLabOrderModal(data: any) {
    this.labOrderDetail = data;
    this.labOrderModalRef = this.modalService.open(this.labOrderModal, { ariaLabelledBy: 'lab-title', size: 'lg', centered: true });
  }

  closeLabOrderModal() {
    if (this.labOrderModalRef) {
      try { this.labOrderModalRef.dismiss(); } catch { }
      this.labOrderModalRef = null;
    }
    this.labOrderDetail = null;
  }

  openUltrasoundModal(data: any) {
    this.ultrasoundDetail = data;
    this.ultrasoundModalRef = this.modalService.open(this.ultrasoundModal, { ariaLabelledBy: 'ultra-title', size: 'lg', centered: true });
  }

  closeUltrasoundModal() {
    if (this.ultrasoundModalRef) {
      try { this.ultrasoundModalRef.dismiss(); } catch { }
      this.ultrasoundModalRef = null;
    }
    this.ultrasoundDetail = null;
  }

  // Open shared IVF order completion screen (Tests Observations) for an ultrasound report
  private openUltrasoundCompletion(props: any) {
    const reportId = props?.orderSetId || props?.ivfLabOrderSetId || props?.reportId;
    if (!reportId) {
      return;
    }

    const orderSetId = Number(reportId);
    if (!Number.isFinite(orderSetId) || orderSetId <= 0) {
      return;
    }

    const labResultId = Number(props?.labResultId ?? props?.labTestId ?? 0);

    // If we have a labResultId, let IvfOrderCompletionComponent load
    // everything via getCollectionDetailsWithResults(labResultId)
    if (Number.isFinite(labResultId) && labResultId > 0) {
      const order: any = {
        orderSetId: orderSetId,
        orderNumber: props?.orderNumber || orderSetId,
      };

      const modalRef = this.modalService.open(IvfOrderCompletionComponent, {
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        centered: true
      });

      const cmp: any = modalRef.componentInstance;
      cmp.order = order;
      cmp.orderSetId = orderSetId;
      cmp.labResultId = labResultId;

      if (cmp.cancel && cmp.cancel.subscribe) {
        cmp.cancel.subscribe(() => {
          try { modalRef.close(); } catch { }
        });
      }
      if (cmp.completed && cmp.completed.subscribe) {
        cmp.completed.subscribe(() => {
          try { modalRef.close(); } catch { }
        });
      }

      return;
    }

    // Fallback: no labResultId, so load tests via collection-details
    this.api.getOrderCollectionDetails(orderSetId).subscribe({
      next: (res: any) => {
        const details = Array.isArray(res) ? res : (Array.isArray(res?.details) ? res.details : []);
        const tests = details.map((d: any) => ({
          id: d.labTestId ?? d.testId,
          orderSetDetailId: d.orderSetDetailId ?? d.id ?? d.labOrderSetDetailId,
          cpt: d.cptCode ?? d.cpt,
          name: d.testName ?? d.name ?? d.cptCode,
          sampleTypeName: d.materialName ?? d.material ?? d.sampleTypeName ?? d.sampleType,
          status: d.status
        }));

        const order: any = {
          orderSetId: orderSetId,
          orderNumber: props?.orderNumber || orderSetId,
        };

        const modalRef = this.modalService.open(IvfOrderCompletionComponent, {
          size: 'lg',
          backdrop: 'static',
          keyboard: false,
          centered: true
        });

        const cmp: any = modalRef.componentInstance;
        cmp.order = order;
        cmp.orderSetId = orderSetId;
        cmp.tests = tests; // pass mapped tests so UI can bind immediately
        cmp.labResultId = null;

        if (cmp.cancel && cmp.cancel.subscribe) {
          cmp.cancel.subscribe(() => {
            try { modalRef.close(); } catch { }
          });
        }
        if (cmp.completed && cmp.completed.subscribe) {
          cmp.completed.subscribe(() => {
            try { modalRef.close(); } catch { }
          });
        }
      },
      error: () => {
        // Silent fail; keep calendar responsive even if completion data cannot be loaded
      }
    });
  }

  openMedicationDoseModal(data: any) {
    this.medicationDetail = data;
    this.medicationModalRef = this.modalService.open(this.medicationModal, { ariaLabelledBy: 'med-title', size: 'md', centered: true });
  }

  closeMedicationModal() {
    if (this.medicationModalRef) {
      try { this.medicationModalRef.dismiss(); } catch { }
      this.medicationModalRef = null;
    }
    this.medicationDetail = null;
  }

  // Edit action from Medication Dose modal -> open Add Medication Resource Modal prefilled
  editMedicationFromDose() {
    const detail = this.medicationDetail || {};
    this.closeMedicationModal();
    // Open Add Medication Resource Modal with prefilled values
    this.buildMedForm();
    const medName = String(detail?.medicationName || '').trim();
    const dose = String(detail?.dose || '').trim();
    const route = String(detail?.route || '').trim();
    const frequency = String(detail?.frequency || '').trim();
    const quantity = String(detail?.quantity || '').trim();
    const refills = String(detail?.refills || detail?.additionalRefills || '').trim();
    const samples = String(detail?.samples || '').trim();
    const substitution = String(detail?.substitution || '').trim();
    const instructions = String(detail?.instructions || '').trim();
    const indications = String(detail?.indications || '').trim();
    const start = (detail?.start || '').slice(0, 10) || (this.selectedDate || new Date().toISOString().slice(0,10));
    const stop = (detail?.end || '').slice(0, 10) || start;
    const medicationId = detail?.medicationId || null;
    const color = detail?.color || '';
    
    // Extract application domain from applicationDomainName array
    let applicationDomainCategoryId: number | null = null;
    let applicationDomainName = '';
    try {
      const appDomainArr = detail?.applicationDomainName;
      if (Array.isArray(appDomainArr) && appDomainArr.length > 0) {
        const domainId = appDomainArr[0]?.applicationDomainId;
        applicationDomainCategoryId = Number.isFinite(Number(domainId)) ? Number(domainId) : null;
        applicationDomainName = appDomainArr[0]?.applicationDomainName || '';
        console.log('Application Domain extracted:', { applicationDomainCategoryId, applicationDomainName });
      }
    } catch (e) { 
      console.error('Error extracting application domain:', e);
    }
    
    // Extract time details from timeDetails array
    const timeDetailsArr = Array.isArray(detail?.timeDetails) ? detail.timeDetails : [];
    
    // compute duration (inclusive days)
    let duration: number | null = null;
    try {
      const sd = new Date(start + 'T00:00:00');
      const ed = new Date(stop + 'T00:00:00');
      const diff = Math.round((ed.getTime() - sd.getTime()) / (1000*60*60*24));
      duration = (isFinite(diff) ? Math.max(0, diff) : 0) + 1; // +1 for inclusive duration
    } catch { duration = null; }

    // Prefill key fields
    const patch: any = {
      startDate: start,
      stopDate: stop,
      duration: duration,
      strength: dose || this.medFG.get('strength')?.value,
      route: route || this.medFG.get('route')?.value,
      frequency: frequency || this.medFG.get('frequency')?.value,
      quantity: quantity || this.medFG.get('quantity')?.value,
      refills: refills || this.medFG.get('refills')?.value,
      samples: samples || this.medFG.get('samples')?.value,
      substitution: substitution || this.medFG.get('substitution')?.value,
      instructions: instructions || this.medFG.get('instructions')?.value,
      indication: indications || this.medFG.get('indication')?.value,
      applicationDomainCategoryId: applicationDomainCategoryId,
      applicationDomain: applicationDomainName
    };
    
    // Store medicationId for update operation
    this.editingMedicationId = medicationId;
    
    this.medFG.patchValue(patch);
    
    // Populate time fields from timeDetails
    this.adjustDoseTimes(frequency);
    if (timeDetailsArr.length > 0) {
      const doseTimesFA = this.doseTimesFA;
      timeDetailsArr.forEach((td: any, idx: number) => {
        if (idx < doseTimesFA.length) {
          const timeStr = String(td?.time || '').trim();
          if (timeStr) {
            // Convert "HH:mm:ss" to "HH:mm" for time input
            const timeParts = timeStr.split(':');
            const formattedTime = timeParts.length >= 2 ? `${timeParts[0]}:${timeParts[1]}` : timeStr;
            doseTimesFA.at(idx)?.setValue(formattedTime);
          }
        }
      });
    }
    
    // help search: put med name into the search box
    this.medSearch = medName;
    // open modal
    this.skipMedResetOnce = true;
    this.openAddMedModal();
    // re-apply patch after modal open in case any reset occurred
    setTimeout(() => {
      try { 
        this.medFG.patchValue(patch);
        console.log('Patch applied:', patch);
        // Explicitly set application domain again
        if (applicationDomainCategoryId) {
          this.medFG.get('applicationDomainCategoryId')?.setValue(applicationDomainCategoryId);
          console.log('Application Domain set to:', applicationDomainCategoryId);
          console.log('Form value after setting:', this.medFG.get('applicationDomainCategoryId')?.value);
        }
        // Re-populate time fields after modal opens
        if (timeDetailsArr.length > 0) {
          const doseTimesFA = this.doseTimesFA;
          timeDetailsArr.forEach((td: any, idx: number) => {
            if (idx < doseTimesFA.length) {
              const timeStr = String(td?.time || '').trim();
              if (timeStr) {
                const timeParts = timeStr.split(':');
                const formattedTime = timeParts.length >= 2 ? `${timeParts[0]}:${timeParts[1]}` : timeStr;
                doseTimesFA.at(idx)?.setValue(formattedTime);
              }
            }
          });
        }
      } catch (e) { 
        console.error('Error in setTimeout patch:', e);
      }
    }, 100);
    // try auto-select the medication after the list loads
    setTimeout(() => {
      try {
        const match = this.drugs.find(x => String(x?.drugName || '').trim().toLowerCase() === medName.toLowerCase());
        if (match) this.pickDrug(match);
        // Re-apply application domain after drug is picked
        if (applicationDomainCategoryId) {
          this.medFG.get('applicationDomainCategoryId')?.setValue(applicationDomainCategoryId);
        }
      } catch { }
    }, 650);
  }

  openHormoneLevelModal(data: any) {
    this.hormoneDetail = data;
    this.hormoneModalRef = this.modalService.open(this.hormoneModal, { ariaLabelledBy: 'hormone-title', size: 'md', centered: true });
  }

  closeHormoneModal() {
    if (this.hormoneModalRef) {
      try { this.hormoneModalRef.dismiss(); } catch { }
      this.hormoneModalRef = null;
    }
    this.hormoneDetail = null;
  }

  // Calendar dates for custom timeline (if needed)
  calendarDates = Array.from({ length: 30 }, (_, i) => i + 1);

  // Ultrasound examination data
  ultrasoundData = [
    { label: 'Examination', values: ['', ''] },
    { label: 'US Exam US', values: ['', ''] },
    { label: 'Endom. [mm]', values: ['3', '6'] },
    { label: 'Total', values: ['28', '28'] },
    { label: 'Left lead. foll.', values: ['22', '22'] },
    { label: 'Right lead. foll.', values: ['21', '21'] },
    { label: 'R.E. above 22', values: ['', ''] }
  ];

  // ---------------------- Add-from-calendar modal state & handlers ----------------------
  @ViewChild('addEventModal') addEventModal!: TemplateRef<any>;
  @ViewChild('addDoseModal') addDoseModal!: TemplateRef<any>;
  @ViewChild('addHormoneAddModal') addHormoneAddModal!: TemplateRef<any>;
  @ViewChild('addMedModal') addMedModal!: TemplateRef<any>;
  @ViewChild('ultrasoundModal') ultrasoundModal!: TemplateRef<any>;
  @ViewChild('labOrderModal') labOrderModal!: TemplateRef<any>;
  @ViewChild('labOrderCreateModal') labOrderCreateModal!: TemplateRef<any>;
  @ViewChild('medicationModal') medicationModal!: TemplateRef<any>;
  @ViewChild('hormoneModal') hormoneModal!: TemplateRef<any>;
  addModalRef: any;
  addMedModalRef: any;
  ultrasoundModalRef: any;
  ultrasoundDetail: any = null;
  labOrderModalRef: any;
  labOrderDetail: any = null;
  labOrderCreateModalRef: any;
  medicationModalRef: any;
  medicationDetail: any = null;
  hormoneModalRef: any;
  hormoneDetail: any = null;
  addForm: {
    category: 'events' | 'medication' | 'hormone';
    subtype: string;
    title: string;
    start: string;
    end: string;
    resourceId: string;
  } = {
      category: 'events',
      subtype: '',
      title: '',
      start: '',
      end: '',
      resourceId: ''
    };

  // Medication modal form model
  medForm: {
    drugCode: string;
    applicationDomain: string;
    startDate: string;
    time: string;
    xDays: number | null;
    dailyDosage: string;
    dosageFrequency: string;
    presentationForm: string;
    application: string;
    additionalInfo: string;
    packaging: string;
    note: string;
  } = {
      drugCode: '',
      applicationDomain: '',
      startDate: '',
      time: '',
      xDays: null,
      dailyDosage: '',
      dosageFrequency: '',
      presentationForm: '',
      application: '',
      additionalInfo: '',
      packaging: '',
      note: ''
    };

  medFG: FormGroup = new FormGroup({});

  private buildMedForm() {
    if (!this.medFG || Object.keys(this.medFG.controls || {}).length === 0) {
      this.medFG = this.fb.group({
        drugCode: [''],
        packaging: [''],
        applicationDomain: [''],
        applicationDomainCategoryId: [null],
        startDate: [''],
        stopDate: [''],
        duration: [null],
        strength: [''],
        route: [''],
        frequency: [''],
        doseTimes: this.fb.array([]),
        quantity: [''],
        refills: [''],
        samples: [''],
        substitution: [''],
        instructions: [''],
        indication: [''],
        roleName: [null],
        receiverName: [null],
        internalOrder: [false],
        additionalInfo: [''],
        note: [''],
        presentationForm: [''],
        time: [''],
        xDays: [null],
        dailyDosage: [''],
        dosageFrequency: ['']
      });
      // Ensure read-only fields are disabled at form level as well
      this.medFG.get('drugCode')?.disable({ emitEvent: false });
      this.medFG.get('strength')?.disable({ emitEvent: false });
      // React to frequency changes
      this.medFG.get('frequency')?.valueChanges.subscribe(v => this.adjustDoseTimes(String(v || '')));
      // React to role changes to load receivers
      this.medFG.get('roleName')?.valueChanges.subscribe((roleId) => {
        const id = Number(roleId || 0);
        this.receivers = [];
        this.medFG.get('receiverName')?.reset(null);
        if (Number.isFinite(id) && id > 0) {
          this.api.getHREmployeesByRole(id).subscribe({
            next: (res: any) => {
              this.receivers = Array.isArray(res) ? res : (Array.isArray(res?.result) ? res.result : []);
            },
            error: () => { this.receivers = []; }
          });
        }
      });
    }
  }

  get doseTimesFA(): FormArray {
    return this.medFG.get('doseTimes') as FormArray;
  }

  private adjustDoseTimes(freq: string) {
    const s = (freq || '').toString().toLowerCase();
    let count = 0;
    if (s.includes('4 hourly')) count = 6;
    else if (s.includes('6 hourly')) count = 4;
    else if (s.includes('8 hourly')) count = 3;
    else if (s.includes('12 hourly')) count = 2;
    else if (s.includes('once daily') || s === 'daily' || s.includes('at night')) count = 1;

    // Resize form array
    while (this.doseTimesFA.length < count) this.doseTimesFA.push(new FormControl(''));
    while (this.doseTimesFA.length > count) this.doseTimesFA.removeAt(this.doseTimesFA.length - 1);
  }

  pickDrug(d: any) {
    try {
      this.selectedDrugId = Number(d?.drugId) || null;
      const presentationForm = String(d?.form || d?.dosageForm || d?.dosageFormPackage || '').trim();
      const packaging = String(d?.packageName || d?.packageSize || '').trim();
      const drugCode = String(d?.code || d?.drugCode || d?.greenRainCode || d?.GreenRainCode || d?.OldGreenRainCode || '').trim();
      const strength = String(d?.dose || d?.strength || '').trim();
      const generic = String(d?.genericName || d?.DHA_GenericName || '').trim();
      this.medFG.patchValue({ presentationForm, packaging, drugCode, strength, additionalInfo: generic || this.medFG.get('additionalInfo')?.value });
      this.medForm.presentationForm = presentationForm;
      this.medForm.packaging = packaging;
      this.medForm.drugCode = drugCode;
      if (generic) this.medForm.additionalInfo = generic;
    } catch { }
  }
 
  saveAndDuplicate() {
    if (this.selectedDrugId) {
      const ovId = Number(this.overviewId || 0);
      if (!ovId) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Overview Id is not loaded. Go back to dashboard and reopen episode.', timer: 1000, showConfirmButton: false });
        return;
      }
      this.api.savePrescriptionMaster({ ivfPrescriptionMasterId: 0, overviewId: ovId, drugId: Number(this.selectedDrugId) })
        .subscribe({
          next: () => {
            const d = this.drugs.find(x => Number(x.drugId) === Number(this.selectedDrugId));
            const dose = d && (d.dose || '').trim();
            const label = d ? `${d.drugName}${dose ? ' | ' + dose : ''}` : '';
            if (label) this.addMedicationRow(label, Number(this.selectedDrugId));
            Swal.fire({ icon: 'success', title: 'Saved', text: 'Saved. You may add another.', timer: 1000, showConfirmButton: false });
          },
          error: (err: any) => {
            if (err && Number(err.status) === 200) {
              const d = this.drugs.find(x => Number(x.drugId) === Number(this.selectedDrugId));
              const dose = d && (d.dose || '').trim();
              const label = d ? `${d.drugName}${dose ? ' | ' + dose : ''}` : '';
              if (label) this.addMedicationRow(label, Number(this.selectedDrugId));
              Swal.fire({ icon: 'success', title: 'Saved', text: 'Saved. You may add another.', timer: 1000, showConfirmButton: false });
              return;
            }
            Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to save prescription.', timer: 1000, showConfirmButton: false });
          }
        });
      return;
    }
    const label = (this.addMedName || '').trim();
    if (label) {
      this.addMedicationRow(label);
      Swal.fire({ icon: 'success', title: 'Added', text: 'Medication row added. You may add another.', timer: 1000, showConfirmButton: false });
    }
  }

  // Normalize color from API to valid CSS color for the dropdown table
  drugColor(d: any): string {
    try {
      const raw = d?.colorHex || d?.colour || d?.color;
      if (!raw) return '#ccc';
      const val = String(raw).trim();
      if (/^(#|rgb\(|rgba\(|hsl\(|hsla\()/i.test(val)) return val;
      if (/^\d+\s*,\s*\d+\s*,\s*\d+$/i.test(val)) return `rgb(${val})`;
      return val;
    } catch { return '#ccc'; }
  }

  // Dynamic: Event subtypes from dropdowns; fallback to defaults if empty
  get eventSubtypes(): string[] {
    const arr = this.options('Events');
    if (Array.isArray(arr) && arr.length) {
      return arr.map((o: any) => o?.name).filter((s: any) => !!s);
    }
    return [];
  }
  medicationSubtypes: string[] = [
    // 'Gonad F Pun [IVF]', 
    // 'Ovitrelle [ivg]', 
    // 'Progesterone [mg]', 
    // 'Oestrogen [mg]', 
    // 'Estradiol [mg]'
  ];
  hormoneSubtypes: string[] = ['FSH [mIU/ml]', 'hCG [ng/ml]', 'LH [mIU/ml]', 'Progesterone [ng/ml]'];

  handleDateClick(arg: any) {
    const resId: string = arg?.resource?.id || '';
    const clickedDate: string = arg?.dateStr || '';
    this.setSelectedDate(clickedDate);

    // Prevent modal from opening when clicking on divider rows
    if (resId === 'divider-meds' || resId === 'divider-hormones' || resId === 'divider-ultrasound') {
      return;
    }

    // If Examination row is clicked, open Lab Order modal instead of generic add modal
    if (resId === 'orders') {
      this.labInvestigationTypeId = 5;
      this.openLabOrderCreateModal(clickedDate);
      return;
    }

    // Determine category by resource id
    let category: 'events' | 'medication' | 'hormone' = 'events';
    const medIds = new Set(this.medsResources.map(r => r.id));
    if (medIds.has(resId)) {
      category = 'medication';
    } else if (['fsh', 'hcg-ng', 'lh', 'progesterone-ng'].includes(resId)) {
      category = 'hormone';
      this.labInvestigationTypeId = 25;
    }

    this.addForm = {
      category,
      subtype: '',
      title: '',
      start: clickedDate,
      end: clickedDate,
      resourceId: resId
    };

    // Default subtype based on resource clicked
    if (category === 'events') {
      this.addForm.subtype = this.eventSubtypes[0] || '';
    } else if (category === 'medication') {
      const med = this.medsResources.find(r => r.id === resId);
      this.addForm.subtype = med?.title || (this.medicationSubtypes[0] || '');
    } else {
      this.addForm.subtype = this.hormoneSubtypes[0] || '';
    }

    // Open appropriate modal
    if (category === 'medication') {
      // Open Add Medication Resource Modal
      this.openAddMedModal();
    } else if (category === 'hormone') {
      // For hormone rows, open Lab Order UI using investigation type 25
      this.openLabOrderCreateModal(clickedDate);
    } else {
      this.openAddModal();
    }
  }

  private setSelectedDate(dateStr: string) {
    if (!dateStr) return;
    const prev = this.selectedDate;
    this.selectedDate = dateStr;
    this.updateHighlightBg();

    // Ensure Reactive form exists
    this.buildMedForm();
  }

  handleDayHeaderDidMount(arg: any) {
    let dateStr = arg?.date?.toISOString?.().slice(0, 10) as string | undefined;
    const el: HTMLElement = arg.el;
    if (!dateStr) {
      // fallback: many FullCalendar headers carry data-date
      const attr = el.getAttribute('data-date');
      if (attr) dateStr = attr;
    }
    if (!dateStr) return;
    el.style.cursor = 'pointer';
    el.addEventListener('click', () => this.setSelectedDate(dateStr!));
    // background event will paint the column; no direct class needed
  }

  handleDayCellDidMount(arg: any) {
    // no-op; background event handles the highlight
  }

  handleViewDidMount() {
    // Bind clicks on the timeline header slots (resourceTimeline header)
    this.bindHeaderClicks();
    // Ensure resources reflect current visible range after first render
    this.rebuildResources();
  }

  handleDatesSet(arg: any) {
    // Capture visible range and rebind header clicks
    try {
      const s = arg?.startStr || arg?.start;
      const e = arg?.endStr || arg?.end;
      const sDay = typeof s === 'string' ? s.slice(0,10) : (s ? new Date(s).toISOString().slice(0,10) : null);
      const eDay = typeof e === 'string' ? e.slice(0,10) : (e ? new Date(e).toISOString().slice(0,10) : null);
      this.visibleStart = sDay;
      this.visibleEnd = eDay;
    } catch {
      this.visibleStart = null;
      this.visibleEnd = null;
    }
    // Rebind after navigation (prev/next/today)
    this.bindHeaderClicks();
    // Rebuild resources to reflect visible range
    this.rebuildResources();
  }

  private bindHeaderClicks() {
    // resourceTimeline header cells usually live under .fc-timeline-header .fc-timeline-slot
    const headerSlots = document.querySelectorAll('.fc-timeline-header .fc-timeline-slot');
    headerSlots.forEach((el: Element) => {
      const h = el as HTMLElement;
      const dateStr = h.getAttribute('data-date');
      if (!dateStr) return;
      h.style.cursor = 'pointer';
      // avoid duplicate listeners
      h.removeEventListener('click', (h as any).__fcClick || (() => { }));
      const handler = () => this.setSelectedDate(dateStr);
      (h as any).__fcClick = handler;
      h.addEventListener('click', handler);
    });
  }

  private updateHighlightBg() {
    // remove previous bg highlight event
    this.bgEvents = this.bgEvents.filter(e => e.id !== '__col_highlight');
    if (!this.selectedDate) {
      this.calendarOptions = { ...this.calendarOptions, events: [...this.calendarData, ...this.bgEvents] };
      return;
    }
    const start = this.selectedDate;
    const end = this.addOneDayISO(start);
    this.bgEvents.push({
      id: '__col_highlight',
      start,
      end,
      display: 'background',
      backgroundColor: 'rgba(0,123,255,0.18)'
    } as any);
    // rebind events combining data + bg
    this.rebindEvents();
  }

  private addOneDayISO(dateStr: string): string {
    const d = new Date(dateStr + 'T00:00:00');
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  }

  private deleteMedicationResource(resourceId: string) {
    try {
      const drugId = this.medResourceDrugMap[resourceId];
      const ovId = Number(this.overviewId || 0);
 
      if (!this.cycleId) {
        Swal.fire({ icon: 'error', title: 'Cycle not loaded', text: 'Cycle Id is not loaded.', showConfirmButton: true });
        return;
      }
      Swal.fire({
        icon: 'warning',
        title: 'Remove medication row?',
        text: 'This will remove all schedules for this drug from the cycle.',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel'
      }).then((res) => {
        if (!res.isConfirmed) return;
        this.api.deletePrescriptionMaster(this.cycleId, Number(drugId)).subscribe({
          next: () => {
            // Remove resource and its events locally
            this.medsResources = this.medsResources.filter(r => r.id !== resourceId);
            delete this.medResourceDrugMap[resourceId];
            this.calendarData = this.calendarData.filter(ev => (ev as any).resourceId !== resourceId);
            this.rebuildResources();
            this.rebindEvents();
            this.fetchOverviewData(this.cycleId);
            Swal.fire({ icon: 'success', title: 'Deleted', text: 'Medication removed.', timer: 1000, showConfirmButton: false });
          },
          error: (err: any) => {
            // Some servers may return 200 in error channel
            if (err && Number(err.status) === 200) {
              this.medsResources = this.medsResources.filter(r => r.id !== resourceId);
              delete this.medResourceDrugMap[resourceId];
              this.calendarData = this.calendarData.filter(ev => (ev as any).resourceId !== resourceId);
              this.rebuildResources();
              this.rebindEvents();
              this.fetchOverviewData(this.cycleId);
              Swal.fire({ icon: 'success', title: 'Deleted', text: 'Medication removed.', timer: 1000, showConfirmButton: false });
              return;
            }
            Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to delete medication.', timer: 1200, showConfirmButton: false });
          }
        });
      });
    } catch {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to delete medication.', timer: 1200, showConfirmButton: false });
    }
  }

  private toDay(v: any): string | null {
    if (!v) return null;
    if (typeof v === 'string' && v.length >= 10) return v.slice(0, 10);
    try {
      const d = new Date(v);
      if (isNaN(d.getTime())) return null;
      return d.toISOString().slice(0, 10);
    } catch { return null; }
  }

  // Always show all medication resources without filtering by visible date range
  private filterMedsByVisibleRange() {
    return this.medsResources;
  }

  openLabOrderCreateModal(date: string) {
    try {
      this.labOrderCreateModalRef = this.modalService.open(this.labOrderCreateModal, { size: 'xl', centered: true });
    } catch { }
  }

  closeLabOrderCreateModal() {
    if (this.labOrderCreateModalRef) {
      try { this.labOrderCreateModalRef.dismiss(); } catch { }
      this.labOrderCreateModalRef = null;
    }
  }

  onLabOrderCreateSave(evt: { tests: any[]; details: any; header?: any }) {
    if (!evt || !Array.isArray(evt.tests) || evt.tests.length === 0) {
      Swal.fire({ icon: 'warning', title: 'No tests selected', text: 'Please select at least one test.', timer: 1200, showConfirmButton: false });
      return;
    }

    const mrNoNum = Number(this.mrNo || 0);
    if (!mrNoNum) {
      Swal.fire({ icon: 'error', title: 'MRN not found', text: 'Patient MRN is missing. Please load patient in banner.', timer: 1500, showConfirmButton: false });
      return;
    }

    const visitId = this.getAppId();
    if (!visitId) {
      Swal.fire({ icon: 'error', title: 'Visit not found', text: 'Appointment/visit is not loaded.', timer: 1500, showConfirmButton: false });
      return;
    }

    const ovId = Number(this.overviewId || 0);
    if (!ovId) {
      Swal.fire({ icon: 'error', title: 'Overview not loaded', text: 'Overview Id is not loaded. Go back to dashboard and reopen episode.', timer: 1500, showConfirmButton: false });
      return;
    }

    const now = new Date().toISOString();

    // Derive provider from per-test refPhysicianId
    const providerFromPhysician = Number(
      (evt.tests || [])
        .find(t => (t?.details?.refPhysicianId ?? null) !== null && (t?.details?.refPhysicianId ?? undefined) !== undefined)
        ?.details?.refPhysicianId ?? 0
    );
    const providerId = Number.isFinite(providerFromPhysician) && providerFromPhysician > 0
      ? providerFromPhysician
      : 0;

    const header = {
      mrNo: mrNoNum,
      providerId,
      orderDate: now,
      visitAccountNo: Number(visitId),
      createdBy: providerId || 0,
      createdDate: now,
      orderControlCode: 'NW',
      orderStatus: 'NEW',
      isHL7MsgCreated: false,
      isHL7MessageGeneratedForPhilips: false,
      isSigned: false,
      overviewId: ovId,
    } as any;

    const details = (evt.tests || []).map((t: any) => ({
      labTestId: Number(t.id),
      cptCode: t.cpt || '',
      orderQuantity: 1,
      investigationTypeId: this.labInvestigationTypeId || 5,
      billOnOrder: 1,
      pComments: (evt.details && evt.details.comments) || '',
    }));

    this.api.createLabOrder({ header, details } as any).subscribe({
      next: () => {
        Swal.fire({ icon: 'success', title: 'Lab order saved', text: 'Lab order has been created.', timer: 1200, showConfirmButton: false });
        this.closeLabOrderCreateModal();
      },
      error: () => {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to create lab order.', timer: 1500, showConfirmButton: false });
      },
    });
  }

  openAddModal() {
    let tpl: any;
    if (this.addForm.category === 'events') {
      tpl = this.addEventModal;
    } else if (this.addForm.category === 'medication') {
      tpl = this.addDoseModal;
    } else if (this.addForm.category === 'hormone') {
      tpl = this.addHormoneAddModal;
    }
    if (tpl) {
      this.addModalRef = this.modalService.open(tpl, { ariaLabelledBy: 'modal-basic-title', size: 'md', centered: true });
    }
  }

  closeAddModal() {
    if (this.addModalRef) {
      try { this.addModalRef.dismiss(); } catch { }
      this.addModalRef = null;
    }
  }

  submitAddForm() {
    const f = this.addForm;
    let newEvent: EventInput | null = null;

    if (f.category === 'events') {
      // Map event subtype to color
      const colors: any = { LMP: '#FF6B6B', OT: '#90EE90', TRIG: '#ffc107', OPU: '#dc3545', FERT: '#fd7e14', ET: '#6f42c1', CS: '#0066cc' };
      newEvent = {
        resourceId: 'events',
        title: f.subtype || 'Event',
        start: f.start,
        end: f.end || undefined,
        backgroundColor: colors[f.subtype] || '#0066cc',
        extendedProps: { description: `${f.subtype || 'Event'} added` }
      };
      // Validate and Save via API
      const appId = this.getAppId();
      if (!appId) {
        Swal.fire({ icon: 'warning', title: 'No visit', text: 'Please load patient. There is no visit.', timer: 1000, showConfirmButton: false });
      }
      const categoryId = this.mapEventNameToId(f.subtype) || 0;
      if (!categoryId) {
        Swal.fire({ icon: 'warning', title: 'Invalid type', text: 'Please select a valid Event type.', timer: 1000, showConfirmButton: false });
      }
      const ovId = this.overviewId || 0;
      if (!ovId) {
        Swal.fire({ icon: 'error', title: 'Overview not loaded', text: 'Open an episode to continue.', timer: 1000, showConfirmButton: false });
      }
      const startISO = f.start ? new Date(f.start).toISOString() : '';
      const endISO = f.end ? new Date(f.end).toISOString() : startISO;
      if (!startISO) {
        Swal.fire({ icon: 'warning', title: 'Missing start date', text: 'Start date is required.', timer: 1000, showConfirmButton: false });
      }
      if (startISO && endISO && new Date(endISO) < new Date(startISO)) {
        Swal.fire({ icon: 'warning', title: 'Invalid dates', text: 'End date cannot be earlier than start date.', timer: 1000, showConfirmButton: false });
      }
      if (appId && categoryId && ovId && startISO && (!endISO || new Date(endISO) >= new Date(startISO))) {
        this.api.saveOverviewEvent({
          eventId: 0,
          appId: appId,
          categoryId,
          overviewId: ovId,
          startdate: startISO,
          enddate: endISO || startISO
        }).subscribe({ next: () => { }, error: () => { } });
      }
    } else if (f.category === 'medication') {
      // Use clicked resource for row; color from medsResources if found
      const med = this.medsResources.find(r => r.id === f.resourceId);
      const eventToAdd: EventInput = {
        resourceId: f.resourceId,
        title: f.title || '0',
        start: f.start,
        end: f.end || undefined,
        backgroundColor: med?.eventColor || '#5bc0de',
        extendedProps: { type: 'medication-dose', medicationName: f.subtype || (med?.title || 'Medication'), dose: f.title || '0', date: f.start }
      };
      // Integrate prescription-save
      const drugId = this.medResourceDrugMap[f.resourceId];
      if (!Number.isFinite(drugId)) {
        Swal.fire({ icon: 'warning', title: 'No Drug Linked', text: 'Please add the medication row from the + button first.', timer: 1000, showConfirmButton: false });
        return;
      }
      const appId = this.getAppId();
      if (!appId) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Visit (appointment) is not loaded.', timer: 1000, showConfirmButton: false });
        return;
      }
      const startISO = f.start ? new Date(f.start).toISOString() : '';
      const endISO = f.end ? new Date(f.end).toISOString() : startISO;
      if (!startISO) {
        Swal.fire({ icon: 'warning', title: 'Start date required', text: 'Please select a start date.', timer: 1000, showConfirmButton: false });
        return;
      }
      this.api.savePrescription({
        ivfPrescriptionMasterId: 0,
        drugId: Number(drugId),
        appointmentId: Number(appId),
        startDate: startISO,
        endDate: endISO,
      }).subscribe({
        next: () => {
          this.calendarData.push(eventToAdd);
          this.rebindEvents();
          this.closeAddModal();
        },
        error: (err: any) => {
          if (err && Number(err.status) === 200) {
            this.calendarData.push(eventToAdd);
            this.rebindEvents();
            this.closeAddModal();
            return;
          }
          Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to save prescription schedule.', timer: 1000, showConfirmButton: false });
        }
      });
      return;
    } else if (f.category === 'hormone') {
      const map: any = {
        'FSH [mIU/ml]': 'fsh',
        'hCG [ng/ml]': 'hcg-ng',
        'LH [mIU/ml]': 'lh',
        'Progesterone [ng/ml]': 'progesterone-ng'
      };
      const rid = map[f.subtype] || f.resourceId || 'fsh';
      newEvent = {
        resourceId: rid,
        title: f.title || '0',
        start: f.start,
        end: f.end || undefined,
        backgroundColor: '#87CEEB',
        extendedProps: { type: 'hormone-level', hormoneName: f.subtype || 'Hormone', value: f.title || '0', date: f.start, status: 'Normal' }
      };
    }

    if (newEvent) {
      this.calendarData.push(newEvent);
      this.rebindEvents();
    }

    this.closeAddModal();
  }

  openAddMedModal() {
    // reset form and selections
    this.addMedName = '';
    this.selectedDrugId = null;
    this.medForm = {} as any;
    this.medSearch = '';
    this.loadDrugs(true);
    // Make sure form exists before template is instantiated
    this.buildMedForm();
    this.addMedModalRef = this.modalService.open(this.addMedModal, { size: 'lg', centered: true });
    // Preload an extra page to ensure scroll appears
    setTimeout(() => this.loadDrugs(false), 250);
    // default dates
    try {
      if (!this.skipMedResetOnce) {
        const sd = this.selectedDate || new Date().toISOString().slice(0, 10);
        this.medFG.reset({
          drugCode: '', packaging: '', applicationDomain: '', applicationDomainCategoryId: null, startDate: sd, stopDate: '', duration: null, strength: '', route: '',
          frequency: '', doseTimes: [], quantity: '', refills: '', samples: '', substitution: '', instructions: '', indication: '', roleName: '',
          receiverName: '', internalOrder: false, additionalInfo: '', note: '', presentationForm: '', time: '', xDays: null,
          dailyDosage: '', dosageFrequency: ''
        });
        this.adjustDoseTimes('');
        this.medForm.startDate = sd as any;
        this.editingMedicationId = null;
      }
      this.skipMedResetOnce = false;
    } catch { this.medForm.startDate = '' as any; }
  }

  private loadDrugs(reset: boolean = false) {
    if (this.drugsLoading) return;
    if (reset) {
      this.drugs = [];
      this.drugsPage = 1;
      this.drugsHasMore = true;
    }
    if (!this.drugsHasMore) return;
    this.drugsLoading = true;
    const kw = (this.medSearch || '').trim();
    const keyword = kw.length >= 3 ? kw : undefined;
    this.api.getAllDrugs(this.drugsPage, this.drugsRowsPerPage, keyword).subscribe({
      next: (res) => {
        const items = Array.isArray(res) ? res : (res?.items || []);
        this.drugs = [...this.drugs, ...items];
        this.drugsHasMore = Array.isArray(items) && items.length === this.drugsRowsPerPage;
        if (this.drugsHasMore) this.drugsPage += 1;
        this.drugsLoading = false;
      },
      error: () => {
        this.drugsLoading = false;
      }
    });
  }

  onDrugsScroll(e: any) {
    try {
      const el = (e?.currentTarget as HTMLElement) || (e?.target as HTMLElement);
      if (!el) return;
      const threshold = 40; // px from bottom
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - threshold) {
        this.loadDrugs(false);
      }
    } catch { }
  }

  onDrugChange(_e: any) {
    // If user selected the synthetic "Load more..." option (-1), fetch next page and reset selection
    if (this.selectedDrugId === -1) {
      this.selectedDrugId = null;
      this.loadDrugs(false);
    }
  }

  onLoadMoreClick(e: any) {
    try { e?.preventDefault?.(); e?.stopPropagation?.(); } catch { }
    this.loadDrugs(false);
  }

  onMedSearchChange() {
    if (this.medSearchDebounce) {
      try { clearTimeout(this.medSearchDebounce); } catch { }
    }
    this.medSearchDebounce = setTimeout(() => {
      const kw = (this.medSearch || '').trim();
      if (kw.length === 0 || kw.length >= 3) {
        this.loadDrugs(true);
      }
    }, 300);
  }

  get selectedDrugLabel(): string {
    if (this.selectedDrugId == null) return '';
    const d = this.drugs.find(x => Number(x.drugId) === Number(this.selectedDrugId));
    if (!d) return '';
    const dose = (d.dose || '').trim();
    return `${d.drugName}${dose ? ' | ' + dose : ''}`;
  }

  closeAddMedModal() {
    if (this.addMedModalRef) {
      try { this.addMedModalRef.dismiss(); } catch { }
      this.addMedModalRef = null;
    }
  }

  confirmAddMed() {
    // Build payload from reactive form and selected drug
    const ovId = Number(this.overviewId || 0);
    const appId = Number(this.getAppId() || 0);
    const drugId = Number(this.selectedDrugId || 0);
    if (!drugId) {
      Swal.fire({ icon: 'warning', title: 'Select drug', text: 'Please select a medication from the dropdown.', timer: 1200, showConfirmButton: false });
      return;
    }
    if (!ovId) {
      Swal.fire({ icon: 'error', title: 'Overview missing', text: 'Overview Id not loaded. Open the episode again.', timer: 1200, showConfirmButton: false });
      return;
    }

    const f = this.medFG?.getRawValue() || {};
    const toNullIfEmpty = (v: any) => {
      if (v === undefined || v === null) return null;
      if (typeof v === 'string' && v.trim() === '') return null;
      return v;
    };
    const toNullIfInvalidId = (v: any) => {
      const n = Number(v);
      return Number.isFinite(n) && n > 0 ? n : null;
    };
    const timesRaw: string[] = Array.isArray(f?.doseTimes) ? f.doseTimes.filter((x: any) => !!x) : [];
    const times = timesRaw.length ? timesRaw : null;
    const startISO = f?.startDate ? new Date(f.startDate).toISOString() : new Date().toISOString();
    const appDomIds = toNullIfInvalidId(f?.applicationDomainCategoryId) ? [Number(f.applicationDomainCategoryId)] : null;
    
    // Calculate stopDate from startDate + duration
    let stopDateISO = startISO;
    if (f?.duration && Number(f.duration) > 0) {
      const stopDate = new Date(f.startDate);
      stopDate.setDate(stopDate.getDate() + Number(f.duration) - 1); // -1 because duration is inclusive
      stopDateISO = stopDate.toISOString();
    } else if (f?.stopDate) {
      stopDateISO = new Date(f.stopDate).toISOString();
    }

    const body: any = {
      ivfPrescriptionMasterId: this.editingMedicationId || 0,
      overviewId: ovId,
      drugId: drugId,
      appId: appId,
      applicationDomainCategoryId: toNullIfEmpty(appDomIds),
      startDate: startISO,
      stopDate: stopDateISO,
      xDays: toNullIfInvalidId(f?.duration),
      time: times,
      dosageFrequency: toNullIfEmpty(f?.frequency),
      dailyDosage: toNullIfEmpty(f?.dailyDosage || f?.strength),
      routeCategoryId: toNullIfEmpty(f?.route),
      quantity: toNullIfEmpty(f?.quantity),
      additionalRefills: toNullIfEmpty(f?.refills),
      samples: toNullIfEmpty(f?.samples),
      instructions: toNullIfEmpty(f?.instructions),
      indications: toNullIfEmpty(f?.indication),
      substitution: toNullIfEmpty(f?.substitution),
      internalOrder: !!f?.internalOrder
    };

    this.api.savePrescriptionMasterFull(body).subscribe({
      next: () => {
        // Refresh calendar/resources from backend to reflect new medication
        this.closeAddMedModal();
        this.editingMedicationId = null;
        Swal.fire({ icon: 'success', title: 'Saved', text: 'Prescription saved successfully.', timer: 1200, showConfirmButton: false });
        this.fetchOverviewData(this.cycleId);
      },
      error: (err: any) => {
        if (err && Number(err.status) === 200) {
          this.fetchOverviewData(this.cycleId);
          this.closeAddMedModal();
          this.editingMedicationId = null;
          Swal.fire({ icon: 'success', title: 'Saved', text: 'Prescription saved successfully.', timer: 1200, showConfirmButton: false });
          return;
        }
        Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to save prescription.', timer: 1200, showConfirmButton: false });
      }
    });
  }
}
