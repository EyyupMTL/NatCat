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

          // Post içeriğini geçici div'e yerleştir
          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = post.content;

          // İçerideki tüm resimleri al
          const images = tempDiv.querySelectorAll("img");

          // Sadece yazı içeriği
          const textOnly = tempDiv.cloneNode(true);
          textOnly.querySelectorAll("img").forEach(img => img.remove());

         postContainer.innerHTML = `
  <h1>${post.title}</h1>
<div style="
  display:inline-block;
  padding:6px 12px;
  border:2px solid #4CAF50;
  color:#4CAF50;
  border-radius:8px;
  margin:5px 0 15px 0;
  font-size:14px;
  font-weight:600;
">
  Paylaşan: ${post.author}
</div>

  <!-- Tarih normal -->
  <p><em>${post.date}</em></p>

  
   

  <!-- ANA RESİM -->
  <img src="${post.cover}" id="main-post-image"
       style="width:100%;border-radius:15px;cursor:pointer;margin-bottom:20px;">

  <!-- Yazılar -->
  <div id="post-text">
    ${textOnly.innerHTML}
  </div>

  <!-- Gizli resimler -->
  <div id="hidden-images" style="display:none;"></div>
`;

          // Gizli image alanına resimleri ekle
          const hiddenDiv = document.getElementById("hidden-images");
          images.forEach(img => hiddenDiv.appendChild(img));
        }
        else {
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

  // ---------- Yorum Sistemi ----------
  const commentForm = document.getElementById("comment-form");
  const commentsDiv = document.getElementById("comments");

  if(commentForm){
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'));

    function loadComments(){
      const saved = JSON.parse(localStorage.getItem("comments_" + id)) || [];
      commentsDiv.innerHTML = "";

      if(saved.length === 0){
        commentsDiv.innerHTML = "<p>Henüz yorum yok.</p>";
        return;
      }

      saved.forEach(c => {
        const div = document.createElement("div");
        div.classList.add("comment");
        div.innerHTML = `
          <p><strong>${c.name}</strong> <em>${c.date}</em></p>
          <p>${c.text}</p>
          <hr>
        `;
        commentsDiv.appendChild(div);
      });
    }

    loadComments();

    commentForm.addEventListener("submit", function(e){
      e.preventDefault();

      const name = document.getElementById("comment-name").value.trim();
      const text = document.getElementById("comment-text").value.trim();
      const date = new Date().toLocaleString();

      if(text === "") return;

      const comment = {
        name: name || "Anonim",
        text,
        date
      };

      const saved = JSON.parse(localStorage.getItem("comments_" + id)) || [];
      saved.push(comment);

      localStorage.setItem("comments_" + id, JSON.stringify(saved));

      commentForm.reset();
      loadComments();
    });
  }

});

/* ----------------- LIGHTBOX SİSTEMİ ------------------ */
document.addEventListener("DOMContentLoaded", () => {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const closeBtn = document.querySelector(".close-btn");
  const leftBtn = document.querySelector(".nav-btn.left");
  const rightBtn = document.querySelector(".nav-btn.right");

  let images = [];
  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    lightboxImg.src = images[currentIndex].src;
    lightbox.style.display = "flex";
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % images.length;
    lightboxImg.src = images[currentIndex].src;
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    lightboxImg.src = images[currentIndex].src;
  }

  function closeLightbox() {
    lightbox.style.display = "none";
  }

  // Gizli resimleri al
  setTimeout(() => {
    const hidden = document.querySelectorAll("#hidden-images img");
    images = Array.from(hidden);

    const mainImage = document.getElementById("main-post-image");

    if (mainImage && images.length > 0) {
      mainImage.addEventListener("click", () => openLightbox(0));
    }
  }, 500);

  rightBtn.addEventListener("click", showNext);
  leftBtn.addEventListener("click", showPrev);
  closeBtn.addEventListener("click", closeLightbox);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") showNext();
    if (e.key === "ArrowLeft") showPrev();
  });

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
});
