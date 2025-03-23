# Quebra-Cabeça Deslizante

Um jogo de quebra-cabeça deslizante (também conhecido como "Racha Cuca") desenvolvido com Next.js e React. O objetivo é organizar os números em ordem crescente movendo as peças para o espaço vazio.

## Demonstração

Você pode experimentar o jogo online aqui:
[Link para o deploy](#) <!-- Adicione seu link de deploy aqui -->

## Funcionalidades

- Tabuleiro 4x4 com 15 peças numeradas
- Movimentação de peças com validação de movimentos
- Embaralhamento automático do tabuleiro
- Detecção automática de vitória
- Animação e efeitos visuais de comemoração quando o quebra-cabeça é resolvido

## Como Jogar

1. Clique nas peças adjacentes ao espaço vazio para movê-las
2. Organize os números em ordem crescente (1-15) com o espaço vazio no canto inferior direito
3. Quando completar o quebra-cabeça, uma mensagem de parabéns será exibida
4. Clique em "Embaralhar" a qualquer momento para reiniciar o jogo

## Tecnologias Utilizadas

- Next.js
- React
- TypeScript
- SCSS Modules
- Canvas Confetti (para efeitos de comemoração)

## Executando Localmente

- Precisa ter o Node.js instalado na versão 22.1.0 ou superior.

Primeiro, clone o repositório e instale as dependências:

```bash
git clone https://github.com/profhdeivisson/racha-cuca-game
cd racha-cuca-game
npm install
```
