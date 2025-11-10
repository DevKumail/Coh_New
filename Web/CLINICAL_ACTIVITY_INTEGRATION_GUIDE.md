# Clinical Activity Integration Guide

## Overview
This guide explains how to integrate the Clinical Activity Service into your clinical forms to automatically log activities in the Notes panel.

## Architecture
- **Service**: `ClinicalActivityService` - Shared service that manages clinical activities
- **Notes Component**: Displays activities in real-time in the right sidebar
- **Child Components**: Clinical forms (Allergies, Procedures, Medications, etc.) emit activities

## How It Works
1. When a doctor creates/updates a record in any clinical form
2. The form component emits an activity to `ClinicalActivityService`
3. The service broadcasts the activity to all subscribers
4. The Notes component receives and displays the activity in real-time

## Integration Steps

### Step 1: Import the Service
Add the import to your component:

```typescript
import { ClinicalActivityService } from '@/app/shared/Services/clinical-activity.service';
```

### Step 2: Inject the Service
Add it to your constructor:

```typescript
constructor(
    // ... other services
    private clinicalActivityService: ClinicalActivityService
) {}
```

### Step 3: Emit Activity on Submit
In your submit/save method, after successful API call, add:

```typescript
this.YourApiService.SubmitYourData(payload).then(() => {
    // ... existing success code
    
    // Emit clinical activity
    const providerName = this.getProviderName(formData.providerId);
    this.clinicalActivityService.addActivity({
        timestamp: new Date(),
        activityType: this.id ? 'update' : 'create', // 'create' or 'update'
        module: 'YourModuleName', // e.g., 'Allergy', 'Procedure', 'Medication'
        providerName: providerName,
        mrNo: this.SearchPatientData?.table2?.[0]?.mrNo || '',
        patientName: this.SearchPatientData?.table2?.[0]?.patientName || '',
        details: payload, // Full payload for reference
        summary: 'Human-readable summary of what was done' // e.g., "Penicillin Allergy - Severe reaction"
    });
    
    // ... rest of success code
});
```

## Example Implementations

### Example 1: Allergy Component
```typescript
// In allergies.component.ts
this.ClinicalApiService.SubmitPatientAllergies(payload).then(() => {
    // Existing code...
    
    // Emit activity
    const providerName = this.hrEmployees.find(p => p.providerId === formValue.providerId)?.name || 'Unknown Provider';
    const allergyTypeName = this.GetAlergy?.find((a: any) => a.typeId === formValue.allergyType)?.name || formValue.allergyType;
    
    this.clinicalActivityService.addActivity({
        timestamp: new Date(),
        activityType: this.id ? 'update' : 'create',
        module: 'Allergy',
        providerName: providerName,
        mrNo: this.SearchPatientData?.table2?.[0]?.mrNo || '',
        patientName: this.SearchPatientData?.table2?.[0]?.patientName || '',
        details: payload,
        summary: `${allergyTypeName} - ${formValue.allergen} (${formValue.reaction || 'No reaction noted'}) - Severity: ${formValue.severity || 'Not specified'}`
    });
});
```

### Example 2: Procedure Component
```typescript
// In procedure.component.ts
this.clinicalApiService.SubmitPatientProcedure(problemPayload).then((res: any) => {
    // Existing code...
    
    // Emit activity
    const providerName = isOutside 
        ? formData.providerName 
        : (this.hrEmployees.find((p: any) => p.providerId === formData.providerId)?.name || 'Unknown Provider');
    const procedureTypeName = this.type.find(t => t.id === formData.procedureType)?.name || 'Unknown Type';
    
    this.clinicalActivityService.addActivity({
        timestamp: new Date(),
        activityType: this.id ? 'update' : 'create',
        module: 'Procedure',
        providerName: providerName,
        mrNo: this.SearchPatientData?.table2?.[0]?.mrNo || '',
        patientName: this.SearchPatientData?.table2?.[0]?.patientName || '',
        details: problemPayload,
        summary: `${procedureTypeName} - ${formData.procedure} (Start: ${formData.startDate}${formData.endDate ? ', End: ' + formData.endDate : ''})`
    });
});
```

### Example 3: Medication Component
```typescript
// In medication.component.ts
this.clinicalApiService.SubmitPrescription(payload).then(() => {
    // Existing code...
    
    // Emit activity
    const providerName = this.hrEmployees.find(p => p.providerId === formValue.providerId)?.name || 'Unknown Provider';
    
    this.clinicalActivityService.addActivity({
        timestamp: new Date(),
        activityType: this.Id ? 'update' : 'create',
        module: 'Medication',
        providerName: providerName,
        mrNo: this.Mrno || '',
        patientName: this.SearchPatientData?.table2?.[0]?.patientName || '',
        details: payload,
        summary: `${formValue.rx} - ${formValue.dose} (${formValue.frequency}) - Route: ${formValue.route}`
    });
});
```

### Example 4: Vital Signs Component
```typescript
// In vital-signs.component.ts
this.ClinicalApiService.SubmitVitalSign(payload).then(() => {
    // Existing code...
    
    // Emit activity
    this.clinicalActivityService.addActivity({
        timestamp: new Date(),
        activityType: this.editingId ? 'update' : 'create',
        module: 'Vital Sign',
        providerName: sessionStorage.getItem('userName') || 'Unknown Provider',
        mrNo: this.SearchPatientData?.table2?.[0]?.mrNo || '',
        patientName: this.SearchPatientData?.table2?.[0]?.patientName || '',
        details: payload,
        summary: `BP: ${formValue.systolic}/${formValue.diastolic}, Temp: ${formValue.temperature}°F, Pulse: ${formValue.pulse}, Weight: ${formValue.weight}kg`
    });
});
```

## Activity Interface
```typescript
export interface ClinicalActivity {
  timestamp: Date;           // When the activity occurred
  activityType: 'create' | 'update'; // Type of activity
  module: string;            // Module name (e.g., 'Allergy', 'Procedure')
  providerName: string;      // Name of the provider
  mrNo: string;              // Patient MR number
  patientName?: string;      // Patient name (optional)
  details: any;              // Full payload/details
  summary: string;           // Human-readable summary
}
```

## Best Practices

### 1. Summary Format
Make summaries clear and concise:
- **Good**: "Penicillin Allergy - Severe anaphylactic reaction - Critical severity"
- **Bad**: "Allergy added"

### 2. Provider Name
Always try to get the actual provider name:
```typescript
const providerName = this.hrEmployees.find(p => p.providerId === formValue.providerId)?.name || 'Unknown Provider';
```

### 3. Activity Type
Use the ID/edit flag to determine if it's create or update:
```typescript
activityType: this.id ? 'update' : 'create'
```

### 4. Error Handling
Only emit activities on successful operations:
```typescript
.then(() => {
    // Success - emit activity here
})
.catch(() => {
    // Error - do NOT emit activity
})
```

## Module Names
Use these standard module names for consistency:
- `'Allergy'`
- `'Procedure'`
- `'Medication'`
- `'Problem'`
- `'Vital Sign'`
- `'Immunization'`
- `'Lab Result'`
- `'Imaging'`

## Testing
1. Load a patient
2. Create/update a record in any integrated form
3. Check the Notes panel on the right sidebar
4. Verify the activity appears with correct details

## Troubleshooting

### Activity not appearing?
- Check if service is injected in constructor
- Verify the activity is emitted AFTER successful API call
- Check browser console for errors

### Wrong provider name?
- Ensure `hrEmployees` array is populated
- Check the providerId mapping

### Summary not clear?
- Review the summary string format
- Include key information (type, name, dates, severity, etc.)

## Future Enhancements
- Export activities to PDF
- Filter activities by module
- Search activities
- Activity history persistence
- Activity notifications
