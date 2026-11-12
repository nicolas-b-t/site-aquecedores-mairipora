/**
 * Aquecedores Mairiporã — script único da landing page.
 *
 * A página não tem formulário nem módulos interativos: o contato é feito
 * diretamente por WhatsApp, telefone ou e-mail. Este arquivo apenas mantém
 * o ano do rodapé atualizado.
 */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const currentYear = String(new Date().getFullYear());

  document.querySelectorAll('[data-current-year]').forEach((element) => {
    element.textContent = currentYear;
  });
});
