/* ============================================================
   NEXUS DIGITAL — JavaScript
   Padrões Web: DOM API, Intersection Observer, Event Listeners,
   Scroll API, Animações, Chatbot com IA Simulada
   ============================================================ */

'use strict';

// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const allNavLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  updateActiveNavLink();
  toggleScrollTopBtn();
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) current = section.getAttribute('id');
  });
  allNavLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}

// ===== REVEAL ON SCROLL (Intersection Observer) =====
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

// ===== COUNTER ANIMATION =====
function animateCounter(el, target, duration = 1800) {
  let start = 0;
  const step = Math.ceil(target / (duration / 16));
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      el.textContent = target;
      clearInterval(timer);
    } else {
      el.textContent = start;
    }
  }, 16);
}

const counters = document.querySelectorAll('.stat-number');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = parseInt(entry.target.dataset.target);
      animateCounter(entry.target, target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

counters.forEach(counter => counterObserver.observe(counter));

// ===== TESTIMONIALS SLIDER =====
const track = document.getElementById('testimonialsTrack');
const cards = track?.querySelectorAll('.testimonial-card') ?? [];
const dotsContainer = document.getElementById('tDots');
const prevBtn = document.getElementById('tPrev');
const nextBtn = document.getElementById('tNext');

let currentSlide = 0;
const slidesPerView = window.innerWidth <= 768 ? 1 : 2;
const totalSlides = Math.ceil(cards.length / slidesPerView);

function createDots() {
  if (!dotsContainer) return;
  dotsContainer.innerHTML = '';
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('button');
    dot.className = `t-dot${i === 0 ? ' active' : ''}`;
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  }
}

function goToSlide(index) {
  currentSlide = Math.max(0, Math.min(index, totalSlides - 1));
  const offset = currentSlide * (100 / slidesPerView);
  track.style.transform = `translateX(-${offset}%)`;
  dotsContainer?.querySelectorAll('.t-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
  });
}

prevBtn?.addEventListener('click', () => goToSlide(currentSlide - 1));
nextBtn?.addEventListener('click', () => goToSlide(currentSlide + 1));

createDots();

// Auto-slide
let autoSlideTimer = setInterval(() => goToSlide((currentSlide + 1) % totalSlides), 5000);
track?.addEventListener('mouseenter', () => clearInterval(autoSlideTimer));
track?.addEventListener('mouseleave', () => {
  autoSlideTimer = setInterval(() => goToSlide((currentSlide + 1) % totalSlides), 5000);
});

// ===== CONTACT FORM =====
const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.getElementById('btnText');
const btnLoading = document.getElementById('btnLoading');
const formSuccess = document.getElementById('formSuccess');

function validateField(id, errorId, validator, message) {
  const field = document.getElementById(id);
  const error = document.getElementById(errorId);
  if (!field || !error) return true;
  const valid = validator(field.value.trim());
  error.textContent = valid ? '' : message;
  field.style.borderColor = valid ? '' : 'var(--error)';
  return valid;
}

form?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const validName = validateField('name', 'nameError',
    v => v.length >= 2, 'Nome deve ter pelo menos 2 caracteres.');
  const validEmail = validateField('email', 'emailError',
    v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'E-mail inválido.');
  const validService = validateField('service', 'serviceError',
    v => v !== '', 'Selecione um serviço.');

  if (!validName || !validEmail || !validService) return;

  btnText.style.display = 'none';
  btnLoading.style.display = 'inline';
  submitBtn.disabled = true;

  // Simula envio (replace com integração real)
  await new Promise(resolve => setTimeout(resolve, 1800));

  btnText.style.display = 'inline';
  btnLoading.style.display = 'none';
  submitBtn.disabled = false;
  form.reset();
  formSuccess.style.display = 'block';
  setTimeout(() => formSuccess.style.display = 'none', 5000);
});

// ===== SCROLL TO TOP =====
const scrollTopBtn = document.getElementById('scrollTop');

function toggleScrollTopBtn() {
  scrollTopBtn?.classList.toggle('visible', window.scrollY > 400);
}

scrollTopBtn?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== AI CHATBOT (Google Gemini via Netlify Function) =====
const chatToggle = document.getElementById('chatToggle');
const chatBox = document.getElementById('chatBox');
const chatCloseBtn = document.getElementById('chatCloseBtn');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');
const chatSuggestions = document.getElementById('chatSuggestions');
const chatBadge = document.getElementById('chatBadge');
const chatIconOpen = document.querySelector('.chat-icon-open');
const chatIconClose = document.querySelector('.chat-icon-close');

// Detecta se está rodando local (file://) ou no Netlify (https://)
const IS_LOCAL = window.location.protocol === 'file:' || window.location.hostname === 'localhost';

const SYSTEM_PROMPT = `Você é o assistente virtual da Nexus Digital, mas age como se fosse um atendente humano chamado "Lucas". Trabalha na Nexus Digital há 2 anos e adora o que faz.

Fale de forma natural, como numa conversa de WhatsApp — sem parecer um robô. Use linguagem descontraída mas profissional. Evite respostas longas e formais. Seja direto, empático e gentil. Use emojis com naturalidade, não em excesso.

Quando o usuário parecer em dúvida, faça uma pergunta para entender melhor o que ele precisa. Se ele estiver animado, entre no clima. Se estiver com pressa, vá direto ao ponto.

Informações que você conhece de cor:
- Serviços: criação de sites, marketing digital, gestão de redes sociais, automação com IA, automação de processos e consultoria digital
- Contato: WhatsApp (11) 99999-0000 | e-mail contato@nexusdigital.com.br
- Atendemos em todo o Brasil, de forma remota
- Prazos médios: sites simples em 7 a 10 dias, e-commerce em 15 a 25 dias, automações em 5 a 15 dias
- Preços variam por projeto — sempre incentive o cliente a pedir um orçamento gratuito

Nunca invente preços específicos. Se não souber algo, seja honesto e diga que vai verificar com a equipe.

Responda sempre em português do Brasil.`;

let chatOpen = false;
// Histórico da conversa enviado ao Gemini para manter contexto
const conversationHistory = [];

// Chips de sugestão padrão por contexto
const defaultSuggestions = [
  'Quais serviços vocês oferecem?',
  'Quanto custa um site?',
  'Solicitar orçamento',
];

// Chips especiais que navegam na página (sem chamar a IA)
const navigationChips = {
  'ver serviços': () => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }),
  'solicitar orçamento': () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }),
  'ir para o formulário': () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }),
};

// Formata markdown simples (negrito e quebras de linha)
function formatText(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br />');
}

function getTime() {
  return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function addMessage(text, type = 'bot') {
  const msg = document.createElement('div');
  msg.className = `chat-msg ${type}`;
  msg.innerHTML = `
    <div class="chat-bubble">${formatText(text)}</div>
    <div class="chat-time">${getTime()}</div>
  `;
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTyping() {
  const typing = document.createElement('div');
  typing.className = 'chat-msg bot typing-indicator';
  typing.id = 'typingIndicator';
  typing.innerHTML = `
    <div class="chat-bubble">
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    </div>
  `;
  chatMessages.appendChild(typing);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTyping() {
  document.getElementById('typingIndicator')?.remove();
}

function showSuggestions(suggestions = defaultSuggestions) {
  chatSuggestions.innerHTML = '';
  suggestions.forEach(label => {
    const chip = document.createElement('button');
    chip.className = 'suggestion-chip';
    chip.textContent = label;
    chip.addEventListener('click', () => sendMessage(label));
    chatSuggestions.appendChild(chip);
  });
}

// ===== FALLBACK LOCAL (usado quando abre o arquivo direto no navegador) =====
const localKB = {
  greetings: ['oi', 'olá', 'ola', 'bom dia', 'boa tarde', 'boa noite', 'hello'],
  services:  ['serviço', 'servico', 'oferecem', 'fazem', 'trabalham', 'o que'],
  site:      ['site', 'website', 'página', 'pagina', 'desenvolvimento'],
  marketing: ['marketing', 'tráfego', 'trafego', 'ads', 'seo', 'google', 'meta'],
  social:    ['redes sociais', 'instagram', 'facebook', 'conteúdo', 'conteudo'],
  ia:        ['ia', 'inteligência', 'chatbot', 'automação', 'automacao', 'bot'],
  price:     ['preço', 'preco', 'valor', 'custo', 'quanto custa', 'orçamento'],
  time:      ['prazo', 'tempo', 'quanto tempo', 'demora', 'entrega'],
  contact:   ['contato', 'falar', 'telefone', 'email', 'humano'],
  thanks:    ['obrigado', 'obrigada', 'valeu', 'grato'],
  bye:       ['tchau', 'bye', 'até logo', 'falou'],
};

function getLocalResponse(input) {
  const t = input.toLowerCase();
  if (localKB.greetings.some(w => t.includes(w)))
    return { text: 'Olá! Seja bem-vindo(a) à **Nexus Digital**! 🚀 Como posso te ajudar?', suggestions: ['Ver serviços', 'Solicitar orçamento', 'Falar com equipe'] };
  if (localKB.services.some(w => t.includes(w)))
    return { text: 'Oferecemos:\n🌐 Criação de Sites\n📱 Marketing Digital\n📣 Gestão de Redes Sociais\n🤖 Automação com IA\n⚡ Automação de Processos\n📊 Consultoria Digital', suggestions: ['Solicitar orçamento', 'Quanto custa?'] };
  if (localKB.site.some(w => t.includes(w)))
    return { text: 'Criamos sites modernos, responsivos e otimizados para SEO. Entrega em 7 a 15 dias úteis! ✅', suggestions: ['Quanto custa?', 'Solicitar orçamento'] };
  if (localKB.marketing.some(w => t.includes(w)))
    return { text: 'Trabalhamos com Google Ads, Meta Ads e SEO para aumentar sua visibilidade online! 📈', suggestions: ['Solicitar orçamento', 'Falar com equipe'] };
  if (localKB.ia.some(w => t.includes(w)))
    return { text: 'Implementamos chatbots e automações com IA para atendimento 24/7! 🤖', suggestions: ['Solicitar orçamento', 'Quanto custa?'] };
  if (localKB.social.some(w => t.includes(w)))
    return { text: 'Gerenciamos suas redes sociais com criação de conteúdo, agendamento e relatórios mensais! 📣', suggestions: ['Solicitar orçamento'] };
  if (localKB.price.some(w => t.includes(w)))
    return { text: 'Os valores variam conforme o projeto. Entre em contato para um orçamento gratuito! 💰', suggestions: ['Ir para o formulário', 'Falar com equipe'] };
  if (localKB.time.some(w => t.includes(w)))
    return { text: 'Sites: 7–15 dias | E-commerce: 15–25 dias | Automações: 5–15 dias ⏱️', suggestions: ['Solicitar orçamento'] };
  if (localKB.contact.some(w => t.includes(w)))
    return { text: '📧 contato@nexusdigital.com.br\n📱 (11) 99999-0000\nAtendimento remoto em todo o Brasil!', suggestions: ['Ir para o formulário'] };
  if (localKB.thanks.some(w => t.includes(w)))
    return { text: 'Disponha! 😊 Se precisar de mais alguma coisa, é só chamar!', suggestions: defaultSuggestions };
  if (localKB.bye.some(w => t.includes(w)))
    return { text: 'Até mais! 👋 Quando quiser modernizar seu negócio, estamos aqui! 🚀', suggestions: [] };
  return { text: 'Posso te ajudar com informações sobre nossos serviços, preços e prazos. O que gostaria de saber? 😊', suggestions: defaultSuggestions };
}

// Chama OpenAI direto do browser (apenas local — chave visível só na máquina do dev)
async function callOpenAIDirect(userMessage) {
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...conversationHistory.map(({ role, text }) => ({
      role: role === 'model' ? 'assistant' : 'user',
      content: text,
    })),
    { role: 'user', content: userMessage },
  ];

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LOCAL_OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        max_tokens: 512,
        temperature: 0.7,
      }),
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(`OpenAI ${res.status}: ${err?.error?.message ?? 'erro desconhecido'}`);
    }

    const data = await res.json();
    console.log('✅ OpenAI respondeu:', data.model);
    return data.choices?.[0]?.message?.content ?? 'Não consegui gerar uma resposta.';
  } catch (err) {
    clearTimeout(timer);
    if (err.name === 'AbortError') throw new Error('Timeout — a OpenAI demorou mais de 15s para responder.');
    throw err;
  }
}

// Chama a Netlify Function que faz a requisição ao Gemini (só no ar)
async function callGemini(userMessage) {
  const response = await fetch('/.netlify/functions/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: userMessage,
      history: conversationHistory,
    }),
  });

  if (!response.ok) throw new Error(`Erro ${response.status}`);
  const data = await response.json();
  return data.text;
}

async function sendMessage(input) {
  const userText = (input || chatInput.value).trim();
  if (!userText) return;

  chatInput.value = '';
  chatSuggestions.innerHTML = '';
  addMessage(userText, 'user');

  // Chips de navegação (não chamam IA)
  const navKey = userText.toLowerCase();
  if (navigationChips[navKey]) {
    navigationChips[navKey]();
    addMessage('Rolando para a seção! 👆 Posso te ajudar com mais alguma coisa?');
    showSuggestions();
    return;
  }

  conversationHistory.push({ role: 'user', text: userText });
  showTyping();
  chatInput.disabled = true;
  chatSend.disabled = true;

  try {
    let botText;

    if (IS_LOCAL && typeof LOCAL_OPENAI_KEY !== 'undefined' && LOCAL_OPENAI_KEY !== 'COLE_SUA_CHAVE_AQUI') {
      // Modo local com chave OpenAI configurada
      botText = await callOpenAIDirect(userText);
      removeTyping();
      conversationHistory.push({ role: 'model', text: botText });
      addMessage(botText);
      showSuggestions();
    } else if (IS_LOCAL) {
      // Modo local sem chave: usa respostas prontas
      await new Promise(r => setTimeout(r, 700 + Math.random() * 500));
      const local = getLocalResponse(userText);
      removeTyping();
      conversationHistory.push({ role: 'model', text: local.text });
      addMessage(local.text);
      showSuggestions(local.suggestions);
    } else {
      // Modo produção (Netlify): chama o Gemini via Function segura
      botText = await callGemini(userText);
      removeTyping();
      conversationHistory.push({ role: 'model', text: botText });
      addMessage(botText);
      showSuggestions();
    }
  } catch (err) {
    removeTyping();
    console.error('Erro ao chamar Gemini:', err);
    addMessage(`Desculpe, tive um problema técnico. 😅\n\n**Erro:** ${err.message}\n\nEntre em contato pelo WhatsApp: **(11) 99999-0000**`);
    showSuggestions();
  } finally {
    chatInput.disabled = false;
    chatSend.disabled = false;
    chatInput.focus();
  }
}

// Abrir/fechar chat
function toggleChat() {
  chatOpen = !chatOpen;
  chatBox.style.display = chatOpen ? 'block' : 'none';
  chatIconOpen.style.display = chatOpen ? 'none' : 'inline';
  chatIconClose.style.display = chatOpen ? 'inline' : 'none';
  chatBadge.style.display = 'none';

  if (chatOpen && chatMessages.children.length === 0) {
    // Mensagem de boas-vindas
    setTimeout(() => {
      showTyping();
      setTimeout(() => {
        removeTyping();
        addMessage('Oi! 👋 Tudo bem? Sou o Lucas, da Nexus Digital! Posso te ajudar com alguma coisa?');
        showSuggestions();
      }, 1000);
    }, 300);
  }
}

chatToggle.addEventListener('click', toggleChat);
chatCloseBtn.addEventListener('click', toggleChat);

chatSend.addEventListener('click', () => sendMessage());
chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendMessage();
});

// Badge de notificação inicial
setTimeout(() => {
  if (!chatOpen) {
    chatBadge.style.display = 'grid';
  }
}, 3000);

// ===== SMOOTH ANCHOR SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
