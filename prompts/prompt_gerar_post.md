# PROMPT PARA GERAÇÃO DE POST NO BLOG (MARKDOWN)

Copie o texto abaixo e insira no seu modelo de IA para gerar um novo post completo e padronizado:

> "Gere um artigo de alta densidade técnica para um repositório médico no formato Markdown (.md). 
>
> ⚠️ **ESTRUTURA OBRIGATÓRIA (FRONTMATTER):**
> O arquivo deve começar com o seguinte cabeçalho (YAML):
> ```yaml
> ---
> title: "Título Científico e Impactante do Post"
> date: "DD/MM/AAAA" (use a data de hoje)
> author: "César Vinícius"
> description: "Um resumo técnico, conciso e atrativo (máximo 160 caracteres)."
> coverImage: "/blog/assets/nome-do-post-capa.webp"
> category: "Área Médica (ex: Cardiologia, Pediatria)"
> tags: ["Tag1", "Tag2", "Tag3"]
> ---
> ```
>
> ⚠️ **REGRAS DE OURO (ESTÉTICA JOURNAL):**
> 1. **Densidade de Informação:** Evite parágrafos muito longos ou muito "vazios". O tom deve ser de jornal médico (ex: NEJM ou UpToDate).
> 2. **Fases e Passos:** Se a orientação for complexa (ex: manejo de sepse), organize em fases claras (ex: Fase 1: Resgate, Fase 2: Otimização).
> 3. **Componentes Especiais:**
>    - **Insights Clínicos:** Use blockquotes para pérolas clínicas (ex: `> 💡 **Pérola Médica:** ...`).
>    - **Tabelas de Alta Precisão:** Use tabelas Markdown para comparar critérios, drogas ou classificações.
>    - **Fórmulas Matemáticas:** Use notação LaTeX/KaTeX (ex: `$TFG < 60$`) para cálculos e fórmulas.
> 4. **Sem Alucinações Visuais:** Imagens de capa NÃO devem ter texto. Devem ser limpas e profissionais.
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

