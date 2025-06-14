let cart = [];

const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');
const cartButton = document.getElementById('cart-button');
const cartModal = document.getElementById('cart-modal');
const closeCart = document.getElementById('close-cart');
const cartItems = document.getElementById('cart-items');
const cartEmpty = document.getElementById('cart-empty');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.getElementById('cart-count');
const sendWhatsApp = document.getElementById('send-whatsapp');
const payMercadoPago = document.getElementById('pay-mercadopago');

// Toggle menú y cambio de ícono
menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  menuToggle.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
});

// Cerrar menú al hacer clic en un enlace
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    menuToggle.textContent = '☰';
  });
});

// Funciones del carrito
function addToCart(product) {
  cart.push(product);
  updateCart();
  showToast(`${product.name} agregado al carrito`);
}

function removeFromCart(index) {
  const productName = cart[index].name;
  cart.splice(index, 1);
  updateCart();
  showToast(`${productName} eliminado del carrito`);
}

function updateCart() {
  cartItems.innerHTML = '';
  let total = 0;
  if (cart.length === 0) {
    cartEmpty.classList.remove('hidden');
    cartItems.classList.add('hidden');
  } else {
    cartEmpty.classList.add('hidden');
    cartItems.classList.remove('hidden');
    cart.forEach((item, index) => {
      const itemElement = document.createElement('div');
      itemElement.className = 'cart-item';
      itemElement.innerHTML = `
        <span>${item.name} - $${item.price} ARS</span>
        <button onclick="removeFromCart(${index})">Eliminar</button>
      `;
      cartItems.appendChild(itemElement);
      total += item.price;
    });
  }
  cartCount.textContent = cart.length;
  cartTotal.textContent = `Total: $${total} ARS`;
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

cartButton.addEventListener('click', () => {
  cartModal.classList.remove('hidden');
});

closeCart.addEventListener('click', () => {
  cartModal.classList.add('hidden');
});

sendWhatsApp.addEventListener('click', () => {
  let message = 'Pedido de Mercería La Plaza:\n';
  cart.forEach(item => {
    message += `- ${item.name}: $${item.price} ARS\n`;
  });
  message += `Total: $${cart.reduce((sum, item) => sum + item.price, 0)} ARS`;
  const url = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
});

payMercadoPago.addEventListener('click', () => {
  alert('Redirigiendo a Mercado Pago... (Funcionalidad simulada)');
});

// Splash screen
window.addEventListener('load', () => {
  const splash = document.getElementById('splash');
  if (splash) {
    setTimeout(() => {
      splash.classList.add('fade-out');
      setTimeout(() => splash.remove(), 600);
    }, 1000);
  }

  // Registrar el service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/js/service-worker.js')
      .then(reg => console.log('Service Worker registrado', reg))
      .catch(err => console.error('Error al registrar el Service Worker', err));
  }
  
});

// PWA Install
let deferredPrompt;
const installBanner = document.getElementById('install-banner');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBanner.classList.remove('hidden');

  installBanner.addEventListener('click', () => {
    installBanner.classList.add('hidden');
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(choice => {
      if (choice.outcome === 'accepted') {
        console.log('Usuario aceptó instalar la app');
      } else {
        console.log('Usuario rechazó la instalación');
      }
      deferredPrompt = null;
    });
  });
});

