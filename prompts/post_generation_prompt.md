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
> author: "Nome do Autor"
> description: "Um resumo conciso e atrativo de 1-2 frases."
> coverImage: "/blog/assets/nome-da-imagem-capa.webp"
> ---
> ```
>
> ⚠️ **REGRAS DE FORMATAÇÃO E CONTEÚDO:**
> 1. **Hierarquia:** Use títulos Markdown (`##`, `###`) para organizar o conteúdo de forma lógica.
> 2. **Assets (Imagens/Links):** 
>    - Todos os caminhos de imagens de cobertura ou internas devem começar com `/blog/assets/`.
>    - **Regra de Formato:** Use apenas extensões `.webp` ou `.svg`. (Lembrete: arquivos `jpg`, `jpeg` e `png` devem ser convertidos para `webp`).
> 3. **Interatividade:** Se o post for acompanhado de um recurso visual interativo (gerado em HTML), você pode sugerir onde inserir o iframe:
>    `<iframe src="/blog/NOME-DO-ARQUIVO.html" width="100%" height="800px" style="border:none;"></iframe>`
> 4. **Estilo:** O tom deve ser acadêmico, porém acessível e moderno. Use negritos para dar ênfase e listas para facilitar a leitura.
> 5. **Rodapé:** Finalize com uma nota de revisão ou autoria curta.
>
> **Tema/Conteúdo para o Post:**
> [DESCREVA O ASSUNTO DO POST AQUI OU COLE O TEXTO BRUTO]"
