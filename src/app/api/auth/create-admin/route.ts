import { NextResponse } from 'next/server';
import { auth } from '@/lib/firebase/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ 
        success: false, 
        error: 'Email e senha são obrigatórios' 
      }, { status: 400 });
    }

    console.log('Tentando criar usuário com email:', email);

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log('Usuário criado com sucesso:', user.uid);

    return NextResponse.json({ 
      success: true, 
      message: 'Usuário administrador criado com sucesso',
      userId: user.uid,
      email: user.email
    });
  } catch (error: any) {
    console.error('Erro ao criar usuário:', error);
    
    let errorMessage = 'Erro ao criar usuário';
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'Este email já está em uso';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Email inválido';
    } else if (error.code === 'auth/operation-not-allowed') {
      errorMessage = 'Criação de usuário não permitida';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'A senha deve ter pelo menos 6 caracteres';
    }

    return NextResponse.json({ 
      success: false, 
      error: errorMessage,
      code: error.code
    }, { status: 400 });
  }
} 