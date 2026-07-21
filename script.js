// =============================================
//   script.js - Electronic Store
//   متجر إلكتروني للالكترونيات
// =============================================

// =============================================
// 1. بيانات الاعتماد وتسجيل الدخول
// =============================================

const VALID_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

// التحقق من حالة تسجيل الدخول
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentPage = window.location.pathname.split('/').pop();
    
    // إذا كان المستخدم غير مسجل الدخول وليس في صفحة تسجيل الدخول
    if (!isLoggedIn && currentPage !== 'login.html') {
        window.location.href = 'login.html';
        return false;
    }
    
    // إذا كان المستخدم مسجل الدخول وفي صفحة تسجيل الدخول
    if (isLoggedIn && currentPage === 'login.html') {
        window.location.href = 'index.html';
        return false;
    }
    
    return true;
}

// دالة تسجيل الدخول
function login(username, password) {
    if (username === VALID_CREDENTIALS.username && 
        password === VALID_CREDENTIALS.password) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);
        return true;
    }
    return false;
}

// دالة تسجيل الخروج
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    window.location.href = 'login.html';
}

// =============================================
// 2. إدارة المنتجات (CRUD)
// =============================================

// مفتاح التخزين في Local Storage
const STORAGE_KEY = 'electronic_store_products';

// بيانات افتراضية للمنتجات
const defaultProducts = [
    {
        id: 1,
        productName: 'iPhone 15 Pro Max',
        brand: 'Apple',
        category: 'هواتف ذكية',
        price: 4999,
        year: 2024,
        description: 'أحدث هاتف من Apple مع شاشة 6.7 بوصة وكاميرا ثلاثية',
        image: '📱',
        rating: 4.8,
        status: 'متوفر'
    },
    {
        id: 2,
        productName: 'Samsung Galaxy S24 Ultra',
        brand: 'Samsung',
        category: 'هواتف ذكية',
        price: 4299,
        year: 2024,
        description: 'هاتف رائد مع قلم S-Pen وكاميرا بدقة 200 ميجابكسل',
        image: '📱',
        rating: 4.7,
        status: 'متوفر'
    },
    {
        id: 3,
        productName: 'MacBook Pro 16"',
        brand: 'Apple',
        category: 'لابتوب',
        price: 8499,
        year: 2024,
        description: 'لابتوب احترافي مع شريحة M3 Max وشاشة Retina XDR',
        image: '💻',
        rating: 4.9,
        status: 'متوفر'
    },
    {
        id: 4,
        productName: 'Sony WH-1000XM5',
        brand: 'Sony',
        category: 'سماعات',
        price: 1299,
        year: 2024,
        description: 'سماعات لاسلكية مع خاصية إلغاء الضوضاء الرائدة',
        image: '🎧',
        rating: 4.6,
        status: 'متوفر'
    },
    {
        id: 5,
        productName: 'Apple Watch Ultra 2',
        brand: 'Apple',
        category: 'ساعات ذكية',
        price: 2799,
        year: 2024,
        description: 'ساعة ذكية متطورة للرياضة والمغامرات',
        image: '⌚',
        rating: 4.8,
        status: 'متوفر'
    },
    {
        id: 6,
        productName: 'Dyson V15 Detect',
        brand: 'Dyson',
        category: 'أجهزة منزلية',
        price: 3499,
        year: 2024,
        description: 'مكنسة كهربائية لاسلكية مع تقنية الكشف عن الغبار',
        image: '🧹',
        rating: 4.5,
        status: 'متوفر'
    },
    {
        id: 7,
        productName: 'AirPods Pro 2',
        brand: 'Apple',
        category: 'سماعات',
        price: 999,
        year: 2024,
        description: 'سماعات أذن لاسلكية مع خاصية إلغاء الضوضاء',
        image: '🎧',
        rating: 4.7,
        status: 'متوفر'
    },
    {
        id: 8,
        productName: 'Samsung Galaxy Tab S9',
        brand: 'Samsung',
        category: 'كمبيوتر لوحي',
        price: 3299,
        year: 2024,
        description: 'جهاز لوحي احترافي مع شاشة AMOLED وقلم S-Pen',
        image: '📟',
        rating: 4.6,
        status: 'متوفر'
    }
];

// الحصول على جميع المنتجات
function getProducts() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        const products = JSON.parse(stored);
        // إعادة إنشاء المنتجات الافتراضية إذا كانت القائمة فارغة
        if (products.length === 0) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProducts));
            return defaultProducts;
        }
        return products;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProducts));
    return defaultProducts;
}

// حفظ المنتجات
function saveProducts(products) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

// إضافة منتج جديد
function addProduct(product) {
    const products = getProducts();
    // إنشاء ID جديد
    const maxId = products.reduce((max, p) => Math.max(max, p.id), 0);
    product.id = maxId + 1;
    products.push(product);
    saveProducts(products);
    return product;
}

// تحديث منتج
function updateProduct(id, updatedData) {
    const products = getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
        products[index] = { ...products[index], ...updatedData };
        saveProducts(products);
        return products[index];
    }
    return null;
}

// حذف منتج
function deleteProduct(id) {
    const products = getProducts();
    const filtered = products.filter(p => p.id !== id);
    saveProducts(filtered);
    return filtered;
}

// الحصول على منتج حسب ID
function getProductById(id) {
    const products = getProducts();
    return products.find(p => p.id === id);
}

// =============================================
// 3. البحث عن المنتجات
// =============================================

function searchProducts(query) {
    if (!query || query.trim() === '') {
        return getProducts();
    }
    
    const products = getProducts();
    const searchTerm = query.toLowerCase().trim();
    
    return products.filter(product => {
        return product.productName.toLowerCase().includes(searchTerm) ||
               product.brand.toLowerCase().includes(searchTerm) ||
               product.category.toLowerCase().includes(searchTerm) ||
               product.description.toLowerCase().includes(searchTerm);
    });
}

// =============================================
// 4. إدارة سلة المشتريات
// =============================================

const CART_KEY = 'electronic_store_cart';

// الحصول على سلة المشتريات
function getCart() {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
}

// حفظ سلة المشتريات
function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// إضافة منتج للسلة
function addToCart(productId, quantity = 1) {
    const cart = getCart();
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ id: productId, quantity: quantity });
    }
    
    saveCart(cart);
    updateCartBadge();
    return cart;
}

// إزالة منتج من السلة
function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    updateCartBadge();
    return cart;
}

// تحديث كمية منتج في السلة
function updateCartQuantity(productId, quantity) {
    const cart = getCart();
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        if (quantity <= 0) {
            return removeFromCart(productId);
        }
        item.quantity = quantity;
        saveCart(cart);
        updateCartBadge();
    }
    return cart;
}

// الحصول على تفاصيل كاملة للسلة مع معلومات المنتجات
function getCartDetails() {
    const cart = getCart();
    const products = getProducts();
    
    return cart.map(cartItem => {
        const product = products.find(p => p.id === cartItem.id);
        return {
            ...cartItem,
            product: product,
            totalPrice: product ? product.price * cartItem.quantity : 0
        };
    }).filter(item => item.product !== null);
}

// حساب إجمالي السلة
function getCartTotal() {
    const details = getCartDetails();
    return details.reduce((sum, item) => sum + item.totalPrice, 0);
}

// الحصول على عدد العناصر في السلة
function getCartCount() {
    const cart = getCart();
    return cart.reduce((sum, item) => sum + item.quantity, 0);
}

// تحديث عدد السلة في الشريط
function updateCartBadge() {
    const count = getCartCount();
    const badge = document.querySelector('.cart-badge');
    if (badge) {
        if (count > 0) {
            badge.textContent = count;
            badge.style.display = 'inline';
        } else {
            badge.style.display = 'none';
        }
    }
}

// =============================================
// 5. تنبيهات وإشعارات
// =============================================

function showNotification(message, type = 'success') {
    // إزالة الإشعارات السابقة
    const oldNotifications = document.querySelectorAll('.notification');
    oldNotifications.forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // إزالة الإشعار بعد 3 ثواني
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// =============================================
// 6. عرض المنتجات في الصفحات
// =============================================

// عرض المنتجات في صفحة المنتجات
function renderProducts(products) {
    const container = document.getElementById('productsContainer');
    if (!container) return;
    
    if (!products || products.length === 0) {
        container.innerHTML = `
            <div class="text-center" style="padding: 60px 20px;">
                <div style="font-size: 60px; margin-bottom: 20px;">📦</div>
                <h3>لا توجد منتجات متاحة</h3>
                <p style="color: var(--gray-color);">قم بإضافة منتجات جديدة من خلال صفحة الإضافة</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = products.map(product => `
        <div class="product-card fade-in">
            <div class="product-card-image">${product.image || '📦'}</div>
            <div class="product-card-body">
                <h3>${product.productName}</h3>
                <div class="brand">${product.brand}</div>
                <div class="category">${product.category}</div>
                <div class="price">${product.price} ر.س</div>
                <div class="rating">⭐ ${product.rating || 'غير مقيم'}</div>
                <div class="card-actions">
                    <a href="product-details.html?id=${product.id}" class="btn btn-primary btn-sm">تفاصيل</a>
                    <button onclick="handleAddToCart(${product.id})" class="btn btn-success btn-sm">➕ سلة</button>
                </div>
            </div>
        </div>
    `).join('');
}

// عرض المنتجات المميزة في الصفحة الرئيسية
function renderFeaturedProducts() {
    const container = document.getElementById('featuredProducts');
    if (!container) return;
    
    const products = getProducts();
    const featured = products.slice(0, 4);
    
    container.innerHTML = featured.map(product => `
        <div class="product-card fade-in">
            <div class="product-card-image">${product.image || '📦'}</div>
            <div class="product-card-body">
                <h3>${product.productName}</h3>
                <div class="brand">${product.brand}</div>
                <div class="category">${product.category}</div>
                <div class="price">${product.price} ر.س</div>
                <div class="rating">⭐ ${product.rating || 'غير مقيم'}</div>
                <div class="card-actions">
                    <a href="product-details.html?id=${product.id}" class="btn btn-primary btn-sm">تفاصيل</a>
                    <button onclick="handleAddToCart(${product.id})" class="btn btn-success btn-sm">➕ سلة</button>
                </div>
            </div>
        </div>
    `).join('');
}

// تحديث الإحصائيات في الصفحة الرئيسية
function updateStats() {
    const products = getProducts();
    
    const productCount = document.getElementById('productCount');
    const categoryCount = document.getElementById('categoryCount');
    
    if (productCount) {
        productCount.textContent = products.length;
    }
    
    if (categoryCount) {
        const categories = new Set(products.map(p => p.category));
        categoryCount.textContent = categories.size;
    }
}

// =============================================
// 7. التعامل مع الأحداث (Event Handlers)
// =============================================

// معالج إضافة إلى السلة
function handleAddToCart(productId) {
    addToCart(productId);
    showNotification('تم إضافة المنتج إلى السلة ✅', 'success');
}

// معالج البحث
function handleSearch(event) {
    const query = event.target.value;
    const products = searchProducts(query);
    renderProducts(products);
}

// =============================================
// 8. تهيئة الصفحات
// =============================================

// تهيئة صفحة تسجيل الدخول
function initLoginPage() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        const messageEl = document.getElementById('loginMessage');
        
        // التحقق من الحقول
        if (!username || !password) {
            messageEl.className = 'login-message error';
            messageEl.textContent = '⚠️ يرجى إدخال اسم المستخدم وكلمة المرور';
            return;
        }
        
        // التحقق من بيانات الدخول
        if (login(username, password)) {
            messageEl.className = 'login-message success';
            messageEl.textContent = '✅ تم تسجيل الدخول بنجاح، جاري التحويل...';
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 800);
        } else {
            messageEl.className = 'login-message error';
            messageEl.textContent = '❌ اسم المستخدم أو كلمة المرور غير صحيحة';
        }
    });
}

// تهيئة شريط التنقل
function initNavbar() {
    const toggle = document.querySelector('.navbar-toggle');
    const menu = document.querySelector('.navbar-menu');
    
    if (toggle && menu) {
        toggle.addEventListener('click', function() {
            menu.classList.toggle('active');
        });
    }
    
    // إضافة حدث تسجيل الخروج
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
    
    // تحديث عدد السلة
    updateCartBadge();
}

// تهيئة صفحة المنتجات
function initProductsPage() {
    const products = getProducts();
    renderProducts(products);
    
    // إضافة حدث البحث
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
}

// تهيئة صفحة تفاصيل المنتج
function initProductDetailsPage() {
    const params = new URLSearchParams(window.location.search);
    const productId = parseInt(params.get('id'));
    
    if (!productId) {
        window.location.href = 'products.html';
        return;
    }
    
    const product = getProductById(productId);
    if (!product) {
        showNotification('المنتج غير موجود', 'error');
        setTimeout(() => {
            window.location.href = 'products.html';
        }, 1500);
        return;
    }
    
    // عرض تفاصيل المنتج
    const container = document.getElementById('productDetails');
    if (container) {
        container.innerHTML = `
            <div class="product-details-container fade-in">
                <div class="product-details-image">${product.image || '📦'}</div>
                <div class="product-details-info">
                    <h2>${product.productName}</h2>
                    <div class="brand">🏷️ ${product.brand}</div>
                    <div class="category">${product.category}</div>
                    <div class="price">${product.price} ر.س</div>
                    <div class="year">📅 سنة الإصدار: ${product.year}</div>
                    <div class="status ${product.status === 'متوفر' ? 'status-available' : 'status-out-of-stock'}">
                        ${product.status === 'متوفر' ? '✅ متوفر' : '❌ غير متوفر'}
                    </div>
                    <div class="rating">⭐ ${product.rating || 'غير مقيم'}</div>
                    <p class="description">${product.description}</p>
                    <div class="details-actions">
                        <button onclick="handleAddToCart(${product.id})" class="btn btn-success">🛒 إضافة إلى السلة</button>
                        <a href="products.html" class="btn btn-secondary">🔙 رجوع</a>
                    </div>
                </div>
            </div>
        `;
    }
}

// تهيئة صفحة إضافة منتج
function initAddProductPage() {
    const form = document.getElementById('addProductForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // الحصول على البيانات
        const productData = {
            productName: document.getElementById('productName').value.trim(),
            brand: document.getElementById('brand').value.trim(),
            category: document.getElementById('category').value.trim(),
            price: parseFloat(document.getElementById('price').value),
            year: parseInt(document.getElementById('year').value),
            description: document.getElementById('description').value.trim(),
            image: document.getElementById('image').value.trim() || '📦',
            rating: parseFloat(document.getElementById('rating').value) || 0,
            status: document.getElementById('status').value
        };
        
        // التحقق من الحقول
        if (!productData.productName || !productData.brand || !productData.category || 
            !productData.price || !productData.year || !productData.description) {
            showNotification('⚠️ يرجى ملء جميع الحقول المطلوبة', 'error');
            return;
        }
        
        // إضافة المنتج
        addProduct(productData);
        showNotification('✅ تم إضافة المنتج بنجاح');
        
        // إعادة تعيين النموذج
        form.reset();
    });
}

// تهيئة صفحة إدارة المنتجات
function initManagePage() {
    renderManageTable();
}

// عرض جدول الإدارة
function renderManageTable() {
    const container = document.getElementById('manageTable');
    if (!container) return;
    
    const products = getProducts();
    
    if (products.length === 0) {
        container.innerHTML = `
            <div class="text-center" style="padding: 40px 20px;">
                <div style="font-size: 40px; margin-bottom: 15px;">📭</div>
                <p>لا توجد منتجات للإدارة</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>المنتج</th>
                    <th>الشركة</th>
                    <th>السعر</th>
                    <th>الفئة</th>
                    <th>الإجراءات</th>
                </tr>
            </thead>
            <tbody>
                ${products.map(product => `
                    <tr>
                        <td>${product.id}</td>
                        <td>${product.productName}</td>
                        <td>${product.brand}</td>
                        <td>${product.price} ر.س</td>
                        <td>${product.category}</td>
                        <td>
                            <div class="actions">
                                <button onclick="editProduct(${product.id})" class="btn btn-warning btn-sm">✏️ تعديل</button>
                                <button onclick="deleteProductHandler(${product.id})" class="btn btn-danger btn-sm">🗑️ حذف</button>
                            </div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// تعديل منتج (يظهر في نموذج التعديل)
function editProduct(id) {
    const product = getProductById(id);
    if (!product) {
        showNotification('المنتج غير موجود', 'error');
        return;
    }
    
    // ملء النموذج بالبيانات
    const form = document.getElementById('editProductForm');
    if (!form) {
        // إذا لم يكن هناك نموذج تعديل، نوجه إلى صفحة الإضافة مع البيانات
        localStorage.setItem('edit_product_id', id);
        window.location.href = 'add-product.html';
        return;
    }
    
    document.getElementById('editId').value = product.id;
    document.getElementById('editProductName').value = product.productName;
    document.getElementById('editBrand').value = product.brand;
    document.getElementById('editCategory').value = product.category;
    document.getElementById('editPrice').value = product.price;
    document.getElementById('editYear').value = product.year;
    document.getElementById('editDescription').value = product.description;
    document.getElementById('editImage').value = product.image;
    document.getElementById('editRating').value = product.rating;
    document.getElementById('editStatus').value = product.status;
    
    document.getElementById('editFormContainer').style.display = 'block';
    document.getElementById('editFormContainer').scrollIntoView({ behavior: 'smooth' });
}

// معالج حذف المنتج
function deleteProductHandler(id) {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
        deleteProduct(id);
        renderManageTable();
        updateStats();
        showNotification('✅ تم حذف المنتج بنجاح');
    }
}

// تهيئة نموذج التعديل
function initEditForm() {
    const form = document.getElementById('editProductForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const id = parseInt(document.getElementById('editId').value);
        const productData = {
            productName: document.getElementById('editProductName').value.trim(),
            brand: document.getElementById('editBrand').value.trim(),
            category: document.getElementById('editCategory').value.trim(),
            price: parseFloat(document.getElementById('editPrice').value),
            year: parseInt(document.getElementById('editYear').value),
            description: document.getElementById('editDescription').value.trim(),
            image: document.getElementById('editImage').value.trim() || '📦',
            rating: parseFloat(document.getElementById('editRating').value) || 0,
            status: document.getElementById('editStatus').value
        };
        
        // التحقق من الحقول
        if (!productData.productName || !productData.brand || !productData.category || 
            !productData.price || !productData.year || !productData.description) {
            showNotification('⚠️ يرجى ملء جميع الحقول المطلوبة', 'error');
            return;
        }
        
        // تحديث المنتج
        updateProduct(id, productData);
        showNotification('✅ تم تحديث المنتج بنجاح');
        
        // إخفاء نموذج التعديل وإعادة عرض الجدول
        document.getElementById('editFormContainer').style.display = 'none';
        renderManageTable();
    });
    
    // زر إلغاء التعديل
    const cancelBtn = document.getElementById('cancelEdit');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            document.getElementById('editFormContainer').style.display = 'none';
            document.getElementById('editProductForm').reset();
        });
    }
}

// تهيئة صفحة سلة المشتريات
function initCartPage() {
    renderCart();
}

// عرض سلة المشتريات
function renderCart() {
    const container = document.getElementById('cartItems');
    const summaryContainer = document.getElementById('cartSummary');
    
    if (!container || !summaryContainer) return;
    
    const cartDetails = getCartDetails();
    
    if (cartDetails.length === 0) {
        container.innerHTML = `
            <div class="text-center" style="padding: 40px 20px;">
                <div style="font-size: 60px; margin-bottom: 20px;">🛒</div>
                <h3>سلة المشتريات فارغة</h3>
                <p style="color: var(--gray-color);">تصفح المنتجات وأضف ما تريد إلى سلة المشتريات</p>
                <a href="products.html" class="btn btn-primary mt-20">تسوق الآن</a>
            </div>
        `;
        summaryContainer.innerHTML = '';
        return;
    }
    
    // عرض العناصر
    container.innerHTML = cartDetails.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">${item.product.image || '📦'}</div>
            <div class="cart-item-info">
                <h4>${item.product.productName}</h4>
                <div class="price">${item.product.price} ر.س</div>
            </div>
            <div class="cart-item-quantity">
                <button onclick="handleQuantityChange(${item.id}, -1)">−</button>
                <span>${item.quantity}</span>
                <button onclick="handleQuantityChange(${item.id}, 1)">+</button>
            </div>
            <div style="font-weight: 600; color: var(--primary-color);">
                ${item.totalPrice} ر.س
            </div>
            <button onclick="handleRemoveFromCart(${item.id})" class="btn btn-danger btn-sm">🗑️</button>
        </div>
    `).join('');
    
    // عرض الملخص
    const total = getCartTotal();
    const count = getCartCount();
    
    summaryContainer.innerHTML = `
        <h3>ملخص الطلب</h3>
        <div class="summary-row">
            <span>عدد المنتجات</span>
            <span>${count}</span>
        </div>
        <div class="summary-row">
            <span>المجموع الفرعي</span>
            <span>${total} ر.س</span>
        </div>
        <div class="summary-row total">
            <span>الإجمالي</span>
            <span>${total} ر.س</span>
        </div>
        <button class="btn btn-primary w-100 mt-20" onclick="showNotification('تم إتمام الطلب بنجاح 🎉', 'success')">
            إتمام الطلب
        </button>
    `;
}

// معالج تغيير الكمية
function handleQuantityChange(productId, change) {
    const cart = getCart();
    const item = cart.find(i => i.id === productId);
    if (item) {
        const newQuantity = item.quantity + change;
        updateCartQuantity(productId, newQuantity);
        renderCart();
        updateCartBadge();
    }
}

// معالج حذف من السلة
function handleRemoveFromCart(productId) {
    removeFromCart(productId);
    renderCart();
    updateCartBadge();
    showNotification('✅ تم حذف المنتج من السلة');
}

// تهيئة صفحة التواصل
function initContactPage() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('contactName').value.trim();
        const email = document.getElementById('contactEmail').value.trim();
        const phone = document.getElementById('contactPhone').value.trim();
        const message = document.getElementById('contactMessage').value.trim();
        
        if (!name || !email || !phone || !message) {
            showNotification('⚠️ يرجى ملء جميع الحقول', 'error');
            return;
        }
        
        showNotification('✅ تم إرسال رسالتك بنجاح، سنتواصل معك قريباً');
        form.reset();
    });
}

// =============================================
// 9. تهيئة الصفحة عند التحميل
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    // التحقق من المصادقة
    if (!checkAuth()) return;
    
    // تهيئة شريط التنقل
    initNavbar();
    
    // تحديد الصفحة الحالية وتهيئتها
    const currentPage = window.location.pathname.split('/').pop();
    
    switch(currentPage) {
        case 'login.html':
            initLoginPage();
            break;
            
        case 'index.html':
            renderFeaturedProducts();
            updateStats();
            break;
            
        case 'products.html':
            initProductsPage();
            break;
            
        case 'product-details.html':
            initProductDetailsPage();
            break;
            
        case 'add-product.html':
            initAddProductPage();
            // التحقق من وجود ID للتعديل
            const editId = localStorage.getItem('edit_product_id');
            if (editId) {
                const product = getProductById(parseInt(editId));
                if (product) {
                    // ملء النموذج للتحرير
                    document.getElementById('productName').value = product.productName;
                    document.getElementById('brand').value = product.brand;
                    document.getElementById('category').value = product.category;
                    document.getElementById('price').value = product.price;
                    document.getElementById('year').value = product.year;
                    document.getElementById('description').value = product.description;
                    document.getElementById('image').value = product.image;
                    document.getElementById('rating').value = product.rating;
                    document.getElementById('status').value = product.status;
                    
                    // تغيير النص لعملية التعديل
                    const submitBtn = document.querySelector('#addProductForm button[type="submit"]');
                    if (submitBtn) {
                        submitBtn.textContent = 'تحديث المنتج';
                    }
                    
                    // تعديل سلوك النموذج للتحديث
                    const form = document.getElementById('addProductForm');
                    const originalSubmit = form.onsubmit;
                    form.addEventListener('submit', function(e) {
                        e.preventDefault();
                        
                        const productData = {
                            productName: document.getElementById('productName').value.trim(),
                            brand: document.getElementById('brand').value.trim(),
                            category: document.getElementById('category').value.trim(),
                            price: parseFloat(document.getElementById('price').value),
                            year: parseInt(document.getElementById('year').value),
                            description: document.getElementById('description').value.trim(),
                            image: document.getElementById('image').value.trim() || '📦',
                            rating: parseFloat(document.getElementById('rating').value) || 0,
                            status: document.getElementById('status').value
                        };
                        
                        updateProduct(parseInt(editId), productData);
                        showNotification('✅ تم تحديث المنتج بنجاح');
                        localStorage.removeItem('edit_product_id');
                        form.reset();
                        window.location.href = 'manage.html';
                    }, true);
                }
                localStorage.removeItem('edit_product_id');
            }
            break;
            
        case 'manage.html':
            initManagePage();
            initEditForm();
            break;
            
        case 'cart.html':
            initCartPage();
            break;
            
        case 'contact.html':
            initContactPage();
            break;
    }
});

// =============================================
// 10. دوال مساعدة إضافية
// =============================================

// تصدير الدوال للاستخدام في HTML
window.handleAddToCart = handleAddToCart;
window.handleQuantityChange = handleQuantityChange;
window.handleRemoveFromCart = handleRemoveFromCart;
window.editProduct = editProduct;
window.deleteProductHandler = deleteProductHandler;
window.showNotification = showNotification;
window.getProducts = getProducts;
window.addToCart = addToCart;