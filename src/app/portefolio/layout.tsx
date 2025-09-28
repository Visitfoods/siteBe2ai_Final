import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfólio | BE2AI',
  description: 'Explore nosso portfólio de projetos de IA, incluindo clones digitais, mascotes digitais, guias virtuais e conteúdos para redes sociais.',
};

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
} 