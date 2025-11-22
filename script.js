document.addEventListener('DOMContentLoaded', () => {

  // ---------- JSON'dan Veriyi Çek ----------
  fetch('posts.json')
    .then(response => response.json())
    .then(posts => {

      // ---------- Blog Listeleme ----------
      const blogGrid = document.getElementById('blog-grid') || document.getElementById('blog-list');
      if(blogGrid){
        posts.forEach(post => {
          const card = document.createElement('div');
          card.classList.add('blog-card');
          card.innerHTML = `
            <img src="${post.cover}" alt="${post.title}" class="cover">
            <h3>${post.title}</h3>
            <p>${post.summary}</p>
            <a href="post.html?id=${post.id}">${post.linkText}</a>
          `;
          blogGrid.appendChild(card);
        });
      }

      // ---------- Arama ----------
      const searchInput = document.getElementById("blog-search");
      if(searchInput){
        searchInput.addEventListener("input", () => {
          const query = searchInput.value.toLowerCase();
          const filtered = posts.filter(post => post.title.toLowerCase().includes(query));
          blogGrid.innerHTML = "";
          filtered.forEach(post => {
            const card = document.createElement('div');
            card.classList.add('blog-card');
            card.innerHTML = `
              <img src="${post.cover}" alt="${post.title}" class="cover">
              <h3>${post.title}</h3>
              <p>${post.summary}</p>
              <a href="post.html?id=${post.id}">${post.linkText}</a>
            `;
            blogGrid.appendChild(card);
          });
        });
      }

      // ---------- Post Sayfası ----------
      const postContainer = document.querySelector('.post-container');
      if(postContainer){
        const params = new URLSearchParams(window.location.search);
        const id = parseInt(params.get('id'));
        const post = posts.find(p => p.id === id);
        if(post){
          postContainer.innerHTML = `
            <h1>${post.title}</h1>
            <p><em>${post.date}</em></p>
            ${post.content}
          `;
        } else {
          postContainer.innerHTML = "<p>Gönderi bulunamadı.</p>";
        }
      }

    })
    .catch(err => console.error('JSON yüklenirken hata:', err));

  // ---------- Hamburger ----------
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("nav-menu");
  if(hamburger){
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");
    });
  }

  // ---------- Contact Form ----------
  const contactForm = document.getElementById("contact-form");
  if(contactForm){
    contactForm.addEventListener("submit", function(e){
      e.preventDefault();
      const name = this.name.value;
      const email = this.email.value;
      const message = this.message.value;
      const subject = encodeURIComponent(`İletişim Formu Mesajı: ${name}`);
      const body = encodeURIComponent(`Ad: ${name}\nEmail: ${email}\nMesaj:\n${message}`);
      window.location.href = `mailto:seningmail@gmail.com?subject=${subject}&body=${body}`;
      const status = document.getElementById("form-status");
      if(status) status.textContent = "Mailiniz açılıyor...";
    });
  }

});
