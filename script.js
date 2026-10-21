(function () {
'use strict';
var $ = function (s) { return document.querySelector(s); };

/* ---------- Data: single source of truth ---------- */
var COSTUMES = {
  RATCHAPRAETEN: { img: 'assets/costumes/ratchapraeten.jpg',
    name: { th: 'ชุดรัชกาลที่ 5 (ชุดราชประแตน)', en: 'Rama V Raj Pattern Costume' },
    persona: { th: 'คุณให้ความสำคัญกับรายละเอียด ความประณีต และการเลือกสิ่งต่าง ๆ อย่างมีความหมาย คุณชอบมองให้ลึกกว่าสิ่งที่เห็น และให้คุณค่ากับเรื่องราวที่ส่งต่อจากอดีต',
      en: 'You value refinement, meaningful choices, and the details others may overlook. You look beyond appearances and appreciate the stories carried forward from the past.' },
    desc: { th: 'เครื่องแต่งกายที่สะท้อนภาพลักษณ์การแต่งกายในสมัยรัชกาลที่ 5 ผ่านรูปแบบเสื้อผ้าและรายละเอียดที่ประณีต',
      en: 'A costume inspired by the dress styles of the reign of King Rama V, featuring refined tailoring and historical details.' },
    male: { th: 'เสื้อราชประแตนสีขาว ประกอบโจงกระเบน', en: 'White Raj pattern jacket with chong kraben' },
    female: { th: 'เสื้อลูกไม้สีขาว ประกอบโจงกระเบน', en: 'White lace blouse with chong kraben' } },
  SIAM_ELITE: { img: 'assets/costumes/siam-elite.jpg',
    name: { th: 'ชุดผู้ดีสยาม', en: 'Siamese Aristocratic Costume' },
    persona: { th: 'คุณให้ความสำคัญกับความรู้สึกของผู้คน มีความใส่ใจในรายละเอียด และสร้างความประทับใจผ่านความอ่อนโยนและความเข้าใจ',
      en: 'You care about how others feel. Your attention to detail, warmth, and understanding create a graceful and lasting impression.' },
    desc: { th: 'การแต่งกายที่เน้นความสง่างาม ผ่านเสื้อแขนกระบอก โจงกระเบน และการซ้อนชั้นของสไบ',
      en: 'An elegant style featuring a long-sleeved jacket, chong kraben, and layered sabai.' },
    male: { th: 'เสื้อแขนกระบอกสีน้ำเงิน ประกอบโจงกระเบน', en: 'Blue long-sleeved jacket with chong kraben' },
    female: { th: 'สไบจีบซ้อนสไบลูกไม้ ประกอบโจงกระเบน', en: 'Pleated sabai with lace sabai overlay and chong kraben' } },
  SIAM: { img: 'assets/costumes/siam.jpg',
    name: { th: 'ชุดชาวสยาม', en: 'Traditional Siamese Costume' },
    persona: { th: 'คุณพร้อมลงมือทำเมื่อถึงเวลา ยืนหยัดเพื่อสิ่งที่เชื่อ และให้ความสำคัญกับความจริงใจและผู้คนที่มีความหมายสำหรับคุณ',
      en: 'You are ready to act when it matters. You stand by what you believe in and value sincerity and the people who matter to you.' },
    desc: { th: 'การแต่งกายแบบชาวสยามที่ผสานเสื้อแขนสั้น โจงกระเบน และผ้าคาดเอวอย่างเรียบง่าย',
      en: 'A traditional Siamese-inspired look combining a short-sleeved shirt, chong kraben, and a waist sash.' },
    male: { th: 'เสื้อแขนสั้นเนื้อผ้าลื่น โจงกระเบน และผ้าคาดเอว', en: 'Smooth short-sleeved shirt, chong kraben, and waist sash' },
    female: { th: 'สไบจีบ ประกอบโจงกระเบน', en: 'Pleated sabai with chong kraben' } },
  LOCAL: { img: 'assets/costumes/local.jpg',
    name: { th: 'ชุดพื้นถิ่น', en: 'Regional Thai Costume' },
    persona: { th: 'คุณภาคภูมิใจในรากเหง้าของตัวเอง เปิดรับความแตกต่าง และถ่ายทอดเอกลักษณ์ของคุณผ่านสิ่งที่คุณเป็น',
      en: 'You take pride in your roots, embrace differences, and express your individuality through the things that make you who you are.' },
    desc: { th: 'เครื่องแต่งกายที่ได้รับแรงบันดาลใจจากภูมิปัญญาการแต่งกายท้องถิ่น โดยเฉพาะเอกลักษณ์แบบอีสาน',
      en: 'A regional-inspired costume celebrating local dress traditions, especially the distinctive character of Isan style.' },
    male: { th: 'ชุดม่อฮ่อม พร้อมผ้าคาดเอว', en: 'Traditional mo hom outfit with waist sash' },
    female: { th: 'ผ้าถุงสั้นแบบอีสาน', en: 'Short traditional skirt in Isan style' } }
};
/* internal scoring id -> costume id (never displayed) */
var TYPES = ['ROYAL', 'SABAI', 'VILLAGE', 'LOCAL'];
var MAP = { ROYAL: 'RATCHAPRAETEN', SABAI: 'SIAM_ELITE', VILLAGE: 'SIAM', LOCAL: 'LOCAL' };
var WEIGHT = [1, 1, 1, 1.2];
var SCORES = [
  [[4,1,2,0],[2,4,0,1],[0,2,4,1],[1,0,2,4]],
  [[4,2,0,1],[1,4,2,0],[0,1,4,2],[2,0,1,4]],
  [[4,0,2,1],[2,1,0,4],[1,4,2,0],[0,2,4,1]],
  [[4,1,0,2],[0,4,2,1],[2,0,4,1],[1,2,0,4]]
];
var QUESTIONS = [
  { label: { th: 'ความประทับใจแรก', en: 'THE FIRST IMPRESSION' },
    q: { th: 'คุณเดินเข้าไปในสถานที่แห่งหนึ่งที่ไม่เคยมาเยือนมาก่อน รอบตัวเต็มไปด้วยผู้คนและเรื่องราวที่คุณไม่รู้จัก สิ่งแรกที่คุณทำคืออะไร?',
         en: 'You enter a place you have never visited before. It is full of unfamiliar people and stories. What do you do first?' },
    a: { th: ['สังเกตผู้คนและบรรยากาศรอบตัว', 'มองหาคนที่รู้จักสถานที่นี้ดี', 'เดินเข้าไปสำรวจด้วยตัวเองทันที', 'มองหาสิ่งที่บอกเล่าความเป็นมาของสถานที่'],
         en: ['Observe the people and atmosphere around you.', 'Look for someone who knows the place well.', 'Explore the place on your own immediately.', "Look for something that reveals the place's history."] } },
  { label: { th: 'ความทรงจำ', en: 'THE MEMORY' },
    q: { th: 'มีคนมอบของเก่าชิ้นหนึ่งให้คุณ พร้อมบอกว่า “ของชิ้นนี้มีเรื่องราวของคนรุ่นก่อนซ่อนอยู่” คุณจะทำอย่างไร?',
         en: 'Someone gives you an old object and tells you that it holds stories from generations past. What would you do?' },
    a: { th: ['ค้นหาว่ามันเคยเป็นของใคร', 'อยากรู้เรื่องราวของเจ้าของเดิม', 'ถามคนในครอบครัวหรือชุมชน', 'ศึกษาวิธีทำและรายละเอียดของสิ่งของ'],
         en: ['Find out who it used to belong to.', 'Learn the story of its former owner.', 'Ask your family or community about it.', 'Study how it was made and examine its details.'] } },
  { label: { th: 'สัญชาตญาณ', en: 'THE INSTINCT' },
    q: { th: 'ระหว่างงานสำคัญ เกิดเหตุการณ์ไม่คาดคิดขึ้นอย่างกะทันหัน คุณจะทำอะไรเป็นอย่างแรก?',
         en: 'During an important event, something unexpected suddenly happens. What is the first thing you do?' },
    a: { th: ['ตั้งสติและมองภาพรวม', 'เข้าไปช่วยคนที่กำลังลำบาก', 'เข้าไปจัดการปัญหาทันที', 'หาต้นเหตุแล้วแก้ด้วยสิ่งที่มี'],
         en: ['Stay calm and assess the bigger picture.', 'Help the person who is struggling.', 'Step in and deal with the problem immediately.', 'Find the cause and solve it with the resources available.'] } },
  { label: { th: 'มรดกของคุณ', en: 'THE LEGACY' },
    q: { th: 'หากเรื่องราวของคุณถูกเล่าต่อไปยังคนรุ่นหลัง คุณอยากให้พวกเขาจดจำคุณในเรื่องใดมากที่สุด?',
         en: 'If your story were passed down to future generations, what would you most want people to remember about you?' },
    a: { th: ['คนที่ทำทุกอย่างอย่างประณีตและรู้ว่าตัวเองกำลังทำอะไร', 'คนที่ทำให้คนรอบตัวรู้สึกอบอุ่นและได้รับการเข้าใจ', 'คนธรรมดาที่พร้อมยืนหยัดเพื่อสิ่งที่รักจนถึงที่สุด', 'คนที่ไม่เคยลืมว่าตัวเองมาจากไหน'],
         en: ['Someone who acted with refinement and purpose.', 'Someone who made others feel understood and cared for.', 'An ordinary person who stood firm for what they loved.', 'Someone who never forgot where they came from.'] } }
];
var UI = {
  th: { brand: 'การเดินทางผ่านมรดกวัฒนธรรม', title: 'อดีตของคุณยังอยู่ในตัวคุณ',
    support: 'ค้นพบเครื่องแต่งกายที่สะท้อนเรื่องราวและตัวตนของคุณ ผ่านมุมมองของอดีต', start: 'เริ่มค้นหาชุดของคุณ',
    introEyebrow: 'ก่อนเริ่ม', introTitle: 'สี่คำถาม หนึ่งชุดที่เป็นคุณ',
    introText: 'ตอบสี่คำถามสั้น ๆ ตามสัญชาตญาณ ไม่มีคำตอบที่ถูกหรือผิด แล้วค้นพบชุดไทยที่ใกล้เคียงกับตัวคุณที่สุด', begin: 'เริ่มคำถามแรก',
    back: 'ย้อนกลับ', next: 'ถัดไป', finish: 'ดูผลลัพธ์', resEyebrow: 'ผลลัพธ์ของคุณ', cue: '↓ เลื่อนลงเพื่อค้นหาชุดของคุณ',
    costumeLabel: 'ชุดของคุณ', view: 'ดูชุดแบบเต็ม', restart: 'เริ่มใหม่อีกครั้ง', close: 'ปิด',
    male: 'ชาย', female: 'หญิง', imgErr: 'ไม่สามารถโหลดภาพชุดได้ กรุณาตรวจสอบไฟล์ภาพ', altPre: 'ภาพอ้างอิงชุด: ', q: 'คำถาม', of: 'จาก' },
  en: { brand: 'A JOURNEY THROUGH HERITAGE', title: 'YOUR PAST IS STILL WITHIN YOU',
    support: 'Discover the costume that reflects your story through the lens of heritage.', start: 'DISCOVER YOUR COSTUME',
    introEyebrow: 'BEFORE YOU BEGIN', introTitle: 'Four questions. One costume that is yours.',
    introText: 'Answer four short questions by instinct. There are no right or wrong answers. Then discover the Thai costume closest to who you are.', begin: 'BEGIN',
    back: 'BACK', next: 'NEXT', finish: 'SEE RESULT', resEyebrow: 'YOUR RESULT', cue: '↓ SCROLL TO DISCOVER YOUR COSTUME',
    costumeLabel: 'YOUR COSTUME', view: 'View Costume', restart: 'Start Again', close: 'Close',
    male: 'Male', female: 'Female', imgErr: 'The costume image could not be loaded. Please check the image file.', altPre: 'Reference image of ', q: 'Question', of: 'of' }
};

/* ---------- State ---------- */
var state = { lang: 'th', stage: 'landing', idx: 0, answers: [null, null, null, null], costume: null };
try { var sl = sessionStorage.getItem('lang'); if (sl === 'en' || sl === 'th') state.lang = sl; } catch (e) {}
var lastFocus = null;
var t = function (k) { return UI[state.lang][k]; };

/* ---------- Scoring (recomputed from stored answers, deterministic) ---------- */
function computeResult(ans) {
  var contrib = [0, 1, 2, 3].map(function (q) { return SCORES[q][ans[q]].map(function (v) { return v * WEIGHT[q]; }); });
  var total = TYPES.map(function (_, i) { return contrib.reduce(function (s, c) { return s + c[i]; }, 0); });
  var best = 0;
  for (var i = 1; i < 4; i++) {
    var d = total[i] - total[best];
    if (Math.abs(d) < 1e-9) {
      d = 0;
      for (var q = 3; q >= 0 && d === 0; q--) d = contrib[q][i] - contrib[q][best];
    }
    if (d > 1e-9) best = i; /* ties beyond Q1 keep earlier fixed order */
  }
  return MAP[TYPES[best]];
}

/* ---------- Rendering ---------- */
function applyStatic() {
  document.documentElement.lang = state.lang;
  document.querySelectorAll('[data-i18n]').forEach(function (el) { el.textContent = t(el.getAttribute('data-i18n')); });
  document.querySelectorAll('.lang button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.lang === state.lang)); });
  $('#close').setAttribute('aria-label', t('close'));
  $('#close').title = t('close');
  document.title = t('title');
}
function renderQuiz(animate) {
  var Q = QUESTIONS[state.idx], L = state.lang, n = state.idx + 1;
  $('#qLabel').textContent = Q.label[L];
  $('#qCount').textContent = '0' + n + ' / 04';
  $('#qCount').setAttribute('aria-label', t('q') + ' ' + n + ' ' + t('of') + ' 4');
  $('#bar').setAttribute('aria-valuenow', n);
  $('#bar').setAttribute('aria-label', t('q') + ' ' + n + ' ' + t('of') + ' 4');
  $('#barFill').style.width = (n / 4 * 100) + '%';
  $('#qText').textContent = Q.q[L];
  var box = $('#answers'); box.textContent = '';
  Q.a[L].forEach(function (txt, i) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'ans'; b.setAttribute('role', 'radio');
    b.setAttribute('aria-checked', String(state.answers[state.idx] === i));
    b.dataset.i = i;
    var l = document.createElement('span'); l.className = 'l'; l.textContent = 'ABCD'[i];
    var s = document.createElement('span'); s.textContent = txt;
    b.appendChild(l); b.appendChild(s); box.appendChild(b);
  });
  $('#back').textContent = t('back');
  $('#back').disabled = state.idx === 0;
  $('#nextLbl').textContent = state.idx === 3 ? t('finish') : t('next');
  $('#next').disabled = state.answers[state.idx] === null;
  if (animate) { var qb = $('#qBody'); qb.classList.remove('enter'); void qb.offsetWidth; qb.classList.add('enter'); }
}
function showImg(img, err, c) {
  var path = c.img;
  img.hidden = false; err.hidden = true;
  img.onload = function () { img.hidden = false; err.hidden = true; };
  img.onerror = function () {
    img.hidden = true; err.hidden = false;
    err.innerHTML = '';
    err.appendChild(document.createTextNode(t('imgErr')));
    var code = document.createElement('code'); code.textContent = path; err.appendChild(code);
  };
  img.alt = t('altPre') + c.name[state.lang];
  if (img.getAttribute('src') !== path) img.src = path;
}
function renderResult() {
  var c = COSTUMES[state.costume], L = state.lang;
  $('#resName').textContent = c.name[L];
  $('#resDesc').textContent = c.persona[L];
  $('#cName').textContent = c.name[L];
  $('#cDesc').textContent = c.desc[L];
  $('#cCap').textContent = '01 / 01 · ' + c.name[L];
  var dl = $('#cDetails'); dl.textContent = '';
  ['male', 'female'].forEach(function (k) {
    var d = document.createElement('div'), a = document.createElement('dt'), b = document.createElement('dd');
    a.textContent = t(k); b.textContent = c[k][L]; d.appendChild(a); d.appendChild(b); dl.appendChild(d);
  });
  showImg($('#cImg'), $('#imgErr'), c);
  if (!$('#modal').hidden) renderModal();
}
function renderModal() {
  var c = COSTUMES[state.costume];
  $('#mName').textContent = c.name[state.lang];
  showImg($('#mImg'), $('#mErr'), c);
}
function renderAll() {
  applyStatic();
  if (state.stage === 'quiz') renderQuiz(false);
  if (state.stage === 'result') renderResult();
}

/* ---------- Stage control ---------- */
function show(stage) {
  state.stage = stage;
  ['landing', 'intro', 'quiz', 'result'].forEach(function (s) {
    var el = $('#' + s); el.hidden = s !== stage;
  });
  var active = $('#' + stage);
  var st = stage === 'result' ? active.querySelector('.resintro') : active;
  [].forEach.call(document.querySelectorAll('.stage'), function (e) { e.classList.remove('in'); });
  void st.offsetWidth; st.classList.add('in');
  window.scrollTo(0, 0);
  if (stage === 'result') watchReveals();
}
var io = null;
function watchReveals() {
  var els = document.querySelectorAll('.rv');
  els.forEach(function (e) { e.classList.remove('show'); });
  if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('show'); }); return; }
  if (io) io.disconnect();
  io = new IntersectionObserver(function (ents) {
    ents.forEach(function (en, i) {
      if (en.isIntersecting) { en.target.style.transitionDelay = (i * 70) + 'ms'; en.target.classList.add('show'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12 });
  els.forEach(function (e) { io.observe(e); });
}
function goQ(next) {
  var qb = $('#qBody'); qb.classList.add('out');
  setTimeout(function () { qb.classList.remove('out'); state.idx = next; renderQuiz(true); }, 180);
}
function openModal() {
  lastFocus = document.activeElement; renderModal();
  $('#modal').hidden = false; document.body.classList.add('lock'); $('#close').focus();
}
function closeModal() {
  if ($('#modal').hidden) return;
  $('#modal').hidden = true; document.body.classList.remove('lock');
  if (lastFocus) lastFocus.focus();
}
function restart() {
  closeModal();
  state.answers = [null, null, null, null]; state.idx = 0; state.costume = null;
  renderQuiz(false); show('landing');
}

/* ---------- Events (bound once) ---------- */
document.querySelectorAll('.lang button').forEach(function (b) {
  b.addEventListener('click', function () {
    state.lang = b.dataset.lang;
    try { sessionStorage.setItem('lang', state.lang); } catch (e) {}
    renderAll();
  });
});
$('#start').addEventListener('click', function () { show('intro'); });
$('#begin').addEventListener('click', function () { state.idx = 0; renderQuiz(true); show('quiz'); });
$('#answers').addEventListener('click', function (e) {
  var b = e.target.closest('.ans'); if (!b) return;
  state.answers[state.idx] = +b.dataset.i;
  [].forEach.call(this.children, function (x) { x.setAttribute('aria-checked', String(x === b)); });
  $('#next').disabled = false;
});
$('#answers').addEventListener('keydown', function (e) {
  var k = e.key, items = [].slice.call(this.children), i = items.indexOf(document.activeElement);
  if (i < 0) return;
  var d = (k === 'ArrowDown' || k === 'ArrowRight') ? 1 : (k === 'ArrowUp' || k === 'ArrowLeft') ? -1 : 0;
  if (d) { e.preventDefault(); items[(i + d + 4) % 4].focus(); }
});
$('#back').addEventListener('click', function () { if (state.idx > 0) goQ(state.idx - 1); });
$('#next').addEventListener('click', function () {
  if (state.answers[state.idx] === null) return;
  if (state.idx < 3) { goQ(state.idx + 1); return; }
  state.costume = computeResult(state.answers);
  renderResult(); show('result');
  $('#resName').focus({ preventScroll: true });
});
$('#cue').addEventListener('click', function () { $('#costume').scrollIntoView({ behavior: 'smooth' }); });
$('#view').addEventListener('click', openModal);
$('#restart').addEventListener('click', restart);
$('#close').addEventListener('click', closeModal);
$('#backdrop').addEventListener('click', closeModal);
document.addEventListener('keydown', function (e) {
  if ($('#modal').hidden) return;
  if (e.key === 'Escape') closeModal();
  if (e.key === 'Tab') { e.preventDefault(); $('#close').focus(); }
});

applyStatic(); renderQuiz(false); show('landing');
})();
