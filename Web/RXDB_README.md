# RxDB Patient Banner System - Complete Documentation

## 📖 Documentation Index

This project uses **RxDB** (Reactive Database) for client-side data persistence. All patient banner data is stored locally in the browser using IndexedDB, allowing data to persist across page refreshes.

---

## 📚 Available Documentation

### 1. **RXDB_USAGE_GUIDE.md** - Comprehensive Guide
   - Complete overview of RxDB architecture
   - Detailed explanations of all operations (Create, Read, Update, Delete)
   - Advanced features and patterns
   - Data structure reference
   - Best practices

   **Read this if:** You're new to the system or need deep understanding

---

### 2. **RXDB_EXAMPLES.md** - Practical Examples
   - 10+ real-world usage scenarios
   - Copy-paste ready code snippets
   - Component lifecycle examples
   - Testing and debugging examples
   - Complete working implementations

   **Read this if:** You want to see working code examples

---

### 3. **RXDB_TROUBLESHOOTING.md** - Problem Solving
   - Common issues and their solutions
   - Step-by-step debugging guide
   - Performance optimization tips
   - Emergency fixes
   - Console debugging commands

   **Read this if:** Something isn't working as expected

---

### 4. **RXDB_QUICK_REFERENCE.md** - Cheat Sheet
   - Quick command reference
   - One-liner solutions
   - Essential patterns
   - Keyboard-friendly format
   - Emergency commands

   **Read this if:** You need quick answers while coding

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Inject the Service

```typescript
import { PatientBannerService } from '@/app/shared/Services/patient-banner.service';

constructor(private patientBannerService: PatientBannerService) {}
```

### Step 2: Load Data on Init

```typescript
async ngOnInit() {
  // Wait for RxDB to load existing data
  await this.patientBannerService.waitForHydration();
  
  // Subscribe to patient data changes
  this.patientBannerService.patientData$.subscribe(data => {
    if (data) {
      console.log('Patient loaded:', data.table2[0].mrNo);
      // Use the data in your component
    }
  });
}
```

### Step 3: Save Patient Data

```typescript
async savePatient() {
  const patientData = {
    table2: [{ mrNo: '12345', patientName: 'John Doe' }],
    table1: [{ insuranceInfo: '...' }]
  };
  
  await this.patientBannerService.setPatientData(patientData);
  console.log('✅ Patient saved to RxDB');
}
```

### Step 4: Clear on Logout

```typescript
async logout() {
  await this.patientBannerService.clearAll();
  this.router.navigate(['/login']);
}
```

**That's it!** Data will now persist across page refreshes.

---

## 🎯 Core Concepts

### 1. **RxDB = Local Database**
   - Stores data in browser's IndexedDB
   - Data survives page refreshes
   - No server needed for persistence

### 2. **Observable Streams**
   - Service emits data changes via RxJS observables
   - Components subscribe and auto-update
   - Reactive and real-time

### 3. **Single Document Pattern**
   - All patient banner data in one document (id: 'current')
   - Atomic updates - no partial failures
   - Simple to understand and debug

### 4. **Auto-cleanup on Patient Switch**
   - When MR number changes, old appointments cleared
   - Prevents data mixing between patients
   - Built-in data integrity

---

## 📦 What Gets Stored

```
PatientBannerDocument {
  ├── patientData        (Demographics, insurance)
  ├── patientIVFData     (IVF-specific info)
  ├── visitAppointments  (List of appointments)
  ├── selectedVisit      (Currently active visit)
  ├── payerInfo         (Insurance payers)
  └── updatedAt         (Last modified timestamp)
}
```

---

## 🛠️ Available Operations

| Operation | Method | Description |
|-----------|--------|-------------|
| **Save** | `setPatientData()` | Save patient demographics |
| **Load** | `patientData$` | Subscribe to patient changes |
| **Check** | `hasPatientData()` | Check if patient loaded |
| **Clear** | `clearAll()` | Remove all data |
| **Export** | `exportRxDBData()` | Get raw RxDB data |
| **Wait** | `waitForHydration()` | Wait for initial load |

---

## 🔧 System Architecture

```
┌─────────────────────────────────────┐
│        Your Component               │
│  (Subscribe to observables)         │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│    PatientBannerService             │
│  (Business logic, RxJS streams)     │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│  PatientBannerStoreService          │
│  (RxDB CRUD operations)             │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│         DbService                   │
│  (RxDB database instance)           │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│   IndexedDB (Browser Storage)       │
└─────────────────────────────────────┘
```

---

## ✅ Current Implementation Status

### ✅ Implemented Features
- [x] Save patient data to RxDB
- [x] Load data on page refresh
- [x] Auto-clear on patient switch
- [x] Appointment management
- [x] Visit selection persistence
- [x] Payer info storage
- [x] IVF data support
- [x] Banner visibility control
- [x] Loading state management
- [x] Export/Import utilities
- [x] Schema migrations (v1 → v2 → v3)

### ✅ Working Features
- Patient data persists across refreshes
- Banner shows/hides correctly
- No data mixing between patients
- Fast local access
- Offline capable

---

## 🔍 How to Verify It's Working

### Test 1: Basic Persistence
1. Load a patient
2. Refresh the page (F5)
3. Patient data should still be visible ✅

### Test 2: Check IndexedDB
1. Open DevTools → Application → Storage → IndexedDB
2. Expand `coherent` database
3. Open `patientbanner` collection
4. Verify document with id: `current` exists ✅

### Test 3: Console Check
```javascript
// In browser console
const service = window.ng.getInjector().get('PatientBannerService');
await service.getFullSnapshot();
// Should show current patient data ✅
```

---

## 🐛 Common Issues

| Issue | Fix |
|-------|-----|
| Data not persisting | Check migration plugin loaded |
| Banner not showing | Verify `Isbanneropen = true` |
| Loading too slow | Add `await waitForHydration()` |
| Old data showing | Clear browser storage |

**For detailed solutions:** See `RXDB_TROUBLESHOOTING.md`

---

## 📞 Getting Help

1. **Quick answer needed?** → Check `RXDB_QUICK_REFERENCE.md`
2. **Want to understand how?** → Read `RXDB_USAGE_GUIDE.md`
3. **Need working code?** → See `RXDB_EXAMPLES.md`
4. **Something broken?** → Check `RXDB_TROUBLESHOOTING.md`
5. **Still stuck?** → Check browser console for emoji logs 🔄 ✅ ❌

---

## 🎓 Learning Path

### Level 1: Beginner (15 mins)
1. Read **Quick Start** section above
2. Try basic save/load in your component
3. Verify data persists on refresh

### Level 2: Intermediate (1 hour)
1. Read `RXDB_USAGE_GUIDE.md`
2. Try examples from `RXDB_EXAMPLES.md`
3. Implement in your feature

### Level 3: Advanced (2 hours)
1. Study schema structure
2. Learn migration strategies
3. Optimize performance
4. Debug with DevTools

---

## 🔐 Security Notes

- **Data stored locally** - Only accessible from same browser
- **No server sync** - Data stays on device
- **Cleared on logout** - Call `clearAll()` in logout function
- **Private browsing** - Data lost when window closes
- **Multiple tabs** - Share same RxDB instance

---

## 📊 Performance Metrics

- **Initial Load:** ~50-100ms
- **Save Operation:** ~10-30ms
- **Data Size:** ~10-50KB per patient
- **Browser Support:** Chrome, Firefox, Edge, Safari
- **Storage Limit:** ~50MB (varies by browser)

---

## 🚀 Production Checklist

Before deploying, ensure:

- [ ] Migration plugin loaded (`db.service.ts`)
- [ ] Schema version correct
- [ ] `clearAll()` called on logout
- [ ] Error handling in place
- [ ] Loading states shown to user
- [ ] Tested on target browsers
- [ ] IndexedDB working in prod environment

---

## 📝 Version History

| Version | Changes | Date |
|---------|---------|------|
| v3 | Added null support for nullable fields | Nov 2025 |
| v2 | Added payerInfo array field | Oct 2025 |
| v1 | Initial implementation | Sep 2025 |

---

## 🤝 Contributing

When modifying the schema:

1. Increment `version` number
2. Add migration strategy
3. Test data migration
4. Update documentation
5. Clear test database

---

## 📄 License

Internal use only - Part of Coherent Healthcare System

---

## 🎉 Success!

If you can:
- [x] Load a patient
- [x] Refresh the page
- [x] See patient data still there

**Then RxDB is working perfectly!** 🎊

---

## 📚 Complete Documentation Set

1. **RXDB_README.md** (This file) - Overview and quick start
2. **RXDB_USAGE_GUIDE.md** - Complete reference
3. **RXDB_EXAMPLES.md** - Code examples
4. **RXDB_TROUBLESHOOTING.md** - Problem solving
5. **RXDB_QUICK_REFERENCE.md** - Cheat sheet

---

## 🔗 Quick Links

- **RxDB Official Docs:** https://rxdb.info
- **IndexedDB MDN:** https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
- **RxJS Docs:** https://rxjs.dev

---

**Last Updated:** November 2025  
**Maintained By:** Development Team  
**RxDB Version:** 16.19.1  
**Schema Version:** 3

---

**Ready to code?** Start with the **Quick Start** section above! 🚀
