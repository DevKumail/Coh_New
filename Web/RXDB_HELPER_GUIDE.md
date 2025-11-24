# RxDB Helper Service - Complete Guide

## 📚 Generic RxDB CRUD Service

Ye service aapko **kisi bhi** RxDB collection ke saath kaam karne ki flexibility deti hai. Patient banner se completely independent!

---

## 🚀 Quick Start

### Import Service
```typescript
import { RxDBHelperService } from '@core/services/rxdb-helper.service';

constructor(private rxdbHelper: RxDBHelperService) {}
```

---

## 📖 Complete CRUD Operations

### 1️⃣ CREATE Operations

#### Insert Single Document
```typescript
async addPatient() {
  const patient = {
    id: 'P001',
    mrNo: '12345',
    name: 'John Doe',
    age: 30
  };

  const result = await this.rxdbHelper.insert('patients', patient);
  console.log('✅ Patient added:', result);
}
```

#### Insert Multiple Documents
```typescript
async addMultiplePatients() {
  const patients = [
    { id: 'P001', mrNo: '12345', name: 'John Doe' },
    { id: 'P002', mrNo: '67890', name: 'Jane Smith' },
    { id: 'P003', mrNo: '11111', name: 'Bob Johnson' }
  ];

  const results = await this.rxdbHelper.bulkInsert('patients', patients);
  console.log('✅ Added patients:', results.length);
}
```

#### Upsert (Insert or Update)
```typescript
async savePatient() {
  const patient = {
    id: 'P001',
    mrNo: '12345',
    name: 'John Doe Updated',
    age: 31
  };

  // Agar exist karta hai to update karega, nahi to insert
  const result = await this.rxdbHelper.upsert('patients', patient);
  console.log('✅ Patient saved:', result);
}
```

---

### 2️⃣ READ Operations

#### Get by ID
```typescript
async getPatient() {
  const patient = await this.rxdbHelper.getById('patients', 'P001');
  
  if (patient) {
    console.log('👤 Patient found:', patient);
  } else {
    console.log('❌ Patient not found');
  }
}
```

#### Get by MR Number (Special Method!)
```typescript
async getPatientByMR() {
  // MR number se patient nikalna
  const patients = await this.rxdbHelper.getByMrNo('patients', '12345');
  
  console.log(`📦 Found ${patients.length} patients with MR: 12345`);
  
  if (patients.length > 0) {
    const patient = patients[0];
    console.log('👤 Patient:', patient);
  }
}

// Agar MR number nested field mein hai
async getPatientByNestedMR() {
  const patients = await this.rxdbHelper.getByMrNo(
    'patients', 
    '12345',
    'demographics.mrNo' // nested path
  );
}
```

#### Get All Documents
```typescript
async getAllPatients() {
  // Sab patients
  const allPatients = await this.rxdbHelper.getAll('patients');
  console.log('📦 Total patients:', allPatients.length);

  // Limited patients (pehle 10)
  const recentPatients = await this.rxdbHelper.getAll('patients', 10);
  console.log('📦 Recent 10 patients:', recentPatients.length);
}
```

#### Custom Query (Find)
```typescript
async findPatients() {
  // Age > 25 wale patients
  const patients = await this.rxdbHelper.find('patients', {
    age: { $gt: 25 }
  });
  console.log('📦 Patients above 25:', patients.length);

  // Multiple conditions
  const activePatients = await this.rxdbHelper.find('patients', {
    status: 'active',
    age: { $gte: 18, $lte: 65 }
  });

  // Sort + Limit + Skip (pagination)
  const paginatedPatients = await this.rxdbHelper.find(
    'patients',
    { status: 'active' },
    { 
      sort: { name: 'asc' },
      limit: 10,
      skip: 20  // Page 3 (skip first 20)
    }
  );
}
```

#### Find One
```typescript
async findActivePatient() {
  const patient = await this.rxdbHelper.findOne('patients', {
    status: 'active',
    mrNo: '12345'
  });

  if (patient) {
    console.log('✅ Found:', patient);
  }
}
```

#### Count Documents
```typescript
async countPatients() {
  // Total count
  const total = await this.rxdbHelper.count('patients');
  console.log('📊 Total patients:', total);

  // Count with condition
  const activeCount = await this.rxdbHelper.count('patients', {
    status: 'active'
  });
  console.log('📊 Active patients:', activeCount);
}
```

#### Search (Text Search)
```typescript
async searchPatients() {
  // Name mein "John" search karo
  const results = await this.rxdbHelper.search('patients', 'name', 'John');
  console.log('🔍 Search results:', results);

  // Case-insensitive search
  const results2 = await this.rxdbHelper.search('patients', 'name', 'john');
}
```

---

### 3️⃣ UPDATE Operations

#### Update by ID
```typescript
async updatePatient() {
  const updated = await this.rxdbHelper.updateById('patients', 'P001', {
    name: 'John Doe Updated',
    age: 32,
    lastUpdated: Date.now()
  });

  if (updated) {
    console.log('✅ Patient updated:', updated);
  }
}
```

#### Update by MR Number
```typescript
async updatePatientByMR() {
  const count = await this.rxdbHelper.updateByMrNo('patients', '12345', {
    status: 'inactive',
    updatedAt: Date.now()
  });

  console.log(`✅ Updated ${count} patients`);
}
```

#### Update Multiple Documents
```typescript
async updateMultiplePatients() {
  // Sab active patients ko verified mark karo
  const count = await this.rxdbHelper.updateMany('patients', 
    { status: 'active' },
    { verified: true }
  );

  console.log(`✅ Updated ${count} patients`);
}
```

---

### 4️⃣ DELETE Operations

#### Delete by ID
```typescript
async deletePatient() {
  const deleted = await this.rxdbHelper.deleteById('patients', 'P001');
  
  if (deleted) {
    console.log('✅ Patient deleted');
  } else {
    console.log('❌ Patient not found');
  }
}
```

#### Delete by MR Number
```typescript
async deletePatientByMR() {
  const count = await this.rxdbHelper.deleteByMrNo('patients', '12345');
  console.log(`✅ Deleted ${count} patients`);
}
```

#### Delete Multiple Documents
```typescript
async deleteInactivePatients() {
  const count = await this.rxdbHelper.deleteMany('patients', {
    status: 'inactive'
  });

  console.log(`✅ Deleted ${count} inactive patients`);
}
```

#### Clear Entire Collection
```typescript
async clearAllPatients() {
  const count = await this.rxdbHelper.clearCollection('patients');
  console.log(`✅ Cleared ${count} patients`);
}
```

---

## 🛠️ Utility Operations

### Check if Document Exists
```typescript
async checkPatientExists() {
  const exists = await this.rxdbHelper.exists('patients', 'P001');
  
  if (exists) {
    console.log('✅ Patient exists');
  } else {
    console.log('❌ Patient not found');
  }
}
```

### Get Collection Stats
```typescript
async getCollectionInfo() {
  const stats = await this.rxdbHelper.getStats('patients');
  
  console.log('📊 Collection:', stats.name);
  console.log('📊 Exists:', stats.exists);
  console.log('📊 Count:', stats.count);
}
```

### Export Collection
```typescript
async exportPatients() {
  const allData = await this.rxdbHelper.exportCollection('patients');
  
  // Download as JSON
  const blob = new Blob([JSON.stringify(allData, null, 2)], { 
    type: 'application/json' 
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'patients-export.json';
  a.click();
}
```

### Import Collection
```typescript
async importPatients(file: File) {
  const text = await file.text();
  const data = JSON.parse(text);
  
  await this.rxdbHelper.importCollection('patients', data);
  console.log('✅ Data imported');
}
```

### Remove Collection
```typescript
async removePatientCollection() {
  await this.rxdbHelper.removeCollection('patients');
  console.log('✅ Collection removed completely');
}
```

---

## 📦 Real-World Examples

### Example 1: Patient Management System

```typescript
export class PatientManagementComponent {
  constructor(private rxdbHelper: RxDBHelperService) {}

  // Add new patient
  async registerPatient(patientData: any) {
    try {
      const patient = await this.rxdbHelper.insert('patients', {
        id: `P${Date.now()}`,
        mrNo: patientData.mrNo,
        name: patientData.name,
        dob: patientData.dob,
        createdAt: Date.now(),
        status: 'active'
      });

      console.log('✅ Patient registered:', patient);
      return patient;
    } catch (error) {
      console.error('❌ Registration failed:', error);
    }
  }

  // Search by MR
  async searchByMR(mrNo: string) {
    const patients = await this.rxdbHelper.getByMrNo('patients', mrNo);
    
    if (patients.length > 0) {
      return patients[0];
    }
    return null;
  }

  // Update patient info
  async updatePatientInfo(id: string, updates: any) {
    return await this.rxdbHelper.updateById('patients', id, {
      ...updates,
      lastModified: Date.now()
    });
  }

  // Get active patients
  async getActivePatients() {
    return await this.rxdbHelper.find('patients', { status: 'active' });
  }
}
```

### Example 2: Appointment System

```typescript
export class AppointmentComponent {
  constructor(private rxdbHelper: RxDBHelperService) {}

  // Schedule appointment
  async scheduleAppointment(mrNo: string, appointmentData: any) {
    const appointment = {
      id: `APT${Date.now()}`,
      mrNo: mrNo,
      date: appointmentData.date,
      time: appointmentData.time,
      provider: appointmentData.provider,
      status: 'scheduled',
      createdAt: Date.now()
    };

    return await this.rxdbHelper.insert('appointments', appointment);
  }

  // Get patient appointments
  async getPatientAppointments(mrNo: string) {
    return await this.rxdbHelper.getByMrNo('appointments', mrNo);
  }

  // Get today's appointments
  async getTodayAppointments() {
    const today = new Date().toISOString().split('T')[0];
    
    return await this.rxdbHelper.find('appointments', {
      date: today,
      status: 'scheduled'
    }, {
      sort: { time: 'asc' }
    });
  }

  // Cancel appointment
  async cancelAppointment(appointmentId: string) {
    return await this.rxdbHelper.updateById('appointments', appointmentId, {
      status: 'cancelled',
      cancelledAt: Date.now()
    });
  }
}
```

### Example 3: Prescription System

```typescript
export class PrescriptionComponent {
  constructor(private rxdbHelper: RxDBHelperService) {}

  // Add prescription
  async addPrescription(mrNo: string, medications: any[]) {
    const prescription = {
      id: `RX${Date.now()}`,
      mrNo: mrNo,
      medications: medications,
      prescribedDate: Date.now(),
      status: 'active'
    };

    return await this.rxdbHelper.insert('prescriptions', prescription);
  }

  // Get patient prescriptions
  async getPatientPrescriptions(mrNo: string) {
    return await this.rxdbHelper.find('prescriptions', 
      { mrNo: mrNo },
      { sort: { prescribedDate: 'desc' } }
    );
  }

  // Search medication
  async searchMedication(medicationName: string) {
    return await this.rxdbHelper.search(
      'prescriptions',
      'medications',
      medicationName
    );
  }
}
```

### Example 4: Lab Results System

```typescript
export class LabResultsComponent {
  constructor(private rxdbHelper: RxDBHelperService) {}

  // Save lab result
  async saveLabResult(mrNo: string, labData: any) {
    const result = {
      id: `LAB${Date.now()}`,
      mrNo: mrNo,
      testName: labData.testName,
      results: labData.results,
      normalRange: labData.normalRange,
      resultDate: Date.now(),
      status: labData.status
    };

    return await this.rxdbHelper.upsert('labresults', result);
  }

  // Get patient lab results
  async getPatientLabResults(mrNo: string) {
    return await this.rxdbHelper.find('labresults',
      { mrNo: mrNo },
      { 
        sort: { resultDate: 'desc' },
        limit: 20
      }
    );
  }

  // Get abnormal results
  async getAbnormalResults(mrNo: string) {
    return await this.rxdbHelper.find('labresults', {
      mrNo: mrNo,
      status: 'abnormal'
    });
  }
}
```

---

## 🎨 Advanced Patterns

### Pattern 1: Pagination
```typescript
async getPaginatedPatients(page: number, pageSize: number = 10) {
  const skip = (page - 1) * pageSize;
  
  const patients = await this.rxdbHelper.find('patients',
    { status: 'active' },
    {
      sort: { name: 'asc' },
      limit: pageSize,
      skip: skip
    }
  );

  const totalCount = await this.rxdbHelper.count('patients', { 
    status: 'active' 
  });

  return {
    data: patients,
    page: page,
    pageSize: pageSize,
    totalPages: Math.ceil(totalCount / pageSize),
    totalCount: totalCount
  };
}
```

### Pattern 2: Batch Operations
```typescript
async batchUpdatePatients(updates: Array<{id: string, data: any}>) {
  const results = [];
  
  for (const update of updates) {
    const result = await this.rxdbHelper.updateById(
      'patients',
      update.id,
      update.data
    );
    results.push(result);
  }

  return results;
}
```

### Pattern 3: Conditional Delete
```typescript
async deleteOldRecords(days: number = 30) {
  const cutoffDate = Date.now() - (days * 24 * 60 * 60 * 1000);
  
  const count = await this.rxdbHelper.deleteMany('logs', {
    createdAt: { $lt: cutoffDate }
  });

  console.log(`✅ Deleted ${count} old records`);
}
```

---

## 🔧 Collection Schema Examples

### Patient Collection Schema
```typescript
import { RxJsonSchema } from 'rxdb';

export const patientSchema: RxJsonSchema<any> = {
  title: 'patient schema',
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: { type: 'string', maxLength: 100 },
    mrNo: { type: 'string', maxLength: 50 },
    name: { type: 'string' },
    dob: { type: 'string' },
    age: { type: 'number' },
    gender: { type: 'string' },
    phone: { type: 'string' },
    email: { type: 'string' },
    status: { type: 'string' },
    createdAt: { type: 'number' },
    updatedAt: { type: 'number' }
  },
  required: ['id', 'mrNo', 'name'],
  indexes: ['mrNo', 'status']
};

// Usage
async initializeCollection() {
  await this.rxdbHelper.getCollection('patients', patientSchema);
}
```

---

## 💡 Tips & Best Practices

1. **Always use try-catch** for error handling
2. **Index frequently queried fields** in schema
3. **Use pagination** for large datasets
4. **Batch operations** for multiple updates
5. **Export data regularly** for backup
6. **Clear old data** periodically

---

## 🐛 Troubleshooting

### Issue: Collection not found
```typescript
// Solution: Create collection with schema first
await this.rxdbHelper.getCollection('myCollection', mySchema);
```

### Issue: Query not working
```typescript
// Make sure field is indexed in schema
indexes: ['mrNo', 'status']
```

### Issue: Slow queries
```typescript
// Use indexes and limit results
await this.rxdbHelper.find('patients', selector, { limit: 100 });
```

---

## 📞 Quick Reference

```typescript
// CREATE
await rxdbHelper.insert(collection, doc)
await rxdbHelper.bulkInsert(collection, docs)
await rxdbHelper.upsert(collection, doc)

// READ
await rxdbHelper.getById(collection, id)
await rxdbHelper.getByMrNo(collection, mrNo)
await rxdbHelper.getAll(collection, limit?)
await rxdbHelper.find(collection, selector, options?)
await rxdbHelper.findOne(collection, selector)
await rxdbHelper.count(collection, selector?)
await rxdbHelper.search(collection, field, text)

// UPDATE
await rxdbHelper.updateById(collection, id, data)
await rxdbHelper.updateByMrNo(collection, mrNo, data)
await rxdbHelper.updateMany(collection, selector, data)

// DELETE
await rxdbHelper.deleteById(collection, id)
await rxdbHelper.deleteByMrNo(collection, mrNo)
await rxdbHelper.deleteMany(collection, selector)
await rxdbHelper.clearCollection(collection)

// UTILITY
await rxdbHelper.exists(collection, id)
await rxdbHelper.getStats(collection)
await rxdbHelper.exportCollection(collection)
await rxdbHelper.importCollection(collection, data)
await rxdbHelper.removeCollection(collection)
```

---

**🎉 Ready to use!** This service gives you complete control over RxDB operations!
