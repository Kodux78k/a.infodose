// js/app.js

async function carregarCombinacoes() {
  try {
    const resposta = await fetch('https://raw.githubusercontent.com/Kodux78k/a.Infodose/main/metapulso_70_combinacoes.json');
    const combinacoes = await resposta.json();
    localStorage.setItem('combinacoesAssistente', JSON.stringify(combinacoes));
    console.log('Combinações carregadas com sucesso!');
  } catch (erro) {
    console.error('Erro ao carregar combinações:', erro);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (!localStorage.getItem('combinacoesAssistente')) {
    carregarCombinacoes();
  }
});
// js/app.js

function salvarConfiguracaoAssistente(configuracao) {
  localStorage.setItem('configuracaoAssistente', JSON.stringify(configuracao));
}

function obterConfiguracaoAssistente() {
  const configuracao = localStorage.getItem('configuracaoAssistente');
  return configuracao ? JSON.parse(configuracao) : null;
}

// Exemplo de uso:
const configuracao = {
  nomeUsuario: 'Kodux',
  nomeAssistente: 'Kodux Dual.Infodose',
  emojis: ['⚡️', '⭕️', '⚡️'],
  fraseVibracional: 'Pulso. Pulso. Pulso!'
};

salvarConfiguracaoAssistente(configuracao);