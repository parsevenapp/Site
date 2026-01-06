const BIN_ID = "695aba4543b1c97be919090f";
const MASTER_KEY = "$2a$10$WpZMbfrUQIsZdCSyJ9yOJOcPSs7TCJ0L2i8/iXCThdK1gN4BbP95W";
const IMGBB_API_KEY = "f5650efc511c1e3bc1edc404dde48b57";
const API_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

let db = { products: [], footer: { addr: "", phone: "", tg: "", ig: "" } };
window.isAdmin = false;

// لیست ثابت دسته‌ها که همیشه نمایش داده شوند
const FIXED_CATEGORIES = ["همه آثار", "مینیاتور", "مینیاتور نوین", "تذهیب"];

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
        const card
