# 🚀 RxDB Helper Service - Complete Documentation

## 📖 Overview

**RxDB Helper Service** ek generic, reusable service hai jo aapko **kisi bhi** RxDB collection ke saath easily kaam karne ki facility deti hai. Ye Patient Banner Service se completely independent hai.

---

## ✨ Key Features

✅ **Generic CRUD Operations** - Create, Read, Update, Delete  
✅ **MR Number Queries** - Specifically designed for healthcare  
✅ **Search Functionality** - Text-based search  
✅ **Pagination Support** - Built-in pagination  
✅ **Bulk Operations** - Insert/Update multiple records  
✅ **Export/Import** - Backup and restore data  
✅ **Collection Management** - Create, remove, stats  
✅ **Type-Safe** - Full TypeScript support  

---

## 📂 Files Created

### 1. **`rxdb-helper.service.ts`**
Generic RxDB service with all CRUD operations

### 2. **`patient-data.service.ts`**
Example service showing how to use RxDB Helper for Patient management

### 3. **`RXDB_HELPER_GUIDE.md`**
Complete usage guide with examples

---

## 🚀 Quick Start (2 Minutes)

### Step 1: Import Service
```typescript
import { RxDBHelperService } from '@core/services/rxdb-helper.service';

constructor(private rxdbHelper: RxDBHelperService) {}
```

### Step 2: Define Schema (Optional)
```typescript
const mySchema = {
  title: 'my collection',
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: { type: 'string' },
    mrNo: { type: 'string' },
    name: { type: 'string' }
  },
  required: ['id'],
  indexes: ['mrNo']
};
```

### Step 3: Use CRUD Operations
```typescript
// CREATE
await this.rxdbHelper.insert('patients', { id: '1', mrNo: '12345', name: 'John' });

// READ
const patient = await this.rxdbHelper.getById('patients', '1');
const byMR = await this.rxdbHelper.getByMrNo('patients', '12345');

// UPDATE
await this.rxdbHelper.updateById('patients', '1', { name: 'John Updated' });

// DELETE
await this.rxdbHelper.deleteById('patients', '1');
```

---

## 📚 Complete API Reference

### CREATE Operations

| Method | Description | Example |
|--------|-------------|---------|
| `insert(collection, doc)` | Insert single document | `await insert('patients', patient)` |
| `bulkInsert(collection, docs)` | Insert multiple documents | `await bulkInsert('patients', [p1, p2])` |
| `upsert(collection, doc)` | Insert or update | `await upsert('patients', patient)` |

### READ Operations

| Method | Description | Example |
|--------|-------------|---------|
| `getById(collection, id)` | Get by primary key | `await getById('patients', 'P001')` |
| `getByMrNo(collection, mrNo)` | **Get by MR Number** | `await getByMrNo('patients', '12345')` |
| `getAll(collection, limit?)` | Get all documents | `await getAll('patients', 100)` |
| `find(collection, selector, options?)` | Custom query | `await find('patients', {age: {$gt: 25}})` |
| `findOne(collection, selector)` | Find single document | `await findOne('patients', {mrNo: '123'})` |
| `count(collection, selector?)` | Count documents | `await count('patients', {status: 'active'})` |
| `search(collection, field, text)` | Text search | `await search('patients', 'name', 'John')` |

### UPDATE Operations

| Method | Description | Example |
|--------|-------------|---------|
| `updateById(collection, id, data)` | Update by ID | `await updateById('patients', 'P001', {name: 'X'})` |
| `updateByMrNo(collection, mrNo, data)` | **Update by MR** | `await updateByMrNo('patients', '12345', {...})` |
| `updateMany(collection, selector, data)` | Update multiple | `await updateMany('patients', {status: 'old'}, {...})` |

### DELETE Operations

| Method | Description | Example |
|--------|-------------|---------|
| `deleteById(collection, id)` | Delete by ID | `await deleteById('patients', 'P001')` |
| `deleteByMrNo(collection, mrNo)` | **Delete by MR** | `await deleteByMrNo('patients', '12345')` |
| `deleteMany(collection, selector)` | Delete multiple | `await deleteMany('patients', {status: 'old'})` |
| `clearCollection(collection)` | Clear all | `await clearCollection('patients')` |

### UTILITY Operations

| Method | Description | Example |
|--------|-------------|---------|
| `exists(collection, id)` | Check if exists | `await exists('patients', 'P001')` |
| `getStats(collection)` | Get collection stats | `await getStats('patients')` |
| `exportCollection(collection)` | Export all data | `await exportCollection('patients')` |
| `importCollection(collection, data)` | Import data | `await importCollection('patients', data)` |
| `removeCollection(collection)` | Remove collection | `await removeCollection('patients')` |

---

## 💡 Use Cases

### Use Case 1: Patient Management
```typescript
// Register patient
await rxdbHelper.insert('patients', {
  id: 'P001',
  mrNo: '12345',
  name: 'John Doe',
  status: 'active'
});

// Find by MR
const patient = await rxdbHelper.getByMrNo('patients', '12345');

// Update
await rxdbHelper.updateByMrNo('patients', '12345', {
  phone: '555-0100'
});
```

### Use Case 2: Appointment System
```typescript
// Create appointment
await rxdbHelper.insert('appointments', {
  id: 'APT001',
  mrNo: '12345',
  date: '2025-01-15',
  time: '10:00 AM'
});

// Get patient appointments
const appointments = await rxdbHelper.getByMrNo('appointments', '12345');

// Get today's appointments
const today = await rxdbHelper.find('appointments', {
  date: new Date().toISOString().split('T')[0]
});
```

### Use Case 3: Lab Results
```typescript
// Save lab result
await rxdbHelper.insert('labresults', {
  id: 'LAB001',
  mrNo: '12345',
  testName: 'CBC',
  results: {...},
  date: Date.now()
});

// Get patient results
const results = await rxdbHelper.getByMrNo('labresults', '12345');
```

### Use Case 4: Prescription System
```typescript
// Add prescription
await rxdbHelper.insert('prescriptions', {
  id: 'RX001',
  mrNo: '12345',
  medications: [...]
});

// Search medication
const prescriptions = await rxdbHelper.search(
  'prescriptions',
  'medications',
  'Aspirin'
);
```

---

## 🎯 Real-World Example: Complete Patient Service

Dekho `patient-data.service.ts` file - ye ek complete example hai jo:

✅ Schema define karta hai  
✅ Type-safe operations provide karta hai  
✅ Domain-specific methods banata hai  
✅ Error handling karta hai  
✅ Statistics provide karta hai  

**Usage:**
```typescript
import { PatientDataService } from '@core/services/patient-data.service';

constructor(private patientService: PatientDataService) {}

// Register patient
const patient = await this.patientService.registerPatient({
  mrNo: '12345',
  name: 'John Doe',
  status: 'active'
});

// Get by MR
const found = await this.patientService.getPatientByMRNo('12345');

// Search by name
const results = await this.patientService.searchPatientsByName('John');

// Get statistics
const stats = await this.patientService.getStats();
console.log(stats); // { total: 100, active: 90, inactive: 10, deceased: 0 }
```

---

## 🔥 Advanced Features

### 1. Pagination
```typescript
const page1 = await rxdbHelper.find('patients', 
  { status: 'active' },
  { limit: 10, skip: 0, sort: { name: 'asc' } }
);

const page2 = await rxdbHelper.find('patients',
  { status: 'active' },
  { limit: 10, skip: 10, sort: { name: 'asc' } }
);
```

### 2. Complex Queries
```typescript
// Age between 18-65, active status
const patients = await rxdbHelper.find('patients', {
  age: { $gte: 18, $lte: 65 },
  status: 'active',
  gender: 'male'
});

// OR conditions
const results = await rxdbHelper.find('patients', {
  $or: [
    { status: 'active' },
    { status: 'pending' }
  ]
});
```

### 3. Bulk Operations
```typescript
// Insert 100 patients at once
const patients = [...Array(100)].map((_, i) => ({
  id: `P${i}`,
  mrNo: `MR${i}`,
  name: `Patient ${i}`,
  status: 'active'
}));

await rxdbHelper.bulkInsert('patients', patients);
```

### 4. Export/Import
```typescript
// Backup
const backup = await rxdbHelper.exportCollection('patients');
localStorage.setItem('backup', JSON.stringify(backup));

// Restore
const data = JSON.parse(localStorage.getItem('backup'));
await rxdbHelper.importCollection('patients', data);
```

---

## 📊 Query Operators

RxDB uses MongoDB-style query operators:

| Operator | Description | Example |
|----------|-------------|---------|
| `$eq` | Equal | `{age: {$eq: 25}}` |
| `$gt` | Greater than | `{age: {$gt: 18}}` |
| `$gte` | Greater than or equal | `{age: {$gte: 18}}` |
| `$lt` | Less than | `{age: {$lt: 65}}` |
| `$lte` | Less than or equal | `{age: {$lte: 65}}` |
| `$ne` | Not equal | `{status: {$ne: 'inactive'}}` |
| `$in` | In array | `{status: {$in: ['active', 'pending']}}` |
| `$regex` | Regular expression | `{name: {$regex: /john/i}}` |
| `$or` | OR condition | `{$or: [{...}, {...}]}` |
| `$and` | AND condition | `{$and: [{...}, {...}]}` |

---

## 🎨 Schema Best Practices

### Good Schema Example
```typescript
const schema: RxJsonSchema<any> = {
  title: 'patients',
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: { type: 'string', maxLength: 100 },
    mrNo: { type: 'string', maxLength: 50 },
    name: { type: 'string' },
    age: { type: 'number', minimum: 0, maximum: 150 },
    status: { 
      type: 'string', 
      enum: ['active', 'inactive', 'deceased'] 
    },
    createdAt: { type: 'number' }
  },
  required: ['id', 'mrNo', 'name', 'status'],
  indexes: ['mrNo', 'status', 'name'] // ✅ Index frequently queried fields
};
```

### Schema Tips
✅ **Index MR Number** - Always!  
✅ **Use enums** for status fields  
✅ **Set maxLength** to prevent huge strings  
✅ **Add validation** (min, max, pattern)  
✅ **Required fields** - Don't make everything optional  

---

## 🔧 Performance Tips

1. **Use Indexes**
   ```typescript
   indexes: ['mrNo', 'status', 'createdAt']
   ```

2. **Limit Results**
   ```typescript
   await rxdbHelper.getAll('patients', 100); // Not all!
   ```

3. **Use Pagination**
   ```typescript
   { limit: 20, skip: offset }
   ```

4. **Batch Inserts**
   ```typescript
   await rxdbHelper.bulkInsert('patients', manyPatients);
   // Not: multiple insert() calls
   ```

5. **Clean Old Data**
   ```typescript
   const oldDate = Date.now() - (30 * 24 * 60 * 60 * 1000);
   await rxdbHelper.deleteMany('logs', {
     createdAt: { $lt: oldDate }
   });
   ```

---

## 🐛 Common Issues

### Issue: "Collection does not exist"
**Fix:** Create collection with schema first
```typescript
await rxdbHelper.getCollection('myCollection', mySchema);
```

### Issue: "Primary key missing"
**Fix:** Always include primary key in documents
```typescript
await rxdbHelper.insert('patients', {
  id: 'P001', // ✅ Primary key
  // ...other fields
});
```

### Issue: Query not working
**Fix:** Make sure field is indexed in schema
```typescript
indexes: ['mrNo', 'status']
```

---

## 📦 Migration from Patient Banner Service

Agar aap Patient Banner Service use kar rahe ho aur is generic service mein migrate karna hai:

```typescript
// OLD (Patient Banner Service)
await patientBannerService.setPatientData(data);
const patient = patientBannerService.getPatientData();

// NEW (RxDB Helper)
await rxdbHelper.upsert('patientbanner', { id: 'current', patientData: data });
const doc = await rxdbHelper.getById('patientbanner', 'current');
const patient = doc?.patientData;
```

---

## 📞 Quick Reference Card

```typescript
// ESSENTIAL OPERATIONS

// Create
await rxdbHelper.insert(collection, document)
await rxdbHelper.upsert(collection, document)

// Read
await rxdbHelper.getById(collection, id)
await rxdbHelper.getByMrNo(collection, mrNo)  // 🏥 Healthcare specific
await rxdbHelper.find(collection, {status: 'active'})

// Update
await rxdbHelper.updateById(collection, id, updates)
await rxdbHelper.updateByMrNo(collection, mrNo, updates)  // 🏥

// Delete
await rxdbHelper.deleteById(collection, id)
await rxdbHelper.deleteByMrNo(collection, mrNo)  // 🏥

// Utility
await rxdbHelper.count(collection)
await rxdbHelper.search(collection, field, text)
await rxdbHelper.exists(collection, id)
```

---

## 🎓 Learning Path

### Beginner (10 mins)
1. Read **Quick Start** section
2. Try basic insert/get operations
3. Use `getByMrNo()` for patient lookup

### Intermediate (30 mins)
1. Read **RXDB_HELPER_GUIDE.md**
2. Try find() with complex queries
3. Implement pagination

### Advanced (1 hour)
1. Study **patient-data.service.ts** example
2. Create your own domain service
3. Implement export/import

---

## 🌟 Why Use This Service?

### ✅ Instead of direct RxDB calls:
```typescript
// ❌ Complex and verbose
const db = await this.dbService.db;
const collection = db.collections.patients;
const docs = await collection.find({
  selector: { mrNo: '12345' }
}).exec();
const patient = docs[0]?.toJSON();
```

### ✅ Use Helper Service:
```typescript
// ✅ Simple and clean
const patients = await this.rxdbHelper.getByMrNo('patients', '12345');
const patient = patients[0];
```

---

## 📁 File Structure

```
src/app/core/services/
├── db.service.ts                    # RxDB initialization
├── rxdb-helper.service.ts           # Generic CRUD service ⭐
├── patient-data.service.ts          # Example domain service ⭐
├── patient-banner-store.service.ts  # Legacy (specific)
└── patient-banner.service.ts        # Legacy (specific)

Documentation:
├── RXDB_HELPER_README.md           # This file
├── RXDB_HELPER_GUIDE.md            # Detailed guide with examples
├── RXDB_USAGE_GUIDE.md             # Patient Banner specific
└── RXDB_EXAMPLES.md                # Patient Banner examples
```

---

## 🚀 Next Steps

1. **Start with basics** - Try insert, get, update, delete
2. **Use getByMrNo()** - MR Number queries
3. **Study example** - Check `patient-data.service.ts`
4. **Create your service** - Make your own domain service
5. **Read full guide** - Check `RXDB_HELPER_GUIDE.md`

---

## 💬 Support

For detailed examples and troubleshooting:
- **Basic Usage:** Check "Quick Start" section above
- **All Methods:** Read `RXDB_HELPER_GUIDE.md`
- **Example Code:** Study `patient-data.service.ts`
- **Patient Banner:** See existing `RXDB_USAGE_GUIDE.md`

---

**🎉 Ready to use! Start building with RxDB Helper Service!**

---

**Last Updated:** November 2025  
**Version:** 1.0.0  
**RxDB Version:** 16.19.1
