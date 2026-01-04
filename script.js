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
    try {
        const res = await fetch(`${API_URL}/latest`, { headers: { "X-Master-Key": MASTER_KEY } });
        const data = await res.json();
        db = data.record;
        render();
        updateFooterUI();
    } catch (err) { console.error("Error loading data"); }
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
        card.onclick = (e) => { if(e.target.tagName !== 'BUTTON') card.classList.toggle('active'); };
        card.innerHTML = `
            <div class="product-img-box"><img src="${item.img}"></div>
            <div class="product-info-summary">
                <h3>${item.name}</h3>
                <span class="price-tag">${item.price} تومان</span>
            </div>
            <div class="product-details">
                <p><strong>مشخصات:</strong> ${item.specs || '-'}</p>
                <p><strong>دسته:</strong> ${item.cat}</p>
                ${window.isAdmin ? `<button onclick="deleteProduct(${index})" style="color:red; background:none; border:1px solid red; padding:5px; margin-top:10px; cursor:pointer;">حذف</button>` : ''}
            </div>
        `;
        container.appendChild(card);
    });
}

async function adminPanel() {
    const pass = prompt("رمز مدیر:");
    if (pass !== "1234") return;
    window.isAdmin = true;
    const choice = prompt("1: افزودن محصول | 2: ویرایش فوتر");
    if(choice === "1") document.getElementById('adminModal').style.display = "block";
    else if(choice === "2") {
        db.footer.addr = prompt("آدرس:", db.footer.addr);
        db.footer.phone = prompt("تلفن:", db.footer.phone);
        db.footer.insta = prompt("اینستا:", db.footer.insta);
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
    const file = document.getElementById('p-file').files[0];
    const status = document.getElementById('uploadStatus');

    if(!name || !price || !file) { alert("اطلاعات ناقص!"); return; }

    status.innerText = "در حال آپلود عکس...";
    const formData = new FormData();
    formData.append('image', file);

    try {
        const imgRes = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: 'POST', body: formData });
        const imgData = await imgRes.json();
        db.products.push({ name, price, specs, cat, img: imgData.data.url });
        await saveData();
        alert("محصول ثبت شد!");
        location.reload();
    } catch (err) { alert("خطا در ثبت!"); }
}

async function deleteProduct(idx) { if(confirm("حذف؟")) { db.products.splice(idx, 1); await saveData(); render(); } }
function toggleView() { currentView = currentView === 'grid' ? 'list' : 'grid'; render(); }
function updateFooterUI() {
    document.getElementById('f-addr').innerText = "آدرس: " + (db.footer.addr || "-");
    document.getElementById('f-phone').innerText = "تلفن: " + (db.footer.phone || "-");
    document.getElementById('f-insta').href = db.footer.insta;
    document.getElementById('f-tele').href = db.footer.tele;
}
function createCategoryButtons() {
    const cont = document.getElementById('cat-buttons');
    for (let i = 1; i <= 10; i++) {
        const b = document.createElement('button'); b.className = 'btn-neon'; b.innerText = `کالای ${i}`;
        b.onclick = () => render(db.products.filter(p => p.cat === `کالای ${i}`));
        cont.appendChild(b);
    }
}
function doSearch() {
    const v = document.getElementById('searchInput').value.toLowerCase();
    render(db.products.filter(p => p.name.toLowerCase().includes(v)));
}
init();
