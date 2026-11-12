/**
 * Aquecedores Mairiporã — comportamento da landing page.
 *
 * A página é estática: o resumo do pedido é montado no navegador e nenhum
 * dado é enviado a servidores. Os canais de envio são configurados em
 * SITE_CONFIG somente depois de validados com a empresa.
 */
'use strict';

const SITE_CONFIG = {
  brandName: 'Aquecedores Mairiporã',

  // Preencha apenas após validar os dados com a empresa.
  // WhatsApp no formato DDI + DDD + número, somente dígitos. Ex.: '5511999999999'.
  whatsapp: '',

  // E-mail de contato validado. Ex.: 'contato@exemplo.com.br'.
  email: ''
};

document.addEventListener('DOMContentLoaded', () => {
  initLgpdConsent();
  initUtmCapture();
  initServiceSelection();
  initLeadForm();
  initCurrentYear();
});

/**
 * Banner e modal de privacidade (LGPD).
 * Usa apenas uma marca local para lembrar a escolha do visitante.
 */
function initLgpdConsent() {
  const banner = document.querySelector('[data-lgpd-banner]');
  const dialog = document.getElementById('dialog-lgpd');
  const openBtns = document.querySelectorAll('[data-open-lgpd-modal]');
  const acceptBtns = document.querySelectorAll('[data-accept-lgpd]');

  let accepted = false;
  try {
    accepted = localStorage.getItem('aqm_lgpd_accepted') === 'true';
  } catch (_) {}

  if (banner && !accepted) {
    banner.hidden = false;
  }

  openBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (dialog && typeof dialog.showModal === 'function') {
        dialog.showModal();
      }
    });
  });

  acceptBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      try {
        localStorage.setItem('aqm_lgpd_accepted', 'true');
      } catch (_) {}
      if (banner) banner.hidden = true;
      if (dialog && dialog.open) dialog.close();
    });
  });
}

/**
 * Copia UTMs da URL para os campos ocultos e pré-seleciona o serviço
 * quando a página é aberta com ?servico=... (ex.: link de campanha).
 */
function initUtmCapture() {
  const urlParams = new URLSearchParams(window.location.search);
  const utmFields = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

  utmFields.forEach((param) => {
    const value = urlParams.get(param);
    const input = document.getElementById(param);
    if (value && input) {
      input.value = value;
    }
  });

  const requestedService = urlParams.get('servico');
  const serviceSelect = document.getElementById('lead-service');
  if (requestedService && serviceSelect) {
    const normalized = requestedService.trim().toLowerCase();
    const match = Array.from(serviceSelect.options).find(
      (option) => option.value.toLowerCase() === normalized
    );
    if (match) {
      serviceSelect.value = match.value;
    }
  }
}

/**
 * Botões "Pedir orçamento" dos cartões pré-selecionam o serviço.
 */
function initServiceSelection() {
  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-select-service]');
    if (!trigger) return;

    const serviceName = trigger.getAttribute('data-select-service');
    const serviceSelect = document.getElementById('lead-service');

    if (serviceSelect && serviceName) {
      serviceSelect.value = serviceName;
      serviceSelect.removeAttribute('aria-invalid');
      const serviceError = document.getElementById('service-error');
      if (serviceError) serviceError.classList.remove('is-visible');
    }

    const href = trigger.getAttribute('href');
    if (href && href.startsWith('#')) {
      const target = document.querySelector(href);
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
        const nameInput = document.getElementById('lead-name');
        if (nameInput) nameInput.focus({ preventScroll: true });
      }
    }
  });
}

/**
 * Validação do formulário e montagem do resumo local.
 */
function initLeadForm() {
  const form = document.getElementById('lead-form');
  const feedbackEl = document.getElementById('form-feedback');

  if (!form || !feedbackEl) return;

  const nameInput = document.getElementById('lead-name');
  const emailInput = document.getElementById('lead-email');
  const phoneInput = document.getElementById('lead-phone');
  const serviceSelect = document.getElementById('lead-service');
  const messageInput = document.getElementById('lead-message');
  const consentInput = document.getElementById('lead-consent');

  const fields = [
    { input: nameInput, error: 'name-error', validate: (value) => value.trim().length >= 2 },
    {
      input: emailInput,
      error: 'email-error',
      validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
    },
    { input: serviceSelect, error: 'service-error', validate: (value) => value.trim() !== '' },
    {
      input: consentInput,
      error: 'consent-error',
      validate: (_, input) => Boolean(input && input.checked)
    }
  ];

  const phoneIsValid = (value) => {
    if (value.trim() === '') return true;
    const digits = value.replace(/\D/g, '');
    return digits.length >= 10;
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    feedbackEl.className = 'form-feedback';
    feedbackEl.replaceChildren();
    feedbackEl.setAttribute('aria-live', 'polite');

    const invalidFields = [];

    fields.forEach(({ input, error, validate }) => {
      if (!input) return;
      const valid = validate(input.value, input);
      setFieldState(input, valid);
      const errorEl = document.getElementById(error);
      if (errorEl) errorEl.classList.toggle('is-visible', !valid);
      if (!valid) invalidFields.push({ input, error });
    });

    if (phoneInput) {
      const validPhone = phoneIsValid(phoneInput.value);
      setFieldState(phoneInput, validPhone);
      const phoneError = document.getElementById('phone-error');
      if (phoneError) phoneError.classList.toggle('is-visible', !validPhone);
      if (!validPhone) invalidFields.push({ input: phoneInput, error: 'phone-error' });
    }

    if (invalidFields.length > 0) {
      const heading = document.createElement('p');
      heading.textContent = 'Revise os campos destacados:';

      const list = document.createElement('ul');
      invalidFields.forEach(({ input, error }) => {
        const item = document.createElement('li');
        const link = document.createElement('a');
        link.href = `#${input.id}`;
        link.textContent =
          document.getElementById(error)?.textContent || 'Corrija este campo.';
        link.addEventListener('click', () => input.focus());
        item.append(link);
        list.append(item);
      });

      feedbackEl.replaceChildren(heading, list);
      feedbackEl.className = 'form-feedback error';
      feedbackEl.setAttribute('aria-live', 'assertive');
      feedbackEl.focus();
      return;
    }

    const payload = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      phone: phoneInput ? phoneInput.value.trim() : '',
      selected_service: serviceSelect.value.trim(),
      message: messageInput ? messageInput.value.trim() : '',
      consent: Boolean(consentInput && consentInput.checked),
      utm_source: document.getElementById('utm_source')?.value || '',
      utm_medium: document.getElementById('utm_medium')?.value || '',
      utm_campaign: document.getElementById('utm_campaign')?.value || '',
      utm_term: document.getElementById('utm_term')?.value || '',
      utm_content: document.getElementById('utm_content')?.value || '',
      timestamp: new Date().toISOString()
    };

    renderSummary(feedbackEl, payload);
  });

  fields.forEach(({ input }) => {
    if (!input) return;
    const eventName = input.type === 'checkbox' || input.tagName === 'SELECT' ? 'change' : 'input';
    input.addEventListener(eventName, () => {
      if (input.getAttribute('aria-invalid') === 'true') {
        setFieldState(input, true);
        const errorEl = document.getElementById(input.getAttribute('aria-describedby') || '');
        if (errorEl) errorEl.classList.remove('is-visible');
      }
    });
  });

  if (phoneInput) {
    phoneInput.addEventListener('input', () => {
      if (phoneInput.getAttribute('aria-invalid') === 'true') {
        setFieldState(phoneInput, true);
        document.getElementById('phone-error')?.classList.remove('is-visible');
      }
    });
  }
}

function setFieldState(input, isValid) {
  if (!input) return;
  if (isValid) {
    input.setAttribute('aria-invalid', 'false');
  } else {
    input.setAttribute('aria-invalid', 'true');
  }
}

function buildSummaryLines(payload) {
  return [
    `Solicitação de orçamento — ${SITE_CONFIG.brandName}`,
    '',
    `Nome: ${payload.name}`,
    `E-mail: ${payload.email}`,
    payload.phone ? `Telefone/WhatsApp: ${payload.phone}` : null,
    `Serviço: ${payload.selected_service}`,
    payload.message ? `Detalhes: ${payload.message}` : null,
    '',
    `Origem: ${payload.utm_source || 'acesso direto'}`,
    `Registrado em: ${new Date(payload.timestamp).toLocaleString('pt-BR')}`
  ]
    .filter((line) => line !== null)
    .join('\n');
}

function renderSummary(feedbackEl, payload) {
  const summary = buildSummaryLines(payload);

  const heading = document.createElement('p');
  heading.textContent = 'Resumo do pedido gerado. Revise e envie pelo canal que preferir:';

  const summaryBox = document.createElement('pre');
  summaryBox.className = 'lead-summary';
  summaryBox.textContent = summary;

  const actions = document.createElement('div');
  actions.className = 'feedback-actions';

  const copyBtn = document.createElement('button');
  copyBtn.type = 'button';
  copyBtn.className = 'btn btn-primary btn-sm';
  copyBtn.setAttribute('data-icon', 'file-text');
  copyBtn.textContent = 'Copiar resumo';
  copyBtn.addEventListener('click', async () => {
    const copied = await copyText(summary);
    copyBtn.textContent = copied ? 'Resumo copiado' : 'Não foi possível copiar';
    window.setTimeout(() => {
      copyBtn.textContent = 'Copiar resumo';
    }, 2500);
  });

  actions.append(copyBtn);

  const whatsappNumber = SITE_CONFIG.whatsapp.replace(/\D/g, '');
  if (whatsappNumber) {
    const waLink = document.createElement('a');
    waLink.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(summary)}`;
    waLink.target = '_blank';
    waLink.rel = 'noopener noreferrer';
    waLink.className = 'btn btn-secondary btn-sm';
    waLink.setAttribute('data-icon', 'message-circle');
    waLink.textContent = 'Abrir no WhatsApp';
    actions.append(waLink);
  }

  if (SITE_CONFIG.email) {
    const subject = encodeURIComponent(`Orçamento — ${payload.selected_service}`);
    const body = encodeURIComponent(summary);
    const mailLink = document.createElement('a');
    mailLink.href = `mailto:${SITE_CONFIG.email}?subject=${subject}&body=${body}`;
    mailLink.className = 'btn btn-secondary btn-sm';
    mailLink.setAttribute('data-icon', 'mail');
    mailLink.textContent = 'Abrir no e-mail';
    actions.append(mailLink);
  }

  feedbackEl.replaceChildren(heading, summaryBox, actions);

  if (!whatsappNumber && !SITE_CONFIG.email) {
    const note = document.createElement('p');
    note.className = 'form-privacy';
    note.textContent =
      'Os canais de envio ainda serão validados com a empresa. Copie o resumo e envie pelo canal de sua preferência.';
    feedbackEl.append(note);
  }

  feedbackEl.className = 'form-feedback success';
  feedbackEl.focus();
}

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (_) {}
  }

  const helper = document.createElement('textarea');
  helper.value = text;
  helper.setAttribute('readonly', '');
  helper.style.position = 'fixed';
  helper.style.opacity = '0';
  document.body.append(helper);
  helper.select();

  let copied = false;
  try {
    copied = document.execCommand('copy');
  } catch (_) {}

  helper.remove();
  return copied;
}

/**
 * Atualiza o ano do rodapé sem fixar a data no HTML.
 */
function initCurrentYear() {
  document.querySelectorAll('[data-current-year]').forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });
}
