# Revisão visual — Mangou

25/10/2026. A implementação foi revisada e aprovada pelo usuário: “perfeito, pode subir esse repositório separado para o github, e publicar no github pages.” Publicação autorizada em `jobvictorfern-cmd/mangou-salvador-mockup`, preservando o repositório anterior.

## Referências e composição

- Mobile: `C:/Users/victo/Downloads/Mockup Mobile Mangou_ Sabores de Salvador.png`.
- Desktop/tablet: `C:/Users/victo/Downloads/Showcase responsivo da Mangou em Salvador.png`.
- Os arquivos de mockup não são carregados pelo site. Textos, botões, cartões, colagens, ornamentos, faixas e navegação são HTML/CSS/SVG; as fotografias continuam assets separados.
- Sem molduras de aparelhos e barras de status na página: elas pertencem à apresentação dos mockups.
- As referências apresentam seções em aparelhos separados. Na implementação elas formam uma página contínua com um único header sticky.

## Comparação e ajustes

Foram renderizadas e inspecionadas rodadas a 390px e 1440px, comparando também recortes das seções da referência na mesma largura. Corrigidos: altura e cor do header, família/peso e escala dos títulos, tamanho da chamada amarela, quebra dos textos, posição do copo, recorte isolado do limão no atlas, margens dos cartões, composição desktop da navegação, proporções das colagens e irregularidade do papel rasgado.

O mobile usa a abertura vertical com copo dominante, sabores em duas colunas e fotografias em colagem. Em desktop, hero e conteúdo ficam lado a lado, seis sabores ocupam uma linha e localização/história ganham composições amplas. A adaptação desktop das seções inferiores segue a identidade mobile, pois a referência desktop mostra apenas o início da página e o cardápio.

## Diferenças que dependem de assets

| Material ausente | Tratamento local e diferença visível |
| --- | --- |
| Fotografias individuais dos seis sabores | Mesma foto original do copo em cada ficha, com aviso; não reproduz as diferentes coberturas dos mockups. Não foram aplicados filtros para simular receitas. |
| Fotografia exata do hero e tiras largas de manga temperada | Preservados o PNG transparente do copo e os fios originais. O rótulo continua autêntico; formato, brilho e espessura da fruta diferem da arte aprovada. |
| Folhagens fotográficas recortadas | Ornamento SVG desenhado em código, suavizado; tem menos detalhe e realismo que a referência. |
| Copo na mão diante do Farol, pôr do sol, consumidor de chapéu e close específico da manga | Reutilizadas fotos identificadas do próprio repositório, já informadas durante a execução. Composição e molduras seguem a referência; cenas e enquadramentos diferem. Nenhuma foto genérica nova foi baixada. |
| Arquivos tipográficos e desenhos manuscritos da arte aprovada | DM Sans local aproxima os títulos. Fonte cursiva do sistema e SVGs nos desenhos; letras e traços não são idênticos e a cursiva pode variar por sistema. |
| TikTok e WhatsApp oficiais | Não incluídos links sem endereço/número confirmado. Instagram continua sendo o contato oficial disponível. |

Não há dados históricos suficientes para escrever uma cronologia da empresa: a seção usa frases comerciais existentes. A receita de Dengo não foi copiada do mockup; permanece sujeita a confirmação. Informações reais de atendimento e os créditos fotográficos foram preservados.

## Verificação

- Microsoft Edge/Chromium real em modo headless, escala 1.
- Larguras: 320, 375, 390, 430, 768, 1024, 1440, 1920px. Sem transbordamento horizontal, imagens quebradas ou erros de JavaScript/HTTP no teste.
- Menu: clique, fechamento por âncora, Escape com retorno de foco e clique fora.
- Parallax por cursor e rolagem; entrada dos elementos; redução de movimento neutraliza copo e tiras.
- Navegação e conteúdo permanecem disponíveis sem JavaScript.
- `node checks/site.mjs`: referências locais, IDs, ARIA, dimensões/alternativas de imagens, seis receitas, seções, links externos e sintaxe.
- `node checks/parallax.mjs`: oito testes aprovados; sensores/permissões são simulados, sem aparelho físico.
- Imagem original do copo idêntica ao blob de HEAD. SHA-256: `8bc7ac5399847e550b64f050a73003e3d76e5d49bba9b63bc5ce4ec9a7c9f093`.
- Tiras originais sem alteração. SHA-256: `953424b21d83c3488344ec3597554f5727167b2bf0eae3a917980eecbea82788`.

As capturas finais são realizadas com movimento reduzido para manter a comparação estável. O comportamento animado foi verificado em uma rodada separada. Não foram medidos Core Web Vitals em aparelhos físicos nem testados Safari/iOS e Firefox. Os botões externos preservam destinos do site anterior; não houve envio de mensagem ou operação em conta externa.

## Evidências locais

Em `../verificacao/mangou-mockups/`:

- `mobile-390.png`, `desktop-1440.png`: capturas iniciais nas larguras solicitadas.
- `mobile-390-completo.png`, `desktop-1440-completo.png`: páginas completas.
- `mobile-390-secoes.jpg`: montagem das capturas reais por seção para inspeção.
- `comparacao-hero.jpg`: referência ao lado da implementação, normalizada por largura.
- `validacao.json`, `validate.cjs`: resultados e script da verificação em navegador.

**As diferenças de assets listadas permanecem documentadas. A versão apresentada e sua publicação foram aprovadas pelo usuário.**
