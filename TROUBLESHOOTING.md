# Troubleshooting Guide

## 🔧 **مشكلة Network Error**

### **المشكلة:**
```
❌ [API] Response error: undefined /auth/login Network Error
❌ [authService] Login error occurred: AxiosError {message: 'Network Error'}
```

### **الأسباب المحتملة:**

#### **1. Backend لا يعمل محلياً:**
```bash
# تحقق من أن الـ backend يعمل
netstat -an | findstr :5145

# إذا لم يعمل، ابدأ الـ backend:
cd Byway.API
dotnet run
```

#### **2. Backend لا يعمل على SmarterASP.NET:**
```bash
# تحقق من الـ URL:
http://mohamedexfs60-001-site1.mtempurl.com/api/health
```

#### **3. مشكلة في الـ CORS:**
- تأكد من أن الـ backend يدعم CORS
- تحقق من الـ allowed origins

### **الحلول:**

#### **الحل الأول: استخدام الـ Backend المحلي**
```typescript
// في src/services/api.ts
const API_BASE_URL = 'http://localhost:5145/api';
```

#### **الحل الثاني: استخدام الـ Backend على SmarterASP.NET**
```typescript
// في src/services/api.ts
const API_BASE_URL = 'http://mohamedexfs60-001-site1.mtempurl.com/api';
```

#### **الحل الثالث: استخدام Configuration مرن**
```typescript
// في src/config/constants.ts
export const ENV = {
  get API_URL() {
    if (process.env.NODE_ENV === 'development') {
      return 'http://localhost:5145/api';
    }
    return 'http://mohamedexfs60-001-site1.mtempurl.com/api';
  }
};
```

### **خطوات التشخيص:**

#### **1. تحقق من الـ Backend:**
```bash
# تحقق من الـ ports
netstat -an | findstr LISTENING

# ابدأ الـ backend
cd Byway.API
dotnet run
```

#### **2. تحقق من الـ Frontend:**
```bash
# تحقق من الـ frontend
cd byway-frontend
npm start
```

#### **3. تحقق من الـ Network:**
```bash
# تحقق من الـ API
curl http://localhost:5145/api/health
curl http://mohamedexfs60-001-site1.mtempurl.com/api/health
```

### **إعدادات الـ Environment:**

#### **Development:**
```typescript
// src/services/api.ts
const API_BASE_URL = 'http://localhost:5145/api';
```

#### **Production:**
```typescript
// src/services/api.ts
const API_BASE_URL = 'http://mohamedexfs60-001-site1.mtempurl.com/api';
```

### **نصائح إضافية:**

#### **1. تحقق من الـ Console:**
- افتح Developer Tools
- تحقق من الـ Network tab
- تحقق من الـ Console للـ errors

#### **2. تحقق من الـ CORS:**
- تأكد من أن الـ backend يدعم CORS
- تحقق من الـ allowed origins

#### **3. تحقق من الـ Firewall:**
- تأكد من أن الـ ports مفتوحة
- تحقق من الـ Windows Firewall

### **الملفات المهمة:**

```
byway-frontend/src/
├── services/
│   └── api.ts              # API configuration
├── config/
│   ├── constants.ts        # API constants
│   └── api-config.ts       # API configuration
└── TROUBLESHOOTING.md      # This file
```

### **الخطوات التالية:**

1. **تحقق من الـ Backend:**
   - تأكد من أن الـ backend يعمل
   - تحقق من الـ ports

2. **تحقق من الـ Frontend:**
   - تأكد من أن الـ frontend يعمل
   - تحقق من الـ API calls

3. **تحقق من الـ Network:**
   - تأكد من أن الـ API متاح
   - تحقق من الـ CORS settings

---

## 🎯 **الخلاصة:**

المشكلة الأساسية هي أن الـ backend لا يعمل. يجب التأكد من:

1. **الـ Backend يعمل محلياً** على port 5145
2. **الـ Backend يعمل على SmarterASP.NET** على الـ URL الصحيح
3. **الـ CORS مُعد بشكل صحيح** للسماح بالـ requests من الـ frontend

بعد إصلاح هذه المشاكل، سيعمل الـ frontend بشكل طبيعي.
