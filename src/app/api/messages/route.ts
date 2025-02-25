import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase/firebase';
import { collection, addDoc } from 'firebase/firestore';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validar dados
    if (!data.nome || !data.email || !data.mensagem) {
      return NextResponse.json({ 
        success: false, 
        error: 'Todos os campos são obrigatórios' 
      }, { status: 400 });
    }

    // Primeiro, salvar no Firestore
    const messagesRef = collection(db, 'messages');
    const docRef = await addDoc(messagesRef, {
      nome: data.nome,
      email: data.email,
      mensagem: data.mensagem,
      dataEnvio: new Date().toISOString(),
      status: 'não lida'
    });

    // Depois, enviar email diretamente
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'be2aigeral@gmail.com',
        pass: process.env.EMAIL_PASSWORD
      }
    });

    try {
      await transporter.sendMail({
        from: 'be2aigeral@gmail.com',
        to: 'be2aigeral@gmail.com',
        subject: 'Nova mensagem do website',
        text: `
          Nome: ${data.nome}
          Email: ${data.email}
          Mensagem: ${data.mensagem}
          Data: ${new Date().toLocaleString('pt-BR')}
        `,
        html: `
          <h2>Nova mensagem do website</h2>
          <p><strong>Nome:</strong> ${data.nome}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Mensagem:</strong> ${data.mensagem}</p>
          <p><strong>Data:</strong> ${new Date().toLocaleString('pt-BR')}</p>
        `
      });
    } catch (emailError) {
      console.error('Erro ao enviar email:', emailError);
      // Não vamos lançar erro aqui, apenas logar
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Mensagem salva com sucesso',
      id: docRef.id
    });
  } catch (error: any) {
    console.error('Erro ao processar mensagem:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Erro ao processar mensagem' 
    }, { status: 500 });
  }
} 