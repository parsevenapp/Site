// کلیدهای اختصاصی تو
const BIN_ID = "695aba4543b1c97be919090f";
const MASTER_KEY = "$2a$10$WpZMbfrUQIsZdCSyJ9yOJOcPSs7TCJ0L2i8/iXCThdK1gN4BbP95W";
const IMGBB_API_KEY = "f5650efc511c1e3bc1edc404dde48b57";

const API_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;
let db = { products: [], footer: { addr: "* * * *", phone: "* * * *", insta: "#", tele: "#" } };
let currentView = 'grid';

async function init() {
    createCategoryButtons();
    await loadData();
}

// ۱. دریافت اطلاعات از دیتابیس آنلاین
async function loadData() {
    const container = document.getElementById('product-container');
    container.innerHTML = '<p style="color:#0ff; text-align:center;">در حال فراخوانی محصولات از سرور...</p>';
    try {
        const res = await fetch(`${API_URL}/latest`, { headers: { "X-Master-Key": MASTER_KEY } });
        const data = await res.json();
        db = data.record;
        render();
        updateFooterUI();
    } catch (err) {
        container.innerHTML = '<p style="color:red;">خطا در اتصال به سرور!</p>';
    }
}

// ۲. ذخیره اطلاعات در دیتابیس آنلاین
async function saveData() {
    try {
        await fetch(API_URL, {
            method: 'PUT',
            headers: { "Content-Type": "application/json", "X-Master-Key": MASTER_KEY },
            body: JSON.stringify(db)
        });
        render();
        updateFooterUI();
    } catch (err) {
        alert("خطا در ذخیره‌سازی آنلاین!");
    }
}

// ۳. آپلود مستقیم عکس به ImgBB
async function uploadImage() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    
    return new Promise((resolve) => {
        fileInput.onchange = async () => {
            const file = fileInput.files[0];
            if (!file) return resolve(null);
            
            const formData = new FormData();
            formData.append('image', file);

            try {
                const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
                    method: 'POST',
                    body: formData
                });
                const data = await res.json();
                resolve(data.data.url);
            } catch (err) {
                alert("خطا در آپلود عکس!");
                resolve(null);
            }
        };
        fileInput.click();
    });
}

// ۴. نمایش محصولات (با قابلیت کشویی)
function render(filterList = null) {
    const list = filterList || db.products;
    const container = document.getElementById('product-container');
    container.className = currentView === 'grid' ? 'grid-display' : 'list-display';
    container.innerHTML = '';

    list.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.onclick = (e) => { if(e.target.tagName !== 'BUTTON') card.classList.toggle('active'); };

        card.innerHTML = `
            <div class="product-img-box"><img src="${item.img}" alt="${item.name}"></div>
            <div class="product-info-summary">
                <h3>${item.name}</h3>
                <span class="price-tag">${item.price} تومان</span>
            </div>
            <div class="product-details">
                <p><strong>توضیحات:</strong> ${item.specs || '-'}</p>
                <p><strong>دسته:</strong> ${item.cat}</p>
                ${window.isAdmin ? `<button onclick="deleteProduct(${index})" style="background:red; color:white; border:none; padding:8px; cursor:pointer; margin-top:10px; border-radius:5px;">حذف کالا</button>` : ''}
            </div>
        `;
        container.appendChild(card);
    });
}

// ۵. پنل مدیریت (رمز ۱۲۳۴)
async function adminPanel() {
    const pass = prompt("رمز مدیر را وارد کنید:");
    if (pass !== "1234") return;
    window.isAdmin = true;

    const mode = prompt("1: اضافه کردن محصول جدید\n2: ویرایش اطلاعات فوتر");
    
    if (mode === "1") {
        const name = prompt("نام محصول:");
        const price = prompt("قیمت (مثلاً ۵۵۰,۰۰۰):");
        const specs = prompt("مشخصات (برای بخش کشویی):");
        const cat = prompt("دسته (مثلاً: کالای ۱):");
        
        alert("لطفاً عکس محصول را از گالری انتخاب کنید...");
        const imgUrl = await uploadImage();

        if (name && price && imgUrl) {
            db.products.push({ name, price, specs, cat, img: imgUrl });
            await saveData();
            alert("محصول با موفقیت اضافه و آنلاین شد!");
        }
    } else if (mode === "2") {
        db.footer.addr = prompt("آدرس جدید:", db.footer.addr);
        db.footer.phone = prompt("تلفن جدید:", db.footer.phone);
        db.footer.insta = prompt("لینک اینستاگرام (کامل):", db.footer.insta);
        db.footer.tele = prompt("لینک تلگرام (کامل):", db.footer.tele);
        await saveData();
        alert("اطلاعات فوتر بروزرسانی شد.");
    }
}

async function deleteProduct(idx) {
    if(confirm("آیا از حذف این کالا مطمئن هستید؟")) {
        db.products.splice(idx, 1);
        await saveData();
    }
}

function updateFooterUI() {
    if(db.footer.addr) document.getElementById('f-addr').innerText = "آدرس: " + db.footer.addr;
    if(db.footer.phone) document.getElementById('f-phone').innerText = "تلفن: " + db.footer.phone;
    if(db.footer.insta) document.getElementById('f-insta').href = db.footer.insta;
    if(db.footer.tele) document.getElementById('f-tele').href = db.footer.tele;
}

function createCategoryButtons() {
    const btnContainer = document.getElementById('cat-buttons');
    btnContainer.innerHTML = '';
    for (let i = 1; i <= 10; i++) {
        const btn = document.createElement('button');
        btn.className = 'btn-neon';
        btn.innerText = `کالای ${i}`;
        btn.onclick = () => render(db.products.filter(p => p.cat === `کالای ${i}`));
        btnContainer.appendChild(btn);
    }
}

function doSearch() {
    const val = document.getElementById('searchInput').value.trim().toLowerCase();
    render(db.products.filter(p => p.name.toLowerCase().includes(val)));
}

function toggleView() {
    currentView = (currentView === 'grid') ? 'list' : 'grid';
    document.getElementById('viewToggle').innerText = `حالت نمایش: ${currentView === 'grid' ? 'گرید' : 'لیست'}`;
    render();
}

init();
