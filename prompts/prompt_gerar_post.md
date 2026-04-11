# PROMPT PARA GERAÇÃO DE POST NO BLOG (MARKDOWN)

Copie o texto abaixo e insira no seu modelo de IA (ChatGPT, Gemini, Claude) para gerar um novo post completo:

> "Preciso que você escreva um post para o meu blog técnico/médico no formato Markdown (.md). 
>
> ⚠️ **ESTRUTURA OBRIGATÓRIA (FRONTMATTER):**
> O arquivo deve começar com o seguinte cabeçalho (YAML):
> ```yaml
> ---
> title: "Título Impactante do Post"
> date: "DD/MM/AAAA" (use a data de hoje)
> author: "César Vinícius"
> description: "Um resumo conciso e atrativo de 1-2 frases."
> coverImage: "/blog/assets/nome-da-imagem-capa.webp"
> ---
> ```
>
> ⚠️ **GERAÇÃO DE IMAGEM (PARA AGENTES IA):**
> Se você for um agente com capacidade de geração de imagens (como Antigravity):
> 1. **GERE** uma imagem de capa profissional, com estética médica/científica moderna, relacionada ao tema. **IMPORTANTE:** A imagem NÃO deve conter palavras, textos ou letras de qualquer idioma. Deve ser puramente visual, limpa e representativa.
> 2. **SALVE** a imagem em `pages/blog/assets/` com o nome `[slug]_capa_[id].webp`.
> 3. **USE** o caminho final no frontmatter (ex: `/blog/assets/[slug]_capa_[id].webp`).
>
> ⚠️ **REGRAS DE FORMATAÇÃO E CONTEÚDO:**
> 1. **Hierarquia:** Use títulos Markdown (`##`, `###`) para organizar o conteúdo de forma lógica.
> 2. **Assets (Imagens/Links):** 
>    - Todos os caminhos de imagens de cobertura ou internas devem começar com `/blog/assets/`.
>    - **Regra de Formato:** Use extensões `.webp`, `.png` ou `.svg`. (Lembrete: arquivos externos `jpg`/`jpeg` devem ser convertidos para `.webp`. Para imagens geradas por IA, `.png` é aceitável).
> 3. **Interatividade:** Se o post for acompanhado de um recurso visual interativo (gerado em HTML), você pode sugerir onde inserir o iframe:
>    `<iframe src="/blog/NOME-DO-ARQUIVO.html" width="100%" height="800px" style="border:none;"></iframe>`
> 4. **Estilo:** O tom deve ser acadêmico, porém acessível e moderno. Use negritos para dar ênfase e listas para facilitar a leitura.
> 5. **Rodapé:** Finalize com uma nota de revisão ou autoria curta.
>
> **Tema/Conteúdo para o Post:**
> [DESCREVA O ASSUNTO DO POST AQUI OU COLE O TEXTO BRUTO]"

