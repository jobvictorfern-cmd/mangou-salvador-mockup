# Mangou Salvador

Landing page em HTML5, CSS3 e JavaScript Vanilla, sem framework, build ou dependência de runtime. Versão dos dois mockups enviada para revisão em 25/10/2026 e aprovada pelo usuário para publicação em um repositório separado. O repositório anterior foi preservado.

Site: https://jobvictorfern-cmd.github.io/mangou-salvador-mockup/

Repositório: https://github.com/jobvictorfern-cmd/mangou-salvador-mockup

GitHub Pages publica a raiz da branch `main`. A presença de `.nojekyll` mantém o conteúdo estático sem processamento Jekyll.

## Visualizar

Na raiz deste diretório:

```powershell
python -m http.server 8130 --bind 127.0.0.1
```

Abra http://127.0.0.1:8130/.

## Estrutura

- `index.html`: header, hero, seis sabores, comunidade, localização, história, Instagram e footer.
- `styles.css`: base mobile first, papel rasgado, quadriculado, colagens e composição própria para tablet/desktop a partir de 900px.
- `script.js`: menu acessível, entrada ao rolar e parallax de rolagem.
- `hero-parallax.js`: parallax interpolado por cursor e, após ação explícita, sensor compatível. Preservado com seus testes.
- `assets/`: imagens e fontes locais. O copo e as tiras originais permanecem sem edição ou recompressão.
- `REVISAO-VISUAL.md`: referências, comparação, assets ausentes e limites da validação.

## Verificar

```powershell
node checks/site.mjs
node checks/parallax.mjs
```

A rodada em Microsoft Edge verificou 320, 375, 390, 430, 768, 1024, 1440 e 1920px; carregamento de imagens; menu por clique, Escape e clique externo; âncoras; animação de entrada; parallax por cursor/rolagem; movimento reduzido; conteúdo sem JavaScript. Evidências e script de navegador estão em `../verificacao/mangou-mockups/`, fora da raiz servida/publicada.

## Conteúdo e fotografias

As seis receitas ficam nos elementos `article.flavor`, sem duplicação no JavaScript. Dengo permanece com ingredientes a confirmar no Instagram. Ponto e horário devem ser confirmados nos Stories; Maps e Waze usam o Farol da Barra como referência.

O repositório não tem as seis fotografias específicas dos sabores nem todas as cenas dos mockups. As fichas usam a mesma imagem original do produto, com aviso explícito. As colagens usam fotografias já existentes, com links de origem. Não há fotografias genéricas novas, receitas simuladas por filtros, depoimentos inventados, telefone ou TikTok presumidos.

A seção Nossa história usa apenas o contexto e os textos comerciais já disponíveis, sem presumir fundadores, datas ou origem da empresa. A fonte principal é DM Sans local; ornamentos manuscritos usam fonte cursiva do sistema. Os arquivos Bricolage anteriores e suas licenças permanecem no repositório.

O MP4 4K e a prévia 3D anteriores continuam preservados e não são carregados pela landing page.
