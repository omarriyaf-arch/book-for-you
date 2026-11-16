# موارد الريادة — Raida Maroc

دليل موارد مجاني لتلاميذ **مؤسسات الريادة** بالمغرب (الابتدائي والإعدادي): دروس، تمارين، امتحانات وفيديوهات.
Guide de ressources gratuit pour les élèves des **écoles/collèges pionniers (Raida)** au Maroc.

الموقع يوجّه التلميذ إلى المصادر الأصلية (TelmidTICE الرسمية، AlloSchool، 9rayti، Taalim.ma، يوتيوب) عبر روابط بحث جاهزة حسب السلك والمستوى والمادة ونوع المورد. **لا يستضيف أي محتوى محمي بحقوق المؤلف.**

## المصادر
- **حكومية رسمية:** منصة TelmidTICE التابعة لوزارة التربية الوطنية (`telmidtice.men.gov.ma` / `soutiensco.men.gov.ma`). الروابط المباشرة للمستويات (الابتدائي 1061–1066، الإعدادي 2A31–2A33) وللمواد المتحقق منها مبنية في `data/resources.js`.
- **خاصة (غير حكومية):** AlloSchool، 9rayti، Taalim.ma، YouTube. يظهر مصدر كل بطاقة عليها، وقائمة المصادر في أسفل الصفحة.
- بوابة مؤسسات الريادة (`portailriada.men.gov.ma`) مخصصة للأطر التربوية وتتطلب حسابًا مهنيًا، لذلك لا تُعرض كفضاء للتلاميذ.
- ملاحظة: محتوى TelmidTICE دعم وفق المنهاج الوطني وقد لا يطابق حرفيًا كتب الريادة الجديدة.

## الخصوصية
لا حسابات. يُحفظ اختيار التلميذ (السلك/المستوى/المادة) في `localStorage` على جهازه فقط.

## التشغيل محليًا
افتح `index.html` في المتصفح. لا حاجة لأي تثبيت.

## النشر على GitHub Pages
1. أنشئ مستودعًا جديدًا على GitHub (مثلًا `raida-maroc`).
2. من هذا المجلد:
   ```bash
   git init -b main
   git add .
   git commit -m "Initial commit: Raida resources site"
   git remote add origin https://github.com/<USERNAME>/raida-maroc.git
   git push -u origin main
   ```
3. في GitHub: **Settings → Pages → Source: GitHub Actions**. سيُنشر الموقع تلقائيًا على `https://<USERNAME>.github.io/raida-maroc/`.

## إضافة مورد
عدّل `data/resources.js` وأضف عنصرًا إلى `curated`:
```js
{stage:"الابتدائي", level:"الخامس ابتدائي", subject:"الرياضيات", type:"exercise",
 title:"سلسلة تمارين الكسور", url:"https://...", source:"اسم الموقع"}
```
`type` ∈ `course | exercise | exam | video`. تأكد أن الرابط مجاني وقانوني وأنه يطابق مقرر الريادة.

## ملاحظات
- موقع مستقل وغير تابع لوزارة التربية الوطنية.
- لا تُجمع أي معطيات شخصية.
- المحتوى الخارجي يخضع لشروط أصحابه.

## الرخصة
MIT — انظر `LICENSE`.
