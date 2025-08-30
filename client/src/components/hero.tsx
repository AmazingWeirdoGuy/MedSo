import posterImage from "@assets/poster_1756536893578.png";

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-4xl mx-auto" data-testid="hero-container">
        <img 
          src={posterImage}
          alt="ISB MedSociety Welcome Poster" 
          className="w-full h-auto object-contain transition-transform duration-300 ease-in-out hover:scale-105 shadow-lg rounded-lg"
          data-testid="hero-poster"
        />
      </div>
    </section>
  );
}
