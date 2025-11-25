# RxDB Troubleshooting Guide

## 🔍 Common Issues and Solutions

### Issue 1: Data Not Persisting After Refresh

#### Symptoms:
- Console shows: `📦 RxDB Data Retrieved: Empty`
- Banner disappears after refresh
- Patient data is lost

#### Solutions:

**Solution A: Check Migration Plugin**
```typescript
// In db.service.ts - MUST have this:
import { RxDBMigrationSchemaPlugin } from 'rxdb/plugins/migration-schema';
addRxPlugin(RxDBMigrationSchemaPlugin);
```

**Solution B: Verify Data is Being Saved**
```typescript
// Add console logs to verify
async savePatient() {
  await this.patientBannerService.setPatientData(data);
  console.log('✅ Data saved, checking RxDB...');
  
  const saved = await this.patientBannerService.exportRxDBData();
  console.log('💾 Saved in RxDB:', saved);
}
```

**Solution C: Check IndexedDB in Browser**
1. Open DevTools → Application → Storage → IndexedDB
2. Look for `coherent` database
3. Check `patientbanner` collection
4. Verify document with id: `current` exists

**Solution D: Clear Browser Storage and Retry**
```javascript
// In browser console
await indexedDB.deleteDatabase('coherent');
location.reload();
```

---

### Issue 2: Banner Not Showing After Refresh

#### Symptoms:
- Data loads successfully
- Console shows patient data
- But banner remains hidden

#### Solutions:

**Solution A: Check Isbanneropen Initialization**
```typescript
// In patient-banner.service.ts
private Isbanneropen = new BehaviorSubject<any>(true); // Must be true!
```

**Solution B: Check Component Visibility Logic**
```typescript
// In patient-header-panel.component.ts
ngOnInit() {
  this.patientBannerService.patientData$.subscribe(data => {
    if (data) {
      this.visible = true; // ✅ Good
      // NOT: this.visible = false; // ❌ Bad
    }
  });
}
```

**Solution C: Debug Visibility State**
```typescript
// Add console logs
ngOnInit() {
  this.patientBannerService.patientData$.subscribe(data => {
    console.log('📡 Data received:', data ? 'Yes' : 'No');
    console.log('🔍 Setting visible to:', data !== null);
    this.visible = data !== null;
  });
}
```

---

### Issue 3: Collection Creation Fails

#### Symptoms:
```
❌ Error creating patientbanner collection
❌ All attempts to create/find patientbanner collection failed
```

#### Solutions:

**Solution A: Check Schema Syntax**
```typescript
// Correct schema with nullable fields
const schema: RxJsonSchema<PatientBannerDocType> = {
  properties: {
    patientData: { 
      oneOf: [
        { type: 'object', properties: {}, additionalProperties: true },
        { type: 'null' }  // ✅ Allow null
      ]
    }
  }
}
```

**Solution B: Increment Schema Version**
```typescript
// After changing schema, increment version:
const schema: RxJsonSchema<PatientBannerDocType> = {
  version: 3, // ← Increment this!
  // ...
}

// And add migration:
const migrationStrategies = {
  2: (oldDoc: any) => ({
    ...oldDoc,
    // migration logic
  })
}
```

**Solution C: Clear Old Database**
```javascript
// In browser console
await indexedDB.deleteDatabase('coherent');
location.reload();
```

---

### Issue 4: Schema Validation Errors

#### Symptoms:
```
❌ RxDB collection patientNumber is unavailable
❌ Error: RxDB collection patientbanner is unavailable
```

#### Solutions:

**Solution A: Check Required Fields**
```typescript
const schema = {
  properties: {
    id: { type: 'string', maxLength: 50 },
    visitAppointments: { type: 'array', items: {...} },
    updatedAt: { type: 'number' }
  },
  required: ['id', 'visitAppointments', 'updatedAt'] // ✅ These must always be present
}
```

**Solution B: Ensure Default Values**
```typescript
async set(partial: Partial<...>) {
  const existing = (await this.get()) || { 
    id: 'current',
    visitAppointments: [], // ✅ Required field with default
    updatedAt: Date.now()  // ✅ Required field with default
  };
}
```

---

### Issue 5: Data Loading but Component Not Updating

#### Symptoms:
- Console shows data loaded from RxDB
- Component variables remain null/empty
- UI not updating

#### Solutions:

**Solution A: Wait for Hydration**
```typescript
async ngOnInit() {
  // ✅ MUST wait first
  await this.patientBannerService.waitForHydration();
  
  // Then subscribe
  this.patientBannerService.patientData$.subscribe(data => {
    this.patientData = data;
  });
}
```

**Solution B: Check Subscription**
```typescript
// ❌ Bad: Not subscribing
this.patientData = this.patientBannerService.getPatientData();

// ✅ Good: Subscribe to observable
this.patientBannerService.patientData$.subscribe(data => {
  this.patientData = data;
});
```

**Solution C: Trigger Change Detection**
```typescript
constructor(
  private cdr: ChangeDetectorRef,
  private patientBannerService: PatientBannerService
) {}

ngOnInit() {
  this.patientBannerService.patientData$.subscribe(data => {
    this.patientData = data;
    this.cdr.detectChanges(); // Force update
  });
}
```

---

### Issue 6: Multiple Patients Mixing Data

#### Symptoms:
- Old patient data shows with new patient
- Appointments from previous patient visible
- Data not clearing properly

#### Solutions:

**Solution A: Verify MR Number Switch Detection**
```typescript
// In patient-banner.service.ts
async setPatientData(data: any) {
  const prevMrNo = this.extractMrNo(this.patientDataSource.value);
  const nextMrNo = this.extractMrNo(data);
  
  console.log('🔄 Switching:', prevMrNo, '→', nextMrNo);
  
  if (prevMrNo !== nextMrNo) {
    // Clear dependent data
    this.visitAppointmentsSource.next([]);
    this.selectedVisit.next(null);
  }
}
```

**Solution B: Manually Clear Before Loading New Patient**
```typescript
async loadNewPatient(mrNo: string) {
  // Clear old patient first
  await this.patientBannerService.clearAll();
  
  // Then load new
  const newData = await this.api.getPatient(mrNo);
  await this.patientBannerService.setPatientData(newData);
}
```

---

### Issue 7: Memory Leaks from Subscriptions

#### Symptoms:
- App slows down over time
- Multiple subscriptions firing
- Console showing duplicate logs

#### Solutions:

**Solution A: Unsubscribe in ngOnDestroy**
```typescript
export class MyComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  ngOnInit() {
    const sub = this.patientBannerService.patientData$.subscribe(data => {
      // handle data
    });
    this.subscriptions.push(sub);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
```

**Solution B: Use takeUntil Pattern**
```typescript
export class MyComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.patientBannerService.patientData$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        // handle data
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

**Solution C: Use Async Pipe (Best)**
```typescript
// Component
patientData$ = this.patientBannerService.patientData$;

// Template
<div *ngIf="patientData$ | async as patient">
  {{ patient.table2[0].mrNo }}
</div>
```

---

### Issue 8: RxDB Performance Issues

#### Symptoms:
- Slow page load
- Laggy UI updates
- High CPU usage

#### Solutions:

**Solution A: Limit Data Size**
```typescript
// Only save essential data
async savePatient(fullData: any) {
  const essentialData = {
    table2: fullData.table2, // Patient info
    table1: fullData.table1  // Insurance
    // Don't save large arrays or files
  };
  
  await this.patientBannerService.setPatientData(essentialData);
}
```

**Solution B: Debounce Updates**
```typescript
import { debounceTime } from 'rxjs/operators';

this.form.valueChanges
  .pipe(debounceTime(500)) // Wait 500ms
  .subscribe(async (value) => {
    await this.patientBannerService.setPatientData(value);
  });
```

**Solution C: Use Pagination for Large Lists**
```typescript
// Don't save all appointments
// Only save recent/relevant ones
async saveRecentAppointments(allAppointments: any[]) {
  const recent = allAppointments.slice(0, 20); // Only last 20
  await this.patientBannerService.setVisitAppointments(recent);
}
```

---

### Issue 9: Console Errors During Development

#### Error: "Cannot read property 'table2' of null"

**Solution:**
```typescript
// ❌ Unsafe
const mrNo = this.patientData.table2[0].mrNo;

// ✅ Safe
const mrNo = this.patientData?.table2?.[0]?.mrNo || 'N/A';
```

#### Error: "ExpressionChangedAfterItHasBeenCheckedError"

**Solution:**
```typescript
ngOnInit() {
  setTimeout(() => {
    this.patientBannerService.patientData$.subscribe(data => {
      this.patientData = data;
    });
  });
}
```

---

## 🛠️ Debugging Tools

### Tool 1: Enable RxDB Dev Mode

```typescript
// In db.service.ts (only for development)
import { addRxPlugin } from 'rxdb';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';

if (environment.development) {
  addRxPlugin(RxDBDevModePlugin);
}
```

### Tool 2: Console Debugging Commands

```javascript
// In browser console

// 1. Check current state
window.ng.getInjector().get('PatientBannerService').getFullSnapshot()

// 2. Export data
await window.ng.getInjector().get('PatientBannerService').exportRxDBData()

// 3. Clear all data
await window.ng.getInjector().get('PatientBannerService').clearAll()

// 4. Check IndexedDB
indexedDB.databases().then(console.log)
```

### Tool 3: Add Debug Logging

```typescript
// In patient-banner.service.ts
constructor(private store: PatientBannerStoreService) {
  console.log('🔄 PatientBannerService: Constructor');
  
  this.hydrationPromise = this.store.get().then((doc) => {
    console.log('📦 RxDB Data:', doc ? JSON.stringify(doc, null, 2) : 'Empty');
  });
}
```

---

## 📋 Pre-flight Checklist

Before deploying or testing, verify:

- [ ] Migration plugin is loaded in `db.service.ts`
- [ ] Schema version incremented after schema changes
- [ ] `Isbanneropen` initialized with `true`
- [ ] All subscriptions properly unsubscribed
- [ ] `waitForHydration()` called before accessing data
- [ ] Null checks on patient data access
- [ ] IndexedDB working in target browsers
- [ ] Console logs clean (no red errors)

---

## 🚨 Emergency Fixes

### Nuclear Option: Complete Reset

```typescript
// In any component with access to service
async resetEverything() {
  // 1. Clear service state
  await this.patientBannerService.clearAll();
  
  // 2. Delete IndexedDB
  await indexedDB.deleteDatabase('coherent');
  
  // 3. Clear browser storage
  localStorage.clear();
  sessionStorage.clear();
  
  // 4. Reload
  window.location.reload();
}
```

### Quick Test: Verify RxDB is Working

```typescript
async testRxDB() {
  const testData = {
    table2: [{ mrNo: 'TEST123', patientName: 'Test Patient' }],
    table1: []
  };
  
  // Save
  await this.patientBannerService.setPatientData(testData);
  console.log('✅ Data saved');
  
  // Reload page
  window.location.reload();
  
  // After reload, check:
  const loaded = this.patientBannerService.getPatientData();
  console.log('📦 Loaded after refresh:', loaded);
  
  if (loaded?.table2?.[0]?.mrNo === 'TEST123') {
    console.log('✅ RxDB working perfectly!');
  } else {
    console.log('❌ RxDB not persisting data');
  }
}
```

---

## 📞 Need More Help?

1. Check browser console for emoji-prefixed logs
2. Verify IndexedDB in DevTools
3. Export data and inspect structure
4. Clear database and try fresh
5. Check schema version matches data structure

---

**Remember:** Most issues are caused by:
1. Missing migration plugin
2. Not waiting for hydration
3. Schema validation errors
4. Incorrect subscription patterns

**Fix these first!** ✅
