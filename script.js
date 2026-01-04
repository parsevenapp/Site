const allProducts = [
    { id: 1, cat: "کالای ۱", name: "محصول طلایی", price: "۵۰۰,۰۰۰", img: "https://via.placeholder.com/150" },
    { id: 2, cat: "کالای ۱", name: "ساعت مچی", price: "۱,۲۰۰,۰۰۰", img: "https://via.placeholder.com/150" },
    { id: 3, cat: "کالای ۲", name: "گردنبند نقره", price: "۸۵۰,۰۰۰", img: "https://via.placeholder.com/150" },
    // می‌توانی محصولات بیشتری اینجا اضافه کنی
];

const categoryList = document.getElementById('category-list');
const productGrid = document.getElementById('product-grid');

function init() {
    // ساخت دکمه‌های کناری (۱۰ کالا)
    for (let i = 1; i <= 10; i++) {
        const btn = document.createElement('button');
        btn.className = 'category-btn';
        btn.innerText = `کالای ${i}`;
        btn.onclick = () => filterByCategory(`کالای ${i}`);
        categoryList.appendChild(btn);
    }
    renderProducts(allProducts);
}

function renderProducts(products) {
    productGrid.innerHTML = '';
    products.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${p.img}" alt="${p.name}">
            <h4>${p.name}</h4>
            <p class="price">${p.price} تومان</p>
            <button class="buy-btn">افزودن به سبد</button>
        `;
        productGrid.appendChild(card);
    });
}

// تابع سرچ
function searchProduct() {
    const term = document.getElementById('searchInput').value.toLowerCase();
    const filtered = allProducts.filter(p => p.name.includes(term));
    renderProducts(filtered);
}

function filterByCategory(catName) {
    const filtered = allProducts.filter(p => p.cat === catName);
    document.getElementById('category-title').innerText = catName;
    renderProducts(filtered);
}

init();
