import { Component, Input, Output, EventEmitter, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@/app/shared/i18n/translate.pipe';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FilledOnValueDirective } from '@/app/shared/directives/filled-on-value.directive';
import { NgIcon } from '@ng-icons/core';
import { GenericPaginationComponent } from '@/app/shared/generic-pagination/generic-pagination.component';
import { ClinicalApiService } from '../clinical.api.service';
import Swal from 'sweetalert2';
import { PatientBannerService } from '@/app/shared/Services/patient-banner.service';
import { Subscription } from 'rxjs';
import { filter, distinctUntilChanged } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-social-history',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        TranslatePipe,
        NgIcon,
        GenericPaginationComponent
    ],
    templateUrl: './social-history.component.html',
    styleUrls: ['./social-history.component.scss']
})
export class SocialHistoryComponent {

    @ViewChild('socialHistoryModal') socialHistoryModal!: TemplateRef<any>;

    @Input() clinicalnote: boolean = false;
    @Input() set preSelectedIds(ids: number[]) {
        if (ids && ids.length > 0) {
            console.log('📥 [SocialHistory] Received preSelectedIds:', ids);
            this.selectedSocialHistories = new Set(ids);
            this.updateSelectAllState();
        }
    }
    @Output() selectionChanged = new EventEmitter<any[]>();

    SocialForm!: FormGroup;
    todayStr: string = '';
    selectedSocialHistories: Set<number> = new Set<number>();
    isAllSelected: boolean = false;
    SocialHistoryData: any[] = [];
    SocialHistoryList: any[] = [];
    pagegination: any = {
        currentPage: 1,
        pageSize: 10,
    }
    SocialHistoryTotalItems: number = 0;
    isSubmitting: boolean = false;
    private patientDataSubscription: Subscription | undefined;
    SelectedVisit: any;
    SearchPatientData: any;
    id: any;
    constructor(
        private fb: FormBuilder,
        private ClinicalApiService: ClinicalApiService,
        private PatientData: PatientBannerService,
        private modalService: NgbModal
    ) { }

    ngOnInit(): void {
        console.log('🎬 [SocialHistory] Component initialized, clinicalnote:', this.clinicalnote);
        this.todayStr = new Date().toISOString().split('T')[0];
        this.SocialForm = this.fb.group({
            socialHistory: [null, Validators.required],
            startDate: [null, Validators.required],
            endDate: [null, Validators.required],
            addInProblemList: [false],
        })

        this.patientDataSubscription = this.PatientData.patientData$
            .pipe(
                filter((data: any) => !!data?.table2?.[0]?.mrNo),
                distinctUntilChanged((prev, curr) =>
                    prev?.table2?.[0]?.mrNo === curr?.table2?.[0]?.mrNo
                )
            )
            .subscribe((data: any) => {
                console.log(' Subscription triggered with MRNO:', data?.table2?.[0]?.mrNo);
                this.SearchPatientData = data;
                this.pagegination.currentPage = 1;
                this.getSocialHistoryData();
            });

        this.PatientData.selectedVisit$.subscribe((data: any) => {
            this.SelectedVisit = data;
        });

        this.getSocialHistoryDropdownData();
        this.getSocialHistoryData();
    }

    getSocialHistoryDropdownData() {
        this.ClinicalApiService.GetSocialHistory().then((res: any) => {
            this.SocialHistoryData = res.result
        })
    }


    getSocialHistoryData() {
        this.SocialHistoryTotalItems = 0;
        const mrno = this.SearchPatientData?.table2?.[0]?.mrNo;
        console.log('🔄 [SocialHistory] Loading data, current selections:', Array.from(this.selectedSocialHistories));
        this.ClinicalApiService.GetAllSocialHistory(mrno, this.pagegination.currentPage, this.pagegination.pageSize).then((res: any) => {
            this.SocialHistoryList = res?.table1 || [];
            this.SocialHistoryTotalItems = res?.table2[0]?.totalRecords || 0;
            console.log('📋 [SocialHistory] Loaded data:', this.SocialHistoryList);
            if (this.SocialHistoryList.length > 0) {
                console.log('📋 [SocialHistory] First item structure:', this.SocialHistoryList[0]);
                console.log('📋 [SocialHistory] shid property:', this.SocialHistoryList[0]?.shid);
            }
            // Keep existing selections when data refreshes
            console.log('🔄 [SocialHistory] After load, selections:', Array.from(this.selectedSocialHistories));
            this.updateSelectAllState();
        })
    }

    onSocialHistoryPageChanged(event: any) {
        this.pagegination.currentPage = event;
        this.getSocialHistoryData();
    }

    openSocialHistoryModal(): void {
        this.resetForm();
        this.modalService.open(this.socialHistoryModal, {
            size: 'lg',
            centered: true,
            backdrop: 'static'
        });
    }

    submit() {
        this.isSubmitting = true;
        const uid = sessionStorage.getItem('userId');

        const data = this.SocialForm.value;

        if (this.SocialForm.invalid) {
            Swal.fire({
                title: 'Error',
                text: 'Please fill all the required fields',
                icon: 'error',
                showConfirmButton: false,
                timer: 1500
            });
            this.isSubmitting = false;
            this.SocialForm.markAllAsTouched();
            return;
        }

        const body: any = {
            shid: this.id,
            shitem: data.socialHistory,
            startDate: data.startDate,
            endDate: data.endDate,
            mrno: this.SearchPatientData?.table2?.[0]?.mrNo,
            AppointmentId: this.SelectedVisit?.appointmentId || 0,
            active: 1,
            createdBy: uid,
            updatedBy: uid,
        }

        this.ClinicalApiService.SubmitSocialHistory(body).then((list: any) => {
            Swal.fire({
                title: 'Success',
                text: 'Social History Successfully Created',
                icon: 'success',
                showConfirmButton: false,
                timer: 1500
            });
            this.id = 0;
            this.SocialForm.reset();
            this.getSocialHistoryData();
            this.isSubmitting = false;
            this.modalService.dismissAll();
            return
        }).catch((error: any) => Swal.fire({
            title: 'Error',
            text: error.message,
            icon: 'error',
            showConfirmButton: false,
            timer: 1500
        }));

        this.isSubmitting = false;
    }

    resetForm() {
        this.pagegination.currentPage = 1;
        this.SocialForm.reset();
        this.id = 0;
        // this.getSocialHistoryData();
    }

    private formatDateYMDForInput(value: any): string {
        try {
            if (!value) return '';
            const d = new Date(value);
            if (!isFinite(d.getTime())) return '';
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const dd = String(d.getDate()).padStart(2, '0');
            return `${yyyy}-${mm}-${dd}`;
        } catch { return ''; }
    }

    editSocialHistory(data: any) {
        debugger
        this.id = data.shid;
        this.SocialForm.patchValue({
            socialHistory: data.shItem,
            startDate: this.formatDateYMDForInput(data.startDate),
            endDate: this.formatDateYMDForInput(data.endDate),
        })
        this.modalService.open(this.socialHistoryModal, {
            size: 'lg',
            centered: true,
            backdrop: 'static'
        });
    }

    deleteSocialHistory(id: any) {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be to Delete this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                this.ClinicalApiService.DeleteSocialHistory(id).then((res: any) => {
                    this.getSocialHistoryData();
                })
            }
        })
    }

    toggleSelection(shid: any) {
        // Ensure shid is a number
        const numericShid = Number(shid);
        console.log('🎯 [SocialHistory] toggleSelection called with shid:', shid, '-> numeric:', numericShid);
        console.log('🎯 [SocialHistory] Type of shid:', typeof numericShid);
        console.log('🎯 [SocialHistory] Current selectedSocialHistories:', Array.from(this.selectedSocialHistories));

        if (this.selectedSocialHistories.has(numericShid)) {
            this.selectedSocialHistories.delete(numericShid);
            console.log('🔲 Unchecked:', numericShid);
        } else {
            this.selectedSocialHistories.add(numericShid);
            console.log('✅ Checked:', numericShid);
        }
        console.log('📊 Total selected:', this.selectedSocialHistories.size, Array.from(this.selectedSocialHistories));
        this.updateSelectAllState();
        this.emitSelectionChange();
    }

    toggleSelectAll() {
        if (this.isAllSelected) {
            this.selectedSocialHistories.clear();
        } else {
            this.SocialHistoryList.forEach(item => {
                this.selectedSocialHistories.add(item.shid);
            });
        }
        this.isAllSelected = !this.isAllSelected;
        this.emitSelectionChange();
    }

    updateSelectAllState() {
        this.isAllSelected = this.SocialHistoryList.length > 0 &&
            this.SocialHistoryList.every(item => this.selectedSocialHistories.has(item.shid));
    }

    isSelected(shid: any): boolean {
        return this.selectedSocialHistories.has(Number(shid));
    }

    getSelectedSocialHistories(): any[] {
        return this.SocialHistoryList.filter(item =>
            this.selectedSocialHistories.has(item.shid)
        );
    }

    getSelectedSocialHistoriesForNote(): any {
        console.log('🔍 [SocialHistory] Getting selections...');
        console.log('🔍 [SocialHistory] selectedSocialHistories:', Array.from(this.selectedSocialHistories));
        console.log('🔍 [SocialHistory] SocialHistoryList count:', this.SocialHistoryList.length);

        const selected = this.getSelectedSocialHistories();
        console.log('🔍 [SocialHistory] Filtered selected items:', selected);

        if (selected.length === 0) {
            console.log('❌ [SocialHistory] No items selected, returning null');
            return null;
        }

        const result = {
            sectionTitle: 'Social History',
            type: 'SocialHistory',
            data: selected.map(item => ({
                shid: item.shid,
                socialHistory: item.shName,
                startDate: item.startDate,
                endDate: item.endDate,
                active: item.active
            }))
        };

        console.log('✅ [SocialHistory] Returning data:', result);
        return result;
    }

    clearSelection() {
        this.selectedSocialHistories.clear();
        this.isAllSelected = false;
        this.emitSelectionChange();
    }

    private emitSelectionChange(): void {
        console.log('🔔 [SocialHistory] emitSelectionChange called');
        console.log('🔔 [SocialHistory] selectedSocialHistories Set:', Array.from(this.selectedSocialHistories));
        const selected = this.getSelectedSocialHistories();
        console.log('🔔 [SocialHistory] Filtered selected items:', selected);
        const formattedData = selected.map(item => ({
            shid: item.shid,
            socialHistory: item.shName,
            startDate: item.startDate,
            endDate: item.endDate,
            active: item.active
        }));
        console.log('🔔 [SocialHistory] Emitting formattedData:', formattedData);
        this.selectionChanged.emit(formattedData);
    }
}
