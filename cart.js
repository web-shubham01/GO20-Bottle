// Go24 Flamingo - Global Cart System
(function () {
    // 1. Initialize State
    let cart = [];
    try {
        const savedCart = localStorage.getItem('go24_cart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
        }
    } catch (e) {
        console.error("Failed to load cart from localStorage:", e);
    }

    // 2. Inject Cart UI Elements on Load
    document.addEventListener("DOMContentLoaded", () => {
        injectCartElements();
        updateCartUI();
        bindTriggers();
    });

    // 3. Inject DOM Elements (Cart Drawer & Checkout Modal)
    function injectCartElements() {
        if (document.getElementById("cart-drawer-container")) return;

        // Create style tag for custom scrollbars or animations if needed
        const style = document.createElement("style");
        style.innerHTML = `
            .cart-scroll::-webkit-scrollbar { width: 4px; }
            .cart-scroll::-webkit-scrollbar-track { background: transparent; }
            .cart-scroll::-webkit-scrollbar-thumb { background: #3c494e; border-radius: 4px; }
            .cart-scroll::-webkit-scrollbar-thumb:hover { background: #00D2FF; }
        `;
        document.head.appendChild(style);

        // Cart Drawer DOM
        const drawerContainer = document.createElement("div");
        drawerContainer.id = "cart-drawer-container";
        drawerContainer.className = "fixed inset-0 z-[100] pointer-events-none opacity-0 transition-opacity duration-300 bg-black/70 backdrop-blur-sm";
        drawerContainer.innerHTML = `
            <div id="cart-drawer" class="fixed top-0 right-0 h-full w-full max-w-md bg-[#131313]/95 backdrop-blur-2xl border-l border-outline-variant/30 p-8 shadow-2xl flex flex-col transform translate-x-full transition-transform duration-300 pointer-events-auto">
                <!-- Header -->
                <div class="flex justify-between items-center pb-6 border-b border-outline-variant/20">
                    <h2 class="font-headline-lg text-2xl text-on-surface uppercase tracking-tight">Your Armor Bag</h2>
                    <button id="cart-close" class="text-on-surface-variant hover:text-primary transition-colors p-2">
                        <span class="material-symbols-outlined text-2xl">close</span>
                    </button>
                </div>
                
                <!-- Items list -->
                <div id="cart-items" class="flex-1 min-h-0 overflow-y-auto py-6 pb-4 space-y-6 cart-scroll">
                    <!-- Dynamic Cart Items -->
                </div>
                
                <!-- Footer -->
                <div class="border-t border-outline-variant/20 pt-6 pb-8 space-y-4 flex-shrink-0">
                    <div class="flex justify-between items-center font-label-md text-label-md">
                        <span class="text-on-surface-variant uppercase tracking-widest">SUBTOTAL</span>
                        <span id="cart-subtotal" class="text-primary font-bold text-lg">$0.00</span>
                    </div>
                    <p class="font-body-md text-sm text-on-surface-variant">Shipping & taxes calculated at checkout.</p>
                    <button id="cart-checkout-btn" class="w-full bg-primary hover:bg-[#00ffa3] text-[#003543] hover:text-[#002111] font-label-md py-4 rounded-full font-bold transition-all duration-300 tracking-wider shadow-[0_0_15px_rgba(0,210,255,0.2)] hover:shadow-[0_0_20px_rgba(0,255,163,0.4)]">
                        PROCEED TO CHECKOUT
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(drawerContainer);

        // Checkout Modal DOM
        const checkoutModal = document.createElement("div");
        checkoutModal.id = "checkout-modal-container";
        checkoutModal.className = "fixed inset-0 z-[110] pointer-events-none opacity-0 transition-opacity duration-300 bg-black/80 flex items-center justify-center p-4 backdrop-blur-md";
        checkoutModal.innerHTML = `
            <div id="checkout-modal" class="w-full max-w-lg bg-[#1a1a1a] border border-outline-variant/30 rounded-2xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto cart-scroll scale-95 transition-transform duration-300">
                <!-- Close Button -->
                <div class="flex justify-end">
                    <button id="checkout-close" class="text-on-surface-variant hover:text-primary transition-colors">
                        <span class="material-symbols-outlined text-2xl">close</span>
                    </button>
                </div>

                <!-- Form Section -->
                <div id="checkout-form-section">
                    <h2 class="font-headline-lg text-3xl text-on-surface uppercase tracking-tight text-center mb-6">SECURE CHECKOUT</h2>
                    <form id="checkout-form" class="space-y-6">
                        <div>
                            <label class="block text-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Email Address</label>
                            <input type="email" required class="w-full bg-[#131313] border border-outline-variant/30 rounded-lg p-3 text-on-surface focus:outline-none focus:border-primary transition-colors" placeholder="explorer@go24.com">
                        </div>
                        <div>
                            <label class="block text-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Shipping Name</label>
                            <input type="text" required class="w-full bg-[#131313] border border-outline-variant/30 rounded-lg p-3 text-on-surface focus:outline-none focus:border-primary transition-colors" placeholder="Alex Carter">
                        </div>
                        <div>
                            <label class="block text-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Delivery Address</label>
                            <input type="text" required class="w-full bg-[#131313] border border-outline-variant/30 rounded-lg p-3 text-on-surface focus:outline-none focus:border-primary transition-colors" placeholder="123 Pulse Street, Mumbai">
                        </div>
                        
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-label-sm text-on-surface-variant uppercase tracking-wider mb-2">City</label>
                                <input type="text" required class="w-full bg-[#131313] border border-outline-variant/30 rounded-lg p-3 text-on-surface focus:outline-none focus:border-primary transition-colors" placeholder="Mumbai">
                            </div>
                            <div>
                                <label class="block text-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Postal Code</label>
                                <input type="text" required class="w-full bg-[#131313] border border-outline-variant/30 rounded-lg p-3 text-on-surface focus:outline-none focus:border-primary transition-colors" placeholder="400001">
                            </div>
                        </div>

                        <!-- Payment Selection -->
                        <div class="border-t border-outline-variant/20 pt-6">
                            <label class="block text-label-sm text-on-surface-variant uppercase tracking-wider mb-4">Payment Method</label>
                            <div class="grid grid-cols-2 gap-4 mb-4">
                                <label class="flex items-center gap-3 bg-[#131313] border border-outline-variant/30 p-4 rounded-lg cursor-pointer hover:border-primary transition-colors">
                                    <input type="radio" name="payment_method" value="card" checked class="text-primary focus:ring-0">
                                    <span class="font-label-md text-sm text-on-surface uppercase tracking-wider">Credit Card</span>
                                </label>
                                <label class="flex items-center gap-3 bg-[#131313] border border-outline-variant/30 p-4 rounded-lg cursor-pointer hover:border-primary transition-colors">
                                    <input type="radio" name="payment_method" value="upi" class="text-primary focus:ring-0">
                                    <span class="font-label-md text-sm text-on-surface uppercase tracking-wider">UPI</span>
                                </label>
                            </div>
                            
                            <div id="card-fields" class="space-y-4">
                                <div>
                                    <input type="text" id="card-num" class="w-full bg-[#131313] border border-outline-variant/30 rounded-lg p-3 text-on-surface focus:outline-none focus:border-primary transition-colors" placeholder="Card Number (4000 1234 5678 9010)">
                                </div>
                                <div class="grid grid-cols-2 gap-4">
                                    <input type="text" id="card-exp" class="w-full bg-[#131313] border border-outline-variant/30 rounded-lg p-3 text-on-surface focus:outline-none focus:border-primary transition-colors" placeholder="MM/YY">
                                    <input type="text" id="card-cvv" class="w-full bg-[#131313] border border-outline-variant/30 rounded-lg p-3 text-on-surface focus:outline-none focus:border-primary transition-colors" placeholder="CVV">
                                </div>
                            </div>
                            
                            <div id="upi-fields" class="hidden">
                                <input type="text" id="upi-id" class="w-full bg-[#131313] border border-outline-variant/30 rounded-lg p-3 text-on-surface focus:outline-none focus:border-primary transition-colors" placeholder="VPA Address (alex@upi)">
                            </div>
                        </div>

                        <!-- Summary block -->
                        <div class="bg-[#131313] p-4 rounded-lg flex justify-between items-center border border-outline-variant/20">
                            <span class="font-label-md text-sm text-on-surface-variant uppercase tracking-wider">Total Due</span>
                            <span id="checkout-total" class="text-secondary-fixed font-bold text-lg font-mono">$0.00</span>
                        </div>

                        <button type="submit" class="w-full bg-secondary-container hover:bg-primary text-[#007146] hover:text-[#003543] font-label-md py-4 rounded-full font-bold transition-all duration-300 tracking-wider shadow-[0_0_15px_rgba(0,255,163,0.2)]">
                            AUTHORIZE ORDER
                        </button>
                    </form>
                </div>

                <!-- Success Section -->
                <div id="checkout-success-section" class="hidden text-center py-12 space-y-6">
                    <div class="w-24 h-24 rounded-full bg-secondary-container/20 border-2 border-secondary-fixed flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(0,255,163,0.3)] animate-bounce">
                        <span class="material-symbols-outlined text-[60px] text-secondary-fixed" style="font-variation-settings: 'FILL' 1;">check_circle</span>
                    </div>
                    <h2 class="font-display-lg text-4xl text-secondary-fixed uppercase tracking-tighter">ORDER CONFIRMED</h2>
                    <p class="font-body-lg text-on-surface-variant max-w-sm mx-auto">Your armor is prepping for shipment. A verification and tracking code has been dispatched to your email.</p>
                    <div class="pt-6">
                        <button id="success-close" class="bg-primary text-on-primary font-label-md px-10 py-4 rounded-full font-bold hover:bg-[#00ffa3] transition-all hover:scale-105 active:scale-95 duration-200">
                            CONTINUE MISSIONS
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(checkoutModal);

        // Bind events for close/clicks
        document.getElementById("cart-close").addEventListener("click", () => toggleCart(false));
        document.getElementById("cart-drawer-container").addEventListener("click", (e) => {
            if (e.target.id === "cart-drawer-container") toggleCart(false);
        });
        document.getElementById("cart-checkout-btn").addEventListener("click", openCheckout);
        document.getElementById("checkout-close").addEventListener("click", closeCheckout);
        document.getElementById("checkout-modal-container").addEventListener("click", (e) => {
            if (e.target.id === "checkout-modal-container") closeCheckout();
        });
        
        // Handle payment fields toggling
        const payRadios = document.getElementsByName("payment_method");
        payRadios.forEach(radio => {
            radio.addEventListener("change", (e) => {
                if (e.target.value === "upi") {
                    document.getElementById("upi-fields").classList.remove("hidden");
                    document.getElementById("card-fields").classList.add("hidden");
                } else {
                    document.getElementById("card-fields").classList.remove("hidden");
                    document.getElementById("upi-fields").classList.add("hidden");
                }
            });
        });

        // Form Submit
        document.getElementById("checkout-form").addEventListener("submit", handleCheckoutSubmit);
        document.getElementById("success-close").addEventListener("click", () => {
            closeCheckout();
            clearCart();
        });
    }

    // 4. Update UI
    function updateCartUI() {
        const cartItemsContainer = document.getElementById("cart-items");
        const subtotalEl = document.getElementById("cart-subtotal");
        const checkoutTotalEl = document.getElementById("checkout-total");
        if (!cartItemsContainer) return;

        // Render Cart Items
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="flex flex-col items-center justify-center h-full text-center py-20 opacity-50">
                    <span class="material-symbols-outlined text-[64px] mb-4">shopping_bag</span>
                    <p class="font-body-lg text-on-surface-variant uppercase tracking-widest text-sm">Bag is empty</p>
                </div>
            `;
            subtotalEl.innerText = "$0.00";
            checkoutTotalEl.innerText = "$0.00";
            document.getElementById("cart-checkout-btn").disabled = true;
            document.getElementById("cart-checkout-btn").style.opacity = "0.5";
        } else {
            let html = "";
            let subtotal = 0;
            cart.forEach((item, index) => {
                const itemPrice = parseFloat(item.price.replace(/[^\d.]/g, "")) || 0;
                const totalItemPrice = itemPrice * item.quantity;
                subtotal += totalItemPrice;
                
                html += `
                    <div class="flex gap-4 bg-[#1a1a1a]/50 p-4 rounded-xl border border-outline-variant/10 hover:border-primary/20 transition-all">
                        <div class="w-20 h-20 bg-[#131313] rounded-lg border border-outline-variant/20 flex items-center justify-center p-2 shrink-0">
                            <img src="${item.image}" alt="${item.name}" class="w-full h-full object-contain ${item.color === 'Royal Purple' ? 'hue-rotate-[180deg] opacity-90 contrast-125 saturate-150' : ''}">
                        </div>
                        <div class="flex-grow flex flex-col justify-between">
                            <div>
                                <h4 class="font-headline-lg text-sm text-on-surface uppercase">${item.name}</h4>
                                <div class="flex gap-2 mt-1">
                                    <span class="font-label-sm text-[10px] text-primary uppercase border border-primary/20 px-2 py-0.5 rounded">${item.color}</span>
                                    <span class="font-label-sm text-[10px] text-secondary-fixed uppercase border border-secondary-fixed/20 px-2 py-0.5 rounded">${item.capacity}</span>
                                </div>
                            </div>
                            <div class="flex justify-between items-center mt-3">
                                <div class="flex items-center border border-outline-variant/30 rounded-full bg-[#131313]">
                                    <button onclick="cart.updateQuantity(${index}, -1)" class="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-primary">-</button>
                                    <span class="w-8 text-center text-sm font-label-md">${item.quantity}</span>
                                    <button onclick="cart.updateQuantity(${index}, 1)" class="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-primary">+</button>
                                </div>
                                <div class="flex items-center gap-3">
                                    <span class="font-label-md text-sm text-secondary-fixed font-bold">$${totalItemPrice.toFixed(2)}</span>
                                    <button onclick="cart.removeItem(${index})" class="text-on-surface-variant hover:text-error transition-colors">
                                        <span class="material-symbols-outlined text-lg">delete</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });
            cartItemsContainer.innerHTML = html;
            subtotalEl.innerText = `$${subtotal.toFixed(2)}`;
            checkoutTotalEl.innerText = `$${subtotal.toFixed(2)}`;
            document.getElementById("cart-checkout-btn").disabled = false;
            document.getElementById("cart-checkout-btn").style.opacity = "1";
        }

        // Update pills
        updateCartPills();
    }

    // 5. Update Pills (Count)
    function updateCartPills() {
        const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        // Find all shopping bag buttons on page and update/inject count badges
        const bagIcons = document.querySelectorAll(".material-symbols-outlined");
        bagIcons.forEach(icon => {
            if (icon.innerText === "shopping_bag" || icon.innerText === "shopping_cart") {
                const parent = icon.parentElement;
                parent.style.position = "relative";
                
                let pill = parent.querySelector(".cart-count-pill");
                if (totalQty === 0) {
                    if (pill) pill.remove();
                } else {
                    if (!pill) {
                        pill = document.createElement("span");
                        pill.className = "cart-count-pill absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-secondary-container text-[#007146] text-[10px] font-bold shadow-[0_0_10px_rgba(0,255,163,0.5)] border border-[#131313]";
                        parent.appendChild(pill);
                    }
                    pill.innerText = totalQty;
                }
            }
        });
    }

    // 6. Bind Toggle Triggers on Page
    function bindTriggers() {
        const bagButtons = document.querySelectorAll(".material-symbols-outlined");
        bagButtons.forEach(btn => {
            if (btn.innerText === "shopping_bag" || btn.innerText === "shopping_cart") {
                const trigger = btn.parentElement;
                // Avoid duplicating listeners
                if (!trigger.dataset.cartBound) {
                    trigger.addEventListener("click", (e) => {
                        e.preventDefault();
                        toggleCart(true);
                    });
                    trigger.dataset.cartBound = "true";
                }
            }
        });
    }

    // 7. Cart actions
    function toggleCart(open) {
        const container = document.getElementById("cart-drawer-container");
        const drawer = document.getElementById("cart-drawer");
        if (!container || !drawer) return;

        if (open) {
            container.classList.remove("pointer-events-none", "opacity-0");
            container.classList.add("pointer-events-auto", "opacity-100");
            drawer.classList.remove("translate-x-full");
            drawer.classList.add("translate-x-0");
        } else {
            container.classList.add("pointer-events-none", "opacity-0");
            container.classList.remove("pointer-events-auto", "opacity-100");
            drawer.classList.add("translate-x-full");
            drawer.classList.remove("translate-x-0");
        }
    }

    function addToCart(item) {
        // item format: { name, color, capacity, price, image }
        const existingIndex = cart.findIndex(i => i.name === item.name && i.color === item.color && i.capacity === item.capacity);
        if (existingIndex > -1) {
            cart[existingIndex].quantity += 1;
        } else {
            cart.push({ ...item, quantity: 1 });
        }
        saveCart();
        updateCartUI();
        toggleCart(true);
    }

    function removeItem(index) {
        cart.splice(index, 1);
        saveCart();
        updateCartUI();
    }

    function updateQuantity(index, delta) {
        cart[index].quantity += delta;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        saveCart();
        updateCartUI();
    }

    function clearCart() {
        cart = [];
        saveCart();
        updateCartUI();
    }

    function saveCart() {
        try {
            localStorage.setItem('go24_cart', JSON.stringify(cart));
        } catch (e) {
            console.error("Failed to save cart to localStorage:", e);
        }
    }

    // 8. Checkout Modal Flow
    function openCheckout() {
        toggleCart(false);
        const container = document.getElementById("checkout-modal-container");
        const modal = document.getElementById("checkout-modal");
        if (!container || !modal) return;

        container.classList.remove("pointer-events-none", "opacity-0");
        container.classList.add("pointer-events-auto", "opacity-100");
        modal.classList.remove("scale-95");
        modal.classList.add("scale-100");

        // Reset views
        document.getElementById("checkout-form-section").classList.remove("hidden");
        document.getElementById("checkout-success-section").classList.add("hidden");
    }

    function closeCheckout() {
        const container = document.getElementById("checkout-modal-container");
        const modal = document.getElementById("checkout-modal");
        if (!container || !modal) return;

        container.classList.add("pointer-events-none", "opacity-0");
        container.classList.remove("pointer-events-auto", "opacity-100");
        modal.classList.add("scale-95");
        modal.classList.remove("scale-100");
    }

    function handleCheckoutSubmit(e) {
        e.preventDefault();
        // Hide form, show success screen
        document.getElementById("checkout-form-section").classList.add("hidden");
        document.getElementById("checkout-success-section").classList.remove("hidden");
    }

    // Expose API globally
    window.cart = {
        addToCart,
        toggleCart,
        removeItem,
        updateQuantity,
        clearCart,
        openCheckout,
        closeCheckout,
        updateCartUI
    };
})();
