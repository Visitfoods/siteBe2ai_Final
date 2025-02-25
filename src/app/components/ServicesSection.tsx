import './ServicesSection.css';

interface Service {
  id: string;
  title: string;
  icon: React.ReactNode;
}

const services: Service[] = [
  // ... definir os serviços aqui
];

const ServicesSection = () => {
  return (
    <section className="w-full flex flex-col lg:flex-row">
      {/* Container do vídeo */}
      <div className="w-full h-[100vh] lg:w-1/2 relative">
        <video 
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay 
          muted 
          loop
        >
          <source src="/path-to-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <h2 className="text-white text-3xl font-bold">ELIMINAR TEMPOS DE ESPERA</h2>
        </div>
      </div>

      {/* Grid de serviços */}
      <div className="w-full lg:w-1/2 min-h-screen bg-blue-50 p-8 flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-8 text-center">SERVIÇOS</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full sm:max-w-3xl">
          {services.map((service) => (
            <div 
              key={service.id}
              className="service-card bg-blue-500 p-6 rounded-lg text-white text-center hover:bg-blue-600 transition-colors max-w-[280px] m-auto sm:m-0 w-full sm:max-w-none"
            >
              <div className="flex flex-col items-center gap-4">
                {service.icon}
                <h3 className="font-semibold">{service.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section> 
  );
};

export default ServicesSection; 