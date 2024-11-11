import Image from "next/image";

const Hero = () => (
  <section className="flex flex-col text-white md:flex-row items-center justify-between py-20 px-10 bg-blue-700">
    <div className="md:w-1/2">
      <h1 className="text-4xl md:text-5xl font-bold mb-4">Experts en sécurité incendie</h1>
      <p className="text-lg mb-6">Assurez la sécurité de vos locaux avec nos équipements et services de maintenance.</p>
      <button className="bg-white hover:bg-blue-600 hover:text-white text-blue-700 px-6 py-3 rounded-lg">Planifier une intervention</button>
    </div>
    <div className="md:w-1/2 flex justify-center mt-6 md:mt-0">
      <Image
        src="/images/hero-image.jpg" width={500} height={500}
        alt="Technicien avec extincteur"
        className="w-full max-w-sm rounded-lg shadow-lg"
      />
    </div>
  </section>
);
export default Hero;
