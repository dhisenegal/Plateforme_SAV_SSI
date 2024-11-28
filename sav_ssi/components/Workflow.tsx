import { FaRegHandshake, FaClipboardList, FaTools, FaCheckCircle, FaFileAlt } from 'react-icons/fa';

const Workflow = () => {
  const steps = [
    {
      id: 1,
      title: "Prise de contact",
      description: "Le client signale une demande de maintenance.",
      icon: <FaRegHandshake size={30} />,
    },
    {
      id: 2,
      title: "Planification",
      description: "Planification de l'intervention par l'équipe DHI.",
      icon: <FaClipboardList size={30} />,
    },
    {
      id: 3,
      title: "Intervention",
      description: "Les techniciens se rendent sur place et effectuent la maintenance.",
      icon: <FaTools size={30} />,
    },
    {
      id: 4,
      title: "Contrôle Qualité",
      description: "Tests et vérifications pour s'assurer de la qualité.",
      icon: <FaCheckCircle size={30} />,
    },
    {
      id: 5,
      title: "Rapport Final",
      description: "Un rapport détaillé est remis au client.",
      icon: <FaFileAlt size={30} />,
    },
  ];

  return (
    <section id="workflow" className="py-16 px-4 bg-gray-100">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-blue-700">
        Notre Processus de Maintenance
      </h2>
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className="flex flex-col items-center md:w-1/5 p-6 bg-white shadow-lg rounded-xl transition-transform transform hover:scale-105 hover:shadow-2xl"
          >
            {/* Icône avec animation de survol */}
            <div className="relative mb-6">
              <div className="w-20 h-20 flex items-center justify-center bg-blue-600 rounded-full shadow-lg transform transition-transform hover:scale-110">
                {step.icon}
              </div>
              {/* Ligne de connexion entre les étapes */}
              {index < steps.length - 1 && (
                <div className="absolute w-12 h-1 bg-blue-600 top-1/2 left-full hidden md:block"></div>
              )}
            </div>
            {/* Titre et Description avec effets */}
            <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">{step.title}</h3>
            <p className="text-gray-600 text-center">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Workflow;
