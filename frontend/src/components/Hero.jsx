import Button from "./Button";

function Hero() {
  return (
    <section className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-6xl font-bold tracking-tight text-gray-900">
          Find Your Next{" "}
          <span className="text-orange-500">Basketball Game</span>
        </h1>

        <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600">
          Join local games, meet new players, and never miss a chance to hoop.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Button text="Find Games" />
          <Button text="Host a Game" />
        </div>
      </div>
    </section>
  );
}

export default Hero;
