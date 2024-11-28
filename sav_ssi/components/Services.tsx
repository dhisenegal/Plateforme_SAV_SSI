import Image from "next/image";

const services = [
  {
    title: "Vente d'équipements",
    description: "Fourniture d'extincteurs, alarmes et détecteurs.",
    image: "/images/equipment-sale.jpg"
  },
  {
    title: "Maintenance régulière",
    description: "Inspection et entretien de vos systèmes de sécurité.",
    image: "/images/maintenance-service.jpg"
  },
  {
    title: "Audit de sécurité",
    description: "Évaluation complète des installations incendie.",
    image: "/images/security-audit.jpg"
  },
];

const Services = () => (
  <section id="services" className="py-16 px-8 bg-white">
    <h2 className="text-3xl text-blue-500 font-bold text-center mb-8">Nos Services</h2>
    <div className="grid md:grid-cols-3 gap-6">
      {services.map((service, index) => (
        <div key={index} className="p-6 border rounded-lg shadow-md flex flex-col items-center">
          <Image src={service.image} width={200} height={200}
          alt={service.title} 
          className="mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-gray-900">
            {service.title}
          </h3>
          <p className="text-center text-gray-700">
            {service.description}
          </p>
        </div>
      ))}
    </div>
  </section>
);
export default Services;
