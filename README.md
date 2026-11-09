# Agenda Area de Lazer Guaruja

Sistema interno de agendamento feito com Next.js e Firebase para uso privado.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Firebase Authentication
- Cloud Firestore

## Rodar localmente

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

## Fotos e vídeos da galeria

Coloque os arquivos reais da área de lazer nestas pastas:

- Fotos: `public/media/imagens/` (JPG, PNG ou WebP).
- Vídeos: `public/media/videos/` (preferencialmente MP4).

Use nomes descritivos, sem espaços ou acentos, como `piscina.webp`,
`churrasqueira.jpg` e `passeio.mp4`.
No site, os caminhos começam por `/media/imagens/` e `/media/videos/`.

A galeria está em `src/app/page.tsx`, com as fotos reais selecionadas na lista
`galleryPhotos` e o vídeo `/media/videos/video1.mp4`. Para trocar ou adicionar
fotos, atualize essa lista com o caminho e a descrição de cada imagem.
As fotos podem ser abertas em tamanho original ao clicar.

## Configurar Firebase

1. Crie um projeto no Firebase Console.
2. Ative Authentication com provedor `Email/password`.
3. Crie dois usuarios: um para voce e outro para seu pai.
4. Ative Cloud Firestore em modo production.
5. Copie as configuracoes do app web do Firebase.
6. Crie `.env.local` usando `.env.example` como base.

Exemplo:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_ALLOWED_EMAILS=seu-email@gmail.com,email-do-seu-pai@gmail.com
```

## Regras do Firestore

Use o arquivo `firestore.rules` como base. Troque os UIDs de exemplo pelos UIDs reais dos dois usuarios no Firebase Authentication.

Cole as regras em Firestore Database > Rules no Firebase Console.

## Dados salvos

As reservas ficam na collection `reservations`:

- `customerName`
- `phone`
- `date`
- `startTime`
- `endTime`
- `totalValue`
- `depositValue`
- `status`
- `notes`
- `createdAt`
- `updatedAt`

## Scripts

```bash
npm run dev
npm run lint
npm run build
```
