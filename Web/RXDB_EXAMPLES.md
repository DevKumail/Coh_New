# RxDB Practical Examples

## 🎯 Real-World Usage Scenarios

### Example 1: Loading Patient on Page Load

```typescript
export class PatientSummaryComponent implements OnInit {
  patientData: any = null;
  isLoading: boolean = true;

  constructor(
    private patientBannerService: PatientBannerService
  ) {}

  async ngOnInit() {
    // Wait for RxDB to load data
    await this.patientBannerService.waitForHydration();
    
    // Subscribe to patient data changes
    this.patientBannerService.patientData$.subscribe(data => {
      this.patientData = data;
      if (data) {
        console.log('✅ Patient loaded from RxDB:', data.table2[0].mrNo);
        this.loadPatientDetails();
      }
    });

    // Subscribe to loading state
    this.patientBannerService.isLoading$.subscribe(loading => {
      this.isLoading = loading;
    });
  }

  loadPatientDetails() {
    // Your component logic here
    const mrNo = this.patientData?.table2?.[0]?.mrNo;
    // Make API calls if needed
  }
}
```

### Example 2: Searching and Saving Patient

```typescript
export class DemographicSearchComponent {
  constructor(
    private patientBannerService: PatientBannerService,
    private demographicApi: DemographicApiServices
  ) {}

  async searchPatient(mrNo: string) {
    try {
      // Search patient from API
      const response = await this.demographicApi.getPatientByMRNo(mrNo).toPromise();
      
      if (response && response.table2?.length > 0) {
        // Save to RxDB
        await this.patientBannerService.setPatientData(response);
        
        console.log('✅ Patient saved to RxDB');
        
        // Navigate to patient summary
        this.router.navigate(['/patient-summary']);
      }
    } catch (error) {
      console.error('❌ Failed to load patient:', error);
    }
  }
}
```

### Example 3: Managing Visit Appointments

```typescript
export class AppointmentListComponent implements OnInit {
  appointments: any[] = [];
  selectedVisit: any = null;

  constructor(
    private patientBannerService: PatientBannerService
  ) {}

  ngOnInit() {
    // Load appointments from RxDB
    this.patientBannerService.visitAppointments$.subscribe(visits => {
      this.appointments = visits || [];
      console.log('📅 Appointments loaded:', this.appointments.length);
    });

    // Track selected visit
    this.patientBannerService.selectedVisit$.subscribe(visit => {
      this.selectedVisit = visit;
      console.log('📌 Selected visit:', visit?.appointmentId);
    });
  }

  async loadAppointments(mrNo: string) {
    try {
      const response = await this.api.getAppointmentsByMRNo(mrNo).toPromise();
      
      if (response?.table1) {
        // Save appointments to RxDB
        await this.patientBannerService.setVisitAppointments(response.table1);
        console.log('✅ Appointments saved');
      }
    } catch (error) {
      console.error('❌ Failed to load appointments:', error);
    }
  }

  async selectVisit(visit: any) {
    // Save selected visit to RxDB
    await this.patientBannerService.setSelectedVisit(visit);
    console.log('✅ Visit selected:', visit.appointmentId);
  }
}
```

### Example 4: Clearing Patient on Logout

```typescript
export class TopbarComponent {
  constructor(
    private patientBannerService: PatientBannerService,
    private authService: AuthService,
    private router: Router
  ) {}

  async logout() {
    try {
      // Clear patient data from RxDB
      await this.patientBannerService.clearAll();
      console.log('✅ Patient data cleared');

      // Logout from auth service
      await this.authService.logout();

      // Navigate to login
      this.router.navigate(['/auth/login']);
    } catch (error) {
      console.error('❌ Logout failed:', error);
    }
  }

  async closeBanner() {
    // Just close banner without deleting data
    this.patientBannerService.setIsbanneropen(false);
    
    // OR clear patient data completely
    await this.patientBannerService.setPatientData(null);
  }
}
```

### Example 5: Checking Patient Data Before Navigation

```typescript
export class NavigationGuard {
  constructor(
    private patientBannerService: PatientBannerService,
    private router: Router
  ) {}

  async canActivate(): Promise<boolean> {
    // Wait for hydration
    await this.patientBannerService.waitForHydration();

    // Check if patient data exists
    if (this.patientBannerService.hasPatientData()) {
      const mrNo = this.patientBannerService.getCurrentMrNo();
      console.log('✅ Patient loaded, MR:', mrNo);
      return true;
    } else {
      console.log('❌ No patient data, redirecting to search');
      this.router.navigate(['/registration/demographic-search']);
      return false;
    }
  }
}
```

### Example 6: Debugging - Export/Import Data

```typescript
export class DebugComponent {
  constructor(private patientBannerService: PatientBannerService) {}

  async exportData() {
    // Get all data from RxDB
    const data = await this.patientBannerService.exportRxDBData();
    console.log('📦 RxDB Export:', data);
    
    // Download as JSON
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `patient-data-${Date.now()}.json`;
    a.click();
  }

  async importData(file: File) {
    const text = await file.text();
    const data = JSON.parse(text);
    
    // Import to RxDB
    await this.patientBannerService.importRxDBData(data);
    console.log('✅ Data imported to RxDB');
  }

  getSnapshot() {
    // Get complete snapshot
    const snapshot = this.patientBannerService.getFullSnapshot();
    console.log('📸 Snapshot:', snapshot);
    return snapshot;
  }
}
```

### Example 7: IVF Module Integration

```typescript
export class IVFPatientComponent implements OnInit {
  ivfData: any = null;
  patientInfo: any = null;

  constructor(
    private patientBannerService: PatientBannerService,
    private ivfApi: IVFApiService
  ) {}

  async ngOnInit() {
    // Wait for hydration
    await this.patientBannerService.waitForHydration();

    // Get patient data
    this.patientBannerService.patientData$.subscribe(data => {
      this.patientInfo = data?.table2?.[0];
    });

    // Get IVF-specific data
    const ivfObservable = this.patientBannerService.getIVFPatientData();
    if (ivfObservable) {
      ivfObservable.subscribe((data: any) => {
        this.ivfData = data;
      });
    }
  }

  async saveIVFData() {
    const ivfData = {
      cycleNumber: 3,
      stimulationProtocol: 'Long Protocol',
      retrievalDate: '2025-01-15',
      eggCount: 12
    };

    await this.patientBannerService.setIVFPatientData(ivfData);
    console.log('✅ IVF data saved to RxDB');
  }
}
```

### Example 8: Patient Switching with Auto-cleanup

```typescript
export class PatientSearchComponent {
  constructor(
    private patientBannerService: PatientBannerService
  ) {}

  async switchToNewPatient(newMrNo: string) {
    // Get current patient
    const currentMrNo = this.patientBannerService.getCurrentMrNo();
    console.log('Current Patient:', currentMrNo);

    // Load new patient data
    const newPatientData = await this.loadPatientData(newMrNo);

    // Save to RxDB - this automatically clears old appointments/visits
    await this.patientBannerService.setPatientData(newPatientData);
    
    console.log('✅ Switched from', currentMrNo, 'to', newMrNo);
    console.log('Old appointments automatically cleared!');
  }

  async loadPatientData(mrNo: string) {
    // Your API call here
    return {
      table2: [{ mrNo, patientName: 'New Patient' }],
      table1: []
    };
  }
}
```

### Example 9: Coverage/Payer Info Management

```typescript
export class CoverageComponent {
  payerInfo: any[] = [];

  constructor(
    private patientBannerService: PatientBannerService,
    private coverageApi: CoverageApiService
  ) {}

  ngOnInit() {
    // Subscribe to payer info
    this.patientBannerService.payerInfo$.subscribe(info => {
      this.payerInfo = info || [];
      console.log('💳 Payer Info:', this.payerInfo.length, 'payers');
    });
  }

  async loadPayerInfo(mrNo: string) {
    const response = await this.coverageApi.getPayerInfo(mrNo).toPromise();
    
    if (response?.payerList) {
      // Save to RxDB
      await this.patientBannerService.setPayerInfo(response.payerList);
      console.log('✅ Payer info saved');
    }
  }

  async addPayer(payer: any) {
    // Add to existing list
    const currentPayers = this.patientBannerService.getPayerInfo() || [];
    const updatedPayers = [...currentPayers, payer];
    
    await this.patientBannerService.setPayerInfo(updatedPayers);
    console.log('✅ Payer added');
  }
}
```

### Example 10: Browser Storage Inspection (DevTools)

```typescript
// In browser console:

// 1. Get current snapshot
await window.patientBannerService.getFullSnapshot()

// 2. Export data
const data = await window.patientBannerService.exportRxDBData()
console.log(JSON.stringify(data, null, 2))

// 3. Check if patient loaded
window.patientBannerService.hasPatientData()

// 4. Get current MR number
window.patientBannerService.getCurrentMrNo()

// 5. Clear all data
await window.patientBannerService.clearAll()

// 6. Check RxDB directly in IndexedDB
// DevTools > Application > Storage > IndexedDB > coherent > patientbanner
```

### Example 11: Component with Complete Lifecycle

```typescript
export class CompleteExampleComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  patientData: any = null;
  appointments: any[] = [];
  selectedVisit: any = null;
  isLoading: boolean = true;

  constructor(
    private patientBannerService: PatientBannerService
  ) {}

  async ngOnInit() {
    // 1. Wait for initial load
    await this.patientBannerService.waitForHydration();

    // 2. Subscribe to all data streams with cleanup
    this.patientBannerService.patientData$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.patientData = data;
        console.log('👤 Patient:', data?.table2?.[0]?.mrNo);
      });

    this.patientBannerService.visitAppointments$
      .pipe(takeUntil(this.destroy$))
      .subscribe(visits => {
        this.appointments = visits || [];
        console.log('📅 Appointments:', visits?.length);
      });

    this.patientBannerService.selectedVisit$
      .pipe(takeUntil(this.destroy$))
      .subscribe(visit => {
        this.selectedVisit = visit;
        console.log('📌 Selected:', visit?.appointmentId);
      });

    this.patientBannerService.isLoading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.isLoading = loading;
      });
  }

  ngOnDestroy() {
    // Cleanup subscriptions
    this.destroy$.next();
    this.destroy$.complete();
  }

  async saveAll() {
    // Save everything at once
    await this.patientBannerService.setPatientData(this.patientData);
    await this.patientBannerService.setVisitAppointments(this.appointments);
    await this.patientBannerService.setSelectedVisit(this.selectedVisit);
    
    console.log('✅ All data saved to RxDB');
  }
}
```

---

## 🎨 Testing in Browser Console

Open DevTools console and try these commands:

```javascript
// Get the service instance
const service = window.ng.getInjector().get('PatientBannerService');

// Check current data
await service.getFullSnapshot();

// Export to JSON
const data = await service.exportRxDBData();
console.table(data);

// Clear everything
await service.clearAll();

// Check if data exists
service.hasPatientData(); // false after clear

// Check MR number
service.getCurrentMrNo();
```

---

## 📊 Data Flow Diagram

```
User Action (Search/Load Patient)
         ↓
    Component
         ↓
PatientBannerService.setPatientData()
         ↓
PatientBannerStoreService.set()
         ↓
    RxDB Collection
         ↓
    IndexedDB (Browser)
         
    On Page Refresh:
         ↓
PatientBannerService Constructor
         ↓
PatientBannerStoreService.get()
         ↓
    Load from IndexedDB
         ↓
    Emit via patientData$
         ↓
Component subscribes and updates UI
```

---

## 🔧 Common Patterns

### Pattern 1: Load Once, Use Everywhere
```typescript
// In app.component.ts (root)
async ngOnInit() {
  await this.patientBannerService.waitForHydration();
  // Now all child components can access data
}
```

### Pattern 2: Guard Routes
```typescript
canActivate(): Promise<boolean> {
  return this.patientBannerService.hasPatientData();
}
```

### Pattern 3: Auto-save on Form Changes
```typescript
this.form.valueChanges
  .pipe(debounceTime(1000))
  .subscribe(async (value) => {
    await this.patientBannerService.setPatientData(value);
  });
```

---

**Happy Coding! 🚀**
