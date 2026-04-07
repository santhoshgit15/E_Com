/* ======================================================
   LUXE E-Commerce — App Logic
   Fast, responsive, and conversion-focused
   ====================================================== */

(() => {
    'use strict';

    // ========== Product Data ==========
    const products = [
        {
            id: 1,
            name: 'Polka Dot Wrap Dress',
            brand: 'LUXE Design',
            price: 45,
            originalPrice: null,
            image: 'images/product-1.png',
            badge: 'New',
            colors: ['Black', 'Brown', 'Red'],
            description: 'A timeless polka dot wrap dress with a flattering V-neckline and flowing silhouette. Perfect for day-to-night versatility.'
        },
        {
            id: 2,
            name: 'Bardot Top in Embroidery',
            brand: 'LUXE Essentials',
            price: 39.99,
            originalPrice: 54.99,
            image: 'images/hero-model.png',
            badge: 'Trending',
            colors: ['Mustard', 'Cream', 'Rose'],
            description: 'A stunning off-shoulder bardot top featuring intricate embroidery details. The perfect statement piece for summer.'
        },
        {
            id: 3,
            name: 'Ruffle Off-Shoulder Blouse',
            brand: 'LUXE Atelier',
            price: 55,
            originalPrice: null,
            image: 'images/product-2.png',
            badge: 'Limited',
            colors: ['Lavender', 'White'],
            description: 'Delicate ruffles cascade across this beautiful off-shoulder blouse. Crafted from premium cotton with a relaxed fit.'
        },
        {
            id: 4,
            name: 'Floral Puff Sleeve Mini Dress',
            brand: 'LUXE Design',
            price: 35,
            originalPrice: 50,
            image: 'images/product-3.png',
            badge: '-30%',
            colors: ['Floral', 'Blue'],
            description: 'A dreamy floral mini dress with romantic puff sleeves. Perfect cottage-core aesthetic for garden parties.'
        },
        {
            id: 5,
            name: 'Lace Detail Knit Crop Top',
            brand: 'LUXE Essentials',
            price: 32,
            originalPrice: null,
            image: 'images/product-4.png',
            badge: null,
            colors: ['Cream', 'Black'],
            description: 'A soft knit crop top with beautiful lace detailing. Pairs perfectly with high-waist jeans for effortless style.'
        },
        {
            id: 6,
            name: 'Sage Satin Slip Dress',
            brand: 'LUXE Atelier',
            price: 62,
            originalPrice: null,
            image: 'images/product-5.png',
            badge: 'New',
            colors: ['Sage', 'Champagne', 'Black'],
            description: 'An elegant satin slip dress in a gorgeous sage green. Features delicate spaghetti straps and a midi length.'
        }
    ];

    // ========== State ==========
    let cart = [];
    let wishlist = [];

    // ========== DOM Cache ==========
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    const dom = {
        body: document.body,
        announcementBar: $('#announcement-bar'),
        announcementClose: $('#announcement-close'),
        navbar: $('#navbar'),
        logo: $('#logo'),
        searchToggle: $('#search-toggle'),
        searchOverlay: $('#search-overlay'),
        searchInput: $('#search-input'),
        searchClose: $('#search-close'),
        hamburger: $('#hamburger'),
        mobileNav: $('#mobile-nav'),
        cartToggle: $('#cart-toggle'),
        cartOverlay: $('#cart-overlay'),
        cartSidebar: $('#cart-sidebar'),
        cartClose: $('#cart-close'),
        cartBody: $('#cart-body'),
        cartItems: $('#cart-items'),
        cartEmpty: $('#cart-empty'),
        cartFooter: $('#cart-footer'),
        cartCount: $('#cart-count'),
        cartHeaderCount: $('#cart-header-count'),
        cartTotalPrice: $('#cart-total-price'),
        cartCheckout: $('#cart-checkout'),
        wishlistCount: $('#wishlist-count'),
        heroAddCart: $('#hero-add-cart'),
        heroWishlist: $('#hero-wishlist'),
        quickViewOverlay: $('#quick-view-overlay'),
        quickViewModal: $('#quick-view-modal'),
        modalClose: $('#modal-close'),
        modalProductImage: $('#modal-product-image'),
        modalBrand: $('#modal-brand'),
        modalName: $('#modal-name'),
        modalPrice: $('#modal-price'),
        modalDescription: $('#modal-description'),
        modalAddCart: $('#modal-add-cart'),
        toast: $('#toast'),
        toastTitle: $('#toast-title'),
        toastMessage: $('#toast-message'),
        newsletterForm: $('#newsletter-form'),
        newsletterEmail: $('#newsletter-email'),
        scrollIndicator: $('#scroll-indicator'),
    };

    // ========== Utilities ==========
    const debounce = (fn, delay) => {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => fn(...args), delay);
        };
    };

    const formatPrice = (price) => `$${price.toFixed(2).replace(/\.00$/, '')}`;

    const showToast = (title, message) => {
        dom.toastTitle.textContent = title;
        dom.toastMessage.textContent = message;
        dom.toast.classList.add('active');
        setTimeout(() => dom.toast.classList.remove('active'), 2800);
    };

    const pulseBadge = (el) => {
        el.classList.remove('pulse');
        void el.offsetWidth; // reflow
        el.classList.add('pulse');
    };

    // ========== Announcement Bar ==========
    dom.announcementClose?.addEventListener('click', () => {
        dom.announcementBar.classList.add('hidden');
        // Update mobile nav top position
        setTimeout(() => {
            if (dom.mobileNav) {
                dom.mobileNav.style.top = `${dom.navbar.offsetHeight}px`;
            }
        }, 350);
    });

    // ========== Navbar Scroll ==========
    const handleScroll = debounce(() => {
        const scrolled = window.scrollY > 50;
        dom.navbar.classList.toggle('scrolled', scrolled);

        // Hide scroll indicator
        if (dom.scrollIndicator && window.scrollY > 100) {
            dom.scrollIndicator.style.opacity = '0';
        }
    }, 10);

    window.addEventListener('scroll', handleScroll, { passive: true });

    // ========== Search ==========
    dom.searchToggle?.addEventListener('click', () => {
        dom.searchOverlay.classList.toggle('active');
        if (dom.searchOverlay.classList.contains('active')) {
            setTimeout(() => dom.searchInput.focus(), 300);
        }
    });

    dom.searchClose?.addEventListener('click', () => {
        dom.searchOverlay.classList.remove('active');
        dom.searchInput.value = '';
    });

    // Close search on outside click
    document.addEventListener('click', (e) => {
        if (dom.searchOverlay.classList.contains('active') &&
            !dom.searchOverlay.contains(e.target) &&
            !dom.searchToggle.contains(e.target)) {
            dom.searchOverlay.classList.remove('active');
        }
    });

    // Trending tags click
    $$('.tag').forEach(tag => {
        tag.addEventListener('click', () => {
            dom.searchInput.value = tag.textContent;
            dom.searchInput.focus();
        });
    });

    // ========== Mobile Nav ==========
    dom.hamburger?.addEventListener('click', () => {
        dom.hamburger.classList.toggle('active');
        dom.mobileNav.classList.toggle('active');
        dom.body.classList.toggle('no-scroll', dom.mobileNav.classList.contains('active'));
    });

    // ========== Category Chips ==========
    $$('.category-chip').forEach(chip => {
        chip.addEventListener('click', (e) => {
            e.preventDefault();
            $$('.category-chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
        });
    });

    // Nav link active state
    $$('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            $$('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // ========== Cart ==========
    const openCart = () => {
        dom.cartOverlay.classList.add('active');
        dom.cartSidebar.classList.add('active');
        dom.body.classList.add('no-scroll');
    };

    const closeCart = () => {
        dom.cartOverlay.classList.remove('active');
        dom.cartSidebar.classList.remove('active');
        dom.body.classList.remove('no-scroll');
    };

    const updateCartUI = () => {
        const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
        const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

        dom.cartCount.textContent = totalItems;
        dom.cartHeaderCount.textContent = `(${totalItems})`;
        dom.cartTotalPrice.textContent = formatPrice(totalPrice);

        pulseBadge(dom.cartCount);

        if (cart.length === 0) {
            dom.cartEmpty.style.display = 'flex';
            dom.cartItems.innerHTML = '';
            dom.cartFooter.style.display = 'none';
        } else {
            dom.cartEmpty.style.display = 'none';
            dom.cartFooter.style.display = 'block';
            renderCartItems();
        }
    };

    const renderCartItems = () => {
        dom.cartItems.innerHTML = cart.map(item => `
            <div class="cart-item" data-cart-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-info">
                    <p class="cart-item-name">${item.name}</p>
                    <p class="cart-item-meta">Size: ${item.size || 'S'} · ${item.color || 'Default'}</p>
                    <div class="cart-item-bottom">
                        <div class="cart-qty">
                            <button class="qty-decrease" data-id="${item.id}">−</button>
                            <span>${item.qty}</span>
                            <button class="qty-increase" data-id="${item.id}">+</button>
                        </div>
                        <span class="cart-item-price">${formatPrice(item.price * item.qty)}</span>
                    </div>
                    <button class="cart-item-remove" data-id="${item.id}">Remove</button>
                </div>
            </div>
        `).join('');

        // Attach cart item events
        $$('.qty-decrease').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                const item = cart.find(i => i.id === id);
                if (item.qty > 1) {
                    item.qty--;
                } else {
                    cart = cart.filter(i => i.id !== id);
                }
                updateCartUI();
            });
        });

        $$('.qty-increase').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                const item = cart.find(i => i.id === id);
                item.qty++;
                updateCartUI();
            });
        });

        $$('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                cart = cart.filter(i => i.id !== id);
                updateCartUI();
            });
        });
    };

    const addToCart = (productId) => {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        const existing = cart.find(i => i.id === productId);
        if (existing) {
            existing.qty++;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                color: product.colors[0],
                size: 'S',
                qty: 1
            });
        }

        updateCartUI();
        showToast('Added to bag', `${product.name} has been added`);
        openCart();
    };

    dom.cartToggle?.addEventListener('click', openCart);
    dom.cartClose?.addEventListener('click', closeCart);
    dom.cartOverlay?.addEventListener('click', closeCart);

    // Continue shopping
    document.querySelector('.cart-continue')?.addEventListener('click', (e) => {
        e.preventDefault();
        closeCart();
    });

    // Checkout button
    dom.cartCheckout?.addEventListener('click', () => {
        showToast('Checkout', 'Redirecting to checkout...');
    });

    // ========== Add to Cart Buttons ==========
    // Hero CTA
    dom.heroAddCart?.addEventListener('click', () => addToCart(2));

    // Product card add-to-bag overlay
    $$('.add-to-bag-overlay').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            addToCart(parseInt(btn.dataset.productId));
        });
    });

    // Modal add to cart
    dom.modalAddCart?.addEventListener('click', () => {
        const id = parseInt(dom.quickViewModal.dataset.productId);
        addToCart(id);
        closeModal();
    });

    // ========== Wishlist ==========
    const toggleWishlist = (productId) => {
        const idx = wishlist.indexOf(productId);
        if (idx > -1) {
            wishlist.splice(idx, 1);
            showToast('Removed', 'Item removed from wishlist');
        } else {
            wishlist.push(productId);
            showToast('Saved ❤️', 'Item added to your wishlist');
        }

        dom.wishlistCount.textContent = wishlist.length;
        pulseBadge(dom.wishlistCount);

        // Update heart icons
        $$('.wishlist-action').forEach(btn => {
            const id = parseInt(btn.dataset.productId);
            btn.classList.toggle('wishlisted', wishlist.includes(id));
        });
    };

    $$('.wishlist-action').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleWishlist(parseInt(btn.dataset.productId));
        });
    });

    // Hero wishlist
    dom.heroWishlist?.addEventListener('click', () => toggleWishlist(2));

    // ========== Quick View Modal ==========
    let currentModalProductId = null;

    const openModal = (productId) => {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        currentModalProductId = productId;
        dom.quickViewModal.dataset.productId = productId;
        dom.modalProductImage.src = product.image;
        dom.modalProductImage.alt = product.name;
        dom.modalBrand.textContent = product.brand;
        dom.modalName.textContent = product.name;
        dom.modalDescription.innerHTML = `<p>${product.description}</p>`;

        let priceHTML = `<span class="current-price">${formatPrice(product.price)}</span>`;
        if (product.originalPrice) {
            priceHTML += ` <span class="original-price">${formatPrice(product.originalPrice)}</span>`;
        }
        dom.modalPrice.innerHTML = priceHTML;

        dom.quickViewOverlay.classList.add('active');
        dom.quickViewModal.classList.add('active');
        dom.body.classList.add('no-scroll');
    };

    const closeModal = () => {
        dom.quickViewOverlay.classList.remove('active');
        dom.quickViewModal.classList.remove('active');
        dom.body.classList.remove('no-scroll');
        currentModalProductId = null;
    };

    $$('.quick-view-action').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            openModal(parseInt(btn.dataset.productId));
        });
    });

    dom.modalClose?.addEventListener('click', closeModal);
    dom.quickViewOverlay?.addEventListener('click', closeModal);

    // Size selection in modal
    $$('.size-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            $$('.size-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // ========== Newsletter ==========
    dom.newsletterForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = dom.newsletterEmail.value.trim();
        if (email) {
            showToast('Subscribed! 🎉', 'Welcome to the club! Check your inbox for 10% off.');
            dom.newsletterEmail.value = '';
        }
    });

    // ========== Keyboard Shortcuts ==========
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (dom.quickViewModal.classList.contains('active')) closeModal();
            else if (dom.cartSidebar.classList.contains('active')) closeCart();
            else if (dom.searchOverlay.classList.contains('active')) {
                dom.searchOverlay.classList.remove('active');
            }
        }
    });

    // ========== Intersection Observer — Scroll Animations ==========
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                scrollObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe product cards for staggered reveal
    $$('.product-card').forEach(card => {
        card.style.animationPlayState = 'paused';
        scrollObserver.observe(card);
    });

    // Observe sections for fade-in
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                sectionObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05 });

    $$('.section-header, .promo-card, .review-card, .newsletter-inner').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
        sectionObserver.observe(el);
    });

    // Apply visible styles
    const style = document.createElement('style');
    style.textContent = `.visible { opacity: 1 !important; transform: translateY(0) !important; }`;
    document.head.appendChild(style);

    // ========== Smooth Image Loading ==========
    $$('.product-image, .promo-image').forEach(img => {
        img.addEventListener('load', () => {
            img.style.opacity = '1';
        });
        if (img.complete) {
            img.style.opacity = '1';
        }
    });

    // ========== Performance: Preload critical resources ==========
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.as = 'image';
    preloadLink.href = 'images/hero-model.png';
    document.head.appendChild(preloadLink);

    // ========== Init ==========
    updateCartUI();
    console.log('🛍️ LUXE E-Commerce initialized');

})();
