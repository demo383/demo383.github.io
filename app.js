/* KURRY'S NEXT: standalone interactive design concept. No real payments or order transmission. */
(() => {
  'use strict';
  const $ = sel => document.querySelector(sel);
  const $$ = sel => [...document.querySelectorAll(sel)];
  const LOC = KURRYS_LOCATIONS;
  const COMMONS = file => 'https://commons.wikimedia.org/wiki/Special:Redirect/file/' + encodeURIComponent(file) + '?width=900';
  // Photographs are free-to-use sources; links and license at photo-credits.html.
  // They are representative photography, not photographs of Kurry's individual dishes.
  const IMAGES = {
    biryani:'https://images.unsplash.com/photo-1563379091339-03246963d5f5?auto=format&fit=crop&w=900&q=85',
    curry:'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=900&q=85',
    paneer:'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=900&q=85',
    appetizers:'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=85',
    tandoor:'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=900&q=85',
    dosa:'https://images.unsplash.com/photo-1630383249896-424e482c7898?auto=format&fit=crop&w=900&q=85',
    bread:'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?auto=format&fit=crop&w=900&q=85',
    chinese:'https://images.unsplash.com/photo-1613292443284-8d10ef9383f1?auto=format&fit=crop&w=900&q=85',
    desserts:'https://images.unsplash.com/photo-1601302017917-26e95d3e5d67?auto=format&fit=crop&w=900&q=85',
    drinks:'https://images.unsplash.com/photo-1615485925600-97237c4fc1ec?auto=format&fit=crop&w=900&q=85'
  };
  Object.assign(IMAGES, window.KURRYS_LOCAL_PHOTOS || {});
  const FALLBACK_REAL_PHOTO = IMAGES.curry;
  const CATEGORY_TITLE = {all:'All dishes',biryani:'Biryani & rice',curry:'Curries',appetizers:'Appetizers',tandoor:'From the tandoor',dosa:'South Indian favorites',chinese:'Indo-Chinese',bread:'Indian breads',desserts:'Desserts',drinks:'Beverages'};
  const FILTERS = [...CATEGORIES];
  const money = n => '$' + Number(n).toFixed(2);
  const safe = str => String(str == null ? '' : str).replace(/[&<>"']/g, x => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
  const price = n => Math.round(n * 100) / 100;
  const memoryStore = {};
  const storage = (key, fallback) => {try{const raw=localStorage.getItem(key);return raw === null ? (key in memoryStore?memoryStore[key]:fallback) : JSON.parse(raw)}catch{return key in memoryStore?memoryStore[key]:fallback}};
  const save = (key,value) => {memoryStore[key]=value;try{localStorage.setItem(key,JSON.stringify(value))}catch{/* private mode: retains session-only state */}};
  let branch = ['troy','farmington'].includes(storage('kn_branch','farmington')) ? storage('kn_branch','farmington') : 'farmington';
  let mode = ['dine','pickup'].includes(storage('kn_mode','dine')) ? storage('kn_mode','dine') : 'dine';
  let details = storage('kn_details',{table:'',guests:2});
  if (!details || typeof details !== 'object') details={table:'',guests:2};
  let currentCategory = 'all', search = '', vegOnly = false, featuredOnly = false, pageSize = 9;
  let selectedDish = null, qty = 1, toastTimer;
  const panels = ['choicePanel','setupPanel','deliveryPanel','cartDrawer','dishPanel','checkoutPanel','cateringPanel'];
  function getCart() {const x=storage(`kn_cart_${branch}_${mode}`,[]);return Array.isArray(x)?x:[]}
  function setCart(x) {save(`kn_cart_${branch}_${mode}`,x);renderCart()}
  const count = list => list.reduce((a,x)=>a+x.qty,0);
  const total = list => price(list.reduce((a,x)=>a+x.price*x.qty,0));
  const locName = () => LOC[branch].name;
  function notify(msg) {const el=$('#toast');el.textContent=msg;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),3100)}
  function open(id) {panels.forEach(x=>$('#'+x).hidden=true);$('#'+id).hidden=false;$('#overlay').hidden=false;document.body.style.overflow='hidden';const f=$('#'+id).querySelector('button, input');if(f) setTimeout(()=>f.focus({preventScroll:true}),30)}
  function close() {panels.forEach(id=>$('#'+id).hidden=true);$('#overlay').hidden=true;document.body.style.overflow='';}
  function setBranch(next) {if(!LOC[next])return;branch=next;save('kn_branch',branch);renderAll();close();notify(`Now browsing Kurry's ${locName()}`)}
  function setMode(next,withSetup=true){
    if(next==='delivery') {renderDelivery();open('deliveryPanel');return}
    mode=next;save('kn_mode',mode);renderAll();
    if(!withSetup){notify(next==='dine'?'Dine-in menu selected':'Pickup menu selected');return}
    $('#setupEyebrow').textContent=next==='dine'?'THE TABLE IS YOURS':'GRAB SOMETHING GOOD';
    $('#setupTitle').innerHTML=next==='dine'?'Dine in,<br>your way.':'Pickup,<br>made simple.';
    $('#setupLead').textContent=next==='dine'?'Browse the menu while planning your visit or ordering from a table.':'Set your pickup location and browse your favorite dishes.';
    $('#setupBranch').value=branch;$('#setupGuests').value=String(details.guests||2);$('#setupTable').value=details.table||'';
    $('#setupGuests').closest('.double-field').hidden=next!=='dine';$('#dineSetupNote').hidden=next!=='dine';
    $('#setupSubmit').innerHTML=next==='dine'?'Explore dine-in menu <span>↗</span>':'Explore pickup menu <span>↗</span>';
    open('setupPanel');
  }
  function photoFor(dish) {return IMAGES[dish.photo]||IMAGES[dish.category]||IMAGES.curry}
  function imgElement(src,alt,loading='lazy') {return `<img src="${safe(src)}" loading="${loading}" alt="${safe(alt)}" data-fallback-photo="true">`}
  function renderCategories() {$('#categoryStack').innerHTML=FILTERS.map(([key,label])=>`<button type="button" data-category="${key}" class="category-button ${currentCategory===key?'active':''}" aria-pressed="${currentCategory===key}">${safe(label)} <span>↗</span></button>`).join('')}
  function filteredMenu(){return MENU_ITEMS.filter(d=> (currentCategory==='all'||d.category===currentCategory) &&(!vegOnly||d.veg)&&(!featuredOnly||d.featured)&&(!search||`${d.name} ${d.description} ${d.category}`.toLowerCase().includes(search)))}
  function renderMenu(){
    renderCategories();const items=filteredMenu();$('#menuCategoryHeading').textContent=search?`Results for “${$('#menuSearch').value.trim()}”`:CATEGORY_TITLE[currentCategory];
    $('#menuResultsCount').textContent=`${items.length} ${items.length===1?'DISH':'DISHES'}`;$('#modeContext').textContent=`${mode==='dine'?'DINE IN':'PICKUP'} · ${locName().toUpperCase()} · DEMO`;
    $('#menuGrid').innerHTML=items.slice(0,pageSize).map((d,i)=>`<article class="dish-card"><div class="dish-image">${imgElement(photoFor(d),`Representative photograph for ${d.category} dishes`)}<span class="diet-badge ${d.veg?'veg':'nonveg'}">${d.veg?'● VEG':'● NON-VEG'}</span></div><div class="dish-card-content"><span class="dish-category">${safe(CATEGORY_TITLE[d.category]||d.category)}${d.featured?' · POPULAR':''}</span><h4>${safe(d.name)}</h4><p>${safe(d.description)}</p><div class="dish-card-bottom"><b>${money(d.price)}</b><button data-dish="${d.id}" type="button" aria-label="Customize ${safe(d.name)}">ADD +</button></div></div></article>`).join('');
    $('#loadMore').hidden=items.length<=pageSize;$('#emptyMenu').hidden=items.length!==0;
    $$('#menuGrid img[data-fallback-photo]').forEach(el=>el.addEventListener('error',imageError,{once:true}));
  }
  function imageError(e){const img=e.target;if(img.dataset.retried)return;img.dataset.retried='yes';if(img.src!==FALLBACK_REAL_PHOTO)img.src=FALLBACK_REAL_PHOTO}
  function renderLocations(){
    const list=[LOC.farmington,LOC.troy];
    $('#locationGrid').innerHTML=list.map((l,i)=>`<article class="location-card ${l.key===branch?'selected':''}" data-number="0${i+1}"><div class="loc-top"><strong>${l.key===branch?'CURRENT LOCATION':'VISIT THIS LOCATION'}</strong><span>0${i+1} / MI</span></div><div><h3>${l.name==='Farmington Hills'?'FARMINGTON<br>HILLS.':'TROY.'}</h3><p>${safe(l.address)}<br>${safe(l.city)}<br><a href="tel:${l.tel}">${safe(l.phone)}</a></p><div class="loc-buttons"><button type="button" data-branch="${l.key}">${l.key===branch?'SELECTED ✓':'SELECT LOCATION ↗'}</button><a href="${safe(l.map)}" target="_blank" rel="noopener noreferrer">DIRECTIONS ↗</a><a href="tel:${l.tel}">CALL ↗</a></div></div></article>`).join('');
    $('#branchOptions').innerHTML=list.map(l=>`<button type="button" class="branch-option ${l.key===branch?'active':''}" data-branch="${l.key}"><span><strong>${safe(l.name)}</strong><small>${safe(l.address)}, ${safe(l.city)}</small></span><span>↗</span></button>`).join('');
  }
  function renderDelivery(){ $('#deliveryBranchOptions').innerHTML=[LOC.farmington,LOC.troy].map(l=>`<a class="branch-option" href="${safe(l.order)}" target="_blank" rel="noopener noreferrer" data-delivery-link="${l.key}"><span><strong>${safe(l.name)}</strong><small>Open external ordering partner · availability varies</small></span><span>↗</span></a>`).join('') }
  function renderCart(){
    const c=getCart(),num=count(c),sum=total(c);
    $('#currentBranch').textContent=locName().toUpperCase();$('#cartCount').textContent=num;$('#cartBranchLabel').textContent=locName().toUpperCase();$('#cartModeLabel').textContent=mode==='dine'?'DINE IN'+(details.table?' · TABLE '+details.table:''):'PICKUP';
    $('#cartSubtotal').textContent=money(sum);$('#checkoutTotal').textContent=money(sum);$('#mobileCartCount').textContent=num;$('#mobileCartTotal').textContent=money(sum);$('#mobileCart').hidden=num===0;$('#checkoutOpen').disabled=!num;
    $('#cartLines').innerHTML=c.length?c.map(x=>`<article class="cart-line"><div><h4>${safe(x.name)}</h4><p>${safe(x.spice)} heat${x.notes?' · '+safe(x.notes):''}</p><div class="cart-line-controls"><button type="button" data-cartminus="${safe(x.key)}" aria-label="Remove one ${safe(x.name)}">−</button><span>${x.qty}</span><button type="button" data-cartplus="${safe(x.key)}" aria-label="Add one ${safe(x.name)}">+</button><button type="button" class="remove" data-cartremove="${safe(x.key)}">REMOVE</button></div></div><strong>${money(x.price*x.qty)}</strong></article>`).join(''):`<div class="cart-empty"><span>✳</span><h3>Your basket is<br>waiting.</h3><p>Add some of your favorite dishes to get things going.</p><a href="#menu" class="action action--ink" id="emptyMenuLink">EXPLORE MENU ↗</a></div>`;
  }
  function renderAll(){renderMenu();renderLocations();renderCart()}
  function openDish(id){const d=MENU_ITEMS.find(x=>x.id===id);if(!d)return;selectedDish=d;qty=1;$('#dishImage').src=photoFor(d);$('#dishImage').alt='Representative food photography for '+d.name;$('#dishImage').dataset.retried='';$('#dishImage').onerror=imageError;$('#dishType').textContent=(d.veg?'● VEGETARIAN · ':'● NON-VEGETARIAN · ')+(CATEGORY_TITLE[d.category]||d.category).toUpperCase();$('#dishTitle').textContent=d.name;$('#dishDescription').textContent=d.description;$('#dishNotes').value='';$('#dishSpice').value='Medium';dishQtyRender();open('dishPanel')}
  function dishQtyRender(){$('#dishQty').textContent=qty;$('#dishPrice').textContent=money((selectedDish?.price||0)*qty)}
  function addDish(){if(!selectedDish)return;const spice=$('#dishSpice').value,notes=$('#dishNotes').value.trim();const key=`${selectedDish.id}|${spice}|${notes}`;const c=getCart();const existing=c.find(x=>x.key===key);if(existing)existing.qty=Math.min(99,existing.qty+qty);else c.push({key,id:selectedDish.id,name:selectedDish.name,price:selectedDish.price,spice,notes,qty});setCart(c);close();notify(`${qty} × ${selectedDish.name} added to your ${mode==='dine'?'dine-in':'pickup'} bag`)}
  function alterCart(key,how){let c=getCart(),row=c.find(x=>x.key===key);if(!row)return;if(how==='remove')c=c.filter(x=>x.key!==key);else{row.qty+=how==='plus'?1:-1;if(row.qty<=0)c=c.filter(x=>x.key!==key);row.qty=Math.min(row.qty,99)}setCart(c)}
  function showCheckout(){const cart=getCart();if(!cart.length)return;$('#checkoutForm').hidden=false;$('#checkoutSuccess').hidden=true;$('#checkoutDineFields').hidden=mode!=='dine';$('#checkoutPickupField').hidden=mode==='dine';$('#checkoutTable').required=mode==='dine';$('#checkoutTable').value=details.table||'';$('#checkoutGuests').value=String(details.guests||2);$('#checkoutTotal').textContent=money(total(cart));open('checkoutPanel')}
  function placeDemoOrder(e){e.preventDefault();const f=e.currentTarget,form=new FormData(f);if(mode==='dine'&&!String(form.get('table')||'').trim()){notify('Enter the table number to save a dine-in order demo');$('#checkoutTable').focus();return}
    const items=getCart(),sum=total(items),ref='DEMO-'+Math.random().toString(36).slice(2,8).toUpperCase();const data={ref,date:new Date().toISOString(),branch,mode,table:form.get('table'),guests:form.get('guests'),name:form.get('name'),items,subtotal:sum};save('kn_last_demo',data);
    if(mode==='dine'){details.table=String(form.get('table')).trim();details.guests=Number(form.get('guests')||2);save('kn_details',details)}
    setCart([]);$('#checkoutForm').hidden=true;$('#checkoutSuccess').hidden=false;$('#checkoutSuccess').innerHTML=`<span class="tiny-label">DEMO ORDER SAVED</span><h3>Your demo order is saved.</h3><p>Reference <strong>${safe(ref)}</strong><br>${safe(mode==='dine'?`Dine in · table ${data.table}`:'Pickup')} at ${safe(locName())}<br>Estimated subtotal ${money(sum)}.</p><p><strong>This is not a real order.</strong> Nothing has been sent or paid. To confirm, contact the restaurant at <a href="tel:${LOC[branch].tel}">${safe(LOC[branch].phone)}</a>.</p><button type="button" id="successDone">CONTINUE EXPLORING ↗</button>`;$('#successDone').addEventListener('click',close);
  }
  function makeCateringEmail(e){e.preventDefault();const f=new FormData(e.currentTarget);const l=LOC[f.get('location')];const email=l.key==='farmington'?'info@kurrys.com':'';const subj=`Kurry's catering inquiry — ${f.get('date')}`;const body=`Hello Kurry's Team,\n\nI would like to ask about catering for an upcoming event.\n\nName: ${f.get('name')}\nEmail: ${f.get('email')}\nLocation: ${l.name}\nDate: ${f.get('date')}\nEstimated guests: ${f.get('guests')}\nEvent details: ${f.get('notes')||'Please contact me to discuss options.'}\n\nThank you.`;
    const mailto=`mailto:${email}?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(body)}`;
    window.location.href=mailto;notify(l.key==='farmington'?'Email draft prepared. Review and press Send in your mail app.':'Email draft prepared. Add Troy’s confirmed email address before sending.');
  }
  function initialize(){
    $('#year').textContent=new Date().getFullYear();renderAll();
    // Menu & filters
    $('#menuSearch').addEventListener('input',e=>{search=e.target.value.trim().toLowerCase();pageSize=9;renderMenu()});
    $('#vegOnly').addEventListener('change',e=>{vegOnly=e.target.checked;pageSize=9;renderMenu()});
    $('#featuredOnly').addEventListener('change',e=>{featuredOnly=e.target.checked;pageSize=9;renderMenu()});
    $('#loadMore').addEventListener('click',()=>{pageSize+=9;renderMenu()});
    $('#clearFilters').addEventListener('click',()=>{currentCategory='all';search='';vegOnly=false;featuredOnly=false;pageSize=9;$('#menuSearch').value='';$('#vegOnly').checked=false;$('#featuredOnly').checked=false;renderMenu()});
    $('#categoryStack').addEventListener('click',e=>{const btn=e.target.closest('[data-category]');if(!btn)return;currentCategory=btn.dataset.category;pageSize=9;renderMenu()});
    $('#menuGrid').addEventListener('click',e=>{const btn=e.target.closest('[data-dish]');if(btn)openDish(btn.dataset.dish)});
    // Location and fulfillment changes
    $('#branchToggle').addEventListener('click',()=>open('choicePanel'));
    $('#branchOptions').addEventListener('click',e=>{const b=e.target.closest('[data-branch]');if(b)setBranch(b.dataset.branch)});
    $('#locationGrid').addEventListener('click',e=>{const b=e.target.closest('[data-branch]');if(b)setBranch(b.dataset.branch)});
    $$('[data-mode]').forEach(el=>el.addEventListener('click',()=>setMode(el.dataset.mode)));
    $('#setupForm').addEventListener('submit',e=>{e.preventDefault();const newBranch=$('#setupBranch').value;branch=newBranch;save('kn_branch',branch);if(mode==='dine'){details={table:$('#setupTable').value.trim(),guests:Number($('#setupGuests').value)};save('kn_details',details)}renderAll();close();document.querySelector('#menu').scrollIntoView({behavior:'smooth'});notify(`${mode==='dine'?'Dine-in':'Pickup'} menu · ${locName()}`)});
    // Cart and checkout
    $('#cartToggle').addEventListener('click',()=>open('cartDrawer'));$('#mobileCartButton').addEventListener('click',()=>open('cartDrawer'));
    $('#cartEditPlan').addEventListener('click',()=>setMode(mode));
    $('#cartLines').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if('cartplus'in b.dataset)alterCart(b.dataset.cartplus,'plus');if('cartminus'in b.dataset)alterCart(b.dataset.cartminus,'minus');if('cartremove'in b.dataset)alterCart(b.dataset.cartremove,'remove')});
    $('#cartLines').addEventListener('click',e=>{if(e.target.closest('#emptyMenuLink'))close()});
    $('#checkoutOpen').addEventListener('click',showCheckout);$('#checkoutForm').addEventListener('submit',placeDemoOrder);
    $('#dishQtyUp').addEventListener('click',()=>{qty=Math.min(30,qty+1);dishQtyRender()});$('#dishQtyDown').addEventListener('click',()=>{qty=Math.max(1,qty-1);dishQtyRender()});$('#dishAdd').addEventListener('click',addDish);
    // Catering email: no invented contact address. User must choose verified recipient before sending.
    $('#cateringOpen').addEventListener('click',()=>open('cateringPanel'));
    const today=new Date().toLocaleDateString('en-CA');$('#cateringDate').min=today;$('#cateringForm').addEventListener('submit',makeCateringEmail);
    // Overlay and keyboard
    $('#overlay').addEventListener('click',close);$$('[data-close]').forEach(el=>el.addEventListener('click',close));document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#overlay').hidden)close()});
    // Mobile nav
    $('#navToggle').addEventListener('click',()=>{const expanded=$('#mainNav').classList.toggle('open');$('#navToggle').setAttribute('aria-expanded',expanded?'true':'false');$('#navToggle').textContent=expanded?'×':'☰'});
    $$('#mainNav a').forEach(el=>el.addEventListener('click',()=>{$('#mainNav').classList.remove('open');$('#navToggle').setAttribute('aria-expanded','false');$('#navToggle').textContent='☰'}));
    // Scroll progress; animated reveal
    window.addEventListener('scroll',()=>{const doc=document.documentElement;$('#scrollMeter').style.width=(doc.scrollTop/(doc.scrollHeight-doc.clientHeight||1)*100)+'%'},{passive:true});
    const observer=('IntersectionObserver' in window)&&new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}},{threshold:.08});
    $$('.way-card,.mosaic figure,.location-card,.story-headline,.menu-title-row,.dine-copy').forEach(el=>{el.classList.add('reveal');if(observer)observer.observe(el);else el.classList.add('visible')});
    // Subtle mouse-controlled orbit: no libraries. Honor reduced motion.
    if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){const art=$('#heroArt');art.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const r=art.getBoundingClientRect();const x=(e.clientX-r.left-r.width/2)/r.width;const y=(e.clientY-r.top-r.height/2)/r.height;art.querySelector('.hero-photo-frame').style.transform=`translate3d(${x*9}px,${y*9}px,0)`;art.querySelector('.hero-sticker').style.transform=`translate3d(${-x*6}px,${-y*6}px,0)`});art.addEventListener('pointerleave',()=>{art.querySelector('.hero-photo-frame').style.transform='';art.querySelector('.hero-sticker').style.transform=''})}
    // Image errors fall back only to another actual photograph, never a placeholder illustration.
    $$('img[src^="https://"]').forEach(img=>img.addEventListener('error',imageError,{once:true}));
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initialize);else initialize();
})();
