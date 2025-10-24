document.addEventListener('DOMContentLoaded', function() {
  const wrapper = document.getElementById('content-wrapper');
  const toggleButton = document.getElementById('accessibility-toggle');
  const widget = document.getElementById('accessibility-widget');

  // Grupos mutuamente exclusivos (só um por grupo pode estar ativo)
  const groups = {
    contrast: ['contrast-invert', 'contrast-dark', 'contrast-light'],
    'text-size': ['text-size-1', 'text-size-2', 'text-size-3', 'text-size-4'],
    spacing: ['spacing-light', 'spacing-moderate', 'spacing-heavy'],
    'line-height': ['line-height-1.5', 'line-height-1.75', 'line-height-2'],
    saturation: ['saturation-high', 'saturation-low', 'saturation-desaturate'],
    colorblind: ['colorblind-protanopia', 'colorblind-deuteranopia', 'colorblind-tritanopia', 'colorblind-achromatopsia'],
  };

  // Opções independentes (podem ser toggled individualmente)
  const independents = ['highlight-links', 'pause-animations', 'hide-images', 'dyslexia-friendly', 'big-cursor', 'reading-mask', 'screen-reader'];

  // Inicializa a API de síntese de voz
  let speech = null;

  // Função para ler o texto do wrapper
  function readContent() {
    // Cancela qualquer leitura anterior
    window.speechSynthesis.cancel();

    // Cria um novo utterance com o texto do wrapper
    speech = new SpeechSynthesisUtterance();
    const content = wrapper.textContent.trim();
    speech.text = content;
    speech.lang = 'pt-BR'; // Define o idioma como português brasileiro
    speech.rate = 1; // Velocidade normal
    speech.pitch = 1; // Tom padrão
    speech.volume = 1; // Volume máximo

    // Inicia a leitura
    window.speechSynthesis.speak(speech);
  }

  // Toggle a visibilidade do widget
  toggleButton.addEventListener('click', function() {
    widget.style.display = widget.style.display === 'none' ? 'block' : 'none';
  });

  // Lida com cliques nos botões do widget
  const buttons = widget.querySelectorAll('button[data-action]');
  buttons.forEach(button => {
    button.addEventListener('click', function() {
      const action = button.dataset.action;

      if (action === 'reset') {
        // Remove todas as classes de acessibilidade
        for (let group in groups) {
          groups[group].forEach(cls => wrapper.classList.remove(cls));
        }
        independents.forEach(cls => wrapper.classList.remove(cls));
        // Cancela a leitura de tela
        window.speechSynthesis.cancel();
      } else if (action === 'screen-reader') {
        // Toggle leitura de tela
        if (wrapper.classList.contains('screen-reader')) {
          // Se já está ativo, desativa e para a leitura
          wrapper.classList.remove('screen-reader');
          window.speechSynthesis.cancel();
        } else {
          // Ativa e inicia a leitura
          wrapper.classList.add('screen-reader');
          readContent();
        }
      } else {
        let foundGroup = null;
        for (let group in groups) {
          if (groups[group].includes(action)) {
            foundGroup = group;
            break;
          }
        }

        if (foundGroup) {
          // Se a ação já está ativa, remove-a
          if (wrapper.classList.contains(action)) {
            wrapper.classList.remove(action);
          } else {
            // Remove todas do grupo e adiciona a selecionada
            groups[foundGroup].forEach(cls => wrapper.classList.remove(cls));
            wrapper.classList.add(action);
          }
        } else {
          // Toggle independente (exceto screen-reader, tratado acima)
          wrapper.classList.toggle(action);
        }
      }
    });
  });
});