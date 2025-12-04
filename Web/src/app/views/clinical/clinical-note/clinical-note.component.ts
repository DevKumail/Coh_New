import { GenericPaginationComponent } from '@/app/shared/generic-pagination/generic-pagination.component';
import { TranslatePipe } from '@/app/shared/i18n/translate.pipe';
import { ClinicalApiService } from '@/app/shared/Services/Clinical/clinical.api.service';
import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PatientBannerService } from '@/app/shared/Services/patient-banner.service';
import { distinctUntilChanged, filter, Subscription, Subject, takeUntil, debounceTime } from 'rxjs';
import Swal from 'sweetalert2';
import { NgIconComponent } from '@ng-icons/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoaderService } from '@core/services/loader.service';

@Component({
  selector: 'app-clinical-note',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    GenericPaginationComponent,
    TranslatePipe,
    FormsModule,
    NgIconComponent,
  ],
  templateUrl: './clinical-note.component.html',
  styleUrl: './clinical-note.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClinicalNoteComponent implements OnInit {
    SearchPatientData: any;
    SelectedVisit: any;
    speechtotxt: any[] = [];
    pagegination: any = {
        pageSize: 10,
        currentPage: 1,
      };
    clinicalnoteTotalItems: any= 0;
    private patientDataSubscription: Subscription | undefined;
    private selectedVisitSubscription: Subscription | undefined;
    private destroy$ = new Subject<void>();
    private providersCache: any[] | null = null;
    private notesCache = new Map<number, any[]>();
    private macrosCache = new Map<number, any[]>();

    // Modal form and data
    modalForm: FormGroup;
    providers: any[] = [];
    clinicalNotes: any[] = [];
    macroList: any[] = [];
    selectedNoteType: string = ''; // 'structured', 'ai', 'freetext'
    cacheItems: string[] = ['Provider'];
    isProviderSelected: boolean = false;

      constructor(
        private apiservice: ClinicalApiService,
        private PatientData: PatientBannerService,
        private router: Router,
        private modalService: NgbModal,
        private fb: FormBuilder,
        private loader: LoaderService,
        private cdr: ChangeDetectorRef
    ) {
      this.modalForm = this.fb.group({
        provider: [null, Validators.required],
        note: [{ value: '', disabled: true }],
        macro: [{ value: '', disabled: true }]
      });
    }

        async ngOnInit(){
        this.patientDataSubscription = this.PatientData.patientData$
        .pipe(
          filter((data: any) => !!data?.table2?.[0]?.mrNo),
          distinctUntilChanged((prev, curr) =>
            prev?.table2?.[0]?.mrNo === curr?.table2?.[0]?.mrNo
          ),
          takeUntil(this.destroy$)
        )
        .subscribe((data: any) => {
          console.log(' Subscription triggered with MRNO:', data?.table2?.[0]?.mrNo);
          this.SearchPatientData = data;
          this.speechtoText();
        });

        // Subscribe to selected visit to get provider info
        this.selectedVisitSubscription = this.PatientData.selectedVisit$
        .pipe(
          takeUntil(this.destroy$)
        )
        .subscribe((visit: any) => {
          this.SelectedVisit = visit;
          console.log('Selected visit updated:', visit);
        });

        // Debounce provider changes to avoid excessive API calls
        this.modalForm.get('provider')?.valueChanges
          .pipe(
            debounceTime(300),
            distinctUntilChanged(),
            takeUntil(this.destroy$)
          )
          .subscribe((val: any) => {
            const code = Number(val) || 0;
            this.isProviderSelected = !!val;
            this.GetNotesEmployeeId(code);
          });

        // Subscribe to template changes - clear macro when template is selected
        this.modalForm.get('note')?.valueChanges
          .pipe(takeUntil(this.destroy$))
          .subscribe((val: any) => {
            if (val && this.selectedNoteType === 'structured') {
              this.modalForm.patchValue({ macro: null }, { emitEvent: false });
            }
          });

        // Subscribe to macro changes - clear template when macro is selected
        this.modalForm.get('macro')?.valueChanges
          .pipe(takeUntil(this.destroy$))
          .subscribe((val: any) => {
            if (val && this.selectedNoteType === 'structured') {
              this.modalForm.patchValue({ note: null }, { emitEvent: false });
            }
          });

        this.modalForm.get('provider')?.valueChanges
          .pipe(takeUntil(this.destroy$))
          .subscribe(value => {
            if (value) {
              this.modalForm.get('note')?.enable();
              this.modalForm.get('macro')?.enable();
            } else {
              this.modalForm.get('note')?.disable();
              this.modalForm.get('macro')?.disable();
            }
          });
    }

    private buildVoiceUrl(path: string): string {
      if (!path) {
        return '';
      }

      // Normalize backslashes to forward slashes
      let normalized = path.replace(/\\/g, '/').replace(/\\/g, '/');

      // Trim everything before the UploadFiles folder so we can use a relative URL
      const lower = normalized.toLowerCase();
      const marker = '/uploadfiles/';
      const idx = lower.indexOf(marker);
      if (idx >= 0) {
        normalized = normalized.substring(idx);
      }

      // Return as relative URL (served from the same origin as the app/API)
      return normalized;
    }

    speechtoText() {
      if(!this.SearchPatientData?.table2?.[0]?.mrNo) {
        Swal.fire('Error', 'MRN not found for the Load patient', 'error');
        return;
      }
      const MRN = this.SearchPatientData?.table2?.[0]?.mrNo;
      this.apiservice.GetEMRNotesByMRNo(MRN, this.pagegination.currentPage, this.pagegination.pageSize)
        .then((res: any) => {
          console.log('EMR Notes RESULT: ', res);

          const rawData = res?.data || [];
          this.speechtotxt = rawData.map((item: any) => {
            const path = item.notePath || item.voicePath || item.filePath || '';
            const voiceSafeUrl = this.buildVoiceUrl(path);
            return {
              ...item,
              voiceSafeUrl
            };
          });

          this.clinicalnoteTotalItems = res?.pagination?.totalCount || this.speechtotxt.length || 0;
          this.cdr.markForCheck();
        })
        .catch((error: any) => {
          console.error('Error loading EMR notes: ', error);
          Swal.fire('Error', 'Failed to load clinical notes', 'error');
          this.cdr.markForCheck();
        });
    }

  openNoteTypeModal(content: any) {
    this.modalForm.reset();
    this.clinicalNotes = [];
    this.macroList = [];
    this.selectedNoteType = '';
    this.isProviderSelected = false;

    // Load providers from cache if available
    if (this.providersCache) {
      this.providers = this.providersCache;
      // Auto-select provider from selected visit
      this.setProviderFromSelectedVisit();
      this.cdr.markForCheck();
      this.modalService.open(content, {
        centered: true,
        size: 'lg',
        scrollable: false,
        backdrop: 'static'
      });
    } else {
      this.FillCache();
      // Auto-select provider after cache loads
      setTimeout(() => this.setProviderFromSelectedVisit(), 100);
      this.modalService.open(content, {
        centered: true,
        size: 'lg',
        scrollable: false,
        backdrop: 'static'
      });
    }
  }

  private setProviderFromSelectedVisit(): void {
    try {
      if (!this.modalForm) { return; }
      const empId = this.SelectedVisit?.employeeId;
      if (!empId) { return; }
      const exists = Array.isArray(this.providers)
        ? this.providers.some((p: any) => String(p?.code) === String(empId))
        : false;
      const ctrl = this.modalForm.get('provider');
      if (!ctrl || !exists) { return; }
      // Set provider value which will trigger template fetch via valueChanges subscription
      ctrl.setValue(empId, { emitEvent: true });
      ctrl.markAsDirty();
      ctrl.markAsTouched();
      ctrl.updateValueAndValidity({ onlySelf: true });
      console.log('Auto-selected provider from visit:', empId);
    } catch (error) {
      console.error('Error setting provider from visit:', error);
    }
  }

  selectNoteType(type: string) {
    this.selectedNoteType = type;

    // Update form validators based on note type
    const providerCtrl = this.modalForm.get('provider');
    const noteCtrl = this.modalForm.get('note');
    const macroCtrl = this.modalForm.get('macro');

    if (type === 'freetext') {
      // Make fields optional for free text
      providerCtrl?.clearValidators();
      noteCtrl?.clearValidators();
      macroCtrl?.clearValidators();
    } else if (type === 'structured') {
      // For structured: provider is required, either note or macro is required
      providerCtrl?.setValidators([Validators.required]);
      noteCtrl?.clearValidators();
      macroCtrl?.clearValidators();
    } else {
      // For AI: provider and note are required
      providerCtrl?.setValidators([Validators.required]);
      noteCtrl?.setValidators([Validators.required]);
      macroCtrl?.clearValidators();
    }

    providerCtrl?.updateValueAndValidity();
    noteCtrl?.updateValueAndValidity();
    macroCtrl?.updateValueAndValidity();

    // If provider is already selected, fetch templates for the new note type
    const providerValue = providerCtrl?.value;
    if (providerValue) {
      const code = Number(providerValue) || 0;
      console.log('Note type changed, refetching templates for provider:', code);
      this.GetNotesEmployeeId(code);
    }

    this.cdr.markForCheck();
  }

  FillCache() {
    this.apiservice
      .getCacheItem({ entities: this.cacheItems })
      .then((response: any) => {
        if (response && response.cache) {
          this.FillDropDown(response);
          this.cdr.markForCheck();
        }
      })
      .catch((error: any) =>
        Swal.fire('Error', error?.message || 'Failed to load cache', 'error')
      );
  }

  FillDropDown(response: any) {
    const jParse = JSON.parse(JSON.stringify(response)).cache;
    let provider = JSON.parse(jParse).Provider;
    if (provider) {
      provider = provider.map((item: any) => ({ name: item.FullName, code: item.EmployeeId }));
      this.providers = provider;
      this.providersCache = provider; // Cache for future use
    }
  }

  private filterNotesByType(notes: any[]): any[] {
    if (!Array.isArray(notes) || notes.length === 0) {
      return [];
    }

    const type = (this.selectedNoteType || '').toLowerCase();
debugger;
    // For freetext selection, only show FreeText templates
    if (type === 'freetext') {
      return notes.filter((n: any) => {
        const t = (n.noteType || n.templateType || '').toString().toLowerCase();
        return t === 'free text';
      });
    }

    // For structured and AI, show only structured templates (default when no type)
    const desired = 'structured';
    return notes.filter((n: any) => {
      const t = (n.noteType || n.templateType || '').toString().toLowerCase();
      if (!t) {
        // If backend didn't set a type, treat as structured to avoid hiding everything
        return true;
      }
      return t === desired;
    });
  }

  GetNotesEmployeeId(providerCode: any) {
    if (providerCode == null || providerCode == undefined) providerCode = 0;
    const selectedProvider = Number(providerCode) || 0;
    if (selectedProvider === 250) providerCode = 197;

    // Check cache first
    if (this.notesCache.has(providerCode)) {
      const allNotes = this.notesCache.get(providerCode) || [];
      const filtered = this.filterNotesByType(allNotes);
      this.clinicalNotes = filtered;
      this.macroList = filtered;
      this.modalForm.patchValue({ note: null, macro: null });
      this.cdr.markForCheck();
      return;
    }

    this.clinicalNotes = [];
    this.macroList = [];
    this.modalForm.patchValue({ note: null, macro: null });
    this.loader.show();

    this.apiservice.EMRNotesGetByEmpId(providerCode).then((res: any) => {
      const notes = res.result || [];

      // Cache the full list per provider
      this.notesCache.set(providerCode, notes);
      this.macrosCache.set(providerCode, notes);

      // Apply filtering based on selected note type
      const filtered = this.filterNotesByType(notes);
      this.clinicalNotes = filtered;
      this.macroList = filtered;

      this.loader.hide();
      this.cdr.markForCheck();
    }).catch((e: any) => {
      Swal.fire('Error', 'Error loading notes', 'error');
      this.loader.hide();
      this.cdr.markForCheck();
    });
  }

  createNote(modal: any) {
    debugger
    // Validation for structured notes - must select either template or macro
    if (this.selectedNoteType === 'structured') {
      const noteValue = this.modalForm.get('note')?.value;
      const macroValue = this.modalForm.get('macro')?.value;

      if (!noteValue && !macroValue) {
        Swal.fire('Warning', 'Please select either Template or Macro', 'warning');
        this.modalForm.markAllAsTouched();
        return;
      }
    }

    // Validation for AI notes
    if (this.selectedNoteType === 'ai' && this.modalForm.invalid) {
      Swal.fire('Warning', 'Please select both Provider and Template', 'warning');
      this.modalForm.markAllAsTouched();
      return;
    }

    const providerValue = this.modalForm.get('provider')?.value;
    const noteValue = this.modalForm.get('note')?.value;
    const macroValue = this.modalForm.get('macro')?.value;

    modal.close();

    // Build query params object
    const queryParams: any = {};
    if (providerValue) queryParams.provider = providerValue;
    if (noteValue) queryParams.template = noteValue;
    if (macroValue) queryParams.macro = macroValue;

    if (this.selectedNoteType === 'freetext') {
      queryParams.noteType = 'FreeText';
    }

    switch(this.selectedNoteType) {
      case 'structured':
        this.router.navigate(['/clinical/create-structured-notes'], { queryParams });
        break;
      case 'ai':
        this.router.navigate(['/clinical/create-notes'], { queryParams });
        break;
      case 'freetext':
        // Always pass params for freetext, even if empty
        this.router.navigate(['/clinical/create-free-text-notes'], { queryParams });
        break;

    }
  }

  isCreateEnabled(): boolean {
    // For freetext, always enabled
    if (this.selectedNoteType === 'freetext') return true;

    // For structured, check if provider and (template OR macro) are selected
    if (this.selectedNoteType === 'structured') {
      const providerValue = this.modalForm.get('provider')?.value;
      const noteValue = this.modalForm.get('note')?.value;
      const macroValue = this.modalForm.get('macro')?.value;
      return !!(providerValue && (noteValue || macroValue));
    }

    // For AI, check if form is valid
    return this.modalForm.valid && this.selectedNoteType !== '';
  }

  goBackToStep1() {
    this.selectedNoteType = '';
    // Don't reset the form completely, keep provider and templates
    // Just clear the note and macro selections
    this.modalForm.patchValue({
      note: null,
      macro: null
    }, { emitEvent: false });
    // Keep clinicalNotes and macroList so they're available when user selects a note type again
    this.cdr.markForCheck();
  }

  async onallergiePageChanged(page: number) {
    this.pagegination.currentPage = page;
    await this.speechtoText();
  }

  editNote(note: any) {
    debugger;
    if (!note || !note.noteId) {
      Swal.fire('Error', 'Note Id not found for editing', 'error');
      return;
    }

     if(note.noteType.toLowerCase() === 'freetext') {
      this.router.navigate(['/clinical/create-free-text-notes'], {
        queryParams: { noteId: note.noteId }
      });
    }
    if(note.noteType.toLowerCase() === 'structured' && (note.filepath == null ||note.filepath == "")) {
      this.router.navigate(['/clinical/create-structured-notes'], {
        queryParams: { noteId: note.noteId }
      });
    }
 if(note.noteType.toLowerCase() === 'structured' && (note.filepath != null ||note.filepath != "")) {
      this.router.navigate(['/clinical/create-notes'], {
        queryParams: { noteId: note.noteId }
      });
    }

  }

  // TrackBy functions for ngFor optimization
  trackByIndex(index: number): number {
    return index;
  }

  trackByCode(index: number, item: any): any {
    return item.code || index;
  }

  trackByPathId(index: number, item: any): any {
    return item.pathId || index;
  }

  @ViewChildren('audioPlayer') audioPlayers!: QueryList<ElementRef<HTMLAudioElement>>;

  /**
   * Play or pause audio at specific index
   */
  playAudio(index: number): void {
    const audioElement = this.audioPlayers.toArray()[index]?.nativeElement;

    if (audioElement) {
      if (audioElement.paused) {
        // Pause all other audio players first
        this.pauseAllAudio();
        audioElement.play().catch(err => {
          console.error('Error playing audio:', err);
        });
      } else {
        audioElement.pause();
      }
      this.cdr.markForCheck();
    }
  }

  /**
   * Pause all audio players
   */
  pauseAllAudio(): void {
    this.audioPlayers.forEach((player) => {
      if (!player.nativeElement.paused) {
        player.nativeElement.pause();
      }
    });

    this.speechtotxt.forEach((item) => {
      item.isPlaying = false;
    });
    this.cdr.markForCheck();
  }

  /**
   * Handle audio play event
   */
  onAudioPlay(index: number): void {
    // Pause all other audios
    this.speechtotxt.forEach((item, i) => {
      if (i !== index) {
        item.isPlaying = false;
      }
    });

    this.speechtotxt[index].isPlaying = true;
    this.cdr.markForCheck();
  }

  /**
   * Handle audio pause event
   */
  onAudioPause(index: number): void {
    this.speechtotxt[index].isPlaying = false;
    this.cdr.markForCheck();
  }

  /**
   * Handle audio ended event
   */
  onAudioEnded(index: number): void {
    this.speechtotxt[index].isPlaying = false;
    this.cdr.markForCheck();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    if (this.patientDataSubscription) {
      this.patientDataSubscription.unsubscribe();
    }

    if (this.selectedVisitSubscription) {
      this.selectedVisitSubscription.unsubscribe();
    }
  }
}

