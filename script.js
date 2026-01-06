const BIN_ID = "695aba4543b1c97be919090f";
const MASTER_KEY = "$2a$10$WpZMbfrUQIsZdCSyJ9yOJOcPSs7TCJ0L2i8/iXCThdK1gN4BbP95W";
const IMGBB_API_KEY = "f5650efc511c1e3bc1edc404dde48b57";
const API_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

let db = { products: [], footer: { addr: "", phone: "", tg: "", ig: "" } };
window.isAdmin = false;

// لیست ۱۰تایی دقیق که الان فرستادی
const CATEGORIES = [
    "همه آثار", 
    "مینیاتور", 
    "مینیاتور نوین", 
    "تذهیب", 
    "میناکاری", 
    "خاتم", 
    "صنایع دستی", 
    "قلم زنی", 
    "رنگ روغن", 
    "آبرنگ", 
    "سایر"
];

async function init() { await loadData(); }

async function loadData() {
    try {
        const res = await fetch(`${API_URL}/latest`, { headers: { "X-Master-Key": MASTER_KEY } });
        const data = await res.json(); 
        db = data.record; 
        if(!db.footer) db.footer = { addr: "", phone: "", tg: "", ig: "" };
        render(); 
        createCategoryButtons();
        updateFooterUI();
    } catch (e) { console.error("خطا در بارگذاری"); }
}

async function saveData() {
    await fetch(API_URL, { method: 'PUT', headers: { "Content-Type": "application/json", "X-Master-Key": MASTER_KEY }, body: JSON.stringify(db) });
}

function render(filterList = null) {
    const list = filterList || db.products;
    const container = document.getElementById('product-container'); 
    container.innerHTML = '';
    
    list.forEach((item, index) => {
        const card = document.createElement('div'); 
        card.className = 'product-card';
        const imgs = [item.img, item.img2, item.img3].filter(s => s && s !== "null" && s !== ""); 
        let cur = 0;

        const deleteBtn = window.isAdmin ? `<button onclick="event.stopPropagation(); deleteProduct(${index})" class="del-btn-fix" style="position:absolute; top:5px; right:5px; z-index:100; width:auto; padding:5px 10px; margin:0;">🗑️ حذف</button>` : '';

        card.innerHTML = `
            ${deleteBtn}
            <div class="image-slider">
                ${imgs.length > 1 ? `<button class="slider-btn next-btn">◀</button>` : ''}
                <img src="${imgs[0]}" class="main-img">
                ${imgs.length > 1 ? `<button class="slider-btn prev-btn">▶</button>` : ''}
            </div>
            <div class="product-info-summary">
                <h3>${item.name}</h3>
                <span class="price-tag">${item.price} تومان</span>
            </div>
            <div class="product-details">
                <p>توضیحات: ${item.specs || '-'}</p>
                <p>سبک: ${item.cat}</p>
            </div>`;

        const imgTag = card.querySelector('.main-img');
        const nextBtn = card.querySelector('.next-btn');
        const prevBtn = card.querySelector('.prev-btn');

        if (nextBtn) {
            nextBtn.onclick = (e) => { 
                e.stopPropagation(); 
                cur = (cur + 1) % imgs.length; 
                imgTag.src = imgs[cur]; 
            };
        }
        if (prevBtn) {
            prevBtn.onclick = (e) => { 
                e.stopPropagation(); 
                cur = (cur - 1 + imgs.length) % imgs.length; 
                imgTag.src = imgs[cur]; 
            };
        }

        card.onclick = () => card.classList.toggle('active'); 
        container.appendChild(card);
    });
}

function createCategoryButtons() {
    const cont = document.getElementById('cat-buttons'); 
    cont.innerHTML = '';
    CATEGORIES.forEach(cat => { 
        const b = document.createElement('button'); 
        b.className = 'btn-neon'; 
        b.innerText = cat; 
        b.onclick = () => {
            if(cat === "همه آثار") render(db.products);
            else render(db.products.filter(p => p.cat && p.cat.trim() === cat.trim()));
        };
        cont.appendChild(b); 
    });
}

async function adminPanel() {
    const p = prompt("رمز:"); if (p !== "6868") return; 
    window.isAdmin = true; render(); 
    const c = prompt("1: افزودن محصول | 2: ویرایش فوتر و آیدی ها");
    if(c === "1") document.getElementById('adminModal').style.display = "block";
    else if(c === "2") { 
        db.footer.addr = prompt("آدرس:", db.footer.addr); 
        db.footer.phone = prompt("تلفن:", db.footer.phone);
        db.footer.tg = prompt("آیدی تلگرام:", db.footer.tg || "");
        db.footer.ig = prompt("آیدی اینستاگرام:", db.footer.ig || "");
        await saveData(); updateFooterUI(); 
    }
}

function closeAdmin() { document.getElementById('adminModal').style.display = "none"; }

async function submitProduct() {
    const n = document.getElementById('p-name').value, p = document.getElementById('p-price').value, s = document.getElementById('p-specs').value, c = document.getElementById('p-cat').value.trim(); 
    const files = [document.getElementById('p-file1').files[0], document.getElementById('p-file2').files[0], document.getElementById('p-file3').files[0]];
    if(!n || !p || !files[0]) return alert("اطلاعات ناقص است");
    document.getElementById('uploadStatus').innerText = "درحال آپلود...";
    try {
        const urls = [];
        for (let f of files) { 
            if (f) { 
                const fd = new FormData(); fd.append('image', f); 
                const r = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: 'POST', body: fd }); 
                const d = await r.json(); urls.push(d.data.url); 
            } else urls.push(null); 
        }
        db.products.push({ name: n, price: p, specs: s, cat: c, img: urls[0], img2: urls[1], img3: urls[2] }); 
        await saveData(); location.reload();
    } catch (e) { alert("خطا در آپلود"); }
}

async function deleteProduct(i) { if(confirm("حذف شود؟")) { db.products.splice(i, 1); await saveData(); render(); } }

function updateFooterUI() { 
    document.getElementById('f-addr').innerText = "آدرس: " + (db.footer.addr || "-"); 
    document.getElementById('f-phone').innerText = "تلفن: " + (db.footer.phone || "-"); 
    if(document.getElementById('text-tg')) {
        document.getElementById('text-tg').innerText = "@" + (db.footer.tg || "");
        document.getElementById('link-tg').href = "https://t.me/" + (db.footer.tg || "");
        document.getElementById('text-ig').innerText = "@" + (db.footer.ig || "");
        document.getElementById('link-ig').href = "https://instagram.com/" + (db.footer.ig || "");
    }
}

function doSearch() { 
    const v = document.getElementById('searchInput').value.toLowerCase(); 
    render(db.products.filter(p => p.name.toLowerCase().includes(v))); 
}

init();
