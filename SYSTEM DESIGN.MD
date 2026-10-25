# Mangou Salvador — System Design

Estado atual: versão aprovada para publicação em repositório separado, `jobvictorfern-cmd/mangou-salvador-mockup`. A autorização de 25/10/2026 na seção 22 substitui as restrições temporárias de publicação das etapas anteriores.

Documento de trabalho da reconstrução da landing page. Criado em 25/10/2026, antes das alterações de implementação.

## 1. Objetivo e limites

Refazer a landing page com prioridade para celular, identidade própria e conteúdo curto. A página deve tornar claros o produto, os sabores e como encontrar a Mangou ou consultar o atendimento no Instagram.

Conversão pretendida: abrir o cardápio, consultar o Instagram e traçar uma rota. Não há resultado de conversão medido; o redesenho não implica garantia de aumento de vendas.

- Implementação: HTML semântico, CSS e JavaScript puro, sem framework nem etapa de build.
- Fotografias e identidade: recolher e conferir materiais do perfil oficial; manter a procedência dos arquivos utilizados.
- Conteúdo: não inventar avaliações, números comerciais, preços, ingredientes, horários ou telefone.
- Hero: fotografia real do produto, conforme decisão nesta conversa. O componente de filme foi removido conforme a seção 15.
- Preservar os seis sabores já informados pelo responsável, distinguindo receitas ainda não confirmadas.
- Publicação: atualizar o repositório e o GitHub Pages existentes depois da validação.

## 2. Contexto conferido

- Repositório: `jobvictorfern-cmd/mangou-salvador`, branch `main`, publicação pela raiz.
- Base da reconstrução: commit `57b37f60c55f784d91ff2abadbe2926f664c3d77`; cópia local sincronizada com `origin/main` no início desta etapa.
- Perfil oficial acessado no navegador: https://www.instagram.com/mangou.salvador/
- Bio observada: “Manga Fresca, Sabor que Vicia”; sábados e domingos na Barra, Salvador; dias adicionais avisados nos Stories.
- O perfil público apresenta fotografias, artes e Reels. A seleção e a coleta utilizadas nesta versão estão registradas na seção 8.
- WhatsApp oficial ainda não configurado no projeto. A ação de contato permanece direcionada ao Instagram até haver número confirmado.

## 3. Plano por etapas

| Etapa | Entrega | Critério para concluir | Estado |
| --- | --- | --- | --- |
| 0. Documento inicial | Este arquivo, objetivo, escopo e sequência | Documento salvo antes de alterar HTML, CSS ou JS | Concluída |
| 1. Pesquisa e direção visual | Perfil, referências de sites, seleção de fotos e paleta | Fontes registradas, ativos selecionados e direção definida neste documento | Concluída |
| 2. Estrutura e conteúdo | HTML completo e fluxos de navegação | Conteúdo curto, ações reais, sem informação comercial presumida | Concluída |
| 3. Design e interações | CSS mobile first e JS necessário | Layout completo no celular e desktop, componentes operacionais | Concluída |
| 4. Validação | Conferência visual, interações, mídia e acessibilidade | Verificações executadas e resultados/limites registrados | Concluída |
| 5. Publicação | Commit, push e GitHub Pages | Deploy concluído e versão pública conferida | Concluída |

Cada etapa atualiza este documento antes da seguinte. Uma falha observada deve ser corrigida ou registrada como limitação; uma etapa não será marcada como concluída apenas porque o código foi escrito.

## 4. Direção visual definida

Ponto de partida: marca de comida de rua da Barra, fresca e informal. Usar fotografia com contexto real, tipografia expressiva e poucos elementos visuais com função clara. Evitar blocos genéricos de vantagens, selos sem fundamento, ícones repetidos e efeitos decorativos contínuos que disputem atenção com o produto.

Conceito: um cartaz de rua da Mangou levado para a web. Papel claro nas áreas de leitura, amarelo no cardápio, fotografias com enquadramento próprio e xadrez em faixas curtas. Após o feedback registrado na seção 14, a abertura passou a usar verde sólido, letras claras/amarelas e o produto recortado; o restante da direção foi preservado.

### Tokens

| Token | Valor | Uso |
| --- | --- | --- |
| `--green` | `#123c29` | Marca, títulos, botões e localização |
| `--yellow` | `#f6cc37` | Cardápio e chamadas sobre o verde |
| `--paper` | `#fcf8e9` | Fundo principal e leitura |
| `--white` | `#fffdf5` | Molduras e detalhes |
| `--muted` | `#576656` | Texto secundário sobre fundo claro |
| `--line` | `#123c2933` | Separações discretas |

Paleta interpretada das cores recorrentes do perfil e do logo já existente; não se trata de um manual de marca oficial fornecido pela empresa.

- Títulos: Bricolage Grotesque local, peso 800–850, entrelinha curta e tamanhos fluidos.
- Corpo: DM Sans local, base 16 px e entrelinha de pelo menos 1,5.
- Escala de espaçamento: 4, 8, 12, 16, 24, 32, 48, 64 e 96 px.
- Conteúdo: largura máxima de 1240 px; margens de 20 px no celular, ampliadas progressivamente.
- Fotografias: PNG transparente original no hero, com `object-fit: contain`; bordas de papel e pequenas inclinações na galeria e no cardápio. Sem filtro que altere o alimento.
- Botões: área de toque de pelo menos 48 px, borda definida e contraste forte. Sem botões flutuantes cobrindo conteúdo.
- Foco: contorno visível de alto contraste. Movimento: queda decorativa de fios no hero, com pausa voluntária, interrupção fora da tela e preferência de movimento reduzido; demais seções mantêm apenas estados de interação.

### Componentes

| Componente | Solução | Estados importantes |
| --- | --- | --- |
| Cabeçalho | Marca, três âncoras e Instagram | Menu móvel fechado/aberto, Escape, retorno de foco |
| Hero | Frase da embalagem, produto transparente com parallax, fios caindo, sabores e localização | Imagem priorizada com alt, ações visíveis, pausa dos fios e sensor após interação |
| Cardápio | Seis elementos `details` com ingredientes | Primeiro aberto; abertura pelo toque e teclado; uso sem JS |
| Galeria | Fotos/capas reais ligadas aos Reels originais | Links com nome acessível, rolagem horizontal interna no celular |
| Localização | Foto do Farol, Maps, Waze e Instagram | Sem afirmar ponto ou horário exato não confirmado |

## 5. Estrutura final para implementação

1. Cabeçalho compacto: marca, navegação e acesso claro ao Instagram.
2. Hero: “O que rima com / Manga verde e sal? / Lá ele!”, fotografia original recortada e ações “Escolher meu sabor” e “Onde encontrar”. A frase vem do rótulo visível na própria foto.
3. Sabores: cardápio amarelo com seis opções, ingredientes em disclosure e acesso ao perfil para preços/disponibilidade.
4. O rolê: três fotografias/capas reais e links para os Reels correspondentes.
5. Localização e atendimento: “O encontro é na Barra.”, foto do Farol, rotas e confirmação de ponto/horário no Instagram.
6. Rodapé: marca, navegação e fontes. Sem outro bloco repetindo a apresentação.

Evitar solicitar pedido ou pagamento se não existe fluxo real para isso. Não inserir formulário, checkout, conta ou backend.

## 6. Arquitetura técnica

- `index.html`: conteúdo, semântica, metadados e alternativas que continuam úteis sem JavaScript.
- `styles.css`: tokens do sistema visual, base para 320 px e melhorias progressivas por largura.
- `script.js`: comportamento do menu, ano do rodapé e WhatsApp opcional.
- `hero-parallax.js`: efeito do copo por cursor/sensor, interpolação e fallback.
- `assets/`: fotos, marca, fontes e mídia servidas localmente.
- `SYSTEM DESIGN.MD`: decisões, fontes, etapas e evidências de validação.
- `README.md`: instruções operacionais e manutenção da versão final.
- `checks/site.mjs`: verificação estrutural em Node.js, sem dependências nem participação na carga da LP.

As páginas e fontes da prévia 3D anterior não precisam ser apagadas para refazer a landing page; permanecem separadas da página principal. A decisão sobre arquivos novos ou substituídos será registrada ao implementar.

## 7. Responsividade, acessibilidade e mídia

- Começar com uma coluna no celular e ampliar a composição quando houver espaço.
- Conferir ao menos 320, 390, 600, 800, 1024 e 1440 px, incluindo transições de layout.
- Sem rolagem horizontal involuntária, elementos sobrepostos ou ações encobertas.
- Navegação por teclado, foco visível, rótulos acessíveis, textos alternativos e contraste legível.
- Respeitar `prefers-reduced-motion`; não depender de animação para apresentar o produto.
- Reservar as proporções das imagens para evitar saltos de layout.
- Priorizar a foto do hero e adiar imagens secundárias. A LP não carrega vídeo.
- Preservar o MP4 4K existente sem recompressão caso seja reutilizado, conforme preferência anterior do usuário.
- Não inserir fotos de uma combinação como se comprovassem outra receita.

## 8. Fontes e referências

### Marca e conteúdo

- Instagram oficial: https://www.instagram.com/mangou.salvador/
- Publicação já usada no projeto para fotografia do produto: https://www.instagram.com/mangou.salvador/p/Ddr6zo-EYwB/
- A bio e a grade pública foram acessadas novamente em 25/10/2026. Ao abrir publicações completas, o Instagram solicitou login. Não houve tentativa de contornar esse bloqueio nem coleta de conteúdo privado.

| Arquivo | Origem pública observada | Uso |
| --- | --- | --- |
| `assets/manga.webp` | https://www.instagram.com/mangou.salvador/p/Ddr6zo-EYwB/ | Fotografia anterior preservada; prévia de compartilhamento |
| `assets/copo-parallax.png` | PNG transparente enviado pelo usuário em 25/10/2026 | Copo do hero, arquivo original sem recompressão |
| `assets/fios-manga.png` | PNG transparente enviado pelo usuário em 25/10/2026 | Três fios originais reaproveitados em sprites CSS |
| `assets/papel-grain.svg` | Textura procedural local, inspirada na arte enviada pelo usuário | Granulado estático nos fundos e nas molduras |
| `assets/role-barra.jpg` | https://www.instagram.com/mangou.salvador/reel/Dcg7NSwpMDw/ | Capa do Reel com duas pessoas na orla |
| `assets/role-resenha.jpg` | https://www.instagram.com/esthervasconcelos2001/reel/DdM_B7ihvQf/ | Capa de publicação colaborativa, pessoa experimentando o produto |
| `assets/role-manga.jpg` | https://www.instagram.com/es.sancho/reel/DdMwPkLJcX_/ | Fotografia/capa do produto com a orla ao fundo |
| `assets/role-preparo.jpg` | https://www.instagram.com/conhecendosalvador_/reel/Dct_3Nshrob/ | Capa da publicação sobre o preparo |
| `assets/logo.webp` | Marca já existente no projeto, compatível com o perfil conferido | Identidade |
| `assets/farol-barra.webp` | Wikimedia, crédito mantido no README/rodapé | Referência de localização |
| `assets/mangou-hero-4k.mp4` | Arquivo anteriormente enviado/aprovado pelo usuário | Ativo preservado, sem referência na LP após a seção 15 |

As novas capas foram baixadas das URLs de imagem presentes no DOM público da grade. A resolução disponível é 360 × 640; por isso entram em formatos pequenos, não como hero ampliado. Os Reels completos não foram baixados: a galeria leva às publicações originais. O filme local existente permanece independente desses Reels. Não apresentar uma capa como se fosse um vídeo local novo.

### Referências de design consultadas

- Ma‘ono: https://www.maonoseattle.com/
- Fishwife: https://eatfishwife.com/
- Tacombi: https://www.tacombi.com/

Ma‘ono: título forte, fotografia próxima do alimento e navegação curta. Fishwife: linguagem de embalagem, contornos e cores expressivas; evitar importar a complexidade de loja ou o popup comercial. Tacombi: hierarquia entre produto, cardápio e localização. Foram acessadas páginas oficiais; Ma‘ono e Fishwife também foram inspecionados visualmente no navegador. Não reutilizar fotos, textos, ilustrações ou identidade dessas marcas.

## 9. Validação e publicação

Critérios usados na conferência. Os resultados executados estão nas seções 12 e 13:

1. Sintaxe de JavaScript, integridade de referências locais, IDs e âncoras.
2. Composição mobile/desktop e ausência de transbordamento horizontal.
3. Menu, seleção de sabores, links de rota e links de contato.
4. Imagem principal carregada, proporções estáveis e ausência do componente de filme.
5. Erros de console e recursos ausentes.
6. Commit publicado, status do deploy e correspondência da página pública.

Testes no navegador não equivalem a teste em aparelho físico ou a um experimento de conversão. Registrar essa distinção na entrega.

## 10. Registro de execução

- 25/10/2026 — Etapa 0: documento criado antes da implementação. Repositório sincronizado e sem alterações locais no início. Perfil oficial acessado; pesquisa visual em andamento.
- 25/10/2026 — Etapa 1: grade e bio verificadas; quatro capas/fotografias reais coletadas; referências oficiais consultadas; paleta, componentes e estrutura definidos. Limitação de acesso a publicações completas registrada. Nenhum HTML, CSS ou JS alterado até concluir esta etapa.
- 25/10/2026 — Etapa 2: HTML reconstruído com hero, seis sabores, galeria de três publicações, localização e créditos. Ingredientes em `details`, vídeo em `dialog` e alternativas sem JS. Não há popup de cadastro, checkout, métricas inventadas ou botão flutuante. CSS e JavaScript da nova estrutura ainda em implementação; etapa visual não considerada concluída.
- 25/10/2026 — Etapa 3: CSS refeito com tokens, base de uma coluna, cardápio amarelo, fotografia em moldura, xadrez e composição desktop a partir de 960 px. No celular, a ação principal foi posicionada antes da fotografia: em 390 × 844 px, seu topo ficou em aproximadamente 292 px, visível na primeira tela. Menu, vídeo em diálogo e configuração opcional do WhatsApp implementados em JS puro. Ingredientes e créditos usam controles HTML nativos. Sem animação contínua, bibliotecas ou dependências novas.
- 25/10/2026 — Início da etapa 4: enquadramento conferido no navegador. A primeira passagem encontrou o título alguns pixels além da coluna desktop; a escala foi reduzida para corrigir esse limite antes da rodada final. Vídeo permanece sem atributo `src` até a abertura voluntária.
- 25/10/2026 — Etapa 4 concluída: verificações estruturais, contraste dos tokens, 11 larguras, navegação, ingredientes, mídia e revisão visual realizadas. Fechamento rápido do filme também conferido: diálogo fechado, vídeo pausado, rolagem liberada e foco no acionador. README atualizado para a nova manutenção. Resultados e limites na seção 12. Publicação iniciada após essas verificações.
- 25/10/2026 — Etapa 5 concluída: código enviado ao GitHub, deploy do Pages finalizado com sucesso e página pública verificada por HTTP e no navegador. Este registro final é publicado em um commit separado da implementação.

## 11. Decisões de implementação

- O CSS usa as próprias fontes locais existentes e não consulta Google Fonts durante a visita.
- O CTA vem antes da foto no layout móvel; a ordem de leitura do HTML continua produto → descrição → ações. No desktop, texto e ações ficam à esquerda da fotografia.
- O cardápio usa `details name="sabores"`; o navegador controla a expansão e oferece teclado sem código adicional. O comportamento continua útil em navegadores que permitem mais de um item aberto.
- O componente de filme e seus controles foram removidos conforme a seção 15; os resultados históricos abaixo descrevem a versão anterior.
- A pausa também ocorre diretamente no acionamento de fechar e no evento de Escape, antes do evento assíncrono `close`, para cobrir fechamento rápido enquanto a mídia ainda está carregando.
- O MP4 só ganha uma URL de fonte depois do clique. O download de 18,8 MB não faz parte da carga inicial. O link direto continua disponível como alternativa quando JS/dialog não estão disponíveis.
- Capas do Instagram são imagens locais. Não há iframe de Instagram, SDK de rede social, mapa incorporado, analytics ou rastreadores novos.
- A localização usa fotografia do Farol e links de rota, em lugar do iframe de mapa da versão anterior.
- A prévia 3D anterior e seus ativos foram preservados; a nova LP não os carrega.

## 12. Resultados da etapa 4

| Verificação executada | Resultado |
| --- | --- |
| Estrutura e sintaxe: `node checks/site.mjs` | Passou: 41 referências locais, IDs únicos, relações ARIA, imagens com dimensões/alt, seis sabores e sintaxe JS |
| Larguras 320, 360, 390, 430, 600, 800, 959, 960, 1024, 1440 e 1885 px | Sem rolagem horizontal; título dentro da coluna em todas as larguras após o ajuste |
| Foto principal | Carregada em todas as larguras verificadas |
| Demais imagens | Sete imagens da página carregadas e decodificadas no navegador |
| Menu móvel | Abre, fecha com Escape, devolve foco ao botão e fecha ao seguir uma âncora |
| Cardápio | As seis receitas conferidas; abertura por clique e teclado; Dengo não recebe ingredientes presumidos |
| Filme | Fonte ausente antes do clique; abertura voluntária; reprodução dos 8 segundos completos, sem erro de mídia |
| Fechamento do diálogo | Escape fecha, pausa vídeo, libera rolagem e devolve foco ao acionador |
| JavaScript no navegador | Nenhum erro de console registrado na rodada de interação |
| Contraste calculado das cores-base | Verde/papel 11,59:1; verde/amarelo 7,99:1; secundário/papel 5,74:1 |
| MP4 4K preservado | Hash Git do arquivo local igual ao ativo anterior; nenhuma recompressão |

Os resultados de contraste cobrem esses pares de cores, não constituem auditoria completa de acessibilidade. A validação visual foi feita no navegador com viewports ajustados; não foi realizada em aparelho físico. A alternativa sem JavaScript foi conferida estruturalmente, sem uma sessão de navegador com JS desativado. Não há experimento A/B, analytics novo ou conversão medida.

Evidências locais: `verificacao/mangou-redesign/` na pasta de trabalho acima do repositório, incluindo pesquisa de mídia e resultados responsivos. Essas evidências não são dependências da página publicada.

## 13. Publicação verificada

- Documento inicial criado e commitado antes da implementação: `19ef4f1`.
- Implementação publicada: `cc4fe4a4760732f0fcd8c85e1ee6c30749149aca`.
- GitHub Actions: execução `40225562142`, workflow `pages build and deployment`, resultado `success`.
- URL da versão: https://jobvictorfern-cmd.github.io/mangou-salvador/?v=cc4fe4a
- HTTP 200 para HTML, CSS v20, JavaScript v21 e as quatro novas imagens.
- Navegador público em 390 × 844 px: identidade nova, fotografia correta, seis sabores e fonte do vídeo ainda ausente antes do clique. Menu e abertura de Xodó conferidos; ingredientes mostrados corretamente. Após o carregamento das fontes, largura do documento igual à largura útil, sem transbordamento.
- O arquivo MP4 continua sendo o ativo anterior, e a nova página permanece em HTML, CSS e JS, sem framework ou dependências novas de runtime.

Todas as etapas previstas neste documento foram executadas. Permanecem os limites explicitados na seção 12: aparelhos físicos, auditoria completa de acessibilidade e resultados reais de conversão não foram verificados.

## 14. Revisão do hero após feedback

25/10/2026 — O usuário aprovou a LP, mas considerou o hero genérico. Escopo desta revisão: somente a abertura e seus metadados, preservando cardápio, galeria, localização e comportamentos já aprovados.

Direção: trocar a composição de foto inclinada + marca-texto + selo por uma campanha da própria Mangou. Usar a brincadeira sobre manga verde e sal presente no rótulo fotografado, fundo verde, tipografia clara/amarela e a fotografia original integrada à composição. O produto não será redesenhado nem gerado novamente; o recorte será definido por uma máscara SVG na página, mantendo o arquivo fotográfico intacto.

| Etapa da revisão | Estado |
| --- | --- |
| Registrar diagnóstico, referência e escopo | Concluída |
| Compor o novo hero com os ativos existentes | Concluída |
| Conferir recorte, celular, desktop e links | Concluída |
| Publicar e conferir a versão pública | Concluída |

Implementação: fundo verde sólido; pergunta em papel claro e resposta amarela; copo e mão recortados por `clipPath` SVG inline. `assets/manga.webp` permanece intacto e recebe preload prioritário. O SVG possui nome acessível via `title`. No celular, a ação de sabores aparece antes da fotografia; em desktop, texto e produto dividem a abertura. A foto não anima e não depende de JavaScript.

Validação local desta revisão: `node checks/site.mjs` passou; `git diff --check` sem erro de whitespace. Larguras 320, 360, 390, 430, 600, 800, 959, 960, 1024, 1440 e 1885 px, com fontes carregadas: sem transbordamento horizontal e com o título dentro da largura útil. Ações com aproximadamente 52 px e 44 px de altura. Recorte conferido visualmente em celular, transição de desktop e tela ampla. A fotografia e o MP4 não foram modificados; `script.js` permanece igual ao da versão aprovada. Mantêm-se os limites de validação da seção 12.

Publicação da revisão: commit `a367f6dfd7e622744baa8172b69e6a0da99a0fd7`; GitHub Actions `40227874632` concluído com `success`. URL conferida: https://jobvictorfern-cmd.github.io/mangou-salvador/?v=a367f6d. HTML, CSS v22 e fotografia retornaram HTTP 200. No navegador público em 390 px, fontes carregadas, novo título e fotografia corretos, sem transbordamento e sem fonte de vídeo atribuída antes do clique. As duas ações do hero chegaram às seções esperadas na verificação local. Evidências desta revisão em `verificacao/mangou-redesign/hero-campanha/`, na pasta acima do repositório.

## 15. Remoção do filme da página

25/10/2026 — Pedido do usuário: remover o elemento “Ver o filme da Mangou 00:08”, indicado em captura de tela. Plano registrado antes da alteração: retirar o acionador e sua alternativa sem JS, o diálogo de reprodução e o CSS/JavaScript que atendiam exclusivamente a esse componente. O MP4 original será preservado no repositório, sem referência na LP. Hero, cardápio, galeria e localização continuam na página.

| Etapa | Estado |
| --- | --- |
| Registrar o pedido e o escopo | Concluída |
| Remover componente e código associado | Concluída |
| Conferir estrutura, menu e seção do rolê | Concluída |
| Publicar e verificar o endereço público | Concluída |

Resultado local: botão, alternativa direta, diálogo, símbolo de play e código exclusivo do filme removidos. CSS e JS versionados como v23 para evitar uso dos controles antigos em cache. `node checks/site.mjs` passou com 35 referências locais; sintaxe JS e `git diff --check` passaram. Navegador em 390 px: nenhum elemento de filme/diálogo, seis sabores preservados, menu abre e fecha com Escape, sem transbordamento e sem erros de console na rodada. Espaçamento da seção do rolê conferido visualmente. O arquivo MP4 não foi alterado.

## 16. Remoção da chamada de imprensa

25/10/2026 — O usuário também solicitou remover “Saiu no Alô Alô Bahia”. Plano: retirar o link, seu contêiner agora vazio, a linha divisória e os estilos exclusivos desse bloco. Preservar a galeria e seu espaçamento de seção.

Implementação e conferência local concluídas: link, contêiner e regras CSS exclusivos removidos; CSS v24. Verificação estrutural passou com 34 referências locais, sem erro de whitespace. Navegador em 390 px: três fotografias da galeria preservadas, sem chamada de imprensa, sem filme, sem transbordamento e com a transição para localização conferida visualmente.

As duas remoções foram publicadas nos commits `843c1f12f1eac349e13996ff9471230c0f51dcaf` e `7786ed3787812ced6a2f40cf10f8325969896848`. GitHub Pages: execução `40228350267`, resultado `success`. Endereço conferido: https://jobvictorfern-cmd.github.io/mangou-salvador/?v=7786ed3. HTTP 200; HTML público com CSS v24 e JS v23, sem os dois componentes. Conferência pública em 390 px confirmou ausência das chamadas, três fotografias e largura útil igual à do documento. Etapas das seções 15 e 16 concluídas.

## 17. Fios de manga caindo no hero

25/10/2026 — Pedido: animar vários fios de manga caindo, usando a imagem enviada `Três fios de manga verde.png`. Plano registrado antes da implementação: copiar o PNG original, que já possui transparência real, e reaproveitar seus três fios como sprites CSS. Não é necessária geração de outra imagem. O arquivo original será preservado byte a byte em `assets/fios-manga.png`.

Direção final após orientação do usuário: queda contínua por toda a largura e altura do hero, com tamanhos, inclinações, trajetórias e tempos diferentes. Camada decorativa atrás de texto, botões e fotografia, sem interceptar cliques. Menos fios no celular. Transformações e opacidade em CSS, sem canvas, biblioteca ou vídeo. Controle de pausa e pausa quando o hero não estiver visível ou a aba estiver oculta. Com `prefers-reduced-motion`, iniciar parada e permitir ativação voluntária pelo mesmo botão.

| Etapa | Estado |
| --- | --- |
| Registrar pedido, ativo e direção | Concluída |
| Implementar sprites, queda e controle de pausa | Concluída |
| Conferir animação, celular, movimento reduzido e navegação | Concluída |
| Publicar e verificar o endereço público | Concluída |

Durante a implementação, o usuário pediu mais fios e a queda em toda a área do hero. Densidade ampliada de 14 para 28 trilhas no desktop e de 7 para 14 no celular, com entradas adicionais mais frequentes. A camada foi movida da fotografia para a seção inteira; acompanha os limites do hero e é cortada na transição para o cardápio.

Validação local: cobertura do hero e ausência de transbordamento conferidas em 320, 390, 800, 960 e 1440 px. Contagem renderizada: 14 trilhas abaixo de 960 px e 28 a partir dessa largura. Imagem original e cópia com SHA-256 `953424b21d83c3488344ec3597554f5727167b2bf0eae3a917980eecbea82788`. A imagem compartilhada tem 1.618.684 bytes; não houve recompressão. As transformações avançam entre observações, o controle pausa e retoma por clique/teclado, a saída do hero interrompe a queda e o retorno retoma. A preferência real de movimento reduzido do navegador foi detectada: início parado e reprodução voluntária conferidos. Nenhum erro de console na rodada móvel. A interrupção por aba oculta foi implementada; não foi simulada nesta rodada.

## 18. Textura de papel impresso

25/10/2026 — O usuário enviou uma arte Mangou como referência de textura. Aplicação planejada: reproduzir o acabamento de papel granulado nos fundos e nas molduras, preservando a paleta atual e a nitidez de fotos, textos e controles. Criar uma textura SVG procedural local, estática e repetível, com composição `soft-light` sobre as cores existentes. A arte de referência não será repetida como estampa de logos. Não é necessária edição dos arquivos fotográficos nem outra imagem gerada.

Implementação e conferência local concluídas. `assets/papel-grain.svg`: 686 bytes, XML válido, bloco repetível de 160 × 160 px. Fundos verde, amarelo e papel e molduras usam a mesma textura; nenhuma camada é aplicada sobre as fotografias ou sobre o texto. Conferência visual em desktop e celular e leitura das propriedades calculadas confirmaram imagem e composição corretas. `node checks/site.mjs` passou, incluindo todos os novos ativos CSS; `git diff --check` sem erro. CSS e JS v26. Os testes foram feitos no navegador, sem aparelho físico.

Publicação das seções 17 e 18 concluída: commit `c6745514b83cf5ae43dc484ee1da82ab3421d995`, GitHub Pages `40229935750` com `success`. URL: https://jobvictorfern-cmd.github.io/mangou-salvador/?v=c674551. HTML, PNG e textura retornaram HTTP 200; CSS publicado idêntico ao commit. O SHA-256 do PNG remoto também corresponde ao original enviado. Navegador público em 390 px: 14 trilhas, queda em toda a área do hero, reprodução voluntária funcionando com movimento reduzido, textura correta e nenhum transbordamento. Evidências em `verificacao/mangou-redesign/hero-textura-fios.jpg` e `fios-larguras.json`, na pasta acima do repositório.

## 19. Parallax interativo do copo

25/10/2026 — Plano antes da implementação: integrar o PNG transparente `Copo de Manga Verde com Sal (1).png` enviado pelo usuário na área do produto existente, mantendo arquivo, proporção e resolução originais (1122 × 1402). Preservar textos, cores, grid, alturas reservadas, textura e chuva de fios. A fotografia anterior permanece no repositório.

Implementar em JavaScript puro: cursor no desktop; `DeviceOrientation` no celular após botão explícito, com `requestPermission()` chamado dentro do clique quando exigido. Contexto seguro, erro/recusa/ausência de dados e API incompatível recebem fallback estático. Calibrar a posição inicial e recalibrar após mudança de orientação/retorno à tela. Não capturar nem transmitir dados de sensores.

Profundidade: copo até 12 px e 5° por eixo, fios a 40% do deslocamento e textura ao fundo em sentido oposto, a 18%. Interpolação temporal em `requestAnimationFrame`, somente enquanto o alvo muda. Cancelar e neutralizar fora do hero, na aba oculta ou com `prefers-reduced-motion`. Movimento reduzido desativa o parallax inclusive quando o usuário reproduz a chuva de fios.

Referências técnicas conferidas: [MDN DeviceOrientationEvent](https://developer.mozilla.org/en-US/docs/Web/API/DeviceOrientationEvent), [MDN requestPermission](https://developer.mozilla.org/en-US/docs/Web/API/DeviceOrientationEvent/requestPermission_static) e [W3C Device Orientation](https://www.w3.org/TR/orientation-event/). Permissão exige ativação do usuário quando o estado é prompt; APIs de orientação dependem de contexto seguro.

| Etapa | Estado |
| --- | --- |
| Inspecionar estrutura, imagem e regras das APIs | Concluída |
| Implementar parallax e controles de sensores | Concluída |
| Testar limites, permissões, fallback e responsividade | Concluída |
| Publicar e conferir a versão pública | Concluída |

Implementação: `hero-parallax.js`, clássico e isolado; sem biblioteca. `perspective: 1100px` na área existente, transformações na camada interna e imagem com `object-fit: contain`. A textura e a camada dos fios movem-se separadamente. O botão de sensor aparece apenas em dispositivo de ponteiro grosso, com API/contexto compatível e sem movimento reduzido. Recusa, exceção ou ausência de dados por 3 segundos desativam o sensor com aviso acessível e fallback estático. Mudança de orientação ou retorno à área recalibra a posição. A primeira amostra válida define o neutro. O PNG tem 1.453.421 bytes; SHA-256 `8bc7ac5399847e550b64f050a73003e3d76e5d49bba9b63bc5ce4ec9a7c9f093`, idêntico ao arquivo enviado.

Validação local: `node checks/site.mjs`, sintaxe dos dois scripts, 35 referências, ARIA/IDs e `git diff --check` passaram. `node checks/parallax.mjs`: 8 testes passaram, cobrindo cursor, interpolação temporal, limites, fim do RAF, toque ignorado, permissão somente após clique, calibração, paisagem, passagem por ±180°, Android sem `requestPermission`, recusa/erro/ausência de dados, aba/hero ocultos, recalibração e mudança de preferência durante pedido pendente. São eventos/API simulados em Node, sem acesso a sensores reais.

Navegador: 320, 360, 390, 430, 600, 800, 959, 960, 1024, 1440 e 1885 px, sem transbordamento; imagem carregada na resolução original, `contain` e área reservada preservados. O navegador de conferência sinaliza movimento reduzido: o copo permanece neutro e o botão de sensor fica oculto, conforme solicitado. Cursor em modo normal e sensores foram validados no teste simulado; aprovação nativa de iOS, resposta física e desempenho em aparelhos reais ainda não foram conferidos. CSS/scripts v27.

Publicação verificada: commit `4d4701ae77d686ba92ddf3d710fe5b5bd3ebcf55`; GitHub Pages `40231244609`, resultado `success`. URL: https://jobvictorfern-cmd.github.io/mangou-salvador/?v=4d4701a. HTML, script novo e PNG retornaram HTTP 200; JavaScript remoto idêntico ao commit. PNG público com 1.453.421 bytes e mesmo SHA-256 do arquivo original. Navegador público: imagem correta, proporção preservada, sem transbordamento ou erro de console; fallback estático observado com movimento reduzido. Evidências em `verificacao/mangou-redesign/hero-parallax-publico.jpg` e `parallax-larguras.json`, na pasta acima do repositório.

## 20. Header transparente

Plano: retirar a cor de fundo, a textura de papel e o divisor inferior do header sticky; manter sua altura, navegação e comportamento responsivo, sobrepondo-o ao fundo verde do hero para que a transparência seja visível. Ajustar o contraste da marca e dos controles sem alterar textos.

Implementação: `styles.css` deixa `.site-header` transparente e remove apenas esse elemento da aplicação de textura. Altura, `position: sticky`, links e menu permanecem intactos. `index.html` aponta para CSS v28 para invalidar o cache.

Primeira alteração: commit `03e8185` e GitHub Pages `40233517747` concluído com sucesso. A captura enviada mostrou que o fundo do body ainda aparecia no espaço do header. Revisão implementada: o header agora é filho sticky do hero, sem fundo/textura/filete, com marca, menu e links em cores de contraste. A altura do header é compensada no fluxo e o início do conteúdo do hero preservado nos breakpoints móvel e desktop; CSS v29.

Publicação verificada: commit `325184b`; GitHub Pages `40233979532` concluído com sucesso. No navegador público, a faixa creme desapareceu e a navegação permanece legível sobre o verde. Evidência: `verificacao/mangou-redesign/header-transparente-publico.png`, fora da raiz do repositório.

## 21. Implementação dos mockups aprovados — revisão local

25/10/2026 — A solicitação atual substitui a direção visual anterior: implementar os dois mockups mobile/desktop em HTML, CSS e JavaScript puro, com oito seções e validação visual. **Não publicar nem fazer push antes de aprovação do usuário**, mesmo que etapas anteriores deste documento descrevam publicação.

Implementados header creme, hero verde com copo inclinado e camadas de fruta, grade dos seis sabores, comunidade em colagem, localização, história, galeria e footer. Papel rasgado, quadriculado e SVGs são componentes de código; os mockups não fazem parte dos assets da página. Preservados receitas, destinos externos, avisos de atendimento e fotografias originais. A imagem do copo e os fios não foram alterados.

As diferenças visuais por falta de material foram informadas durante a execução e detalhadas em `REVISAO-VISUAL.md`. As fichas usam o copo original como imagem ilustrativa, sem inventar coberturas; Dengo permanece com ingredientes a confirmar. Não foram criados telefone, TikTok, avaliações ou dados históricos da empresa.

Foram feitas comparações de capturas a 390 e 1440px e correções de tipografia, escala, alinhamento, recortes e papel rasgado. Navegador Edge, oito larguras de 320 a 1920px, menu, âncoras, movimento reduzido, parallax e fallback sem JS verificados. Verificações estruturais e oito testes do módulo de parallax aprovados. A publicação continua pendente da aprovação visual. Esta seção e `REVISAO-VISUAL.md` são a referência atual para a versão local.


## 22. Publicação aprovada em repositório separado

25/10/2026 — O usuário aprovou o resultado e solicitou subir um repositório separado para o GitHub e publicar no GitHub Pages. Criada uma cópia independente do checkout aprovado, sem copiar seu diretório Git nem alterar o remote ou a publicação anteriores. Destino: `jobvictorfern-cmd/mangou-salvador-mockup`, público, branch `main`, Pages na raiz.

Preservados os arquivos do produto e o visual aprovado; apenas a URL da imagem de compartilhamento, canonical e documentação foram ajustadas para o novo endereço. `.nojekyll` preservado. Os arquivos de verificação visual continuam fora da raiz pública.
