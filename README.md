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
