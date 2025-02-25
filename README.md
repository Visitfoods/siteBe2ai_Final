# Be2AI Website

Website institucional da Be2AI, desenvolvido com Next.js 14, TypeScript, Tailwind CSS e Firebase.

## Tecnologias Utilizadas

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Firebase (Auth, Firestore, Storage)
- Vercel AI SDK
- Lucide Icons

## Funcionalidades

- Landing page moderna e responsiva
- Painel administrativo protegido
- Gestão de conteúdo dinâmico
- Chat em tempo real
- Integração com IA
- Sistema de FAQs
- Formulário de contacto
- Integração com redes sociais

## Estrutura do Projeto

```
src/
├── app/
│   ├── api/         # Rotas da API
│   ├── components/  # Componentes React
│   └── lib/         # Utilitários e configurações
├── public/          # Arquivos estáticos
└── styles/         # Estilos globais
```

## Configuração

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure as variáveis de ambiente:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
   NEXT_PUBLIC_FIREBASE_APP_ID=
   ```
4. Execute o projeto:
   ```bash
   npm run dev
   ```

## Licença

Todos os direitos reservados © 2024 Be2AI