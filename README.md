# 📚 Guia do Publicador - Como Atualizar o Blog

Bem-vindo ao repositório do seu Blog! Este guia foi feito para ser simples e direto. Você não precisa enteder de programação para publicar ou editar textos aqui. 

Tudo o que você precisa é do programa **GitHub Desktop**, do seu editor de textos favorito, e de seguir um fluxo básico.

---

## 🔄 O Fluxo Básico de Publicação

Sempre que você quiser mudar algo no site, adicionar um artigo novo ou atualizar um resumo, você vai repetir estes **4 passos fundamentais**:

1. **Alterar:** Edite ou crie os arquivos de texto no seu computador.
2. **Salvar:** Salve as alterações no seu bloco de notas ou editor de código.
3. **Commit (Registrar):** Abra o GitHub Desktop, escreva o que você fez, e clique em "Commit". Isso empacota as suas mudanças prontas para envio.
4. **Push (Enviar):** Clique em "Push origin" no GitHub Desktop. Isso envia as mudanças para a internet e o site será atualizado automaticamente em alguns minutos.

> ✨ **Apenas isso!** Altere os arquivos, salve, faça o Commit e dê o Push. O resto é automático.

---

## 🛠️ Como usar o GitHub Desktop na Prática

1. **Abra o GitHub Desktop:** Certifique-se de que o repositório do blog está selecionado no canto superior esquerdo (Current Repository).
2. **Faça suas alterações:** Edite os arquivos normalmente nas pastas explicadas abaixo.
3. **Revise as mudanças:** Volte ao GitHub Desktop. Na coluna da esquerda ("Changes"), você verá todos os arquivos que você modificou ou criou.
4. **Faça o Commit:** 
   - No canto inferior esquerdo, há uma caixinha com título (ex: *Summary*).
   - Escreva algo simples sobre o que você fez, ex: `"Adicionando diretriz de hipertensão"` ou `"Corrigindo erro de digitação"`.
   - Clique no botão azul **Commit to master** (ou main).
5. **Faça o Push:**
   - Na barra superior do programa, clique no botão **Push origin** (que geralmente tem uma setinha apontando para cima).
   - Espere carregar. Pronto! O site de produção já está sendo reconstruído sozinho.

---

## 📝 Onde Editar e Criar Artigos de Texto (.md)

Os textos normais do blog vivem dentro da pasta:
👉 `pages/blog/posts`

1. **Escolha a Categoria:** Dentro desta pasta, você verá outras pastas (como `clinica-medica`, `pediatria`, etc.). Abra a que faz mais sentido.
2. **Crie o Arquivo:** Crie um novo arquivo de texto e coloque a extensão `.md` no final. Exemplo: `diretriz-asma.md`.
3. **Use o Cabeçalho Padrão:** O sistema precisa de algumas informações no topo do texto. Copie e cole isso no topo do seu novo arquivo:
```md
---
title: "Título do Seu Artigo"
date: "15/05/2026"
author: "Seu Nome"
description: "Um resumo rápido sobre o que é o texto."
---

Aqui começa o seu texto normalmente usando formatação Markdown (hashtags para títulos, asteriscos para negrito, etc.).
```

---

## 🎨 Como Criar Resumos Interativos / Visuais (.html)

Às vezes, você vai querer usar Inteligência Artificial (ChatGPT, Gemini, Claude) para criar uma página visual super bonita, com tabelas bonitas, ícones ou calculadoras (chamadas aqui de "Resumos"). 

Esses resumos são especiais porque são arquivos `.html` interativos completos.

**Onde eles devem ser salvos?**
👉 `pages/blog/resumo`

**Como criar arquivos .html perfeitos com a IA:**
Para que a IA gere um arquivo HTML que funcione perfeitamente dentro do seu blog sem quebrar o layout, você deve **SEMPRE** copiar e colar o Prompt Base abaixo antes de pedir o seu resumo.

### 🤖 Prompt Mestre para a IA:

Copie o texto abaixo e insira no ChatGPT junto com o texto que você quer resumir:

> **PROMPT PARA COPIAR:**
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
> 9. Adicione este bloco script imediatamente no início da tag body para que fique invisível se aberto em iframe, mas mostre tudo se aberto sozinho: 
> `<script>if (window.self !== window.top) { document.body.style.backgroundColor = 'transparent'; document.body.style.margin = '0'; }</script>`
>
> **Meu conteúdo / Resumo que precisa ser transformado:**
> [COLE SEU TEXTO AQUI]"

Depois que a IA devolver o código HTML:
1. Crie um arquivo com final `.html` na pasta `pages/blog/resumo` (ex: `infarto-agudo.html`).
2. Cole todo o código dado pela IA.
3. Volte no seu post `.md` (na pasta posts) e insira o iframe chamando o arquivo com o caminho mágico: `<iframe src="/blog/infarto-agudo.html" width="100%" height="800px" style="border:none;"></iframe>`.
4. Salve, Faça o Commit e dê o Push.

---
🚀 **Parabéns!** Agora você tem controle total sobre as postagens, edição de textos e criação de aplicativos visuais dentro do seu próprio blog.
