function toggleChatbot() {
  const body = document.getElementById('chatbot-body');
  body.style.display = body.style.display === 'none' ? 'block' : 'none';
}

function sendPredefinedMsg(text) {
  addUserMessage(text);
  botReply(getBotResponse(text));
}

function addUserMessage(text) {
  const container = document.getElementById('chatbot-messages');
  const msg = document.createElement('div');
  msg.classList.add('user-message');
  msg.textContent = text;
  container.appendChild(msg);
  container.scrollTop = container.scrollHeight;
}

function botReply(text) {
  const container = document.getElementById('chatbot-messages');
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

function sendUserMessage(event) {
  event.preventDefault();
  const name = document.getElementById('user-name').value.trim();
  const message = document.getElementById('user-message').value.trim();
  if (!name || !message) {
    alert('Por favor completá tu nombre y consulta.');
    return false;
  }
  const whatsappNumber = '1234567890'; // Actualiza con el número real
  const text = `Hola, soy ${name} y quiero consultar: ${message}`;
  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
  document.getElementById('user-name').value = '';
  document.getElementById('user-message').value = '';
  toggleChatbot();
  return false;
}