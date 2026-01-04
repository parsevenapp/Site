// محصولات
const db = [
    { name: "محصول ۱", specs: "تست ۱", price: "۱۰۰,۰۰۰", cat: "کالای ۱", img: "" },
    { name: "محصول ۲", specs: "تست ۲", price: "۲۰۰,۰۰۰", cat: "کالای ۱", img: "" },
    // محصولاتت رو اینجا اضافه کن
];

const container = document.getElementById('product-container');
const btnContainer = document.getElementById('cat-buttons');

// شروع برنامه
function init() {
    createButtons();
    render(db);
    loadFooter(); // لود کردن اطلاعات فوتر
}

function createButtons() {
    for (let i = 1; i <= 10; i++) {
        const btn = document.createElement('button');
        btn.className = 'btn-neon';
        btn.innerText = `کالای ${i}`;
        btn.onclick = () => filterCat(`کالای ${i}`);
        btnContainer.appendChild(btn);
    }
}

function render(list) {
    container.innerHTML = '';
    if(list.length === 0) {
        container.innerHTML = '<p style="color:#aaa;">موردی نیست.</p>'; return;
    }
    list.forEach(item => {
        const card = document.createElement('div');
        card.className = 'product-card';
        const imageSrc = item.img ? `<img src="${item.img}" style="width:100%; height:180px; object-fit:cover;">` : '<div class="product-img">عکس</div>';
        card.innerHTML = `${imageSrc}<h3>${item.name}</h3><p class="specs">${item.specs}</p><p class="price">${item.price} تومان</p>`;
        container.appendChild(card);
    });
}

function doSearch() {
    const val = document.getElementById('searchInput').value.trim().toLowerCase();
    render(db.filter(p => p.name.includes(val)));
}

function filterCat(c) {
    render(db.filter(p => p.cat === c));
}

// === بخش مدیریت فوتر ===
function adminEdit() {
    // ۱. رمز ساده (میتونی عدد ۱۲۳۴ رو عوض کنی)
    const pass = prompt("رمز مدیر را وارد کنید:");
    if (pass !== "1234") {
        alert("رمز اشتباه است!");
        return;
    }

    // ۲. گرفتن اطلاعات جدید
    const newAddr = prompt("آدرس جدید را وارد کنید:", document.getElementById('f-addr').innerText.replace('آدرس: ', ''));
    const newPhone = prompt("تلفن جدید را وارد کنید:", document.getElementById('f-phone').innerText.replace('تلفن: ', ''));
    const newInsta = prompt("لینک اینستاگرام:", document.getElementById('f-insta').getAttribute('href'));
    const newTele = prompt("لینک تلگرام:", document.getElementById('f-tele').getAttribute('href'));

    // ۳. ذخیره و نمایش
    if(newAddr) localStorage.setItem('site_addr', newAddr);
    if(newPhone) localStorage.setItem('site_phone', newPhone);
    if(newInsta) localStorage.setItem('site_insta', newInsta);
    if(newTele) localStorage.setItem('site_tele', newTele);

    loadFooter();
    alert("اطلاعات فوتر با موفقیت آپدیت شد!");
}

function loadFooter() {
    const addr = localStorage.getItem('site_addr');
    const phone = localStorage.getItem('site_phone');
    const insta = localStorage.getItem('site_insta');
    const tele = localStorage.getItem('site_tele');

    if(addr) document.getElementById('f-addr').innerText = "آدرس: " + addr;
    if(phone) document.getElementById('f-phone').innerText = "تلفن: " + phone;
    if(insta && insta !== '#') document.getElementById('f-insta').href = insta;
    if(tele && tele !== '#') document.getElementById('f-tele').href = tele;
}

init();
