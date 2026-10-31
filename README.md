# Nexus Digital — Smart Web Experience

> Projeto desenvolvido para a disciplina **Padrões Web para No Code e Low Code** — UniFECAF

---

## Problema

Uma pequena empresa de serviços digitais não possuía presença web profissional. Seus clientes encontravam apenas informações básicas nas redes sociais e precisavam entrar em contato manualmente para tirar dúvidas ou solicitar serviços. Sem equipe de desenvolvimento, a empresa necessitava de uma solução rápida, acessível e funcional.

---

## Solução

Desenvolvimento de um **site institucional completo** para a empresa fictícia **Nexus Digital**, uma agência de serviços digitais. O site apresenta os serviços da empresa, permite interação com o usuário por meio de formulário de contato e conta com um **assistente virtual com IA embutida** que orienta os visitantes 24 horas por dia.

---

## Funcionalidades

- **Navbar responsiva** com menu hamburguer para mobile e destaque automático da seção ativa
- **Hero animado** com contadores estatísticos e cards flutuantes
- **Seção de serviços** com cards interativos e hover effects
- **Seção Sobre** com badge animado
- **Carrossel de depoimentos** com auto-play, navegação por dots e controles
- **Formulário de contato** com validação em JavaScript puro
- **Botão "voltar ao topo"** com aparecimento suave via scroll
- **Chatbot com IA simulada** — assistente virtual com respostas contextuais, captura de nome, sugestões dinâmicas e delay realista
- **Design totalmente responsivo** (mobile, tablet, desktop)

---

## Tecnologias e Ferramentas

| Camada | Tecnologia |
|--------|-----------|
| Estrutura | HTML5 semântico |
| Estilo | CSS3 (variáveis, Grid, Flexbox, animações) |
| Comportamento | JavaScript ES6+ (DOM API, Intersection Observer) |
| Hospedagem | Netlify (plataforma low-code de deploy) |
| Fontes | Google Fonts — Inter |

---

## Personalizações com Padrões Web

### HTML
- Estrutura semântica com `<nav>`, `<section>`, `<footer>`, `<article>`, `<form>`
- Atributos de acessibilidade (`aria-label`, `role`, `for`, `required`, `novalidate`)
- Meta tags para SEO e responsividade

### CSS
- **CSS Custom Properties (variáveis)** para sistema de design consistente
- **CSS Grid** nas grades de serviços e footer
- **Flexbox** para alinhamento de componentes
- **Media Queries** para responsividade completa (480px, 768px, 1024px)
- **Keyframe Animations** — fadeInUp, float, pulse-glow, orb-move, typing-bounce
- **Glassmorphism** — backdrop-filter nos cards e navbar
- **Gradiente de texto** com `background-clip: text`
- **Intersection Observer** via CSS classes + JS para reveal on scroll

### JavaScript
- **Intersection Observer API** — animações de entrada ao scrollar
- **DOM API** — manipulação dinâmica de elementos
- **Event Listeners** — scroll, click, keydown, mouseenter/leave
- **Chatbot com base de conhecimento** — correspondência por palavras-chave, respostas contextuais, captura de estado da conversa
- **Validação de formulário** — verificação em tempo real sem bibliotecas externas
- **Animação de contadores** — incremento numérico suave via `setInterval`
- **Slider/Carrossel** — lógica de slide manual com auto-play e dots

---

## Recurso Inteligente — Chatbot com IA Simulada

O assistente virtual **"Assistente Nexus"** utiliza:

- **Base de conhecimento estruturada** (knowledgeBase) com categorias de intenção
- **Reconhecimento de intenção por palavras-chave** sem bibliotecas externas
- **Gerenciamento de estado da conversa** (`conversationStep`, `userName`)
- **Personalização por nome** — captura o nome do usuário e o utiliza nas respostas
- **Delay realista de digitação** — simula tempo de resposta humano
- **Sugestões dinâmicas (chips)** — guiam o usuário por tópicos relevantes
- **Navegação integrada** — os chips podem rolar a página para seções específicas
- **Formatação de texto** — suporte a negrito via markdown simples

---

## Responsividade e Acessibilidade

- Layout adaptado para 3 breakpoints: 480px, 768px e 1024px
- Menu hamburguer funcional no mobile com bloqueio de scroll
- Todos os botões com `aria-label`
- Inputs com `label` associado via `for`
- Formulário com `novalidate` + validação manual acessível
- Contraste de cores adequado (fundo escuro + texto claro)
- Animações respeitam preferências do usuário (podem ser desativadas via CSS `prefers-reduced-motion`)

---

## Limitações e Aprendizados

**Limitações:**
- O chatbot usa correspondência por palavras-chave; para NLP real seria necessária uma API (ex: OpenAI, Dialogflow)
- O formulário não possui backend; em produção exigiria integração com serviço de e-mail (ex: Formspree, EmailJS)
- Sem banco de dados para persistir conversas do chatbot entre sessões

**Aprendizados:**
- Mesmo sem framework, é possível construir interfaces profissionais e interativas com HTML, CSS e JS puros
- O Intersection Observer é uma alternativa moderna e eficiente às animações por scroll via `addEventListener('scroll')`
- Plataformas low-code como Netlify permitem deploy profissional sem necessidade de servidor

---

## Como acessar

**Link público:** [https://projetofaculdadelow.netlify.app](https://projetofaculdadelow.netlify.app)

**Ou rodar localmente:**
1. Clone ou baixe a pasta do projeto
2. Abra `index.html` no navegador
3. Não requer servidor — funciona como arquivo estático

---

## Prints da aplicação

> *(Inserir prints após publicação)*

---

*Projeto desenvolvido como parte da disciplina Padrões Web para No Code e Low Code — UniFECAF, 2025.*
