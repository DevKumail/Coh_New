# RxDB Usage Guide - Patient Banner System

## 📚 Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Getting Data (READ)](#getting-data-read)
4. [Updating Data (UPDATE)](#updating-data-update)
5. [Deleting Data (DELETE)](#deleting-data-delete)
6. [Advanced Operations](#advanced-operations)
7. [Troubleshooting](#troubleshooting)

---

## Overview

RxDB is used in this application to persist patient banner data locally in the browser using IndexedDB. This allows patient data to survive page refreshes without making additional API calls.

### Key Components:
- **`DbService`**: Core RxDB database initialization
- **`PatientBannerStoreService`**: Low-level RxDB collection operations
- **`PatientBannerService`**: High-level business logic with RxJS observables

---

## Architecture

```
┌─────────────────────────────────────┐
│   PatientBannerService              │
│   (Business Logic + Observables)    │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│   PatientBannerStoreService         │
│   (RxDB Collection CRUD)            │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│   DbService                         │
│   (RxDB Database Instance)          │
└─────────────────────────────────────┘
```

---

## Getting Data (READ)

### Method 1: Using PatientBannerService (Recommended)

#### Subscribe to Observable Stream
```typescript
import { PatientBannerService } from '@/app/shared/Services/patient-banner.service';

constructor(private patientBannerService: PatientBannerService) {}

ngOnInit() {
  // Subscribe to live patient data stream
  this.patientBannerService.patientData$.subscribe((data) => {
    if (data) {
      console.log('Patient Data:', data);
      // Use the data in your component
    }
  });
}
```

#### Get Sync Value (Current State)
```typescript
// Get current value without subscribing
const currentPatientData = this.patientBannerService.getPatientData();
console.log('Current Patient:', currentPatientData);

// Get visit appointments
const visits = this.patientBannerService.getVisitAppointments();
console.log('Appointments:', visits);

// Get selected visit
const selectedVisit = this.patientBannerService.getSelectedVisit();
console.log('Selected Visit:', selectedVisit);

// Get payer info
const payerInfo = this.patientBannerService.getPayerInfo();
console.log('Payer Info:', payerInfo);
```

#### Wait for Hydration (Important!)
```typescript
async loadPatient() {
  // Wait for RxDB to finish loading
  await this.patientBannerService.waitForHydration();
  
  // Now safe to get data
  const patientData = this.patientBannerService.getPatientData();
  console.log('Hydrated Patient Data:', patientData);
}
```

### Method 2: Using PatientBannerStoreService (Low-level)

```typescript
import { PatientBannerStoreService } from '@core/services/patient-banner-store.service';

constructor(private store: PatientBannerStoreService) {}

async getDataFromRxDB() {
  try {
    const doc = await this.store.get();
    
    if (doc) {
      console.log('Patient Data:', doc.patientData);
      console.log('IVF Data:', doc.patientIVFData);
      console.log('Appointments:', doc.visitAppointments);
      console.log('Selected Visit:', doc.selectedVisit);
      console.log('Payer Info:', doc.payerInfo);
      console.log('Last Updated:', new Date(doc.updatedAt));
    } else {
      console.log('No data in RxDB');
    }
  } catch (error) {
    console.error('Failed to get data:', error);
  }
}
```

---

## Updating Data (UPDATE)

### Method 1: Using PatientBannerService (Recommended)

#### Update Patient Data
```typescript
async savePatient() {
  const patientData = {
    table2: [{
      mrNo: '12345',
      patientName: 'John Doe',
      dob: '1990-01-01',
      // ... other patient fields
    }],
    table1: [{
      insuranceInfo: 'Insurance details...'
    }]
  };

  await this.patientBannerService.setPatientData(patientData);
  console.log('✅ Patient data saved to RxDB');
}
```

#### Update Visit Appointments
```typescript
async saveAppointments() {
  const appointments = [
    { appointmentId: 1, date: '2025-01-15', time: '10:00 AM' },
    { appointmentId: 2, date: '2025-01-20', time: '2:00 PM' }
  ];

  await this.patientBannerService.setVisitAppointments(appointments);
  console.log('✅ Appointments saved');
}
```

#### Update Selected Visit
```typescript
async selectVisit() {
  const visit = {
    appointmentId: 1,
    visitDate: '2025-01-15',
    provider: 'Dr. Smith'
  };

  await this.patientBannerService.setSelectedVisit(visit);
  console.log('✅ Visit selected');
}
```

#### Update Payer Info
```typescript
async savePayerInfo() {
  const payerInfo = [
    { payerId: 1, payerName: 'Blue Cross', status: 'Active' },
    { payerId: 2, payerName: 'Medicare', status: 'Active' }
  ];

  await this.patientBannerService.setPayerInfo(payerInfo);
  console.log('✅ Payer info saved');
}
```

#### Update IVF Patient Data
```typescript
async saveIVFData() {
  const ivfData = {
    cycleNumber: 3,
    stimulationProtocol: 'Long Protocol',
    eggRetrievalDate: '2025-01-10'
  };

  await this.patientBannerService.setIVFPatientData(ivfData);
  console.log('✅ IVF data saved');
}
```

### Method 2: Using PatientBannerStoreService (Low-level)

#### Partial Update
```typescript
async updatePartialData() {
  // Only update specific fields
  await this.store.set({
    patientData: { /* new patient data */ }
  });
  
  console.log('✅ Partial update complete');
}
```

#### Full Update
```typescript
async updateAllData() {
  await this.store.set({
    patientData: { /* patient data */ },
    patientIVFData: { /* IVF data */ },
    visitAppointments: [ /* appointments */ ],
    selectedVisit: { /* selected visit */ },
    payerInfo: [ /* payer info */ ]
  });
  
  console.log('✅ Full update complete');
}
```

---

## Deleting Data (DELETE)

### Method 1: Clear All Patient Data
```typescript
async clearPatient() {
  // This clears everything and hides banner
  await this.patientBannerService.setPatientData(null);
  console.log('✅ Patient data cleared');
}
```

### Method 2: Clear Entire RxDB Document
```typescript
async clearEverything() {
  // Clears all banner-related state
  await this.patientBannerService.clearAll();
  console.log('✅ All data cleared from RxDB');
}
```

### Method 3: Using Store Service (Low-level)
```typescript
async deleteFromRxDB() {
  await this.store.clear();
  console.log('✅ RxDB document deleted');
}
```

### Partial Deletion (Set to null)
```typescript
// Clear only specific fields
await this.patientBannerService.setSelectedVisit(null);
await this.patientBannerService.setVisitAppointments([]);
```

---

## Advanced Operations

### Check Loading State
```typescript
ngOnInit() {
  this.patientBannerService.isLoading$.subscribe(isLoading => {
    if (isLoading) {
      console.log('⏳ Loading data from RxDB...');
    } else {
      console.log('✅ Data loaded');
    }
  });
}
```

### Banner Visibility Control
```typescript
// Show banner
this.patientBannerService.setIsbanneropen(true);

// Hide banner
this.patientBannerService.setIsbanneropen(false);

// Subscribe to visibility changes
this.patientBannerService.Isbanneropen$.subscribe(isOpen => {
  console.log('Banner is:', isOpen ? 'Open' : 'Closed');
});
```

### Switching Patients (Auto-cleanup)
```typescript
async switchPatient() {
  // When switching to a different patient, dependent data is cleared automatically
  const newPatient = {
    table2: [{ mrNo: '67890', patientName: 'Jane Smith' }]
  };
  
  // Service detects MR number change and clears appointments/visits
  await this.patientBannerService.setPatientData(newPatient);
  console.log('✅ Patient switched, old appointments cleared');
}
```

---

## Troubleshooting

### Issue: Data not persisting after refresh

**Solution 1:** Check if RxDB Migration Plugin is loaded
```typescript
// In db.service.ts
import { RxDBMigrationSchemaPlugin } from 'rxdb/plugins/migration-schema';
addRxPlugin(RxDBMigrationSchemaPlugin);
```

**Solution 2:** Wait for hydration before accessing data
```typescript
await this.patientBannerService.waitForHydration();
const data = this.patientBannerService.getPatientData();
```

### Issue: Banner not showing after refresh

**Check:** Ensure `Isbanneropen` is initialized with `true`
```typescript
// In patient-banner.service.ts
private Isbanneropen = new BehaviorSubject<any>(true);
```

### Issue: Schema validation errors

**Solution:** Ensure schema allows null values where needed
```typescript
// In patient-banner-store.service.ts
patientData: { 
  oneOf: [
    { type: 'object', properties: {}, additionalProperties: true },
    { type: 'null' }
  ]
}
```

### Issue: Collection creation fails

**Check Console Logs:**
- "🔍 Looking for patientbanner collection..."
- "✅ Found existing patientbanner collection" OR
- "📝 Creating new patientbanner collection..."

**Common Fixes:**
1. Clear browser storage and refresh
2. Check if migration strategies are defined for version changes
3. Verify schema version is incremented when schema changes

---

## Data Structure Reference

### PatientBannerDocType (RxDB Document)
```typescript
interface PatientBannerDocType {
  id: string;                    // Always 'current'
  patientData: any | null;       // Main patient data
  patientIVFData: any | null;    // IVF-specific data
  visitAppointments: any[];      // List of appointments
  selectedVisit: any | null;     // Currently selected visit
  payerInfo: any[];              // Insurance/payer information
  updatedAt: number;             // Timestamp of last update
}
```

### Example Patient Data Structure
```typescript
const patientData = {
  table2: [{
    mrNo: '12345',
    patientName: 'John Doe',
    dob: '1990-01-01',
    gender: 'Male',
    phone: '555-0100',
    email: 'john.doe@example.com'
  }],
  table1: [{
    insuranceProvider: 'Blue Cross',
    policyNumber: 'BC123456',
    status: 'Active'
  }]
};
```

---

## Quick Reference Commands

```typescript
// READ
const data = this.patientBannerService.getPatientData();
this.patientBannerService.patientData$.subscribe(data => {});

// UPDATE
await this.patientBannerService.setPatientData(newData);
await this.patientBannerService.setVisitAppointments(appointments);
await this.patientBannerService.setSelectedVisit(visit);

// DELETE
await this.patientBannerService.setPatientData(null);  // Clear patient
await this.patientBannerService.clearAll();            // Clear everything

// UTILITY
await this.patientBannerService.waitForHydration();    // Wait for load
this.patientBannerService.setIsbanneropen(true);       // Show banner
```

---

## Best Practices

1. **Always await hydration** before accessing data in critical operations
2. **Use observables** for reactive UI updates
3. **Clear data** when logging out or switching facilities
4. **Handle errors** gracefully - RxDB operations may fail
5. **Update schema version** when modifying the data structure
6. **Test persistence** by refreshing the page after saving

---

## Support

For issues or questions:
- Check browser console for RxDB error messages
- Look for emoji-prefixed log messages (🔄, ✅, ❌, 📦, etc.)
- Verify IndexedDB in browser DevTools > Application > Storage
- Check that the `coherent` database exists with `patientbanner` collection

---

**Last Updated:** November 2025  
**RxDB Version:** 16.19.1  
**Schema Version:** 3
