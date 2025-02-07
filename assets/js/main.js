// Initialize AOS
AOS.init({
    duration: 1000,
    once: true,
    easing: "ease",
  });
  
  // Navbar scroll behavior
  const navbar = document.querySelector(".navbar");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("shadow-sm");
      navbar.style.backgroundColor = "#ffffff";
    } else {
      navbar.classList.remove("shadow-sm");
      navbar.style.backgroundColor = "transparent";
    }
  });
  
  // Smooth scroll for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 70,
          behavior: "smooth",
        });
      }
    });
  });
  
  // Active link highlighting
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-link");
  
  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollY >= sectionTop - 150) {
        current = section.getAttribute("id");
      }
    });
  
    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href").includes(current)) {
        link.classList.add("active");
      }
    });
  });
  
  // Form validation
  const contactForm = document.querySelector(".contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      // Add your form submission logic here
      alert("Pesan Anda telah terkirim! Kami akan segera menghubungi Anda.");
      this.reset();
    });
  }
  
  // Hero image hover effect
  const heroImage = document.querySelector(".hero-image");
  heroImage.addEventListener("mousemove", (e) => {
    const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
    const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
    heroImage.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
  });
  
  heroImage.addEventListener("mouseleave", () => {
    heroImage.style.transform = "rotateY(0) rotateX(0)";
  });
  