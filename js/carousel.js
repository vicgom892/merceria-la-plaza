 // Carrusel de Testimonios
    const testimonialsWrapper = document.querySelector('.testimonials-wrapper');
    const testimonials = document.querySelectorAll('.testimonial');
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');
    const dots = document.querySelectorAll('.dot');
    let currentIndex = 0;

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