/* ═══════════════════════════════════════
   MOTOSPIKE — script.js
   Hiro Code Brasil
═══════════════════════════════════════ */

const ALL_MOTOS = [
  // BIG TRAIL — ABS
  { name:'Honda Africa Twin',      emoji:'🏔️', price:4500, cat:'Big Trail',      catKey:'bigtrail', cc:'1100cc', brake:['ABS'],       variants:['MT','DCT','ES'] },
  { name:'Triumph Tiger 900',      emoji:'🏔️', price:4200, cat:'Big Trail',      catKey:'bigtrail', cc:'900cc',  brake:['ABS'],       variants:['MT','ES'] },
  { name:'BMW R 1250 GS',          emoji:'🏔️', price:5000, cat:'Big Trail',      catKey:'bigtrail', cc:'1254cc', brake:['ABS'],       variants:['MT','ES'] },
  { name:'Triumph Tiger 800',      emoji:'🏔️', price:3800, cat:'Big Trail',      catKey:'bigtrail', cc:'800cc',  brake:['ABS'],       variants:['MT','ES'] },
  { name:'Triumph Tiger 1200',     emoji:'🏔️', price:4800, cat:'Big Trail',      catKey:'bigtrail', cc:'1160cc', brake:['ABS'],       variants:['MT','ES'] },
  { name:'Yamaha Tenere 1200',     emoji:'🏔️', price:4000, cat:'Big Trail',      catKey:'bigtrail', cc:'1200cc', brake:['ABS'],       variants:['MT'] },
  // TRAIL — ABS
  { name:'BMW G 310 GS',           emoji:'🌲', price:2200, cat:'Trail',          catKey:'trail',    cc:'313cc',  brake:['ABS'],       variants:['MT'] },
  { name:'Yamaha Lander 250',      emoji:'🌲', price:2000, cat:'Trail',          catKey:'trail',    cc:'250cc',  brake:['ABS'],       variants:['MT'] },
  // NAKED — ABS
  { name:'Honda CB 600F Hornet',   emoji:'🔥', price:3200, cat:'Naked',          catKey:'naked',    cc:'600cc',  brake:['ABS'],       variants:['MT'] },
  { name:'Kawasaki Z900',          emoji:'🔥', price:3800, cat:'Naked',          catKey:'naked',    cc:'948cc',  brake:['ABS'],       variants:['MT'] },
  { name:'KTM 1290 Super Duke R',  emoji:'🔥', price:4500, cat:'Naked',          catKey:'naked',    cc:'1301cc', brake:['ABS'],       variants:['MT'] },
  // CUSTOM — ABS
  { name:'Harley-Davidson',        emoji:'💀', price:4800, cat:'Custom',         catKey:'custom',   cc:'1868cc', brake:['ABS'],       variants:['MT'] },
  { name:'Royal Enfield 650',      emoji:'🇮🇳', price:3200, cat:'Custom',        catKey:'custom',   cc:'650cc',  brake:['ABS'],       variants:['MT'] },
  // SUPERESPORTIVA — ABS
  { name:'BMW S1000 RR',           emoji:'🏁', price:6500, cat:'SuperEsportiva', catKey:'sport',    cc:'999cc',  brake:['ABS'],       variants:['MT'] },
  { name:'Yamaha YZF-R1',          emoji:'🏁', price:6200, cat:'SuperEsportiva', catKey:'sport',    cc:'998cc',  brake:['ABS'],       variants:['MT'] },
  { name:'Ducati Monster 696',     emoji:'🏁', price:6000, cat:'SuperEsportiva', catKey:'sport',    cc:'696cc',  brake:['ABS'],       variants:['MT'] },
  // STREET
  { name:'Honda CG 160',           emoji:'🛵', price:800,  cat:'Street',         catKey:'street',   cc:'162cc',  brake:['ABS','CBS'], variants:['MT'] },
  { name:'Honda CG 150',           emoji:'🛵', price:800,  cat:'Street',         catKey:'street',   cc:'149cc',  brake:['CBS'],       variants:['MT'] },
  { name:'Honda CB 300F',          emoji:'🛵', price:1200, cat:'Street',         catKey:'street',   cc:'293cc',  brake:['ABS'],       variants:['MT'] },
  { name:'Yamaha Fazer 250',       emoji:'🛵', price:1100, cat:'Street',         catKey:'street',   cc:'249cc',  brake:['ABS'],       variants:['MT'] },
  { name:'Honda CB 600F',          emoji:'🛵', price:2000, cat:'Street',         catKey:'street',   cc:'599cc',  brake:['ABS'],       variants:['MT'] },
  // CARENADA — ABS
  { name:'Kawasaki Ninja 400',     emoji:'⚡', price:5200, cat:'Carenada',       catKey:'carenada', cc:'399cc',  brake:['ABS'],       variants:['MT'] },
  { name:'Yamaha YZF-R3',          emoji:'⚡', price:5000, cat:'Carenada',       catKey:'carenada', cc:'321cc',  brake:['ABS'],       variants:['MT'] },
  { name:'Yamaha YZF-R15',         emoji:'⚡', price:5000, cat:'Carenada',       catKey:'carenada', cc:'155cc',  brake:['ABS'],       variants:['MT'] },
  // SCOOTER
  { name:'Honda PCX 160',          emoji:'🛺', price:1500, cat:'Scooter',        catKey:'scooter',  cc:'160cc',  brake:['ABS'],       variants:[] },
  { name:'Honda Biz 125',          emoji:'🛺', price:1000, cat:'Scooter',        catKey:'scooter',  cc:'125cc',  brake:['CBS'],       variants:[] },
  { name:'Lambretta V200',         emoji:'🛺', price:1800, cat:'Scooter',        catKey:'scooter',  cc:'200cc',  brake:['ABS'],       variants:[] },
];

const PLAN_CONFIG = {
  basic: { label:'Básico',      price:800,  slots:1,  allowedCats:['street','scooter'],                                               kit:false, colorClass:'basic' },
  pro:   { label:'Pro',         price:2500, slots:2,  allowedCats:['trail','bigtrail','naked','custom','carenada','street','scooter'], kit:true,  colorClass:'pro'   },
  vip:   { label:'VIP',         price:6000, slots:99, allowedCats:['bigtrail','trail','naked','custom','sport','street','carenada','scooter'], kit:true, colorClass:'vip' },
  spike: { label:'Plano Spike', price:0,    slots:1,  allowedCats:['bigtrail','trail','naked','custom','sport','street','carenada','scooter'], kit:true, colorClass:'spike' },
};

const DAY_DISCOUNTS = { 3:5, 7:10, 15:15, 30:20 };
const COUPONS = { 'SPIKE10':10, 'MOTO20':20, 'VIP30':30 };

/* ════ STATE ════ */
var cart = [];
var days = 1, dayDisc = 0, couponDisc = 0, couponCode = '';
var currentPlan = 'basic';
var planSelectedMotos = [];
var planSpikeSlots = 1;
var planDays = 1, planDayDisc = 0, planCouponDisc = 0, planCouponCode = '';

/* ════ BRAKE MODAL STATE ════ */
var pendingMoto = null;
var pendingBtn  = null;
var pendingBrakeSelected   = null;
var pendingVariantSelected = null;

/* ════ PAGE SYSTEM ════ */
function showPage(id) {
  document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
  document.getElementById('page-' + id).classList.add('active');
  window.scrollTo({ top:0, behavior:'smooth' });
}

function gotoSection(id) {
  showPage('home');
  setTimeout(function() {
    var el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior:'smooth', block:'start' });
  }, 60);
}

/* ════ FILTER ════ */
var currentCatFilter   = 'all';
var currentBrakeFilter = 'all';

function filterCat(cat, btn) {
  currentCatFilter = cat;
  document.querySelectorAll('.cat-tab').forEach(function(t) { t.classList.remove('active'); });
  btn.classList.add('active');
  applyFilters();
}

function filterBrake(brake, btn) {
  currentBrakeFilter = brake;
  document.querySelectorAll('.brake-tab').forEach(function(t) {
    t.classList.remove('active','abs-active','cbs-active');
  });
  if (brake === 'ABS')      btn.classList.add('abs-active');
  else if (brake === 'CBS') btn.classList.add('cbs-active');
  else                      btn.classList.add('active');
  applyFilters();
}

function applyFilters() {
  document.querySelectorAll('.moto-card').forEach(function(c) {
    var catOk   = currentCatFilter   === 'all' || c.dataset.cat   === currentCatFilter;
    var brakeOk = currentBrakeFilter === 'all' || c.dataset.brake === currentBrakeFilter || (currentBrakeFilter !== 'all' && c.dataset.brake === 'BOTH');
    c.classList.toggle('hidden', !catOk || !brakeOk);
  });
}

/* ════ CART ════ */
function addToCart(motoName, btn) {
  if (cart.find(function(m) { return m.name === motoName; })) {
    if (btn) flashBtn(btn, '✓ Já no carrinho');
    openCart();
    return;
  }
  var fullMoto = ALL_MOTOS.find(function(m) { return m.name === motoName; });
  if (!fullMoto) return;

  var needsBrake   = fullMoto.brake.length > 1;
  var needsVariant = fullMoto.variants && fullMoto.variants.length > 1;

  if (needsBrake || needsVariant) {
    openBrakeModal(fullMoto, btn);
    return;
  }

  var entry = {
    name:            fullMoto.name,
    emoji:           fullMoto.emoji,
    price:           fullMoto.price,
    cat:             fullMoto.cat,
    cc:              fullMoto.cc,
    brake:           fullMoto.brake,
    variants:        fullMoto.variants,
    selectedBrake:   fullMoto.brake[0],
    selectedVariant: fullMoto.variants && fullMoto.variants.length === 1 ? fullMoto.variants[0] : null,
  };
  cart.push(entry);
  updateCartUI();
  if (btn) flashBtn(btn, '✓ Adicionado!');
  openCart();
}

function flashBtn(btn, text) {
  if (!btn) return;
  var orig = btn.innerHTML;
  btn.innerHTML = text;
  btn.classList.add('added');
  setTimeout(function() { btn.innerHTML = orig; btn.classList.remove('added'); }, 1800);
}

function removeFromCart(i) {
  cart.splice(i, 1);
  updateCartUI();
}

function brakeTag(b) {
  var col = b === 'ABS' ? '#0369a1' : '#059669';
  var bg  = b === 'ABS' ? '#f0f9ff' : '#ecfdf5';
  var bdr = b === 'ABS' ? '#bae6fd' : '#6ee7b7';
  return '<span style="font-size:.65rem;font-weight:700;padding:.1rem .4rem;border-radius:99px;border:1px solid ' + bdr + ';background:' + bg + ';color:' + col + '">' + b + '</span>';
}

function variantTag(v) {
  return '<span style="font-size:.65rem;font-weight:700;padding:.1rem .4rem;border-radius:99px;background:#f3f4f6;border:1px solid #e5e7eb;color:#374151">' + v + '</span>';
}

function updateCartUI() {
  var n  = cart.length;
  var el = document.getElementById('cartCount');
  el.textContent = n;
  n > 0 ? el.classList.add('show') : el.classList.remove('show');

  var body = document.getElementById('cartBody');
  if (n === 0) {
    body.innerHTML = '<div class="cart-empty"><div class="cart-empty-icon">🏍️</div><p>Nenhuma moto.<br>Explore nosso catálogo!</p></div>';
  } else {
    body.innerHTML = cart.map(function(m, i) {
      var bTag = brakeTag(m.selectedBrake || m.brake[0]);
      var vTag = m.selectedVariant ? variantTag(m.selectedVariant) : '';
      return '<div class="cart-item">' +
        '<div class="cart-item-emoji">' + m.emoji + '</div>' +
        '<div class="cart-item-info">' +
          '<div class="cart-item-name">' + m.name + '</div>' +
          '<div class="cart-item-sub" style="display:flex;flex-wrap:wrap;gap:.3rem;margin-top:.2rem">' + bTag + vTag + '</div>' +
          '<div class="cart-item-price">R$' + m.price.toLocaleString('pt-BR') + '/dia</div>' +
        '</div>' +
        '<button class="cart-item-remove" onclick="removeFromCart(' + i + ')">✕</button>' +
      '</div>';
    }).join('');
  }

  var sub = cart.reduce(function(s, m) { return s + m.price; }, 0);
  document.getElementById('cartTotal').textContent = 'R$' + sub.toLocaleString('pt-BR');
  document.getElementById('btnCartCheckout').disabled = n === 0;
}

function openCart()  {
  document.getElementById('cartOverlay').classList.add('open');
  document.getElementById('cartDrawer').classList.add('open');
}
function closeCart() {
  document.getElementById('cartOverlay').classList.remove('open');
  document.getElementById('cartDrawer').classList.remove('open');
}

/* ════ BRAKE MODAL ════ */
function openBrakeModal(moto, btn) {
  pendingMoto             = moto;
  pendingBtn              = btn;
  pendingBrakeSelected    = moto.brake.length === 1 ? moto.brake[0] : null;
  pendingVariantSelected  = moto.variants && moto.variants.length === 1 ? moto.variants[0] : null;

  document.getElementById('brakeModalEmoji').textContent = moto.emoji;
  document.getElementById('brakeModalName').textContent  = moto.name;
  document.getElementById('brakeModalCat').textContent   = moto.cat + ' · ' + moto.cc;

  // Brake options
  var brakeWrap = document.getElementById('brakeOptions');
  var brakeSection = document.getElementById('brakeSelectWrap');
  if (moto.brake.length >= 1) {
    brakeSection.style.display = 'block';
    brakeWrap.innerHTML = moto.brake.map(function(b) {
      var icon = b === 'ABS' ? '🔵' : '🟢';
      var desc = b === 'ABS' ? 'Anti-lock Braking System' : 'Combined Brake System';
      return '<button class="brake-opt-btn" onclick="selectModalBrake(\'' + b + '\',this)">' +
        icon + ' <strong>' + b + '</strong><small style="display:block;font-weight:300;font-size:.65rem;color:var(--muted)">' + desc + '</small>' +
      '</button>';
    }).join('');
  } else {
    brakeSection.style.display = 'none';
  }

  // Variant options
  var varWrap = document.getElementById('variantOptions');
  var varSection = document.getElementById('variantSelectWrap');
  if (moto.variants && moto.variants.length >= 1) {
    varSection.style.display = 'block';
    varWrap.innerHTML = moto.variants.map(function(v) {
      var desc = v === 'MT' ? 'Manual' : v === 'DCT' ? 'Dupla Embreagem Auto' : v === 'ES' ? 'Eletrônico + ABS' : v;
      return '<button class="brake-opt-btn" onclick="selectModalVariant(\'' + v + '\',this)">' +
        '⚙️ <strong>' + v + '</strong><small style="display:block;font-weight:300;font-size:.65rem;color:var(--muted)">' + desc + '</small>' +
      '</button>';
    }).join('');
  } else {
    varSection.style.display = 'none';
  }

  document.getElementById('brakeModal').classList.add('open');
}

function selectModalBrake(brake, btn) {
  pendingBrakeSelected = brake;
  document.querySelectorAll('#brakeOptions .brake-opt-btn').forEach(function(b) { b.className = 'brake-opt-btn'; });
  btn.className = brake === 'ABS' ? 'brake-opt-btn sel-abs' : 'brake-opt-btn sel-cbs';
}

function selectModalVariant(variant, btn) {
  pendingVariantSelected = variant;
  document.querySelectorAll('#variantOptions .brake-opt-btn').forEach(function(b) { b.className = 'brake-opt-btn'; });
  btn.className = 'brake-opt-btn sel-var';
}

function confirmBrakeSelection() {
  var needsBrake   = pendingMoto.brake.length > 1;
  var needsVariant = pendingMoto.variants && pendingMoto.variants.length > 1;
  if (needsBrake   && !pendingBrakeSelected)   { alert('Selecione o sistema de freio!'); return; }
  if (needsVariant && !pendingVariantSelected) { alert('Selecione a variante!'); return; }
  // Auto-seleciona se só tem 1 opção
  if (!pendingBrakeSelected && pendingMoto.brake.length === 1)
    pendingBrakeSelected = pendingMoto.brake[0];
  if (!pendingVariantSelected && pendingMoto.variants && pendingMoto.variants.length === 1)
    pendingVariantSelected = pendingMoto.variants[0];
  // Auto-seleciona se só tem 1 opção
  if (!pendingBrakeSelected && pendingMoto.brake.length === 1)
    pendingBrakeSelected = pendingMoto.brake[0];
  if (!pendingVariantSelected && pendingMoto.variants && pendingMoto.variants.length === 1)
    pendingVariantSelected = pendingMoto.variants[0];

  var entry = {
    name:            pendingMoto.name,
    emoji:           pendingMoto.emoji,
    price:           pendingMoto.price,
    cat:             pendingMoto.cat,
    cc:              pendingMoto.cc,
    brake:           pendingMoto.brake,
    variants:        pendingMoto.variants,
    selectedBrake:   pendingBrakeSelected   || pendingMoto.brake[0],
    selectedVariant: pendingVariantSelected || null,
  };
  cart.push(entry);
  updateCartUI();
  if (pendingBtn) flashBtn(pendingBtn, '✓ Adicionado!');
  closeBrakeModal();
  openCart();
}

function closeBrakeModal() {
  document.getElementById('brakeModal').classList.remove('open');
  pendingMoto = null; pendingBtn = null;
  pendingBrakeSelected = null; pendingVariantSelected = null;
}

/* ════ CHECKOUT ════ */
function goCheckout() {
  if (cart.length === 0) return;
  closeCart();
  showPage('checkout');
  renderCheckout();
}

function renderCheckout() {
  setTimeout(initRetCheckout, 50);

  var list = document.getElementById('coItemsList');
  list.innerHTML = cart.map(function(m) {
    var bTag = brakeTag(m.selectedBrake || m.brake[0]);
    var vTag = m.selectedVariant ? variantTag(m.selectedVariant) : '';
    return '<div class="co-item">' +
      '<div class="co-item-emoji">' + m.emoji + '</div>' +
      '<div style="flex:1">' +
        '<div class="co-item-name">' + m.name + '</div>' +
        '<span class="co-item-cat">' + m.cat + ' · ' + m.cc + '</span>' +
        '<div style="display:flex;flex-wrap:wrap;gap:.3rem;margin-top:.3rem">' + bTag + vTag + '</div>' +
      '</div>' +
      '<div>' +
        '<div class="co-item-price">R$' + m.price.toLocaleString('pt-BR') + '</div>' +
        '<div class="co-item-sub">por dia</div>' +
      '</div>' +
    '</div>';
  }).join('');

  days = 1; dayDisc = 0; couponDisc = 0; couponCode = '';
  document.querySelectorAll('#page-checkout .time-btn').forEach(function(b, i) { b.classList.toggle('selected', i === 0); });
  document.getElementById('customDays').value = '';
  document.getElementById('couponInput').value = '';
  document.getElementById('couponMsg').textContent = '';
  document.getElementById('sumDayDiscRow').style.display = 'none';
  document.getElementById('sumCouponRow').style.display  = 'none';
  recalculate();
}

function selectDays(d, btn) {
  document.querySelectorAll('#page-checkout .time-btn').forEach(function(b) { b.classList.remove('selected'); });
  btn.classList.add('selected');
  document.getElementById('customDays').value = '';
  days = d; dayDisc = DAY_DISCOUNTS[d] || 0;
  recalculate();
}

function selectCustomDays(v) {
  days = parseInt(v) || 1; dayDisc = 0;
  document.querySelectorAll('#page-checkout .time-btn').forEach(function(b) { b.classList.remove('selected'); });
  recalculate();
}

function applyCoupon() {
  var code = document.getElementById('couponInput').value.trim().toUpperCase();
  var msg  = document.getElementById('couponMsg');
  if (!code) { msg.textContent = 'Digite um código.'; msg.className = 'coupon-msg coupon-err'; return; }
  if (COUPONS[code]) {
    couponDisc = COUPONS[code]; couponCode = code;
    msg.textContent = '✓ Cupom ' + code + ' aplicado! -' + couponDisc + '%';
    msg.className = 'coupon-msg coupon-ok';
  } else {
    couponDisc = 0; couponCode = '';
    msg.textContent = '✗ Cupom inválido.';
    msg.className = 'coupon-msg coupon-err';
  }
  recalculate();
}

function recalculate() {
  var sub   = cart.reduce(function(s, m) { return s + m.price; }, 0);
  var total = sub * days;
  if (dayDisc > 0) {
    total *= (1 - dayDisc / 100);
    document.getElementById('sumDayDiscRow').style.display = 'flex';
    document.getElementById('sumDayDiscLabel').textContent = 'Desc. período (' + days + 'd)';
    document.getElementById('sumDayDiscVal').textContent   = '-' + dayDisc + '%';
  } else { document.getElementById('sumDayDiscRow').style.display = 'none'; }
  if (couponDisc > 0) {
    total *= (1 - couponDisc / 100);
    document.getElementById('sumCouponRow').style.display = 'flex';
    document.getElementById('sumCouponLabel').textContent = 'Cupom (' + couponCode + ')';
    document.getElementById('sumCouponVal').textContent   = '-' + couponDisc + '%';
  } else { document.getElementById('sumCouponRow').style.display = 'none'; }
  document.getElementById('sumSubtotal').textContent = 'R$' + sub.toLocaleString('pt-BR');
  document.getElementById('sumDaysLabel').textContent = 'Período';
  document.getElementById('sumDaysVal').textContent   = days + ' dia' + (days > 1 ? 's' : '');
  document.getElementById('sumTotal').textContent     = 'R$' + Math.round(total).toLocaleString('pt-BR');
}

function confirmOrder() {
  var nick  = document.getElementById('nickInput').value.trim();
  var phone = document.getElementById('phoneInput').value.trim();
  if (!nick)  { document.getElementById('nickInput').style.borderColor  = 'var(--accent)'; document.getElementById('nickInput').focus();  return; }
  if (!phone) { document.getElementById('phoneInput').style.borderColor = 'var(--accent)'; document.getElementById('phoneInput').focus(); return; }
  if (retCidadeSel === null) { alert('Selecione o ponto de retirada!'); return; }
  var ponto = RET_PONTOS[retEstado][retCidadeSel];
  document.getElementById('modalTitle').textContent = 'Reserva confirmada!';
  document.getElementById('modalSub').textContent   = 'Retirada em: ' + ponto.cidade + '. Nossa equipe entrará em contato em até 2h pelo WhatsApp. Boa pilotagem! 🏍️';
  document.getElementById('successModal').classList.add('open');
}

/* ════ PLAN PAGE ════ */
function openPlanPage(planKey) {
  currentPlan = planKey;
  planSelectedMotos = [];
  planDays = 1; planDayDisc = 0; planCouponDisc = 0; planCouponCode = '';
  planSpikeSlots = 1;
  planRetEstado    = 'df';
  planRetCidadeSel = null;
  showPage('plan');

  var plan = PLAN_CONFIG[planKey];
  var banner = document.getElementById('planBanner');
  var priceStr = planKey === 'spike' ? 'Personalizado' : 'R$' + plan.price.toLocaleString('pt-BR') + '/dia';
  banner.className = 'plan-banner ' + planKey;
  banner.innerHTML =
    '<div class="plan-banner-left"><h2>' + plan.label + '</h2><p>' + plan.desc + '</p></div>' +
    '<div><div class="plan-banner-price">' + priceStr + '</div><div class="plan-banner-price-sub">por dia' + (planKey === 'spike' ? ' · configurável' : '') + '</div></div>';

  document.getElementById('kitStrip').style.display    = plan.kit ? 'flex' : 'none';
  setTimeout(function() { renderPlanRetCidades(); }, 100);
  document.getElementById('spikeConfig').style.display = planKey === 'spike' ? 'block' : 'none';
  document.getElementById('spikeSlotsNum').textContent = planSpikeSlots;

  document.querySelectorAll('#page-plan .time-btn').forEach(function(b, i) { b.classList.toggle('selected', i === 0); });
  document.getElementById('planCustomDays').value   = '';
  document.getElementById('planCouponInput').value  = '';
  document.getElementById('planCouponMsg').textContent = '';
  document.getElementById('sumDayDiscRow2').style.display = 'none';
  document.getElementById('sumCouponRow2').style.display  = 'none';

  var btnBuy = document.getElementById('btnBuyPlan');
  btnBuy.className = 'btn-buy' + (planKey === 'spike' ? ' gold-buy' : '');

  renderPlanMotos();
  recalcPlan();
}

function renderPlanMotos() {
  var plan  = PLAN_CONFIG[currentPlan];
  var slots = currentPlan === 'spike' ? planSpikeSlots : plan.slots;
  var slotsLabel = currentPlan === 'vip'
    ? 'Escolha livre em todas as categorias (ilimitado)'
    : 'Você pode selecionar até <strong>' + slots + '</strong> moto' + (slots > 1 ? 's' : '') + ' (' + planSelectedMotos.length + ' selecionada' + (planSelectedMotos.length !== 1 ? 's' : '') + ')';
  document.getElementById('slotsInfo').innerHTML = slotsLabel;

  var grid = document.getElementById('planMotosGrid');
  grid.innerHTML = ALL_MOTOS.map(function(m, i) {
    var allowed     = plan.allowedCats.indexOf(m.catKey) >= 0;
    var selected    = planSelectedMotos.indexOf(i) >= 0;
    var maxReached  = planSelectedMotos.length >= slots && !selected;
    var cls = 'plan-moto-card';
    if (!allowed)         cls += ' locked';
    else if (selected)    cls += ' selected';
    else if (maxReached)  cls += ' disabled';

    var lockMsg = !allowed ? '<div class="pmoto-lock-msg">🔒 Não disponível neste plano</div>' : '';

    var brakeBadges = m.brake.map(function(b) {
      var col = b === 'ABS' ? '#0369a1' : '#059669';
      var bg  = b === 'ABS' ? '#f0f9ff' : '#ecfdf5';
      var bdr = b === 'ABS' ? '#bae6fd' : '#6ee7b7';
      return '<span style="font-size:.6rem;font-weight:700;padding:.15rem .45rem;border-radius:99px;border:1px solid ' + bdr + ';background:' + bg + ';color:' + col + '">✓ ' + b + '</span>';
    }).join('');

    var varBadges = m.variants.map(function(v) {
      return '<span style="font-size:.6rem;font-weight:700;padding:.15rem .45rem;border-radius:99px;background:#f3f4f6;border:1px solid #e5e7eb;color:#374151">' + v + '</span>';
    }).join('');

    var clickFn = (allowed && !maxReached) || selected ? 'togglePlanMoto(' + i + ')' : '';

    return '<div class="' + cls + '" onclick="' + clickFn + '">' +
      '<div class="pmoto-top"><div class="pmoto-emoji">' + m.emoji + '</div><div class="pmoto-check">' + (selected ? '✓' : '') + '</div></div>' +
      '<div class="pmoto-name">' + m.name + '</div>' +
      '<div class="pmoto-sub">' + m.cat + ' · ' + m.cc + '</div>' +
      '<div style="display:flex;flex-wrap:wrap;gap:.3rem;margin-top:.3rem">' + brakeBadges + varBadges + '</div>' +
      (selected && planMotoVersions[i] ? '<div style="margin-top:.4rem;font-size:.72rem;color:var(--accent);font-weight:600">✓ ' + planMotoVersions[i].brake + (planMotoVersions[i].variant ? ' · ' + planMotoVersions[i].variant : '') + ' selecionado</div>' : '') +
      '<div class="pmoto-price">R$' + m.price.toLocaleString('pt-BR') + '/dia</div>' +
      lockMsg +
    '</div>';
  }).join('');

  recalcPlan();
}

/* seleções de versão por moto no plano */
var planMotoVersions = {};

function togglePlanMoto(i) {
  var plan  = PLAN_CONFIG[currentPlan];
  var slots = currentPlan === 'spike' ? planSpikeSlots : plan.slots;
  var idx   = planSelectedMotos.indexOf(i);
  if (idx >= 0) {
    planSelectedMotos.splice(idx, 1);
    delete planMotoVersions[i];
    renderPlanMotos();
    return;
  }
  if (planSelectedMotos.length >= slots) return;
  var m = ALL_MOTOS[i];
  var needsBrake   = m.brake.length > 1;
  var needsVariant = m.variants && m.variants.length > 1;
  if (needsBrake || needsVariant) {
    openPlanVersionModal(i);
  } else {
    planMotoVersions[i] = {
      brake:   m.brake[0],
      variant: m.variants && m.variants.length === 1 ? m.variants[0] : null
    };
    planSelectedMotos.push(i);
    renderPlanMotos();
  }
}

var pendingPlanMotoIdx = null;
var pendingPlanBrake   = null;
var pendingPlanVariant = null;

function openPlanVersionModal(i) {
  var m = ALL_MOTOS[i];
  pendingPlanMotoIdx = i;
  pendingPlanBrake   = m.brake.length === 1 ? m.brake[0] : null;
  pendingPlanVariant = m.variants && m.variants.length === 1 ? m.variants[0] : null;

  document.getElementById('planVerModalEmoji').textContent = m.emoji;
  document.getElementById('planVerModalName').textContent  = m.name;
  document.getElementById('planVerModalCat').textContent   = m.cat + ' · ' + m.cc;

  var brakeWrap = document.getElementById('planVerBrakeOptions');
  var brakeSection = document.getElementById('planVerBrakeWrap');
  if (m.brake.length > 1) {
    brakeSection.style.display = 'block';
    brakeWrap.innerHTML = m.brake.map(function(b) {
      var icon = b === 'ABS' ? '🔵' : '🟢';
      var desc = b === 'ABS' ? 'Anti-lock Braking System' : 'Combined Brake System';
      return '<button class="brake-opt-btn" onclick="selectPlanBrake(\'' + b + '\',this)">' +
        icon + ' <strong>' + b + '</strong>' +
        '<small style="display:block;font-weight:300;font-size:.65rem;color:var(--muted)">' + desc + '</small>' +
      '</button>';
    }).join('');
  } else {
    brakeSection.style.display = 'none';
  }

  var varWrap = document.getElementById('planVerVariantOptions');
  var varSection = document.getElementById('planVerVariantWrap');
  if (m.variants && m.variants.length > 1) {
    varSection.style.display = 'block';
    varWrap.innerHTML = m.variants.map(function(v) {
      var desc = v === 'MT' ? 'Câmbio Manual' : v === 'DCT' ? 'Dupla Embreagem Automática' : v === 'ES' ? 'Eletrônico + ABS' : v;
      return '<button class="brake-opt-btn" onclick="selectPlanVariant(\'' + v + '\',this)">' +
        '⚙️ <strong>' + v + '</strong>' +
        '<small style="display:block;font-weight:300;font-size:.65rem;color:var(--muted)">' + desc + '</small>' +
      '</button>';
    }).join('');
  } else {
    varSection.style.display = 'none';
  }

  document.getElementById('planVersionModal').classList.add('open');
}

function selectPlanBrake(brake, btn) {
  pendingPlanBrake = brake;
  document.querySelectorAll('#planVerBrakeOptions .brake-opt-btn').forEach(function(b) { b.className = 'brake-opt-btn'; });
  btn.className = brake === 'ABS' ? 'brake-opt-btn sel-abs' : 'brake-opt-btn sel-cbs';
}

function selectPlanVariant(variant, btn) {
  pendingPlanVariant = variant;
  document.querySelectorAll('#planVerVariantOptions .brake-opt-btn').forEach(function(b) { b.className = 'brake-opt-btn'; });
  btn.className = 'brake-opt-btn sel-var';
}

function confirmPlanVersion() {
  var m = ALL_MOTOS[pendingPlanMotoIdx];
  if (m.brake.length > 1 && !pendingPlanBrake)            { alert('Selecione o sistema de freio!'); return; }
  if (m.variants && m.variants.length > 1 && !pendingPlanVariant) { alert('Selecione a variante!'); return; }
  planMotoVersions[pendingPlanMotoIdx] = {
    brake:   pendingPlanBrake   || m.brake[0],
    variant: pendingPlanVariant || (m.variants && m.variants.length > 0 ? m.variants[0] : null)
  };
  planSelectedMotos.push(pendingPlanMotoIdx);
  closePlanVersionModal();
  renderPlanMotos();
}

function closePlanVersionModal() {
  document.getElementById('planVersionModal').classList.remove('open');
  pendingPlanMotoIdx = null;
  pendingPlanBrake   = null;
  pendingPlanVariant = null;
}

function changeSpikeSlots(delta) {
  planSpikeSlots = Math.max(1, Math.min(20, planSpikeSlots + delta));
  document.getElementById('spikeSlotsNum').textContent = planSpikeSlots;
  if (planSelectedMotos.length > planSpikeSlots) planSelectedMotos = planSelectedMotos.slice(0, planSpikeSlots);
  renderPlanMotos();
}

function selectPlanDays(d, btn) {
  document.querySelectorAll('#page-plan .time-btn').forEach(function(b) { b.classList.remove('selected'); });
  btn.classList.add('selected');
  document.getElementById('planCustomDays').value = '';
  planDays = d; planDayDisc = DAY_DISCOUNTS[d] || 0;
  recalcPlan();
}

function selectPlanCustomDays(v) {
  planDays = parseInt(v) || 1; planDayDisc = 0;
  document.querySelectorAll('#page-plan .time-btn').forEach(function(b) { b.classList.remove('selected'); });
  recalcPlan();
}

function applyPlanCoupon() {
  var code = document.getElementById('planCouponInput').value.trim().toUpperCase();
  var msg  = document.getElementById('planCouponMsg');
  if (!code) { msg.textContent = 'Digite um código.'; msg.className = 'coupon-msg2 coupon-err'; return; }
  if (COUPONS[code]) {
    planCouponDisc = COUPONS[code]; planCouponCode = code;
    msg.textContent = '✓ Cupom ' + code + ' aplicado! -' + planCouponDisc + '%';
    msg.className = 'coupon-msg2 coupon-ok';
  } else {
    planCouponDisc = 0; planCouponCode = '';
    msg.textContent = '✗ Cupom inválido.';
    msg.className = 'coupon-msg2 coupon-err';
  }
  recalcPlan();
}

function recalcPlan() {
  var plan    = PLAN_CONFIG[currentPlan];
  var motoSub = planSelectedMotos.reduce(function(s, i) { return s + ALL_MOTOS[i].price; }, 0);
  var base    = currentPlan === 'spike' ? (motoSub > 0 ? motoSub : planSpikeSlots * 800) : Math.max(plan.price, motoSub);
  var total   = base * planDays;

  if (planDayDisc > 0) {
    total *= (1 - planDayDisc / 100);
    document.getElementById('sumDayDiscRow2').style.display = 'flex';
    document.getElementById('sumDayDiscLbl2').textContent   = 'Desc. período (' + planDays + 'd)';
    document.getElementById('sumDayDiscVal2').textContent   = '-' + planDayDisc + '%';
  } else { document.getElementById('sumDayDiscRow2').style.display = 'none'; }

  if (planCouponDisc > 0) {
    total *= (1 - planCouponDisc / 100);
    document.getElementById('sumCouponRow2').style.display = 'flex';
    document.getElementById('sumCouponLbl2').textContent   = 'Cupom (' + planCouponCode + ')';
    document.getElementById('sumCouponVal2').textContent   = '-' + planCouponDisc + '%';
  } else { document.getElementById('sumCouponRow2').style.display = 'none'; }

  document.getElementById('sumPlanName').textContent   = plan.label;
  document.getElementById('sumMotoCount').textContent  = planSelectedMotos.length + ' moto' + (planSelectedMotos.length !== 1 ? 's' : '');
  document.getElementById('sumDaysLbl').textContent    = 'Período';
  document.getElementById('sumDaysVal2').textContent   = planDays + ' dia' + (planDays > 1 ? 's' : '');
  document.getElementById('sumTotalPlan').textContent  = 'R$' + Math.round(total).toLocaleString('pt-BR');
  document.getElementById('btnBuyPlan').disabled       = planSelectedMotos.length === 0;

  if (currentPlan === 'spike') {
    document.getElementById('spikePricePreview').textContent = 'Total motos: R$' + motoSub.toLocaleString('pt-BR') + '/dia';
  }
}

/* ════ RETIRADA NA PÁGINA DE PLANOS ════ */
var planRetEstado    = 'df';
var planRetCidadeSel = null;

function selectPlanRetEstado(estado, btn) {
  planRetEstado    = estado;
  planRetCidadeSel = null;
  document.querySelectorAll('#page-plan .ret-estado-btn').forEach(function(b) { b.classList.remove('active'); });
  btn.classList.add('active');
  var sel = document.getElementById('planRetSelecionado');
  if (sel) sel.style.display = 'none';
  renderPlanRetCidades();
}

function renderPlanRetCidades() {
  var lista = RET_PONTOS[planRetEstado];
  var wrap  = document.getElementById('planRetCidadesWrap');
  if (!wrap) return;
  wrap.innerHTML = lista.map(function(p, i) {
    return '<button class="ret-cidade-btn" onclick="selectPlanRetCidade(' + i + ',this)">' +
      '<span style="font-size:1.4rem">' + p.icon + '</span>' +
      '<div style="flex:1">' +
        '<span class="ret-cidade-nome">' + p.cidade + '</span>' +
        '<span class="ret-cidade-end">' + p.end + '</span>' +
        '<span class="ret-cidade-hora">⏰ ' + p.horario + '</span>' +
      '</div>' +
      '<div class="ret-check">✓</div>' +
    '</button>';
  }).join('');
}

function selectPlanRetCidade(i, btn) {
  planRetCidadeSel = i;
  document.querySelectorAll('#planRetCidadesWrap .ret-cidade-btn').forEach(function(b) { b.classList.remove('active'); });
  btn.classList.add('active');
  var p   = RET_PONTOS[planRetEstado][i];
  var box = document.getElementById('planRetSelecionado');
  document.getElementById('planRetSelecionadoInfo').innerHTML =
    '<strong>Endereço:</strong> ' + p.end + '<br><strong>Horário:</strong> ' + p.horario;
  box.style.display = 'block';
}

function confirmPlanOrder() {
  if (planSelectedMotos.length === 0) return;
  if (planRetCidadeSel === null) { alert('Selecione o ponto de retirada!'); return; }
  var plan  = PLAN_CONFIG[currentPlan];
  var motos = planSelectedMotos.map(function(i) {
    var m = ALL_MOTOS[i];
    return m.name + ' (' + m.brake.join('/') + ')';
  }).join(', ');
  var kitMsg = plan.kit ? ' Kit Capacete + Luvas será entregue com a moto.' : '';
  var pontoMsg = planRetCidadeSel !== null ? ' Retirada em: ' + RET_PONTOS[planRetEstado][planRetCidadeSel].cidade + '.' : '';
  document.getElementById('modalTitle').textContent = plan.label + ' confirmado!';
  document.getElementById('modalSub').textContent   = 'Motos: ' + motos + '.' + pontoMsg + kitMsg + ' Entraremos em contato em até 2h. 🏍️';
  document.getElementById('successModal').classList.add('open');
}

/* ════ MODAL ════ */
function closeModal() {
  document.getElementById('successModal').classList.remove('open');
  cart = []; updateCartUI();
  planSelectedMotos = [];
  showPage('home');
}

/* ════ RETIRADA NO CHECKOUT ════ */
var RET_PONTOS = {
  df: [
    { cidade:'Sobradinho II', icon:'🏛️', end:'QR 06 Conjunto F, Sobradinho II — DF', horario:'Seg–Sáb: 08h às 18h · Dom: 09h às 14h', maps:'https://maps.google.com/?q=Sobradinho+II+DF' },
    { cidade:'Asa Sul',       icon:'🏙️', end:'CLN 410 Bloco C, Loja 12, Asa Sul — DF', horario:'Seg–Sex: 08h às 19h · Sáb: 09h às 16h', maps:'https://maps.google.com/?q=Asa+Sul+Brasilia+DF' },
  ],
  pa: [
    { cidade:'Belém', icon:'🌿', end:'Av. Almirante Barroso, 1234 — Belém, PA', horario:'Seg–Sex: 08h às 18h · Sáb: 09h às 14h', maps:'https://maps.google.com/?q=Belem+PA' },
  ],
  rs: [
    { cidade:'Balneário Camboriú', icon:'⛵', end:'Av. Atlântica, 890, Centro — Balneário Camboriú, RS', horario:'Seg–Dom: 08h às 20h', maps:'https://maps.google.com/?q=Balneario+Camboriu+RS' },
  ],
};

var retEstado    = 'df';
var retCidadeSel = null;

function selectRetEstado(estado, btn) {
  retEstado    = estado;
  retCidadeSel = null;
  document.querySelectorAll('.ret-estado-btn').forEach(function(b) { b.classList.remove('active'); });
  btn.classList.add('active');
  document.getElementById('retSelecionado').style.display = 'none';
  renderRetCidades();
}

function renderRetCidades() {
  var lista = RET_PONTOS[retEstado];
  var wrap  = document.getElementById('retCidadesWrap');
  if (!wrap) return;
  wrap.innerHTML = lista.map(function(p, i) {
    return '<button class="ret-cidade-btn" onclick="selectRetCidade(' + i + ', this)">' +
      '<span style="font-size:1.5rem">' + p.icon + '</span>' +
      '<div style="flex:1">' +
        '<span class="ret-cidade-nome">' + p.cidade + '</span>' +
        '<span class="ret-cidade-end">' + p.end + '</span>' +
        '<span class="ret-cidade-hora">⏰ ' + p.horario + '</span>' +
      '</div>' +
      '<div class="ret-check">✓</div>' +
    '</button>';
  }).join('');
}

function selectRetCidade(i, btn) {
  retCidadeSel = i;
  document.querySelectorAll('.ret-cidade-btn').forEach(function(b) { b.classList.remove('active'); });
  btn.classList.add('active');
  var p   = RET_PONTOS[retEstado][i];
  var box = document.getElementById('retSelecionado');
  document.getElementById('retSelecionadoInfo').innerHTML =
    '<strong>Endereço:</strong> ' + p.end + '<br><strong>Horário:</strong> ' + p.horario;
  box.style.display = 'block';
}

function initRetCheckout() {
  retEstado    = 'df';
  retCidadeSel = null;
  document.querySelectorAll('.ret-estado-btn').forEach(function(b, i) { b.classList.toggle('active', i === 0); });
  var retSel = document.getElementById('retSelecionado');
  if (retSel) retSel.style.display = 'none';
  renderRetCidades();
}

/* ════ RETIRADA NA HOME ════ */
var PONTOS = RET_PONTOS;
var currentEstado  = 'df';
var selectedCidade = null;

function selectEstado(estado, btn) {
  currentEstado  = estado;
  selectedCidade = null;
  document.querySelectorAll('.estado-tab').forEach(function(t) { t.classList.remove('active'); });
  btn.classList.add('active');
  document.getElementById('selectedPonto').classList.remove('show');
  resetMapa();
  renderCidades();
}

function renderCidades() {
  var lista = PONTOS[currentEstado];
  var wrap  = document.getElementById('cidadesWrap');
  if (!wrap) return;
  wrap.innerHTML = lista.map(function(p, i) {
    return '<div class="cidade-card" onclick="selectCidade(' + i + ')" id="cidade-' + i + '">' +
      '<div class="cidade-icon">' + p.icon + '</div>' +
      '<div class="cidade-info">' +
        '<div class="cidade-nome">' + p.cidade + '</div>' +
        '<div class="cidade-end">' + p.end + '</div>' +
        '<div class="cidade-horario">⏰ ' + p.horario + '</div>' +
      '</div>' +
      '<div class="cidade-check">✓</div>' +
    '</div>';
  }).join('');
}

function selectCidade(i) {
  selectedCidade = i;
  document.querySelectorAll('.cidade-card').forEach(function(c, idx) { c.classList.toggle('selected', idx === i); });
  var p     = PONTOS[currentEstado][i];
  var ponto = document.getElementById('selectedPonto');
  document.getElementById('selectedPontoTitle').textContent = '📍 ' + p.cidade;
  document.getElementById('selectedPontoInfo').innerHTML =
    '<strong>Endereço:</strong> ' + p.end +
    '<br><strong>Horário:</strong> ' + p.horario +
    '<br><a href="' + p.maps + '" target="_blank" style="color:var(--accent);font-weight:600;font-size:.78rem;margin-top:.3rem;display:inline-block">Ver no Google Maps →</a>';
  ponto.classList.add('show');

  var mapa = document.getElementById('mapaBox');
  mapa.innerHTML =
    '<div style="text-align:center;padding:2rem">' +
      '<div style="font-size:3rem;margin-bottom:.8rem">' + p.icon + '</div>' +
      '<div style="font-family:Inter,sans-serif;font-weight:800;font-size:1.2rem;color:var(--text);margin-bottom:.4rem">' + p.cidade + '</div>' +
      '<div style="font-size:.82rem;color:var(--muted);margin-bottom:.3rem">' + p.end + '</div>' +
      '<div style="font-size:.78rem;color:var(--green);font-weight:600;margin-bottom:1rem">⏰ ' + p.horario + '</div>' +
      '<a href="' + p.maps + '" target="_blank" style="background:var(--accent);color:#fff;padding:.6rem 1.4rem;border-radius:8px;text-decoration:none;font-family:Inter,sans-serif;font-weight:700;font-size:.82rem">📍 Ver no Google Maps</a>' +
    '</div>';
}

function resetMapa() {
  var mapa = document.getElementById('mapaBox');
  if (!mapa) return;
  mapa.innerHTML =
    '<div class="map-icon">🗺️</div>' +
    '<div class="map-text">Selecione uma cidade</div>' +
    '<div class="map-sub">O endereço completo e horário aparecerão aqui</div>';
}

/* ════ REVIEWS ════ */
var reviews = [
  { name:'Carlos M.',    stars:5, moto:'BMW S1000 RR',       city:'Asa Sul — DF',              text:'Experiência incrível! A moto estava impecável e a equipe super profissional.',       date:'Abr 2025', verified:true  },
  { name:'Fernanda L.',  stars:5, moto:'Honda Africa Twin',  city:'Sobradinho II — DF',         text:'Kit capacete e luvas foi um diferencial. Entrega na hora certa. Recomendo!',         date:'Mar 2025', verified:true  },
  { name:'Rafael T.',    stars:4, moto:'Kawasaki Z900',      city:'Belém — PA',                 text:'Moto em ótimo estado. Prazo de confirmação demorou um pouco, mas no geral ótimo.',   date:'Mar 2025', verified:true  },
  { name:'Juliana S.',   stars:5, moto:'Yamaha YZF-R1',      city:'Balneário Camboriú — RS',    text:'Melhor aluguel de moto que já fiz! A equipe foi super atenciosa.',                   date:'Fev 2025', verified:true  },
  { name:'Diego P.',     stars:5, moto:'Harley-Davidson',    city:'Asa Sul — DF',               text:'A Harley estava linda e bem conservada. Plano VIP valeu muito a pena!',              date:'Fev 2025', verified:true  },
  { name:'Amanda R.',    stars:5, moto:'Honda PCX 160',      city:'Sobradinho II — DF',         text:'Ótima opção para o dia a dia! Entrega rápida e atendimento via WhatsApp ágil.',      date:'Jan 2025', verified:false },
  { name:'Bruno K.',     stars:4, moto:'Ducati Monster 696', city:'Belém — PA',                 text:'A Ducati é um espetáculo! Plano Spike valeu cada centavo.',                          date:'Jan 2025', verified:true  },
];

var selectedStars = 0;

function setStar(n) {
  selectedStars = n;
  document.querySelectorAll('.star-btn').forEach(function(btn, i) { btn.classList.toggle('active', i < n); });
}

function renderReviews() {
  var list = document.getElementById('reviewsList');
  list.innerHTML = reviews.map(function(r) {
    var stars = '';
    for (var i = 0; i < 5; i++) stars += i < r.stars ? '★' : '☆';
    var verified = r.verified ? '<span class="review-badge" style="margin-left:.5rem">✓ Verificado</span>' : '';
    return '<div class="review-card">' +
      '<div class="review-header">' +
        '<div><span class="review-author">' + r.name + '</span>' + verified + '</div>' +
        '<div class="review-stars">' + stars + '</div>' +
      '</div>' +
      '<div><span class="review-moto">🏍️ ' + r.moto + '</span> · <span class="review-city">📍 ' + r.city + '</span></div>' +
      '<div class="review-text">"' + r.text + '"</div>' +
      '<div class="review-date">' + r.date + '</div>' +
    '</div>';
  }).join('');
  updateRatingSummary();
}

function updateRatingSummary() {
  var avg = (reviews.reduce(function(s, r) { return s + r.stars; }, 0) / reviews.length).toFixed(1);
  document.getElementById('avgRating').textContent    = avg;
  document.getElementById('totalReviews').textContent = reviews.length + ' avaliações';
  var bars = document.getElementById('ratingBars');
  bars.innerHTML = [5,4,3,2,1].map(function(star) {
    var count = reviews.filter(function(r) { return r.stars === star; }).length;
    var pct   = Math.round((count / reviews.length) * 100);
    return '<div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.2rem">' +
      '<span style="font-size:.7rem;color:var(--muted);width:12px">' + star + '</span>' +
      '<span style="color:#f59e0b;font-size:.65rem">★</span>' +
      '<div style="flex:1;height:6px;background:var(--border);border-radius:3px;overflow:hidden">' +
        '<div style="height:100%;width:' + pct + '%;background:#f59e0b;border-radius:3px"></div>' +
      '</div>' +
      '<span style="font-size:.68rem;color:var(--muted);width:24px">' + count + '</span>' +
    '</div>';
  }).join('');
}

function submitReview() {
  var name = document.getElementById('reviewName').value.trim();
  var moto = document.getElementById('reviewMoto').value;
  var city = document.getElementById('reviewCity').value;
  var text = document.getElementById('reviewText').value.trim();
  if (!name)          { alert('Digite seu nome!'); return; }
  if (!selectedStars) { alert('Selecione uma avaliação (estrelas)!'); return; }
  if (!moto)          { alert('Selecione a moto que alugou!'); return; }
  if (!city)          { alert('Selecione a cidade de retirada!'); return; }
  if (text.length < 10) { alert('Escreva um comentário com pelo menos 10 caracteres!'); return; }
  var months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  var now    = new Date();
  reviews.unshift({ name:name, stars:selectedStars, moto:moto, city:city, text:text, date:months[now.getMonth()] + ' ' + now.getFullYear(), verified:false });
  renderReviews();
  document.getElementById('reviewName').value = '';
  document.getElementById('reviewMoto').value = '';
  document.getElementById('reviewCity').value = '';
  document.getElementById('reviewText').value = '';
  selectedStars = 0;
  document.querySelectorAll('.star-btn').forEach(function(b) { b.classList.remove('active'); });
  alert('Comentário publicado! Obrigado pelo feedback! 🏍️');
}

/* ════ INIT ════ */
updateCartUI();
renderCidades();
renderReviews();

/* ════ FADE-IN OBSERVER ════ */
var observer = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
    }
  });
}, { threshold: 0.05 });

document.querySelectorAll('.fade-in').forEach(function(el) {
  observer.observe(el);
});

/* Fallback: força visibilidade após 500ms caso observer não dispare */
setTimeout(function() {
  document.querySelectorAll('.fade-in').forEach(function(el) {
    el.classList.add('visible');
  });
}, 500);