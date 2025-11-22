document.addEventListener('DOMContentLoaded', () => {

  // Blog verileri
  const posts = [
     {
      "id": 1,
      "title": "Ben Kimim?",
      "date": "2025-22-11",
      "summary": "Ben Kimim?",
      "cover": "assets/kimimben.jpg",
       "content": "<p>Ben 14 yşinda bir yazılım öğrenmeye çaışan biriyim. Birsürü oyun denemem,Site denemem ve uygulama denemelerim oldu. Ama hala kendimi geliştirmeye çalışıyorum Ve burda yaptigim bütün Oyunalrımı,sitelerimi ve kodlarımı burda paylaşacağım.</p><img src='assets/foto1.jpg' style='width:100%; border-radius:10px;'><img src='assets/foto2.jpg' style='width:100%; border-radius:10px;'>",
      "link": "post.html?id=1",
      "linkText": "Daha Fazla."
    },
     {
    id: 2,
    title: "Maze Naze",
    date: "2025-11-22",
    summary: "Yaptığım Maze Naze Oyununu İndir.",
    cover: "assets/MazeNaze.jpg",
    content: `
      <p>İlk Yaptığım Oyunlardan Olan Maze Naze'yi İndir!</p>

      <img src="assets/foto1.jpg" style="width:100%; border-radius:10px; margin-bottom:10px;">
      <img src="assets/foto2.jpg" style="width:100%; border-radius:10px; margin-bottom:10px;">
      <img src="assets/foto3.jpg" style="width:100%; border-radius:10px; margin-bottom:10px;">
      <img src="assets/foto4.jpg" style="width:100%; border-radius:10px; margin-bottom:10px;">

      <p style="margin-top:15px;">
        <a href="assets/proje-dosyasi.zip" download style="font-weight:bold; color:#0077ff;">
          📁 Proje dosyalarını indir (ZIP)
        </a>
      </p>
    `,
    link: "post.html?id=2",
    linkText: "Oyunu İndir!"
  }

  ];

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
        <a href="post.html?id=${post.id}">Devamını Oku</a>
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
          <a href="post.html?id=${post.id}">Devamını Oku</a>
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
