 // دیتابیس محصولات (می‌توانی قیمت‌ها و نام‌ها را اینجا عوض کنی)
const categories = [
    { id: 1, name: "کالای ۱", products: [{ name: "زیرمجموعه ۱-۱", price: "۱۰,۰۰۰" }, { name: "زیرمجموعه ۱-۲", price: "۲۰,۰۰۰" }] },
    { id: 2, name: "کالای ۲", products: [{ name: "زیرمجموعه ۲-۱", price: "۳۰,۰۰۰" }] },
    { id: 3, name: "کالای ۳", products: [{ name: "زیرمجموعه ۳-۱", price: "۴۰,۰۰۰" }] },
    { id: 4, name: "کالای ۴", products: [] },
    { id: 5, name: "کالای ۵", products: [] },
    { id: 6, name: "کالای ۶", products: [] },
    { id: 7, name: "کالای ۷", products: [] },
    { id: 8, name: "کالای ۸", products: [] },
    { id: 9, name: "کالای ۹", products: [] },
    { id: 10, name: "کالای ۱۰", products: [] },
];

const categoryList = document.getElementById('category-list');
const productGrid = document.getElementById('product-grid');
const categoryTitle = document.getElementById('category-title');

// تابع ساخت دکمه‌های سمت راست
function IRAN_Shop_Init() {
    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'category-btn';
        btn.innerText = cat.name;
        btn.onclick = () => showProducts(cat);
        categoryList.appendChild(btn);
    });
}

// تابع نمایش محصولات هر دسته
function showProducts(category) {
    // تغییر عنوان بالای صفحه
    categoryTitle.innerText = 'لیست محصولات ' + category.name;
    
    // پاک کردن محصولات قبلی
    productGrid.innerHTML = '';

    // اگر محصولی بود نمایش بده، وگرنه پیام خالی بودن
    if (category.products.length === 0) {
        productGrid.innerHTML = '<p style="padding:20px;">هنوز محصولی در این دسته اضافه نشده است.</p>';
        return;
    }

    category.products.forEach(prod => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-img-placeholder">عکس</div>
            <h4>${prod.name}</h4>
            <p>قیمت: ${prod.price} تومان</p>
            <button style="margin-top:10px; padding:5px 10px; cursor:pointer;">مشاهده</button>
        `;
        productGrid.appendChild(card);
    });
}

// اجرای اولیه
IRAN_Shop_Init();
