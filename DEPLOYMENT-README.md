# 🚀 Deployment Guide

## ⚠️ **مهم: قبل استخدام الـ Frontend**

### **المشكلة الحالية:**
الـ frontend مُعرض على GitHub Pages ولكن الـ backend يعمل فقط محلياً. هذا يعني أن الـ frontend لا يستطيع الاتصال بالـ backend.

### **الحلول المتاحة:**

#### **الحل الأول: تشغيل الـ Backend محلياً (مؤقت)**

1. **ابدأ الـ Backend:**
```bash
cd Byway.API
dotnet run
```

2. **افتح الـ Frontend:**
```
http://localhost:3002
```

#### **الحل الثاني: نشر الـ Backend على SmarterASP.NET (دائم)**

1. **تأكد من أن الـ Backend يعمل على SmarterASP.NET**
2. **حدث الـ API URL في الـ frontend**

#### **الحل الثالث: استخدام ngrok للـ Backend (مؤقت)**

1. **تثبيت ngrok:**
```bash
npm install -g ngrok
```

2. **تشغيل ngrok:**
```bash
ngrok http 5145
```

3. **استخدام الـ ngrok URL في الـ frontend**

## 🔧 **إعدادات الـ API**

### **Development (Local):**
```typescript
// src/services/api.ts
const API_BASE_URL = 'https://mohamedexfs60-001-site1.mtempurl.com/api';
```

### **Production (GitHub Pages):**
```typescript
// src/services/api.ts
const API_BASE_URL = 'https://mohamedexfs60-001-site1.mtempurl.com/api';
```

## 📋 **خطوات الـ Deployment الكاملة**

### **1. نشر الـ Backend:**
```bash
# في مجلد Byway.API
dotnet publish -c Release -o ./publish
# رفع الـ publish folder إلى SmarterASP.NET
```

### **2. تحديث الـ Frontend:**
```typescript
// src/services/api.ts
const API_BASE_URL = 'http://YOUR_BACKEND_URL/api';
```

### **3. إعادة نشر الـ Frontend:**
```bash
npm run build
npm run deploy
```

## 🎯 **النتيجة المطلوبة**

- **Frontend:** https://mohamedashraf144.github.io/algoriza-internship2025--EXFS60--FE-byway
- **Backend:** http://YOUR_BACKEND_URL (يعمل على SmarterASP.NET)
- **Full Stack Application** جاهز للاستخدام

## ⚠️ **تحذيرات مهمة**

1. **الـ Backend يجب أن يعمل على server عام** (ليس localhost)
2. **الـ CORS يجب أن يكون مُعد بشكل صحيح**
3. **الـ Database يجب أن يكون متاح على الإنترنت**

## 🔧 **استكشاف الأخطاء**

### **Network Error:**
- تحقق من أن الـ backend يعمل
- تحقق من الـ API URL
- تحقق من الـ CORS settings

### **CORS Error:**
- تأكد من أن الـ backend يدعم CORS
- تحقق من الـ allowed origins

### **404 Error:**
- تحقق من الـ API endpoints
- تحقق من الـ backend deployment
