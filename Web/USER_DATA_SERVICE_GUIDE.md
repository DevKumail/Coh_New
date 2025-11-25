# 👤 User Data Service - RxDB Implementation

## 📖 Overview

**UserDataService** manages current logged-in user data using RxDB instead of localStorage. Data persists across page refreshes and is automatically cleared on logout.

---

## ✅ **Implementation Complete!**

### **Files Created/Updated:**

1. ✅ **`user-data.service.ts`** - New RxDB-based user service
2. ✅ **`clinical-structured-note-create.component.ts`** - Updated to use RxDB
3. ✅ **`topbar/user-profile.component.ts`** - Updated to clear user data on logout
4. ✅ **`sidenav/user-profile.component.ts`** - Updated to clear user data on logout

---

## 🚀 Quick Usage

### **1. Login Time - Save User**

```typescript
import { UserDataService } from '@core/services/user-data.service';

constructor(private userDataService: UserDataService) {}

async login(username: string, password: string) {
  // After successful login API call
  await this.userDataService.setCurrentUser({
    userName: 'john.doe',
    userId: 'U12345',
    email: 'john@example.com',
    role: 'Doctor',
    facilityId: 'F001',
    providerId: 'P001'
  });
  
  console.log('✅ User saved to RxDB');
}
```

### **2. Get User Data (Audit Fields)**

```typescript
// Method 1: Get full audit info
async submitForm() {
  const auditInfo = await this.userDataService.getAuditInfo();
  
  const data = {
    ...formData,
    createdBy: auditInfo.createdBy,      // userName
    updatedBy: auditInfo.updatedBy,      // userName
    userId: auditInfo.userId             // userId (optional)
  };
}

// Method 2: Get just username
async saveNote() {
  const userName = await this.userDataService.getUserName();
  
  const note = {
    ...noteData,
    createdBy: userName,
    updatedBy: userName
  };
}

// Method 3: Get full user object
async loadUserProfile() {
  const user = await this.userDataService.getCurrentUser();
  
  if (user) {
    console.log('User:', user.userName);
    console.log('Role:', user.role);
    console.log('Email:', user.email);
  }
}
```

### **3. Logout - Clear User**

```typescript
// Already implemented in user-profile components!
async logout() {
  await this.userDataService.clearCurrentUser();
  console.log('✅ User data cleared');
}
```

---

## 📊 **Data Structure**

```typescript
interface CurrentUser {
  id: string;                  // Always 'current'
  userName: string;            // Required - Used for audit fields
  userId?: string;             // Optional - User ID
  email?: string;
  role?: string;               // e.g., 'Doctor', 'Nurse'
  facilityId?: string;
  facilityName?: string;
  providerId?: string;
  providerName?: string;
  lastLogin?: number;          // Timestamp
  createdAt: number;
  updatedAt?: number;
}
```

---

## 🔄 **Migration from localStorage**

### **Old Way (❌ Don't use):**
```typescript
// OLD - localStorage
const current_User = JSON.parse(localStorage.getItem('currentUser') || 'null') || {};
this.createdBy = current_User.userName || '';
this.updatedBy = current_User.userName || '';
```

### **New Way (✅ Use this):**
```typescript
// NEW - RxDB
const auditInfo = await this.userDataService.getAuditInfo();
this.createdBy = auditInfo.createdBy;
this.updatedBy = auditInfo.updatedBy;
```

---

## 💡 **Available Methods**

| Method | Description | Returns |
|--------|-------------|---------|
| `setCurrentUser(userData)` | Save user after login | `Promise<CurrentUser \| null>` |
| `getCurrentUser()` | Get full user object | `Promise<CurrentUser \| null>` |
| `getUserName()` | Get username only | `Promise<string>` |
| `getUserId()` | Get user ID only | `Promise<string>` |
| `getAuditInfo()` | Get audit fields | `Promise<{createdBy, updatedBy, userId}>` |
| `updateCurrentUser(updates)` | Update user info | `Promise<CurrentUser \| null>` |
| `clearCurrentUser()` | Clear on logout | `Promise<boolean>` |
| `isUserLoggedIn()` | Check if user exists | `Promise<boolean>` |

---

## 🎯 **Real Examples**

### **Example 1: Clinical Note Creation**
```typescript
export class ClinicalNoteComponent {
  constructor(private userDataService: UserDataService) {}

  async submitNote() {
    const auditInfo = await this.userDataService.getAuditInfo();
    
    const note = {
      patientId: this.patientId,
      noteText: this.noteText,
      createdBy: auditInfo.createdBy,
      updatedBy: auditInfo.updatedBy,
      createdDate: new Date()
    };
    
    await this.api.saveNote(note);
  }
}
```

### **Example 2: Appointment Scheduling**
```typescript
export class AppointmentComponent {
  constructor(private userDataService: UserDataService) {}

  async scheduleAppointment() {
    const userName = await this.userDataService.getUserName();
    
    const appointment = {
      patientMrNo: this.mrNo,
      appointmentDate: this.date,
      scheduledBy: userName,
      modifiedBy: userName
    };
    
    await this.api.createAppointment(appointment);
  }
}
```

### **Example 3: Prescription Creation**
```typescript
export class PrescriptionComponent {
  constructor(private userDataService: UserDataService) {}

  async createPrescription() {
    const user = await this.userDataService.getCurrentUser();
    
    const prescription = {
      medications: this.medications,
      prescribedBy: user?.userName || '',
      providerId: user?.providerId || '',
      prescribedDate: Date.now()
    };
    
    await this.api.savePrescription(prescription);
  }
}
```

---

## 🧪 **Testing**

### **Test in Browser Console:**
```javascript
// Get service
const userService = window.ng.getInjector().get('UserDataService');

// Check current user
const user = await userService.getCurrentUser();
console.log('User:', user);

// Get username
const name = await userService.getUserName();
console.log('Username:', name);

// Get audit info
const audit = await userService.getAuditInfo();
console.log('Audit Info:', audit);

// Check if logged in
const isLoggedIn = await userService.isUserLoggedIn();
console.log('Logged In:', isLoggedIn);
```

---

## ✅ **Benefits**

| Feature | localStorage | RxDB (New) |
|---------|-------------|------------|
| **Persistence** | ❌ Cleared on logout | ✅ Controlled persistence |
| **Type Safety** | ❌ No types | ✅ TypeScript interfaces |
| **Querying** | ❌ Manual parsing | ✅ Built-in queries |
| **Consistency** | ❌ String parsing | ✅ Structured data |
| **Centralized** | ❌ Scattered usage | ✅ Single service |
| **Testable** | ❌ Hard to mock | ✅ Easy to test |

---

## 🔐 **Security**

- ✅ Data stored locally in IndexedDB (same as localStorage)
- ✅ Automatically cleared on logout
- ✅ No sensitive data (passwords, tokens) stored
- ✅ Only user profile information

---

## 🚨 **Important Notes**

1. **Always use `await`** - All methods are async
   ```typescript
   // ❌ Wrong
   const user = this.userDataService.getCurrentUser();
   
   // ✅ Correct
   const user = await this.userDataService.getCurrentUser();
   ```

2. **Make methods async** when using user service
   ```typescript
   // ❌ Wrong
   submitForm() {
     const user = await this.userDataService.getAuditInfo();
   }
   
   // ✅ Correct
   async submitForm() {
     const user = await this.userDataService.getAuditInfo();
   }
   ```

3. **Handle null cases**
   ```typescript
   const user = await this.userDataService.getCurrentUser();
   
   if (!user) {
     console.error('No user logged in');
     return;
   }
   
   // Use user data
   ```

---

## 📦 **Storage Location**

RxDB stores data in **IndexedDB**:

```
DevTools → Application → Storage → IndexedDB
  └── coherent
      └── currentuser
          └── current: { userName, userId, role, ... }
```

---

## 🔄 **Logout Flow**

```
User clicks Logout
    ↓
1. Clear patient banner (PatientBannerService)
2. Clear user data (UserDataService)  ✅ NEW!
3. Delete IndexedDB ('coherent')
4. Clear sessionStorage
5. Remove localStorage token
6. API logout call
7. Redirect to login
    ↓
Complete Clean Logout! ✅
```

---

## 📝 **Migration Checklist**

Replace all instances of this pattern:

**Find:**
```typescript
const current_User = JSON.parse(localStorage.getItem('currentUser') || 'null') || {};
this.createdBy = current_User.userName || '';
this.updatedBy = current_User.userName || '';
```

**Replace with:**
```typescript
const auditInfo = await this.userDataService.getAuditInfo();
this.createdBy = auditInfo.createdBy;
this.updatedBy = auditInfo.updatedBy;
```

**Don't forget to:**
1. ✅ Import `UserDataService`
2. ✅ Inject in constructor
3. ✅ Make method `async`
4. ✅ Use `await` when calling

---

## 🎉 **Summary**

- ✅ **No more localStorage** for user data
- ✅ **Type-safe** with TypeScript interfaces
- ✅ **Persistent** across page refreshes
- ✅ **Centralized** in one service
- ✅ **Clean logout** - data automatically cleared
- ✅ **Easy to use** - simple async methods

---

**Ready to use!** Replace all localStorage user access with UserDataService! 🚀

---

**Last Updated:** November 2025  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
