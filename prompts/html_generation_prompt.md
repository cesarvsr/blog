# PROMPT PARA GERAÇÃO DE RESUMO HTML (IA)

Copie o texto abaixo e insira no seu modelo de IA (ChatGPT, Gemini, Claude) junto com o texto que você quer resumir:

> "Preciso que você atue como um web designer especialista e crie um resumo altamente visual, dinâmico e esteticamente premium, focado na melhor experiência de leitura possível.
>
> ⚠️ **REGRAS ESTRITAS DE CÓDIGO (SELF-CONTAINED HTML):**
> 1. Você deve me entregar **Apenas 1 ÚNICO ARQUIVO HTML**.
> 2. O arquivo DEVE conter `<html>`, `<head>`, e `<body>`.
> 3. Inclua a CDN do Tailwind CSS no head EXATAMENTE assim: `<script src="https://cdn.tailwindcss.com"></script>`
> 4. É PROIBIDO criar arquivos `.css` ou `.js` separados. Qualquer estilização ou script DEVE estar contido no mesmo arquivo HTML.
> 5. A estética deve ser incrível: use Tailwind para cores gradientes suaves, sombras (shadow-lg), bordas arredondadas (rounded-xl) e um layout responsivo. Não faça algo básico.
> 6. O design precisa parecer moderno, usando cores que combinem com o tema (ex: tons de base slate/gray e realces em blue/indigo).
> 7. Se precisar de gráficos, use a CDN do Chart.js.
> 8. **Não** use `iframes` de outros sites dentro deste arquivo.
> 9. **REGRAS DE IMAGENS E CAMINHOS:**
>    - Todas as imagens devem ser referenciadas com o prefixo `/blog/assets/` (ex: `/blog/assets/imagem.webp`).
>    - Use apenas imagens no formato `.webp` ou `.svg`.
>    - Se você sugerir imagens que eu deva providenciar, lembre-me que eu preciso converter `jpg`/`png` para `webp` antes de subir.
> 10. Adicione este bloco script imediatamente no início da tag body para que fique invisível se aberto em iframe, mas mostre tudo se aberto sozinho: 
> `<script>if (window.self !== window.top) { document.body.style.backgroundColor = 'transparent'; document.body.style.margin = '0'; }</script>`
>
> **Meu conteúdo / Resumo que precisa ser transformado:**
> [COLE SEU TEXTO AQUI]"
