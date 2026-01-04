// دیتابیس محصولات (عکس، نام، مشخصات، قیمت، دسته)
const db = [
    { name: "محصول نمونه ۱", specs: "سایز بزرگ - رنگ مشکی", price: "۵۵۰,۰۰۰", cat: "کالای ۱", img: "" },
    { name: "محصول نمونه ۲", specs: "سایز کوچک - استیل", price: "۱,۲۰۰,۰۰۰", cat: "کالای ۱", img: "" },
    { name: "محصول نمونه ۳", specs: "ضد آب - چرم", price: "۳,۵۰۰,۰۰۰", cat: "کالای ۲", img: "" },
    // اینجا بعدا محصولات واقعی رو اضافه میکنیم
];

const container = document.getElementById('product-container');
const btnContainer = document.getElementById('cat-buttons');

// ۱. اجرای اولیه سایت
function init() {
    createButtons();
    render(db);
}

// ۲. ساخت دکمه‌های ۱ تا ۱۰
function createButtons() {
    for (let i = 1; i <= 10; i++) {
        const btn = document.createElement('button');
        btn.className = 'btn-neon';
        btn.innerText = `کالای ${i}`;
        btn.onclick = () => filterCat(`کالای ${i}`);
        btnContainer.appendChild(btn);
    }
}

// ۳. نمایش محصولات در صفحه
function render(list) {
    container.innerHTML = '';
    
    if(list.length === 0) {
        container.innerHTML = '<p style="color:#aaa; width:100%;">موردی یافت نشد.</p>';
        return;
    }

    list.forEach(item => {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        // اگر عکس نداشت، یک باکس خالی نشون میده
        const imageSrc = item.img ? `<img src="${item.img}" style="width:100%; height:180px; object-fit:cover;">` : '<div class="product-img">بدون عکس</div>';

        card.innerHTML = `
            ${imageSrc}
            <h3>${item.name}</h3>
            <p class="specs">${item.specs}</p>
            <p class="price">${item.price} تومان</p>
        `;
        container.appendChild(card);
    });
}

// ۴. سرچ کردن
function doSearch() {
    const val = document.getElementById('searchInput').value.trim().toLowerCase();
    const filtered = db.filter(p => p.name.includes(val));
    render(filtered);
}

// ۵. فیلتر بر اساس دسته
function filterCat(catName) {
    // برای اینکه تیتر "لیست محصولات" عوض نشه، فقط فیلتر میکنیم
    const filtered = db.filter(p => p.cat === catName);
    render(filtered);
}

init();
