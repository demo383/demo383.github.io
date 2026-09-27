const menuItems = [
  {id:'dabeli',name:'Dabeli Sandwich',cat:'street',price:8.5,desc:'Pressed potato patty in a toasted slider bun with roasted peanuts and pomegranate.',tags:['Vegetarian'],image:'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=800&q=85'},
  {id:'pavbhaji',name:'Pav Bhaji',cat:'street',price:10.5,desc:'Spiced potato, peas and carrots served with toasted slider buns.',tags:['Popular'],image:'https://images.unsplash.com/photo-1626132647523-66f7f1b3d4b0?auto=format&fit=crop&w=800&q=85'},
  {id:'chaat',name:'Chaat Papadi',cat:'street',price:9.5,desc:'Crisp papadi layered with tamarind and cilantro chutneys, yogurt, sev and masala.',tags:['Chaat'],image:'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=85'},
  {id:'idli',name:'Idli Sambhar',cat:'south',price:9.5,desc:'Soft idlis with lentil sambhar, coconut chutney and onion chutney.',tags:['South Indian'],image:'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=85'},
  {id:'dosa',name:'Masala Dosa',cat:'south',price:12,desc:'Crisp dosa with a warmly spiced potato and pea filling, chutney and sambhar.',tags:['Fan favorite'],image:'https://images.unsplash.com/photo-1630383249896-424e482c7898?auto=format&fit=crop&w=800&q=85'},
  {id:'mega',name:'Krishna’s Mega Dosa',cat:'south',price:16.5,desc:'A huge dosa made for the table — truly a sight to behold.',tags:['Signature'],image:'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=85'},
  {id:'paneer',name:'Paneer Tikka Masala',cat:'mains',price:14.5,desc:'Paneer in a rich tomato-forward sauce with warm spices and a creamy finish.',tags:['Vegetarian'],image:'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=85'},
  {id:'biriyani',name:'Paneer Biriyani',cat:'mains',price:15.5,desc:'Spiced basmati rice with paneer, onion and cauliflower, served with raita.',tags:['Basmati'],image:'https://images.unsplash.com/photo-1563379091339-03246963d5f5?auto=format&fit=crop&w=800&q=85'},
  {id:'manchurian',name:'Gobi Manchurian',cat:'mains',price:13.5,desc:'Crispy cauliflower with a savory soy-and-chili sauce, served with rice.',tags:['Fusion'],image:'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=85'},
  {id:'jalebi',name:'Jalebi',cat:'sweets',price:6.5,desc:'Crisp fried spirals glazed in a saffron syrup, served warm.',tags:['Sweet'],image:'https://images.unsplash.com/photo-1601302017917-26e95d3e5d67?auto=format&fit=crop&w=800&q=85'},
  {id:'lassi',name:'Mango Lassi',cat:'sweets',price:5.5,desc:'Thick yogurt-based shake flavored with pure mango pulp.',tags:['Cold drink'],image:'https://images.unsplash.com/photo-1615485925600-97237c4fc1ec?auto=format&fit=crop&w=800&q=85'},
  {id:'rasmalai',name:'Ras Malai',cat:'sweets',price:7,desc:'Soft paneer patties in sweetened milk with a fragrant cardamom finish.',tags:['Dessert'],image:'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=800&q=85'}
];

const categoryLabels = {street:'Street favorites',south:'South Indian',mains:'Mains',sweets:'Sweets & drinks'};
const state = {category:'all',cart:{}};

const imageFallback = 'assets/image-fallback.svg';
const originalImagePool = [
  'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1900&q=85',
  'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=900&q=90',
  'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=1100&q=90',
  'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=900&q=90',
  'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=700&q=90',
  'https://images.unsplash.com/photo-1613292443284-8d10ef9383f1?auto=format&fit=crop&w=700&q=90',
  'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=700&q=90'
];
const resolvedImageCache = new Map();
function resolveImage(url, extraFallbacks=[]){
  const candidates=[url,...extraFallbacks,...originalImagePool,imageFallback].filter((v,i,a)=>v&&a.indexOf(v)===i);
  if(resolvedImageCache.has(url)) return resolvedImageCache.get(url);
  const p=new Promise(resolve=>{
    let i=0;
    const next=()=>{
      const src=candidates[i++];
      if(!src) return resolve(imageFallback);
      const img=new Image();
      img.onload=()=>{resolvedImageCache.set(url,src);resolve(src)};
      img.onerror=next;
      img.src=src;
    };
    next();
  });
  resolvedImageCache.set(url,p);
  return p;
}
function applyBackground(el, url, extraFallbacks=[], overlay=''){
  if(!el) return;
  resolveImage(url,extraFallbacks).then(src=>{ el.style.backgroundImage=overlay ? overlay + ',url("'+src+'")' : 'url("'+src+'")'; });
}
function refreshStaticImages(){
  applyBackground(document.querySelector('.hero-bg'), 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1900&q=85', [], 'linear-gradient(90deg,rgba(45,23,19,.97) 0%,rgba(45,23,19,.76) 44%,rgba(45,23,19,.15) 100%)');
  applyBackground(document.querySelector('.hero-card-image'), 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=900&q=90');
  applyBackground(document.querySelector('.story-image'), 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=85', [], 'linear-gradient(180deg,rgba(82,42,26,.04),rgba(82,42,26,.28))');
  applyBackground(document.querySelector('.catering-main-image'), 'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=1100&q=90');
  const galleries=[
    ['.g1','https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=900&q=90'],
    ['.g2','https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=700&q=90'],
    ['.g3','https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=700&q=90'],
    ['.g4','https://images.unsplash.com/photo-1613292443284-8d10ef9383f1?auto=format&fit=crop&w=700&q=90'],
    ['.g5','https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=700&q=90']
  ];
  galleries.forEach(([sel,url])=>applyBackground(document.querySelector(sel),url));
}

const menuGrid = document.getElementById('menuGrid');
const cartDrawer = document.getElementById('cartDrawer');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const searchPanel = document.getElementById('searchPanel');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modalContent');
const toast = document.getElementById('toast');

const money = n => `$${n.toFixed(2)}`;
const findItem = id => menuItems.find(x=>x.id===id);

function renderMenu(){
  const items = state.category==='all' ? menuItems.slice(0,9) : menuItems.filter(x=>x.cat===state.category);
  menuGrid.innerHTML = items.map(item => `
    <article class="food-card">
      <div class="food-image" data-food-image="${item.id}" style="background-image:url('${item.image}')"></div>
      <div class="food-content">
        <div class="food-top"><h3 class="food-name">${item.name}</h3><span class="food-price">${money(item.price)}</span></div>
        <p class="food-desc">${item.desc}</p>
        <div class="food-tags">${item.tags.map(t=>`<span>${t}</span>`).join('')}</div>
        <button class="add-btn" data-add="${item.id}" type="button">Add to order <span>+</span></button>
      </div>
    </article>`).join('');
  menuGrid.querySelectorAll('[data-food-image]').forEach(el=>{
    const item=findItem(el.dataset.foodImage);
    resolveImage(item.image).then(src=>{el.style.backgroundImage=`url("${src}")`;});
  });
}

function renderCart(){
  const entries = Object.entries(state.cart);
  if(!entries.length){
    cartItems.innerHTML = '<div class="empty-cart"><strong>Your table is empty.</strong><p>Add a few favorites from the menu to see them here.</p></div>';
  } else {
    cartItems.innerHTML = entries.map(([id,qty])=>{
      const item=findItem(id);
      return `<div class="cart-row">
        <div class="cart-thumb" data-cart-image="${item.id}" style="background-image:url('${item.image}')"></div>
        <div><strong>${item.name}</strong><small>${money(item.price)} each</small><div class="qty-controls"><button type="button" data-dec="${id}">−</button><span>${qty}</span><button type="button" data-inc="${id}">+</button></div></div>
        <div class="cart-line-total">${money(item.price*qty)}</div>
      </div>`
    }).join('');
  }
  const totalQty=entries.reduce((a,[,q])=>a+q,0);
  const total=entries.reduce((a,[id,q])=>a+findItem(id).price*q,0);
  cartCount.textContent=totalQty;
  cartTotal.textContent=money(total);
  const mobileBar=document.getElementById('mobileOrderBar');
  const mobileQty=document.getElementById('mobileOrderCount');
  const mobileTotal=document.getElementById('mobileOrderTotal');
  if(mobileBar){
    mobileQty.textContent=totalQty; mobileTotal.textContent=money(total);
    mobileBar.classList.toggle('show', totalQty>0); mobileBar.setAttribute('aria-hidden',String(totalQty===0));
  }
  cartItems.querySelectorAll('[data-cart-image]').forEach(el=>{const item=findItem(el.dataset.cartImage);resolveImage(item.image).then(src=>el.style.backgroundImage=`url("${src}")`)});
}

function showToast(message){toast.textContent=message;toast.classList.add('show');clearTimeout(showToast.t);showToast.t=setTimeout(()=>toast.classList.remove('show'),1800)}
function persistCart(){try{localStorage.setItem('krishna-demo-cart',JSON.stringify(state.cart))}catch{}}
function addToCart(id){state.cart[id]=(state.cart[id]||0)+1;persistCart();renderCart();showToast(`${findItem(id).name} added to your order`)}
function changeQty(id,delta){state.cart[id]=(state.cart[id]||0)+delta;if(state.cart[id]<=0)delete state.cart[id];persistCart();renderCart()}
function openCart(){cartDrawer.classList.add('open');cartDrawer.setAttribute('aria-hidden','false')}
function closeCart(){cartDrawer.classList.remove('open');cartDrawer.setAttribute('aria-hidden','true')}
function openSearch(){searchPanel.classList.add('open');searchPanel.setAttribute('aria-hidden','false');document.body.classList.add('lock');setTimeout(()=>searchInput.focus(),50);runSearch()}
function closeSearch(){searchPanel.classList.remove('open');searchPanel.setAttribute('aria-hidden','true');document.body.classList.remove('lock')}

function runSearch(){
  const q=searchInput.value.trim().toLowerCase();
  const matches=q?menuItems.filter(x=>`${x.name} ${x.desc} ${x.tags.join(' ')}`.toLowerCase().includes(q)):menuItems.slice(0,5);
  searchResults.innerHTML=matches.length?matches.map(x=>`<div class="search-result"><div><strong>${x.name}</strong><div style="font-size:11px;color:#8f8278">${categoryLabels[x.cat]} · ${money(x.price)}</div></div><button type="button" data-search-add="${x.id}">Add +</button></div>`).join(''):'<div style="padding:15px 0;color:#8f8278">No matches yet — try “dosa”, “paneer”, or “sweet”.</div>';
}

function openModal(type){
  document.body.classList.add('lock');
  if(type==='catering'){
    modalContent.innerHTML=`<p class="eyebrow">Catering inquiry</p><h2>Let’s plan a <em>great table</em>.</h2><p style="color:#756b62;max-width:530px">This is a presentation demo form. Connect it to the restaurant’s email/CRM before launch.</p><form class="modal-form" id="cateringForm"><div class="two"><div><label>Name</label><input required name="name" placeholder="Your name"></div><div><label>Email</label><input required type="email" name="email" placeholder="you@example.com"></div></div><div class="two"><div><label>Event date</label><input required type="date" name="date"></div><div><label>Guest count</label><select name="guests"><option>10–30</option><option>31–50</option><option>51–100</option><option>100+</option><option>250+</option><option>500+</option><option>1000</option></select></div></div><div><label>Event type</label><select name="type"><option>Wedding / reception</option><option>Graduation</option><option>Puja / religious gathering</option><option>Business meeting</option><option>Birthday / family event</option><option>Other</option></select></div><div><label>Notes</label><textarea rows="4" name="notes" placeholder="Tell us about menu preferences, service style, or dietary needs..."></textarea></div><button class="btn btn-primary" type="submit">Send catering inquiry <span>→</span></button></form>`;
    document.getElementById('cateringForm').addEventListener('submit',e=>{e.preventDefault();closeModal();showToast('Demo inquiry captured — connect form to email/CRM at launch.');});
  } else if(type==='menu'){
    modalContent.innerHTML=`<p class="eyebrow">Full menu</p><h2>Pick your <em>favorites</em>.</h2><p style="color:#756b62">The demo menu is intentionally curated. The production version can load the complete dine-in, carryout, and catering menus from a CMS or ordering platform.</p><div style="display:grid;gap:10px;margin-top:20px">${menuItems.map(x=>`<div class="search-result"><div><strong>${x.name}</strong><div style="font-size:11px;color:#8f8278">${categoryLabels[x.cat]}</div></div><span style="font-weight:800">${money(x.price)}</span></div>`).join('')}</div>`;
  } else if(type==='checkout'){
    const total=Object.entries(state.cart).reduce((a,[id,q])=>a+findItem(id).price*q,0);
    modalContent.innerHTML=`<p class="eyebrow">Checkout</p><h2>Order <em>demo</em>.</h2><p style="color:#756b62">Total today: <strong>${money(total)}</strong>. Connect this step to the restaurant’s real ordering provider before launch.</p><form class="modal-form" id="checkoutForm"><div class="two"><div><label>Name</label><input required name="name" placeholder="Your name"></div><div><label>Phone</label><input required name="phone" placeholder="(555) 555-5555"></div></div><div><label>Pickup</label><select><option>Carryout — Farmington Hills</option><option>Drive-thru pickup</option></select></div><div><label>Special notes</label><textarea rows="3" placeholder="No onion / garlic, spice preference, timing..."></textarea></div><button class="btn btn-primary" type="submit">Place demo order <span>✓</span></button></form>`;
    document.getElementById('checkoutForm').addEventListener('submit',e=>{e.preventDefault();state.cart={};renderCart();closeModal();closeCart();showToast('Demo order placed — payment is not connected.');});
  }
  modal.classList.add('open');modal.setAttribute('aria-hidden','false');
}
function closeModal(){modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.classList.remove('lock')}

document.addEventListener('click', e=>{
  const tab=e.target.closest('.category-tabs button');
  if(tab){document.querySelectorAll('.category-tabs button').forEach(b=>b.classList.remove('active'));tab.classList.add('active');state.category=tab.dataset.category;renderMenu();}
  const add=e.target.closest('[data-add]'); if(add){addToCart(add.dataset.add);}
  const inc=e.target.closest('[data-inc]'); if(inc){changeQty(inc.dataset.inc,1);}
  const dec=e.target.closest('[data-dec]'); if(dec){changeQty(dec.dataset.dec,-1);}
  const searchAdd=e.target.closest('[data-search-add]'); if(searchAdd){addToCart(searchAdd.dataset.searchAdd);openCart();}
});

document.getElementById('cartBtn').addEventListener('click',openCart);
const mobileMenuBtn=document.getElementById('mobileMenuBtn'), mobileNav=document.getElementById('mobileNav');
if(mobileMenuBtn){mobileMenuBtn.addEventListener('click',()=>{const open=!mobileNav.classList.contains('open');mobileNav.classList.toggle('open',open);mobileMenuBtn.setAttribute('aria-expanded',String(open));mobileNav.setAttribute('aria-hidden',String(!open));});mobileNav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{mobileNav.classList.remove('open');mobileMenuBtn.setAttribute('aria-expanded','false');mobileNav.setAttribute('aria-hidden','true');}));}
const mobileOrderBtn=document.getElementById('mobileOrderBtn'); if(mobileOrderBtn) mobileOrderBtn.addEventListener('click',openCart);
document.getElementById('cartClose').addEventListener('click',closeCart);
document.getElementById('searchBtn').addEventListener('click',openSearch);
document.getElementById('searchClose').addEventListener('click',closeSearch);
document.getElementById('searchInput').addEventListener('input',runSearch);
document.getElementById('openMenuBtn').addEventListener('click',()=>openModal('menu'));
document.getElementById('cateringBtn').addEventListener('click',()=>openModal('catering'));
document.getElementById('checkoutBtn').addEventListener('click',()=>{if(!Object.keys(state.cart).length){showToast('Add something delicious first.');return;}openModal('checkout')});
modal.addEventListener('click',e=>{if(e.target.classList.contains('modal-backdrop')||e.target.id==='modalClose')closeModal()});
searchPanel.addEventListener('click',e=>{if(e.target===searchPanel)closeSearch()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeSearch();closeModal();closeCart(); if(mobileNav){mobileNav.classList.remove('open');mobileMenuBtn.setAttribute('aria-expanded','false');}}});
try{state.cart=JSON.parse(localStorage.getItem('krishna-demo-cart')||'{}')||{}}catch{state.cart={}}
refreshStaticImages();
renderMenu();renderCart();
