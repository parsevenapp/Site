const BIN_ID = "695aba4543b1c97be919090f";
const MASTER_KEY = "$2a$10$WpZMbfrUQIsZdCSyJ9yOJOcPSs7TCJ0L2i8/iXCThdK1gN4BbP95W";
const IMGBB_API_KEY = "f5650efc511c1e3bc1edc404dde48b57";
const API_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

let db = { products: [], footer: { addr: "", phone: "", insta: "#", tele: "#" } };
let currentView = 'grid';

async function init() {
    createCategoryButtons();
    await loadData();
}

async function loadData() {
    const container = document.getElementById('product-container');
    container.innerHTML = '<p style="color:#0ff; text-align:center;">درحال دریافت کالاها...</p>';
    try {
        const res = await fetch(`${API_URL}/latest`, { headers: { "X-Master-Key": MASTER_KEY } });
        const data = await res.json();
        db = data.record;
        render();
        updateFooterUI();
    } catch (err) { console.error("Error loading"); }
}

async function saveData() {
    await fetch(API_URL, {
        method: 'PUT',
        headers: { "Content-Type": "application/json", "X-Master-Key": MASTER_KEY },
        body: JSON.stringify(db)
    });
}

function render(filterList = null) {
    const list = filterList || db.products;
    const container = document.getElementById('product-container');
    container.className = currentView === 'grid' ? 'grid-display' : 'list-display';
    container.innerHTML = '';

    list.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        const images = [item.img, item.img2, item.img3].filter(src => src);
        let currentImgIdx = 0;

        card.innerHTML = `
            <div class="image-slider">
                ${images.length > 1 ? `<button class="slider-btn next-btn">◀</button>` : ''}
                <img src="${images[0]}" class="main-img">
                ${images.length > 1 ? `<button class="slider-btn prev-btn">▶</button>` : ''}
            </div>
            <div class="product-info-summary">
                <h3>${item.name}</h3>
                <span class="price-tag">${item.price} تومان</span>
            </div>
            <div class="product-details">
                <p><strong>توضیحات:</strong> ${item.specs || '-'}</p>
                <p><strong>دسته:</strong> ${item.cat}</p>
                ${window.isAdmin ? `<button onclick="deleteProduct(${index})" class="del-btn-fix">🗑️ حذف این کالا</button>` : ''}
            </div>
        `;

        const imgTag = card.querySelector('.main-img');
        card.querySelectorAll('.slider-btn').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                if(btn.classList.contains('next-btn')) currentImgIdx = (currentImgIdx + 1) % images.length;
                else currentImgIdx = (currentImgIdx - 1 + images.length) % images.length;
                imgTag.src = images[currentImgIdx];
            };
        });

        card.onclick = () => card.classList.toggle('active');
        container.appendChild(card);
    });
}

async function adminPanel() {
    const pass = prompt("رمز مدیر:");
    // رمز جدید در خط پایین اعمال شده است
    if (pass !== "6868") {
        alert("رمز اشتباه است!");
        return;
    }
    window.isAdmin = true;
    const choice = prompt("1: افزودن محصول | 2: ویرایش فوتر");
    if(choice === "1") document.getElementById('adminModal').style.display = "block";
    else if(choice === "2") {
        db.footer.addr = prompt("آدرس:", db.footer.addr);
        db.footer.phone = prompt("تلفن:", db.footer.phone);
        db.footer.insta = prompt("اینستاگرام:", db.footer.insta);
        db.footer.tele = prompt("تلگرام:", db.footer.tele);
        await saveData();
        updateFooterUI();
    }
}

function closeAdmin() { document.getElementById('adminModal').style.display = "none"; }

async function submitProduct() {
    const name = document.getElementById('p-name').value;
    const price = document.getElementById('p-price').value;
    const specs = document.getElementById('p-specs').value;
    const cat = document.getElementById('p-cat').value;
    const files = [
        document.getElementById('p-file1').files[0],
        document.getElementById('p-file2').files[0],
        document.getElementById('p-file3').files[0]
    ];
    const status = document.getElementById('uploadStatus');

    if(!name || !price || !files[0]) { alert("نام، قیمت و عکس اول الزامی است!"); return; }

    status.innerText = "درحال آپلود عکس‌ها... شکیبا باشید.";
    try {
        const urls = [];
        for (let f of files) {
            if (f) {
                const fd = new FormData(); fd.append('image', f);
                const r = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: 'POST', body: fd });
                const d = await r.json(); urls.push(d.data.url);
            } else { urls.push(null); }
        }
        db.products.push({ name, price, specs, cat, img: urls[0], img2: urls[1], img3: urls[2] });
        await saveData();
        alert("محصول با موفقیت آنلاین شد!");
        location.reload();
    } catch (err) { alert("خطا در آپلود! حجم عکس یا اینترنت را چک کنید."); }
}

async function deleteProduct(idx) {
    if(confirm("آیا واقعاً حذف شود؟")) { 
        db.products.splice(idx, 1); 
        await saveData(); 
        render(); 
    }
}

function toggleView() { currentView = currentView === 'grid' ? 'list' : 'grid'; render(); }

function updateFooterUI() {
    document.getElementById('f-addr').innerText = "آدرس: " + (db.footer.addr || "-");
    document.getElementById('f-phone').innerText = "تلفن: " + (db.footer.phone || "-");
    document.getElementById('f-insta').href = db.footer.insta;
    document.getElementById('f-tele').href = db.footer.tele;
}

function createCategoryButtons() {
    const cont = document.getElementById('cat-buttons');
    cont.innerHTML = '';
    for (let i = 1; i <= 10; i++) {
        const b = document.createElement('button'); 
        b.className = 'btn-neon'; 
        b.innerText = `کالای ${i}`;
        b.onclick = () => render(db.products.filter(p => p.cat === `کالای ${i}`));
        cont.appendChild(b);
    }
}

function doSearch() {
    const v = document.getElementById('searchInput').value.toLowerCase();
    render(db.products.filter(p => p.name.toLowerCase().includes(v)));
}

init();
