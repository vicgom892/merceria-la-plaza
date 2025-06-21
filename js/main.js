let cart = [];

const page = document.body.getAttribute('data-page');

// Elementos comunes - si existen
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

if(menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      menuToggle.textContent = '☰';
    });
  });
}

// --- Código carrito (en páginas donde exista) ---
if(cartButton && cartModal && closeCart && cartItems && cartEmpty && cartTotal && cartCount && sendWhatsApp && payMercadoPago) {

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
    alert('Redirigiendo a Mercado Pago... (Proximamente)');
  });

  // Hacer global para poder llamar desde onclick inline en HTML
  window.addToCart = addToCart;
  window.removeFromCart = removeFromCart;
}

// --- Código para splash screen y service worker (todas las páginas) ---
window.addEventListener('load', () => {
  const splash = document.getElementById('splash');
  if (splash) {
    setTimeout(() => {
      splash.classList.add('fade-out');
      setTimeout(() => splash.remove(), 600);
    }, 1000);
  }

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js')
      .then(reg => console.log('Service Worker registrado', reg))
      .catch(err => console.error('Error al registrar el Service Worker', err));
  }
});

// --- PWA Install banner ---
let deferredPrompt;

window.addEventListener("beforeinstallprompt", e => {
  console.log("▶️ beforeinstallprompt fired");
  e.preventDefault();
  deferredPrompt = e;
  const btn = document.getElementById("install-button");
  if (btn) {
    btn.hidden = false;
    btn.addEventListener("click", async () => {
      btn.hidden = true;
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log("Install outcome:", outcome);
      deferredPrompt = null;
    });
  }
});

window.addEventListener("appinstalled", () => {
  console.log("✅ App installed");
});


// --- Código específico para la página "index" ---
if(['index', 'hilos', 'estampados'].includes(page)) {
  // Carrusel testimonios
  const testimonialsWrapper = document.querySelector('.testimonials-wrapper');
  const testimonials = document.querySelectorAll('.testimonial');
  const prevButton = document.querySelector('.prev');
  const nextButton = document.querySelector('.next');
  const dots = document.querySelectorAll('.dot');
  let currentIndex = 0;

  if(testimonialsWrapper && prevButton && nextButton && dots.length) {
    function updateTestimonials() {
      testimonialsWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    }

    prevButton.addEventListener('click', () => {
      currentIndex = (currentIndex === 0) ? testimonials.length - 1 : currentIndex - 1;
      updateTestimonials();
    });

    nextButton.addEventListener('click', () => {
      currentIndex = (currentIndex === testimonials.length - 1) ? 0 : currentIndex + 1;
      updateTestimonials();
    });

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        currentIndex = index;
        updateTestimonials();
      });
    });

    // Auto-avance cada 5 segundos
    setInterval(() => {
      currentIndex = (currentIndex === testimonials.length - 1) ? 0 : currentIndex + 1;
      updateTestimonials();
    }, 5000);
  }
  
  // Chatbot toggle
  window.toggleChatbot = function() {
    const body = document.getElementById('chatbot-body');
    if(body) {
      body.style.display = body.style.display === 'none' ? 'block' : 'none';
    }
  };

  // Funciones chatbot
  window.sendPredefinedMsg = function(text) {
    addUserMessage(text);
    botReply(getBotResponse(text));
  };

  function addUserMessage(text) {
    const container = document.getElementById('chatbot-messages');
    if(!container) return;
    const msg = document.createElement('div');
    msg.classList.add('user-message');
    msg.textContent = text;
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;
  }

  function botReply(text) {
    const container = document.getElementById('chatbot-messages');
    if(!container) return;
    const msg = document.createElement('div');
    msg.classList.add('bot-message');
    msg.textContent = text;
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;
  }

  function getBotResponse(userText) {
    const responses = {
      '¿Cuáles son los combos disponibles?': 'Ofrecemos combos de hilos y telas a partir de $500. ¡Consulta en WhatsApp para personalizar tu combo!',
      '¿Hacen envíos sin cargo?': 'Envíos gratis en compras superiores a $5000 en General Rodríguez. Otros destinos, consulta costos.',
      '¿Cuál es el horario de atención?': 'Atendemos de lunes a sábado de 09:00 a 18:00.',
      '¿Cuál es la forma de pago?': 'Aceptamos débito, crédito, Mercado Pago y transferencias bancarias.'
    };
    return responses[userText] || 'Disculpá, no entendí tu consulta. Por favor, escribila abajo y te responderemos por WhatsApp.';
  }

  window.sendUserMessage = function(event) {
    event.preventDefault();
    const name = document.getElementById('user-name')?.value.trim();
    const message = document.getElementById('user-message')?.value.trim();
    if (!name || !message) {
      alert('Por favor completá tu nombre y consulta.');
      return false;
    }
    const whatsappNumber = '1234567890'; // Actualiza con el número real
    const text = `Hola, soy ${name} y quiero consultar: ${message}`;
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    if(document.getElementById('user-name')) document.getElementById('user-name').value = '';
    if(document.getElementById('user-message')) document.getElementById('user-message').value = '';
    window.toggleChatbot();
    return false;
  };
}

// --- Código para modal imágenes en páginas que lo tengan ---
if(page === 'estampados' || page === 'index') {
  const imagenes = document.querySelectorAll('.producto img');
  const modal = document.getElementById('modal');
  const modalImg = document.getElementById('modalImg');
  const closeModal = document.getElementById('closeModal');

  if(imagenes.length && modal && modalImg && closeModal) {
    imagenes.forEach(img => {
      img.addEventListener('click', () => {
        modal.style.display = 'flex';
        modalImg.src = img.src;
      });
    });

    closeModal.addEventListener('click', () => {
      modal.style.display = 'none';
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });
  }
}
document.addEventListener("DOMContentLoaded", () => {
  const volverBtn = document.querySelector('.btn-volver-arriba');

  if (volverBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        volverBtn.classList.add('visible');
      } else {
        volverBtn.classList.remove('visible');
      }
    });
  }
});




