# GUIA DE GERENCIAMENTO DE IMAGENS (PROMPTS)

Siga estas instruções para organizar e utilizar imagens no seu blog de forma profissional.

---

## 1. Preparação da Imagem (IA / Ferramenta)
Se você estiver gerando uma imagem via IA ou se tiver um arquivo em outro formato (JPG, PNG), use este prompt para garantir a compatibilidade:

> "Preciso otimizar esta imagem para o meu blog. Por favor, converta-a para o formato **.webp** (preferencial) ou **.svg** (se for ícone/vetor). O nome do arquivo deve ser em minúsculas, usando hifens em vez de espaços (ex: `insuficiencia-cardiaca-clue.webp`)."

---

## 2. Onde Salvar (Mover o Arquivo)
Todas as imagens do blog DEVEM ser salvas na pasta central de assets:

👉 `pages/blog/assets/`

**Como mover via terminal (se necessário):**
```bash
mv ~/Downloads/minha-imagem.webp pages/blog/assets/nome-correto.webp
```

---

## 3. Como Usar no Post (Markdown)
Para inserir a imagem dentro do seu texto `.md`, use o caminho absoluto que começa com `/blog/assets/`. 

**Nota:** O blog converte automaticamente imagens (JPG, PNG, etc.) para o formato otimizado `.webp` durante o build. Você pode manter a extensão original no seu Markdown que o link será adaptado automaticamente.

### No Cabeçalho (Imagem de Capa):
```yaml
---
title: "Título"
author: "César Vinícius"
category: "Área Médica"
tags: ["Tag1", "Tag2"]
coverImage: "/blog/assets/nome-da-imagem.jpg"
---
```

### No Corpo do Texto:
```markdown
![Descrição da Imagem](/blog/assets/nome-da-imagem.png)
```

---

## 4. Checklist de Nomenclatura Profissional
✅ **Apenas Letras Minúsculas:** Use `foto-hospital.webp` em vez de `FotoHospital.webp`.
✅ **Hifens em vez de Espaços:** Use `guia-pratico.webp` em vez de `guia pratico.webp`.
✅ **Extensões Corretas:** As imagens serão convertidas para `.webp` automaticamente, mas você pode usar `.jpg`, `.png` ou `.webp` no seu texto. Prefira sempre arquivos de alta qualidade na pasta assets.
✅ **Sem Caracteres Especiais:** Evite acentos ou símbolos (ex: use `coracao`, não `coração`).
