import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { FormsModule } from '@angular/forms';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-cycle-overview',
  imports: [CommonModule, FormsModule, FullCalendarModule],
  templateUrl: './cycle-overview.component.html',
  styleUrls: ['./cycle-overview.component.scss']
})
export class CycleOverviewComponent {

  constructor(private modalService: NgbModal) { }

  // Mock data for UI display
  cycleInfo = {
    treatment: 'IVF/ICSI',
    ivfNo: '9',
    embryos: '2',
    dateOfLMP: '03/14/2008',
    downRegulation: 'GnRH Agonist (Long) (Faviston)',
    oocytes: '24',
    mainIndication: 'Both',
    protocol: '',
    ivfSpermCollection: 'Autograft ejaculation (Autograft ejaculation)',
    ivfAdditionalMeasures: 'Assisted hatching, Polar body biopsy',
    pidIndication: '',
    pidIndication2: '',
    ivfAccounting: ''
  };

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
    resources: [
      { id: 'events', title: 'Events', eventColor: '#0066cc', order: 1 },
      // Divider after events for medications section
      { id: 'divider-meds', title: 'Medication', eventColor: '#eee', order: 2 },
      { id: 'gonad', title: 'Gonad F Pun [IVF]', eventColor: '#87CEEB', order: 5 },
      { id: 'ovitrelle', title: 'Ovitrelle [ivg]', eventColor: '#FFA500', order: 6 },
      { id: 'progesterone-mg', title: 'Progesterone [mg]', eventColor: '#90EE90', order: 7 },
      { id: 'oestrogen', title: 'Oestrogen [mg]', eventColor: '#FF69B4', order: 8 },
      { id: 'estradiol', title: 'Estradiol [mg]', eventColor: '#FFFF00', order: 9 },
      // Divider before hormone rows
      { id: 'divider-hormones', title: 'Hormones', eventColor: '#eee', order: 10 },
      // Hormone rows
      { id: 'fsh', title: 'FSH [mIU/ml]', eventColor: '#87CEEB', order: 11 },
      { id: 'hcg-ng', title: 'hCG [ng/ml]', eventColor: '#FFD700', order: 12 },
      { id: 'lh', title: 'LH [mIU/ml]', eventColor: '#FFA500', order: 13 },
      { id: 'progesterone-ng', title: 'Progesterone [ng/ml]', eventColor: '#FFFF00', order: 14 },
      // Examination row (orders)
      { id: 'orders', title: 'Examination', eventColor: '#6c757d', order: 15 },
      // Divider and rows for Ultrasound Data section
      { id: 'divider-ultrasound', title: 'Follicle US', eventColor: '#eee', order: 16 },
      { id: 'us-endom', title: 'Endom. [mm]', eventColor: '#e0e0e0', order: 17 },
      { id: 'us-total', title: 'Total', eventColor: '#e0e0e0', order: 18 },
      { id: 'us-left', title: 'Left lead. foll.', eventColor: '#e0e0e0', order: 19 },
      { id: 'us-right', title: 'Right lead. foll.', eventColor: '#e0e0e0', order: 20 },
      { id: 'us-re-above', title: 'R.E. above 22', eventColor: '#e0e0e0', order: 21 }
    ],
    events: [],
    eventClick: this.handleEventClick.bind(this),
    eventContent: this.renderEventContent.bind(this),
    eventDidMount: this.handleEventDidMount.bind(this),
    resourceLabelDidMount: this.handleResourceLabelDidMount.bind(this),
    dateClick: this.handleDateClick.bind(this)
  };

  ngOnInit() {
    this.loadCalendarEvents();
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
  }

  // Keep a reusable array so we can append new items from the Add modal
  private calendarData: EventInput[] = [];

  loadCalendarEvents() {
    const events: EventInput[] = [
      // Events Row - All important cycle milestones
      {
        resourceId: 'events',
        title: 'CS',
        start: '2025-11-01',
        backgroundColor: '#0066cc',
        extendedProps: {
          description: 'IVF Treatment Cycle Started - Beginning of ovarian stimulation protocol'
        }
      },

      // Oocyte Triggering Phase shown in Events row (multi-day)
      {
        resourceId: 'events',
        title: 'OT',
        start: '2025-11-03',
        end: '2025-11-08',
        backgroundColor: '#90EE90',
        extendedProps: {
          description: 'Oocyte Triggering Phase - Final maturation window before retrieval'
        }
      },
      {
        resourceId: 'events',
        title: 'TRIG',
        start: '2025-11-13',
        backgroundColor: '#ffc107',
        extendedProps: {
          description: 'Trigger Shot (hCG) - Final oocyte maturation before retrieval'
        }
      },
      {
        resourceId: 'events',
        title: 'OPU',
        start: '2025-11-15',
        backgroundColor: '#dc3545',
        extendedProps: {
          description: 'Oocyte Pick-Up (OPU) - Egg retrieval procedure'
        }
      },
      {
        resourceId: 'events',
        title: 'FERT',
        start: '2025-11-16',
        backgroundColor: '#fd7e14',
        extendedProps: {
          description: 'Fertilization Day - ICSI/IVF procedure performed'
        }
      },
      {
        resourceId: 'events',
        title: 'ET',
        start: '2025-11-20',
        backgroundColor: '#6f42c1',
        extendedProps: {
          description: 'Embryo Transfer (ET) - Embryo implantation into uterus'
        }
      },

      // Last Period (LMP) - Start of cycle
      {
        resourceId: 'events',
        title: 'LMP',
        start: '2025-11-07',
        end: '2025-11-13',
        backgroundColor: '#FF6B6B',
        extendedProps: {
          description: 'Last Menstrual Period (LMP) - Start of menstrual cycle'
        }
      },

      // Examination row background band (dark gray across the month)
      {
        resourceId: 'orders',
        start: '2025-11-01',
        end: '2025-12-01',
        display: 'background',
        backgroundColor: '#D0D0D0'
      },

      // Medication divider background band (dark gray across the month)
      {
        resourceId: 'divider-meds',
        start: '2025-11-01',
        end: '2025-12-01',
        display: 'background',
        backgroundColor: '#D0D0D0'
      },

      // Hormones divider background band (dark gray across the month)
      {
        resourceId: 'divider-hormones',
        start: '2025-11-01',
        end: '2025-12-01',
        display: 'background',
        backgroundColor: '#D0D0D0'
      },

      // Ultrasound Data divider background band (dark gray across the month)
      {
        resourceId: 'divider-ultrasound',
        start: '2025-11-01',
        end: '2025-12-01',
        display: 'background',
        backgroundColor: '#D0D0D0'
      },

      // Follicle US metrics - sample data points (single-day boxes)
      // 1) Endometrium thickness (mm)
      {
        resourceId: 'us-endom',
        title: '3',
        start: '2025-11-08',
        end: '2025-11-09',
        extendedProps: {
          type: 'ultrasound-metric',
          metric: 'Endometrium',
          value: '3 mm',
          date: '2025-11-08'
        }
      },
      {
        resourceId: 'us-endom',
        title: '6',
        start: '2025-11-15',
        end: '2025-11-16',
        extendedProps: {
          type: 'ultrasound-metric',
          metric: 'Endometrium',
          value: '6 mm',
          date: '2025-11-15'
        }
      },
      {
        resourceId: 'us-endom',
        title: '9',
        start: '2025-11-22',
        end: '2025-11-23',
        extendedProps: {
          type: 'ultrasound-metric',
          metric: 'Endometrium',
          value: '9 mm',
          date: '2025-11-22'
        }
      },

      // 2) Total follicle count
      {
        resourceId: 'us-total',
        title: '28',
        start: '2025-11-08',
        end: '2025-11-09',
        extendedProps: {
          type: 'ultrasound-metric',
          metric: 'Total Follicles',
          value: '28',
          date: '2025-11-08'
        }
      },
      {
        resourceId: 'us-total',
        title: '28',
        start: '2025-11-15',
        end: '2025-11-16',
        extendedProps: {
          type: 'ultrasound-metric',
          metric: 'Total Follicles',
          value: '28',
          date: '2025-11-15'
        }
      },
      {
        resourceId: 'us-total',
        title: '35',
        start: '2025-11-22',
        end: '2025-11-23',
        extendedProps: {
          type: 'ultrasound-metric',
          metric: 'Total Follicles',
          value: '35',
          date: '2025-11-22'
        }
      },

      // 3) Left leading follicle (mm)
      {
        resourceId: 'us-left',
        title: '22',
        start: '2025-11-08',
        end: '2025-11-09',
        extendedProps: {
          type: 'ultrasound-metric',
          metric: 'Left Lead Foll.',
          value: '22 mm',
          date: '2025-11-08'
        }
      },
      {
        resourceId: 'us-left',
        title: '21',
        start: '2025-11-15',
        end: '2025-11-16',
        extendedProps: {
          type: 'ultrasound-metric',
          metric: 'Left Lead Foll.',
          value: '21 mm',
          date: '2025-11-15'
        }
      },
      {
        resourceId: 'us-left',
        title: '16',
        start: '2025-11-22',
        end: '2025-11-23',
        extendedProps: {
          type: 'ultrasound-metric',
          metric: 'Left Lead Foll.',
          value: '16 mm',
          date: '2025-11-22'
        }
      },

      // 4) Right leading follicle (mm)
      {
        resourceId: 'us-right',
        title: '21',
        start: '2025-11-08',
        end: '2025-11-09',
        extendedProps: {
          type: 'ultrasound-metric',
          metric: 'Right Lead Foll.',
          value: '21 mm',
          date: '2025-11-08'
        }
      },
      {
        resourceId: 'us-right',
        title: '14',
        start: '2025-11-15',
        end: '2025-11-16',
        extendedProps: {
          type: 'ultrasound-metric',
          metric: 'Right Lead Foll.',
          value: '14 mm',
          date: '2025-11-15'
        }
      },
      {
        resourceId: 'us-right',
        title: '19',
        start: '2025-11-22',
        end: '2025-11-23',
        extendedProps: {
          type: 'ultrasound-metric',
          metric: 'Right Lead Foll.',
          value: '19 mm',
          date: '2025-11-22'
        }
      },

      // 5) R.E. above 22 (count)
      {
        resourceId: 'us-re-above',
        title: '0',
        start: '2025-11-08',
        end: '2025-11-09',
        extendedProps: {
          type: 'ultrasound-metric',
          metric: 'R.E. above 22',
          value: '0',
          date: '2025-11-08'
        }
      },
      {
        resourceId: 'us-re-above',
        title: '0',
        start: '2025-11-15',
        end: '2025-11-16',
        extendedProps: {
          type: 'ultrasound-metric',
          metric: 'R.E. above 22',
          value: '0',
          date: '2025-11-15'
        }
      },
      {
        resourceId: 'us-re-above',
        title: '0',
        start: '2025-11-22',
        end: '2025-11-23',
        extendedProps: {
          type: 'ultrasound-metric',
          metric: 'R.E. above 22',
          value: '0',
          date: '2025-11-22'
        }
      },

      // Fertilization with values (clickable with dose counts)
      {
        resourceId: 'fertilization',
        title: '29',
        start: '2025-11-15',
        end: '2025-11-16',
        backgroundColor: '#FFD700',
        extendedProps: {
          type: 'medication-dose',
          medicationName: 'Fertilization IVF',
          dose: '29 oocytes retrieved',
          date: '2025-11-15',
          notes: 'Oocyte retrieval procedure completed successfully'
        }
      },
      {
        resourceId: 'fertilization',
        title: '24',
        start: '2025-11-16',
        end: '2025-11-17',
        backgroundColor: '#FFD700',
        extendedProps: {
          type: 'medication-dose',
          medicationName: 'Fertilization IVF',
          dose: '24 oocytes fertilized',
          date: '2025-11-16',
          notes: 'ICSI procedure performed, 24 out of 29 successfully fertilized'
        }
      },
      {
        resourceId: 'fertilization',
        title: '20',
        start: '2025-11-17',
        end: '2025-11-18',
        backgroundColor: '#FFD700',
        extendedProps: {
          type: 'medication-dose',
          medicationName: 'Fertilization IVF',
          dose: '20 embryos developing',
          date: '2025-11-17',
          notes: '20 embryos showing good development progress'
        }
      },

      // Gonad F Pun medication - DAILY doses (each day separate)
      {
        resourceId: 'gonad',
        title: '150',
        start: '2025-11-03',
        end: '2025-11-04',
        backgroundColor: '#4169E1',
        extendedProps: {
          type: 'medication-dose',
          medicationName: 'Gonad F Pun',
          dose: '150 IU',
          date: '2025-11-03',
          route: 'Subcutaneous injection',
          notes: 'Day 1 - Starting dose for ovarian stimulation'
        }
      },
      {
        resourceId: 'gonad',
        title: '150',
        start: '2025-11-04',
        end: '2025-11-05',
        backgroundColor: '#4169E1',
        extendedProps: {
          type: 'medication-dose',
          medicationName: 'Gonad F Pun',
          dose: '150 IU',
          date: '2025-11-04',
          route: 'Subcutaneous injection',
          notes: 'Day 2 - Continued stimulation'
        }
      },
      {
        resourceId: 'gonad',
        title: '150',
        start: '2025-11-05',
        end: '2025-11-06',
        backgroundColor: '#4169E1',
        extendedProps: {
          type: 'medication-dose',
          medicationName: 'Gonad F Pun',
          dose: '150 IU',
          date: '2025-11-05',
          route: 'Subcutaneous injection',
          notes: 'Day 3 - Continued stimulation'
        }
      },
      {
        resourceId: 'gonad',
        title: '150',
        start: '2025-11-06',
        end: '2025-11-07',
        backgroundColor: '#4169E1',
        extendedProps: {
          type: 'medication-dose',
          medicationName: 'Gonad F Pun',
          dose: '150 IU',
          date: '2025-11-06',
          route: 'Subcutaneous injection',
          notes: 'Day 4 - Continued stimulation'
        }
      },
      {
        resourceId: 'gonad',
        title: '150',
        start: '2025-11-07',
        end: '2025-11-08',
        backgroundColor: '#4169E1',
        extendedProps: {
          type: 'medication-dose',
          medicationName: 'Gonad F Pun',
          dose: '150 IU',
          date: '2025-11-07',
          route: 'Subcutaneous injection',
          notes: 'Day 5 - Final phase of stimulation'
        }
      },

      // Ovitrelle with dose
      {
        resourceId: 'ovitrelle',
        title: '250',
        start: '2025-11-13',
        backgroundColor: '#FFA500',
        extendedProps: {
          type: 'medication-dose',
          medicationName: 'Ovitrelle',
          dose: '250 mcg',
          date: '2025-11-13',
          route: 'Subcutaneous injection',
          notes: 'Trigger injection for final oocyte maturation'
        }
      },

      // Progesterone medication - DAILY doses (each day separate)
      {
        resourceId: 'progesterone-mg',
        title: '0.50',
        start: '2025-11-16',
        end: '2025-11-17',
        backgroundColor: '#32CD32',
        extendedProps: {
          type: 'medication-dose',
          medicationName: 'Progesterone',
          dose: '0.50 mg',
          date: '2025-11-16',
          route: 'Intramuscular injection',
          notes: 'Day 1 - Luteal phase support started'
        }
      },
      {
        resourceId: 'progesterone-mg',
        title: '0.50',
        start: '2025-11-17',
        end: '2025-11-18',
        backgroundColor: '#32CD32',
        extendedProps: {
          type: 'medication-dose',
          medicationName: 'Progesterone',
          dose: '0.50 mg',
          date: '2025-11-17',
          route: 'Intramuscular injection',
          notes: 'Day 2 - Continued luteal support'
        }
      },
      {
        resourceId: 'progesterone-mg',
        title: '0.50',
        start: '2025-11-18',
        end: '2025-11-19',
        backgroundColor: '#32CD32',
        extendedProps: {
          type: 'medication-dose',
          medicationName: 'Progesterone',
          dose: '0.50 mg',
          date: '2025-11-18',
          route: 'Intramuscular injection',
          notes: 'Day 3 - Continued luteal support'
        }
      },
      {
        resourceId: 'progesterone-mg',
        title: '0.50',
        start: '2025-11-19',
        end: '2025-11-20',
        backgroundColor: '#32CD32',
        extendedProps: {
          type: 'medication-dose',
          medicationName: 'Progesterone',
          dose: '0.50 mg',
          date: '2025-11-19',
          route: 'Intramuscular injection',
          notes: 'Day 4 - Continued luteal support'
        }
      },
      {
        resourceId: 'progesterone-mg',
        title: '0.50',
        start: '2025-11-20',
        end: '2025-11-21',
        backgroundColor: '#32CD32',
        extendedProps: {
          type: 'medication-dose',
          medicationName: 'Progesterone',
          dose: '0.50 mg',
          date: '2025-11-20',
          route: 'Intramuscular injection',
          notes: 'Day 5 - Continued luteal support'
        }
      },
      {
        resourceId: 'progesterone-mg',
        title: '0.50',
        start: '2025-11-21',
        end: '2025-11-22',
        backgroundColor: '#32CD32',
        extendedProps: {
          type: 'medication-dose',
          medicationName: 'Progesterone',
          dose: '0.50 mg',
          date: '2025-11-21',
          route: 'Intramuscular injection',
          notes: 'Day 6 - Maintaining progesterone levels'
        }
      },
      {
        resourceId: 'progesterone-mg',
        title: '0.50',
        start: '2025-11-22',
        end: '2025-11-23',
        backgroundColor: '#32CD32',
        extendedProps: {
          type: 'medication-dose',
          medicationName: 'Progesterone',
          dose: '0.50 mg',
          date: '2025-11-22',
          route: 'Intramuscular injection',
          notes: 'Day 7 - Maintaining progesterone levels'
        }
      },

      // Oestrogen - DAILY doses (2mg period)
      {
        resourceId: 'oestrogen',
        title: '2',
        start: '2025-11-03',
        end: '2025-11-04',
        backgroundColor: '#FF1493',
        extendedProps: {
          type: 'medication-dose',
          medicationName: 'Oestrogen',
          dose: '2 mg',
          date: '2025-11-03',
          route: 'Oral',
          notes: 'Day 1 - Endometrial preparation'
        }
      },
      {
        resourceId: 'oestrogen',
        title: '2',
        start: '2025-11-04',
        end: '2025-11-05',
        backgroundColor: '#FF1493',
        extendedProps: {
          type: 'medication-dose',
          medicationName: 'Oestrogen',
          dose: '2 mg',
          date: '2025-11-04',
          route: 'Oral',
          notes: 'Day 2 - Endometrial preparation'
        }
      },
      {
        resourceId: 'oestrogen',
        title: '2',
        start: '2025-11-05',
        end: '2025-11-06',
        backgroundColor: '#FF1493',
        extendedProps: {
          type: 'medication-dose',
          medicationName: 'Oestrogen',
          dose: '2 mg',
          date: '2025-11-05',
          route: 'Oral',
          notes: 'Day 3 - Endometrial preparation'
        }
      },
      {
        resourceId: 'oestrogen',
        title: '2',
        start: '2025-11-06',
        end: '2025-11-07',
        backgroundColor: '#FF1493',
        extendedProps: {
          type: 'medication-dose',
          medicationName: 'Oestrogen',
          dose: '2 mg',
          date: '2025-11-06',
          route: 'Oral',
          notes: 'Day 4 - Endometrial preparation'
        }
      },
      {
        resourceId: 'oestrogen',
        title: '2',
        start: '2025-11-07',
        end: '2025-11-08',
        backgroundColor: '#FF1493',
        extendedProps: {
          type: 'medication-dose',
          medicationName: 'Oestrogen',
          dose: '2 mg',
          date: '2025-11-07',
          route: 'Oral',
          notes: 'Day 5 - Endometrial preparation'
        }
      },
      {
        resourceId: 'oestrogen',
        title: '2',
        start: '2025-11-08',
        end: '2025-11-09',
        backgroundColor: '#FF1493',
        extendedProps: {
          type: 'medication-dose',
          medicationName: 'Oestrogen',
          dose: '2 mg',
          date: '2025-11-08',
          route: 'Oral',
          notes: 'Day 6 - Endometrial preparation'
        }
      },
      // Oestrogen - DAILY doses (4mg period)
      {
        resourceId: 'oestrogen',
        title: '4',
        start: '2025-11-16',
        end: '2025-11-17',
        backgroundColor: '#FF1493',
        extendedProps: {
          type: 'medication-dose',
          medicationName: 'Oestrogen',
          dose: '4 mg',
          date: '2025-11-16',
          route: 'Oral',
          notes: 'Day 1 - Increased dose for better endometrial support'
        }
      },
      {
        resourceId: 'oestrogen',
        title: '4',
        start: '2025-11-17',
        end: '2025-11-18',
        backgroundColor: '#FF1493',
        extendedProps: {
          type: 'medication-dose',
          medicationName: 'Oestrogen',
          dose: '4 mg',
          date: '2025-11-17',
          route: 'Oral',
          notes: 'Day 2 - Continued support'
        }
      },
      {
        resourceId: 'oestrogen',
        title: '4',
        start: '2025-11-18',
        end: '2025-11-19',
        backgroundColor: '#FF1493',
        extendedProps: {
          type: 'medication-dose',
          medicationName: 'Oestrogen',
          dose: '4 mg',
          date: '2025-11-18',
          route: 'Oral',
          notes: 'Day 3 - Continued support'
        }
      },
      {
        resourceId: 'oestrogen',
        title: '4',
        start: '2025-11-19',
        end: '2025-11-20',
        backgroundColor: '#FF1493',
        extendedProps: {
          type: 'medication-dose',
          medicationName: 'Oestrogen',
          dose: '4 mg',
          date: '2025-11-19',
          route: 'Oral',
          notes: 'Day 4 - Continued support'
        }
      },
      {
        resourceId: 'oestrogen',
        title: '4',
        start: '2025-11-20',
        end: '2025-11-21',
        backgroundColor: '#FF1493',
        extendedProps: {
          type: 'medication-dose',
          medicationName: 'Oestrogen',
          dose: '4 mg',
          date: '2025-11-20',
          route: 'Oral',
          notes: 'Day 5 - Continued support'
        }
      },
      {
        resourceId: 'oestrogen',
        title: '4',
        start: '2025-11-21',
        end: '2025-11-22',
        backgroundColor: '#FF1493',
        extendedProps: {
          type: 'medication-dose',
          medicationName: 'Oestrogen',
          dose: '4 mg',
          date: '2025-11-21',
          route: 'Oral',
          notes: 'Day 6 - Continued support'
        }
      },
      {
        resourceId: 'oestrogen',
        title: '4',
        start: '2025-11-22',
        end: '2025-11-23',
        backgroundColor: '#FF1493',
        extendedProps: {
          type: 'medication-dose',
          medicationName: 'Oestrogen',
          dose: '4 mg',
          date: '2025-11-22',
          route: 'Oral',
          notes: 'Day 7 - Continued support'
        }
      },
      {
        resourceId: 'oestrogen',
        title: '4',
        start: '2025-11-23',
        end: '2025-11-24',
        backgroundColor: '#FF1493',
        extendedProps: {
          type: 'medication-dose',
          medicationName: 'Oestrogen',
          dose: '4 mg',
          date: '2025-11-23',
          route: 'Oral',
          notes: 'Day 8 - Continued support'
        }
      },
      {
        resourceId: 'oestrogen',
        title: '4',
        start: '2025-11-24',
        end: '2025-11-25',
        backgroundColor: '#FF1493',
        extendedProps: {
          type: 'medication-dose',
          medicationName: 'Oestrogen',
          dose: '4 mg',
          date: '2025-11-24',
          route: 'Oral',
          notes: 'Day 9 - Continued support'
        }
      },

      // Estradiol - DAILY doses
      {
        resourceId: 'estradiol',
        title: '2',
        start: '2025-11-10',
        end: '2025-11-11',
        backgroundColor: '#FFD700',
        extendedProps: {
          type: 'medication-dose',
          medicationName: 'Estradiol',
          dose: '2 mg',
          date: '2025-11-10',
          route: 'Oral',
          notes: 'Day 1 - Supplemental estrogen support'
        }
      },
      {
        resourceId: 'estradiol',
        title: '2',
        start: '2025-11-11',
        end: '2025-11-12',
        backgroundColor: '#FFD700',
        extendedProps: {
          type: 'medication-dose',
          medicationName: 'Estradiol',
          dose: '2 mg',
          date: '2025-11-11',
          route: 'Oral',
          notes: 'Day 2 - Supplemental estrogen support'
        }
      },
      {
        resourceId: 'estradiol',
        title: '2',
        start: '2025-11-12',
        end: '2025-11-13',
        backgroundColor: '#FFD700',
        extendedProps: {
          type: 'medication-dose',
          medicationName: 'Estradiol',
          dose: '2 mg',
          date: '2025-11-12',
          route: 'Oral',
          notes: 'Day 3 - Supplemental estrogen support'
        }
      },
      {
        resourceId: 'estradiol',
        title: '2',
        start: '2025-11-13',
        end: '2025-11-14',
        backgroundColor: '#FFD700',
        extendedProps: {
          type: 'medication-dose',
          medicationName: 'Estradiol',
          dose: '2 mg',
          date: '2025-11-13',
          route: 'Oral',
          notes: 'Day 4 - Supplemental estrogen support'
        }
      },
      {
        resourceId: 'estradiol',
        title: '2',
        start: '2025-11-14',
        end: '2025-11-15',
        backgroundColor: '#FFD700',
        extendedProps: {
          type: 'medication-dose',
          medicationName: 'Estradiol',
          dose: '2 mg',
          date: '2025-11-14',
          route: 'Oral',
          notes: 'Day 5 - Supplemental estrogen support'
        }
      },

      // FSH hormone levels - DAILY boxes (8.5 period)
      {
        resourceId: 'fsh',
        title: '8.5',
        start: '2025-11-03',
        end: '2025-11-04',
        backgroundColor: '#4682B4',
        extendedProps: {
          type: 'hormone-level',
          hormoneName: 'FSH',
          value: '8.5 mIU/ml',
          date: '2025-11-03',
          normalRange: '3-10 mIU/ml',
          status: 'Normal',
          notes: 'Day 1 - Baseline FSH level within normal range'
        }
      },
      {
        resourceId: 'fsh',
        title: '8.5',
        start: '2025-11-04',
        end: '2025-11-05',
        backgroundColor: '#4682B4',
        extendedProps: {
          type: 'hormone-level',
          hormoneName: 'FSH',
          value: '8.5 mIU/ml',
          date: '2025-11-04',
          normalRange: '3-10 mIU/ml',
          status: 'Normal',
          notes: 'Day 2 - Baseline FSH level maintained'
        }
      },
      {
        resourceId: 'fsh',
        title: '8.5',
        start: '2025-11-05',
        end: '2025-11-06',
        backgroundColor: '#4682B4',
        extendedProps: {
          type: 'hormone-level',
          hormoneName: 'FSH',
          value: '8.5 mIU/ml',
          date: '2025-11-05',
          normalRange: '3-10 mIU/ml',
          status: 'Normal',
          notes: 'Day 3 - Baseline FSH level maintained'
        }
      },
      {
        resourceId: 'fsh',
        title: '8.5',
        start: '2025-11-06',
        end: '2025-11-07',
        backgroundColor: '#4682B4',
        extendedProps: {
          type: 'hormone-level',
          hormoneName: 'FSH',
          value: '8.5 mIU/ml',
          date: '2025-11-06',
          normalRange: '3-10 mIU/ml',
          status: 'Normal',
          notes: 'Day 4 - Baseline FSH level maintained'
        }
      },
      // FSH hormone levels - DAILY boxes (12.3 period)
      {
        resourceId: 'fsh',
        title: '12.3',
        start: '2025-11-10',
        end: '2025-11-11',
        backgroundColor: '#4682B4',
        extendedProps: {
          type: 'hormone-level',
          hormoneName: 'FSH',
          value: '12.3 mIU/ml',
          date: '2025-11-10',
          normalRange: '3-10 mIU/ml',
          status: 'Slightly Elevated',
          notes: 'Day 1 - FSH increased during stimulation phase'
        }
      },
      {
        resourceId: 'fsh',
        title: '12.3',
        start: '2025-11-11',
        end: '2025-11-12',
        backgroundColor: '#4682B4',
        extendedProps: {
          type: 'hormone-level',
          hormoneName: 'FSH',
          value: '12.3 mIU/ml',
          date: '2025-11-11',
          normalRange: '3-10 mIU/ml',
          status: 'Slightly Elevated',
          notes: 'Day 2 - FSH elevated during stimulation'
        }
      },
      {
        resourceId: 'fsh',
        title: '12.3',
        start: '2025-11-12',
        end: '2025-11-13',
        backgroundColor: '#4682B4',
        extendedProps: {
          type: 'hormone-level',
          hormoneName: 'FSH',
          value: '12.3 mIU/ml',
          date: '2025-11-12',
          normalRange: '3-10 mIU/ml',
          status: 'Slightly Elevated',
          notes: 'Day 3 - FSH elevated during stimulation'
        }
      },
      {
        resourceId: 'fsh',
        title: '12.3',
        start: '2025-11-13',
        end: '2025-11-14',
        backgroundColor: '#4682B4',
        extendedProps: {
          type: 'hormone-level',
          hormoneName: 'FSH',
          value: '12.3 mIU/ml',
          date: '2025-11-13',
          normalRange: '3-10 mIU/ml',
          status: 'Slightly Elevated',
          notes: 'Day 4 - FSH elevated during stimulation'
        }
      },

      // hCG levels - DAILY boxes (145 period)
      {
        resourceId: 'hcg-ng',
        title: '145',
        start: '2025-11-18',
        end: '2025-11-19',
        backgroundColor: '#FFD700',
        extendedProps: {
          type: 'hormone-level',
          hormoneName: 'hCG',
          value: '145 ng/ml',
          date: '2025-11-18',
          normalRange: '>100 ng/ml (positive)',
          status: 'Positive',
          notes: 'Day 1 - First beta hCG test - positive pregnancy result'
        }
      },
      {
        resourceId: 'hcg-ng',
        title: '145',
        start: '2025-11-19',
        end: '2025-11-20',
        backgroundColor: '#FFD700',
        extendedProps: {
          type: 'hormone-level',
          hormoneName: 'hCG',
          value: '145 ng/ml',
          date: '2025-11-19',
          normalRange: '>100 ng/ml (positive)',
          status: 'Positive',
          notes: 'Day 2 - hCG level maintained'
        }
      },
      {
        resourceId: 'hcg-ng',
        title: '145',
        start: '2025-11-20',
        end: '2025-11-21',
        backgroundColor: '#FFD700',
        extendedProps: {
          type: 'hormone-level',
          hormoneName: 'hCG',
          value: '145 ng/ml',
          date: '2025-11-20',
          normalRange: '>100 ng/ml (positive)',
          status: 'Positive',
          notes: 'Day 3 - hCG level maintained'
        }
      },
      {
        resourceId: 'hcg-ng',
        title: '145',
        start: '2025-11-21',
        end: '2025-11-22',
        backgroundColor: '#FFD700',
        extendedProps: {
          type: 'hormone-level',
          hormoneName: 'hCG',
          value: '145 ng/ml',
          date: '2025-11-21',
          normalRange: '>100 ng/ml (positive)',
          status: 'Positive',
          notes: 'Day 4 - hCG level maintained'
        }
      },
      // hCG levels - DAILY boxes (285 period)
      {
        resourceId: 'hcg-ng',
        title: '285',
        start: '2025-11-23',
        end: '2025-11-24',
        backgroundColor: '#FFD700',
        extendedProps: {
          type: 'hormone-level',
          hormoneName: 'hCG',
          value: '285 ng/ml',
          date: '2025-11-23',
          normalRange: '>100 ng/ml (positive)',
          status: 'Positive - Doubling',
          notes: 'Day 1 - hCG levels doubling appropriately, good progression'
        }
      },
      {
        resourceId: 'hcg-ng',
        title: '285',
        start: '2025-11-24',
        end: '2025-11-25',
        backgroundColor: '#FFD700',
        extendedProps: {
          type: 'hormone-level',
          hormoneName: 'hCG',
          value: '285 ng/ml',
          date: '2025-11-24',
          normalRange: '>100 ng/ml (positive)',
          status: 'Positive - Doubling',
          notes: 'Day 2 - hCG doubling maintained'
        }
      },
      {
        resourceId: 'hcg-ng',
        title: '285',
        start: '2025-11-25',
        end: '2025-11-26',
        backgroundColor: '#FFD700',
        extendedProps: {
          type: 'hormone-level',
          hormoneName: 'hCG',
          value: '285 ng/ml',
          date: '2025-11-25',
          normalRange: '>100 ng/ml (positive)',
          status: 'Positive - Doubling',
          notes: 'Day 3 - hCG doubling maintained'
        }
      },
      {
        resourceId: 'hcg-ng',
        title: '285',
        start: '2025-11-26',
        end: '2025-11-27',
        backgroundColor: '#FFD700',
        extendedProps: {
          type: 'hormone-level',
          hormoneName: 'hCG',
          value: '285 ng/ml',
          date: '2025-11-26',
          normalRange: '>100 ng/ml (positive)',
          status: 'Positive - Doubling',
          notes: 'Day 4 - hCG doubling maintained'
        }
      },

      // LH levels - DAILY boxes (5.2 period)
      {
        resourceId: 'lh',
        title: '5.2',
        start: '2025-11-03',
        end: '2025-11-04',
        backgroundColor: '#FF8C00',
        extendedProps: {
          type: 'hormone-level',
          hormoneName: 'LH',
          value: '5.2 mIU/ml',
          date: '2025-11-03',
          normalRange: '2-10 mIU/ml',
          status: 'Normal',
          notes: 'Day 1 - Baseline LH level'
        }
      },
      {
        resourceId: 'lh',
        title: '5.2',
        start: '2025-11-04',
        end: '2025-11-05',
        backgroundColor: '#FF8C00',
        extendedProps: {
          type: 'hormone-level',
          hormoneName: 'LH',
          value: '5.2 mIU/ml',
          date: '2025-11-04',
          normalRange: '2-10 mIU/ml',
          status: 'Normal',
          notes: 'Day 2 - Baseline LH level maintained'
        }
      },
      {
        resourceId: 'lh',
        title: '5.2',
        start: '2025-11-05',
        end: '2025-11-06',
        backgroundColor: '#FF8C00',
        extendedProps: {
          type: 'hormone-level',
          hormoneName: 'LH',
          value: '5.2 mIU/ml',
          date: '2025-11-05',
          normalRange: '2-10 mIU/ml',
          status: 'Normal',
          notes: 'Day 3 - Baseline LH level maintained'
        }
      },
      // LH levels - DAILY boxes (8.7 period)
      {
        resourceId: 'lh',
        title: '8.7',
        start: '2025-11-08',
        end: '2025-11-09',
        backgroundColor: '#FF8C00',
        extendedProps: {
          type: 'hormone-level',
          hormoneName: 'LH',
          value: '8.7 mIU/ml',
          date: '2025-11-08',
          normalRange: '2-10 mIU/ml',
          status: 'Normal',
          notes: 'Day 1 - LH rising during stimulation'
        }
      },
      {
        resourceId: 'lh',
        title: '8.7',
        start: '2025-11-09',
        end: '2025-11-10',
        backgroundColor: '#FF8C00',
        extendedProps: {
          type: 'hormone-level',
          hormoneName: 'LH',
          value: '8.7 mIU/ml',
          date: '2025-11-09',
          normalRange: '2-10 mIU/ml',
          status: 'Normal',
          notes: 'Day 2 - LH rising during stimulation'
        }
      },
      {
        resourceId: 'lh',
        title: '8.7',
        start: '2025-11-10',
        end: '2025-11-11',
        backgroundColor: '#FF8C00',
        extendedProps: {
          type: 'hormone-level',
          hormoneName: 'LH',
          value: '8.7 mIU/ml',
          date: '2025-11-10',
          normalRange: '2-10 mIU/ml',
          status: 'Normal',
          notes: 'Day 3 - LH rising during stimulation'
        }
      },
      // LH levels - DAILY boxes (12.4 period)
      {
        resourceId: 'lh',
        title: '12.4',
        start: '2025-11-13',
        end: '2025-11-14',
        backgroundColor: '#FF8C00',
        extendedProps: {
          type: 'hormone-level',
          hormoneName: 'LH',
          value: '12.4 mIU/ml',
          date: '2025-11-13',
          normalRange: '2-10 mIU/ml',
          status: 'Elevated',
          notes: 'Day 1 - LH surge detected, trigger administered'
        }
      },
      {
        resourceId: 'lh',
        title: '12.4',
        start: '2025-11-14',
        end: '2025-11-15',
        backgroundColor: '#FF8C00',
        extendedProps: {
          type: 'hormone-level',
          hormoneName: 'LH',
          value: '12.4 mIU/ml',
          date: '2025-11-14',
          normalRange: '2-10 mIU/ml',
          status: 'Elevated',
          notes: 'Day 2 - LH surge maintained'
        }
      },
      {
        resourceId: 'lh',
        title: '12.4',
        start: '2025-11-15',
        end: '2025-11-16',
        backgroundColor: '#FF8C00',
        extendedProps: {
          type: 'hormone-level',
          hormoneName: 'LH',
          value: '12.4 mIU/ml',
          date: '2025-11-15',
          normalRange: '2-10 mIU/ml',
          status: 'Elevated',
          notes: 'Day 3 - LH surge maintained'
        }
      },

      // Progesterone ng/ml - DAILY boxes (18.5 period)
      {
        resourceId: 'progesterone-ng',
        title: '18.5',
        start: '2025-11-18',
        end: '2025-11-19',
        backgroundColor: '#FFFF00',
        extendedProps: {
          type: 'hormone-level',
          hormoneName: 'Progesterone',
          value: '18.5 ng/ml',
          date: '2025-11-18',
          normalRange: '10-30 ng/ml (luteal)',
          status: 'Normal',
          notes: 'Day 1 - Progesterone levels adequate for luteal support'
        }
      },
      {
        resourceId: 'progesterone-ng',
        title: '18.5',
        start: '2025-11-19',
        end: '2025-11-20',
        backgroundColor: '#FFFF00',
        extendedProps: {
          type: 'hormone-level',
          hormoneName: 'Progesterone',
          value: '18.5 ng/ml',
          date: '2025-11-19',
          normalRange: '10-30 ng/ml (luteal)',
          status: 'Normal',
          notes: 'Day 2 - Progesterone levels maintained'
        }
      },
      {
        resourceId: 'progesterone-ng',
        title: '18.5',
        start: '2025-11-20',
        end: '2025-11-21',
        backgroundColor: '#FFFF00',
        extendedProps: {
          type: 'hormone-level',
          hormoneName: 'Progesterone',
          value: '18.5 ng/ml',
          date: '2025-11-20',
          normalRange: '10-30 ng/ml (luteal)',
          status: 'Normal',
          notes: 'Day 3 - Progesterone levels maintained'
        }
      },
      {
        resourceId: 'progesterone-ng',
        title: '18.5',
        start: '2025-11-21',
        end: '2025-11-22',
        backgroundColor: '#FFFF00',
        extendedProps: {
          type: 'hormone-level',
          hormoneName: 'Progesterone',
          value: '18.5 ng/ml',
          date: '2025-11-21',
          normalRange: '10-30 ng/ml (luteal)',
          status: 'Normal',
          notes: 'Day 4 - Progesterone levels maintained'
        }
      },
      // Progesterone ng/ml - DAILY boxes (24.8 period)
      {
        resourceId: 'progesterone-ng',
        title: '24.8',
        start: '2025-11-23',
        end: '2025-11-24',
        backgroundColor: '#FFFF00',
        extendedProps: {
          type: 'hormone-level',
          hormoneName: 'Progesterone',
          value: '24.8 ng/ml',
          date: '2025-11-23',
          normalRange: '10-30 ng/ml (luteal)',
          status: 'Normal',
          notes: 'Day 1 - Progesterone levels rising appropriately'
        }
      },
      {
        resourceId: 'progesterone-ng',
        title: '24.8',
        start: '2025-11-24',
        end: '2025-11-25',
        backgroundColor: '#FFFF00',
        extendedProps: {
          type: 'hormone-level',
          hormoneName: 'Progesterone',
          value: '24.8 ng/ml',
          date: '2025-11-24',
          normalRange: '10-30 ng/ml (luteal)',
          status: 'Normal',
          notes: 'Day 2 - Progesterone levels rising'
        }
      },
      {
        resourceId: 'progesterone-ng',
        title: '24.8',
        start: '2025-11-25',
        end: '2025-11-26',
        backgroundColor: '#FFFF00',
        extendedProps: {
          type: 'hormone-level',
          hormoneName: 'Progesterone',
          value: '24.8 ng/ml',
          date: '2025-11-25',
          normalRange: '10-30 ng/ml (luteal)',
          status: 'Normal',
          notes: 'Day 3 - Progesterone levels rising'
        }
      },
      {
        resourceId: 'progesterone-ng',
        title: '24.8',
        start: '2025-11-26',
        end: '2025-11-27',
        backgroundColor: '#FFFF00',
        extendedProps: {
          type: 'hormone-level',
          hormoneName: 'Progesterone',
          value: '24.8 ng/ml',
          date: '2025-11-26',
          normalRange: '10-30 ng/ml (luteal)',
          status: 'Normal',
          notes: 'Day 4 - Progesterone levels rising'
        }
      },

      // Orders (Lab + Ultrasound) in a single divider row
      {
        resourceId: 'orders',
        title: '🔬',
        start: '2025-11-05',
        extendedProps: {
          type: 'lab-order',
          orderId: 123,
          images: ['lab-image-1.jpg', 'lab-image-2.jpg'],
          testName: 'Hormone Panel',
          status: 'Completed'
        }
      },
      {
        resourceId: 'orders',
        title: '🔬',
        start: '2025-11-12',
        extendedProps: {
          type: 'lab-order',
          orderId: 124,
          images: ['lab-image-3.jpg'],
          testName: 'Blood Test',
          status: 'Completed'
        }
      },
      {
        resourceId: 'orders',
        title: '🔬',
        start: '2025-11-19',
        extendedProps: {
          type: 'lab-order',
          orderId: 125,
          images: ['lab-image-4.jpg'],
          testName: 'Beta hCG Test',
          status: 'Pending'
        }
      },

      // Ultrasound orders in the same Orders row
      {
        resourceId: 'orders',
        title: '📋',
        start: '2025-11-08',
        extendedProps: {
          type: 'ultrasound',
          reportId: 456,
          images: ['ultrasound-1.jpg'],
          measurements: {
            endom: 3,
            total: 28,
            leftFoll: 22,
            rightFoll: 21
          }
        }
      },
      {
        resourceId: 'orders',
        title: '📋',
        start: '2025-11-15',
        extendedProps: {
          type: 'ultrasound',
          reportId: 457,
          images: ['ultrasound-2.jpg'],
          measurements: {
            endom: 9,
            total: 32,
            leftFoll: 18,
            rightFoll: 14
          }
        }
      },
      {
        resourceId: 'orders',
        title: '📋',
        start: '2025-11-22',
        extendedProps: {
          type: 'ultrasound',
          reportId: 458,
          images: ['ultrasound-3.jpg'],
          measurements: {
            endom: 11,
            total: 35,
            leftFoll: 16,
            rightFoll: 19
          }
        }
      }

    ];

    // Save and bind
    this.calendarData = events;
    this.calendarOptions.events = this.calendarData;
  }

  renderEventContent(arg: any) {
    const { event } = arg;
    const props = event.extendedProps || {};
    const resId = (event as any).getResources ? (event as any).getResources()[0]?.id : (event as any)?._def?.resourceIds?.[0];

    // Icons for lab/ultrasound
    if (props.type === 'lab-order' || props.type === 'ultrasound') {
      return {
        html: `<div class="event-icon" style="font-size: 20px; cursor: pointer; text-align: center;">${event.title}</div>`
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
      info.el.title = `${props.medicationName} - ${props.dose}${props.notes ? `\n${props.notes}` : ''}`;
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
      this.openUltrasoundModal(props);
    } else if (props.type === 'medication-dose') {
      this.openMedicationDoseModal(props);
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
      try { this.labOrderModalRef.dismiss(); } catch {}
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
      try { this.ultrasoundModalRef.dismiss(); } catch {}
      this.ultrasoundModalRef = null;
    }
    this.ultrasoundDetail = null;
  }

  openMedicationDoseModal(data: any) {
    this.medicationDetail = data;
    this.medicationModalRef = this.modalService.open(this.medicationModal, { ariaLabelledBy: 'med-title', size: 'md', centered: true });
  }

  closeMedicationModal() {
    if (this.medicationModalRef) {
      try { this.medicationModalRef.dismiss(); } catch {}
      this.medicationModalRef = null;
    }
    this.medicationDetail = null;
  }

  openHormoneLevelModal(data: any) {
    this.hormoneDetail = data;
    this.hormoneModalRef = this.modalService.open(this.hormoneModal, { ariaLabelledBy: 'hormone-title', size: 'md', centered: true });
  }

  closeHormoneModal() {
    if (this.hormoneModalRef) {
      try { this.hormoneModalRef.dismiss(); } catch {}
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
  @ViewChild('ultrasoundModal') ultrasoundModal!: TemplateRef<any>;
  @ViewChild('labOrderModal') labOrderModal!: TemplateRef<any>;
  @ViewChild('medicationModal') medicationModal!: TemplateRef<any>;
  @ViewChild('hormoneModal') hormoneModal!: TemplateRef<any>;
  addModalRef: any;
  ultrasoundModalRef: any;
  ultrasoundDetail: any = null;
  labOrderModalRef: any;
  labOrderDetail: any = null;
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

  eventSubtypes: string[] = ['LMP', 'OT', 'TRIG', 'OPU', 'FERT', 'ET', 'CS'];
  medicationSubtypes: string[] = ['Gonad F Pun', 'Ovitrelle', 'Progesterone [mg]', 'Oestrogen [mg]', 'Estradiol [mg]'];
  hormoneSubtypes: string[] = ['FSH [mIU/ml]', 'hCG [ng/ml]', 'LH [mIU/ml]', 'Progesterone [ng/ml]'];

  handleDateClick(arg: any) {
    const resId: string = arg?.resource?.id || '';
    const clickedDate: string = arg?.dateStr || '';

    // Determine category by resource id
    let category: 'events' | 'medication' | 'hormone' = 'events';
    if (['gonad', 'ovitrelle', 'progesterone-mg', 'oestrogen', 'estradiol'].includes(resId)) {
      category = 'medication';
    } else if (['fsh', 'hcg-ng', 'lh', 'progesterone-ng'].includes(resId)) {
      category = 'hormone';
    } else if (resId === 'events') {
      category = 'events';
    } else {
      return; // ignore non-target rows
    }

    this.addForm = {
      category,
      subtype: '',
      title: '',
      start: clickedDate,
      end: clickedDate,
      resourceId: resId || (category === 'events' ? 'events' : category === 'medication' ? 'gonad' : 'fsh')
    };

    this.openAddModal();
  }

  openAddModal() {
    this.addModalRef = this.modalService.open(this.addEventModal, { ariaLabelledBy: 'modal-basic-title', size: 'md', centered: true });
  }

  closeAddModal() {
    if (this.addModalRef) {
      try { this.addModalRef.dismiss(); } catch {}
      this.addModalRef = null;
    }
  }

  submitAddForm() {
    const f = this.addForm;
    let newEvent: EventInput | null = null;

    if (f.category === 'events') {
      newEvent = {
        resourceId: 'events',
        title: f.subtype || f.title || 'Event',
        start: f.start,
        end: f.end,
        backgroundColor: '#90EE90',
        extendedProps: { description: f.title || f.subtype }
      };
    } else if (f.category === 'medication') {
      const map: any = {
        'Gonad F Pun': 'gonad',
        'Ovitrelle': 'ovitrelle',
        'Progesterone [mg]': 'progesterone-mg',
        'Oestrogen [mg]': 'oestrogen',
        'Estradiol [mg]': 'estradiol'
      };
      const rid = map[f.subtype] || f.resourceId || 'gonad';
      newEvent = {
        resourceId: rid,
        title: f.title || '1',
        start: f.start,
        end: f.end,
        backgroundColor: '#4169E1',
        extendedProps: { type: 'medication-dose', medicationName: f.subtype || 'Medication', dose: f.title || '1', date: f.start, notes: '' }
      };
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
        end: f.end,
        backgroundColor: '#87CEEB',
        extendedProps: { type: 'hormone-level', hormoneName: f.subtype || 'Hormone', value: f.title || '0', date: f.start, status: 'Normal' }
      };
    }

    if (newEvent) {
      this.calendarData.push(newEvent);
      this.calendarOptions = { ...this.calendarOptions, events: [...this.calendarData] };
    }

    this.closeAddModal();
  }
}
