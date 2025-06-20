# Subject Page

Bu sahifa fanlarni boshqarish uchun yaratilgan. Backend API bilan bog'langan holda CRUD amallarini bajaradi.

## Komponentlar

### 1. SubjectPage (asosiy sahifa)
- Barcha fanlarni ko'rsatadi
- Yangi fan qo'shish, tahrirlash va o'chirish imkoniyatlarini boshqaradi
- Loading holatlarini ko'rsatadi
- Xatolik xabarlarini toast orqali ko'rsatadi

### 2. SubjectList
- Fanlar ro'yxatini ko'rsatadi
- Grid layout da responsive dizayn
- Har bir fan uchun edit va delete tugmalari
- Bo'sh holat uchun maxsus UI

### 3. SubjectForm
- Yangi fan qo'shish va mavjud fanni tahrirlash uchun
- Modal shaklida ochiladi
- Form validation
- Loading holatlarini ko'rsatadi

### 4. DeleteConfirmDialog
- Fan o'chirishni tasdiqlash uchun
- Cascade deletion haqida ogohlantirish
- Modal dialog

## Xususiyatlar

- **Authentication**: Barcha API chaqiruvlari authentication talab qiladi
- **Authorization**: Faqat ADMIN rolidagi foydalanuvchilar yozish amallarini bajarishi mumkin
- **Real-time updates**: Ma'lumotlar o'zgarishidan keyin avtomatik yangilanadi
- **Error handling**: Xatoliklar toast orqali ko'rsatiladi
- **Loading states**: Barcha amallar uchun loading holatlari
- **Responsive design**: Barcha qurilmalarda yaxshi ko'rinadi

## API Endpoints

- `GET /subjects` - Barcha fanlarni olish
- `POST /subjects` - Yangi fan qo'shish (ADMIN)
- `PATCH /subjects/:id` - Fanni yangilash (ADMIN)
- `DELETE /subjects/:id` - Fanni o'chirish (ADMIN)

## Foydalanish

```tsx
import { SubjectPage } from '@/pages/subject/subject';

// App.tsx yoki router da
<Route path="/subjects" element={<SubjectPage />} />
```

## Muhim Eslatmalar

1. Backend server ishga tushirilgan bo'lishi kerak
2. Foydalanuvchi login qilgan bo'lishi kerak
3. Yozish amallari uchun ADMIN roli talab qilinadi
4. Cascade deletion - fan o'chirilganda bog'langan testlar va optionlar ham o'chiriladi 