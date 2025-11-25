# 🚀 RxDB Quick Reference Card

## Essential Imports

```typescript
import { PatientBannerService } from '@/app/shared/Services/patient-banner.service';
import { PatientBannerStoreService } from '@core/services/patient-banner-store.service';
```

---

## CRUD Operations

### CREATE / UPDATE

```typescript
// Save patient
await service.setPatientData(patientData);

// Save appointments
await service.setVisitAppointments(appointments);

// Save selected visit
await service.setSelectedVisit(visit);

// Save payer info
await service.setPayerInfo(payerInfo);

// Save IVF data
await service.setIVFPatientData(ivfData);
```

### READ

```typescript
// Subscribe to observables (reactive)
service.patientData$.subscribe(data => { /* ... */ });
service.visitAppointments$.subscribe(visits => { /* ... */ });
service.selectedVisit$.subscribe(visit => { /* ... */ });
service.payerInfo$.subscribe(info => { /* ... */ });
service.isLoading$.subscribe(loading => { /* ... */ });

// Get current values (sync)
const patient = service.getPatientData();
const visits = service.getVisitAppointments();
const selected = service.getSelectedVisit();
const payer = service.getPayerInfo();
```

### DELETE

```typescript
// Clear patient (hides banner)
await service.setPatientData(null);

// Clear everything
await service.clearAll();

// Clear specific fields
await service.setSelectedVisit(null);
await service.setVisitAppointments([]);
```

---

## Utility Methods

```typescript
// Wait for initial load
await service.waitForHydration();

// Check if data exists
service.hasPatientData(); // boolean

// Get current MR number
service.getCurrentMrNo(); // string | null

// Get complete snapshot
service.getFullSnapshot(); // object

// Export/Import (debugging)
await service.exportRxDBData();
await service.importRxDBData(data);

// Banner visibility
service.setIsbanneropen(true);
service.setIsbanneropen(false);
```

---

## Component Template

```typescript
export class MyComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  patientData: any = null;
  isLoading: boolean = true;

  constructor(
    private patientBannerService: PatientBannerService
  ) {}

  async ngOnInit() {
    // 1. Wait for hydration
    await this.patientBannerService.waitForHydration();

    // 2. Subscribe with cleanup
    this.patientBannerService.patientData$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.patientData = data;
      });

    this.patientBannerService.isLoading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.isLoading = loading;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

---

## Common Patterns

### Pattern: Load and Save
```typescript
async loadPatient(mrNo: string) {
  const data = await this.api.getPatient(mrNo).toPromise();
  await this.patientBannerService.setPatientData(data);
}
```

### Pattern: Check Before Navigate
```typescript
async canActivate(): Promise<boolean> {
  await this.patientBannerService.waitForHydration();
  return this.patientBannerService.hasPatientData();
}
```

### Pattern: Switch Patients
```typescript
async switchPatient(newMrNo: string) {
  const data = await this.loadPatient(newMrNo);
  await this.patientBannerService.setPatientData(data);
  // Old appointments auto-cleared!
}
```

### Pattern: Logout/Clear
```typescript
async logout() {
  await this.patientBannerService.clearAll();
  this.router.navigate(['/login']);
}
```

---

## Console Debugging

```javascript
// Get service
const s = window.ng.getInjector().get('PatientBannerService');

// Quick checks
await s.getFullSnapshot()
s.hasPatientData()
s.getCurrentMrNo()

// Export/Clear
await s.exportRxDBData()
await s.clearAll()

// IndexedDB
indexedDB.databases().then(console.log)
await indexedDB.deleteDatabase('coherent')
```

---

## Troubleshooting Quick Fixes

| Problem | Fix |
|---------|-----|
| Data not persisting | Check migration plugin in `db.service.ts` |
| Banner not showing | Set `Isbanneropen = true` in service |
| Component not updating | Use `await waitForHydration()` first |
| Old data showing | Verify MR number changed, clear manually |
| Memory leaks | Use `takeUntil` or async pipe |
| Schema error | Increment version, add migration |

---

## Files Location

```
src/app/
├── core/services/
│   ├── db.service.ts                        (RxDB init)
│   └── patient-banner-store.service.ts      (Low-level CRUD)
└── shared/Services/
    └── patient-banner.service.ts            (Business logic)
```

---

## Schema Structure

```typescript
{
  id: 'current',
  patientData: { table2: [...], table1: [...] } | null,
  patientIVFData: {...} | null,
  visitAppointments: [...],
  selectedVisit: {...} | null,
  payerInfo: [...],
  updatedAt: number
}
```

---

## RxJS Operators to Use

```typescript
import { takeUntil, debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';

// Cleanup
.pipe(takeUntil(this.destroy$))

// Wait before action
.pipe(debounceTime(500))

// Only if changed
.pipe(distinctUntilChanged())

// Only if has value
.pipe(filter(data => data !== null))
```

---

## Key Points to Remember

✅ **Always** wait for hydration before first access  
✅ **Always** unsubscribe in ngOnDestroy  
✅ **Always** use optional chaining (`?.`) for nested access  
✅ **Always** increment schema version after changes  
✅ **Never** access data synchronously without checking  
✅ **Never** forget migration plugin in db.service  

---

## One-Liners

```typescript
// Is patient loaded?
this.patientBannerService.hasPatientData()

// What's the MR?
this.patientBannerService.getCurrentMrNo()

// Show everything
this.patientBannerService.getFullSnapshot()

// Nuke it all
await this.patientBannerService.clearAll()
```

---

## Emergency Reset

```typescript
await this.patientBannerService.clearAll();
await indexedDB.deleteDatabase('coherent');
localStorage.clear();
sessionStorage.clear();
location.reload();
```

---

**🎯 Pro Tip:** Keep this reference open while coding!

**📚 Full Docs:** See `RXDB_USAGE_GUIDE.md`  
**🔧 Examples:** See `RXDB_EXAMPLES.md`  
**🐛 Issues:** See `RXDB_TROUBLESHOOTING.md`
