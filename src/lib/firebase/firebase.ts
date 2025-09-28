import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Verificar se estamos no lado do cliente
const isBrowser = typeof window !== 'undefined';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Verificar se todas as variáveis necessárias estão definidas
const isFirebaseConfigValid = Object.values(firebaseConfig).every(value => value !== undefined && value !== '');

// Verificar se as variáveis estão definidas apenas no lado do cliente
if (isBrowser) {
  console.log('Firebase Config:', {
    apiKey: !!firebaseConfig.apiKey,
    authDomain: !!firebaseConfig.authDomain,
    projectId: !!firebaseConfig.projectId,
    storageBucket: !!firebaseConfig.storageBucket,
    messagingSenderId: !!firebaseConfig.messagingSenderId,
    appId: !!firebaseConfig.appId,
    isValid: isFirebaseConfigValid
  });
}

// Inicializar Firebase apenas se a configuração for válida
let app: any = null;
let auth: any = null;
let db: any = null;

if (isFirebaseConfigValid) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    console.error('Erro ao inicializar Firebase:', error);
  }
} else {
  console.warn('Configuração do Firebase incompleta. Verifique as variáveis de ambiente.');
}

export { auth, db }; 