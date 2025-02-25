import { NextResponse } from 'next/server';
import { auth } from '@/lib/firebase/firebase';

export async function GET() {
  try {
    // Tenta obter a configuração atual do Firebase
    const config = auth.app.options;
    
    return NextResponse.json({ 
      status: 'success',
      message: 'Firebase configurado corretamente',
      projectId: config.projectId 
    });
  } catch (error: any) {
    return NextResponse.json({ 
      status: 'error',
      message: 'Erro na configuração do Firebase',
      error: error.message 
    }, { status: 500 });
  }
} 