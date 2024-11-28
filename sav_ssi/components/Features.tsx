import Image from "next/image";

const Features = () => (
  <section id="features" className="py-16 bg-gray-50">
    <h2 className="text-3xl text-blue-500 font-bold text-center mb-8">Fonctionnalités de notre plateforme</h2>
    <div className="flex flex-wrap justify-center gap-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-72">
        <Image src="/images/feature-tracking.jpg" width={300} height={200}
        alt="Suivi des interventions" 
        className="mb-4 mx-auto" />
        <h3 className="font-semibold text-lg">Suivi des interventions</h3>
        <p className="text-sm text-gray-600">Visualisez et suivez chaque étape des interventions.</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-lg w-72">
        <Image src="/images/feature-notifications.jpg" width={300} height={200}
        alt="Notifications" 
        className="mb-4 mx-auto" />
        <h3 className="font-semibold text-lg">Notifications automatiques</h3>
        <p className="text-sm text-gray-600">Recevez des notifications pour chaque étape critique.</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-lg w-72">
        <Image src="/images/feature-reports.jpg" width={300} height={200}
        alt="Rapports" 
        className="mb-4 mx-auto" />
        <h3 className="font-semibold text-lg">Rapports détaillés</h3>
        <p className="text-sm text-gray-600">Accédez aux rapports complets de vos interventions.</p>
      </div>
    </div>
  </section>
);
export default Features;
