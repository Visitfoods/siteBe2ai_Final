import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const video = formData.get('video') as File;
    const type = formData.get('type') as string;

    if (!video) {
      return NextResponse.json(
        { error: 'Nenhum vídeo foi enviado' },
        { status: 400 }
      );
    }

    // Criar o buffer do arquivo
    const bytes = await video.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Definir o caminho onde o vídeo será salvo
    const videoPath = join(process.cwd(), 'public', 'Video', video.name);

    // Salvar o arquivo
    await writeFile(videoPath, buffer);

    return NextResponse.json({ 
      success: true, 
      path: `/Video/${video.name}` 
    });
    
  } catch (error) {
    console.error('Erro ao fazer upload do vídeo:', error);
    return NextResponse.json(
      { error: 'Erro ao processar o upload do vídeo' },
      { status: 500 }
    );
  }
} 