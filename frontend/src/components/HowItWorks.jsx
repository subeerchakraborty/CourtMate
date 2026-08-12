function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Find a Game",
      description:
        "Discover basketball games happening near you and find one that matches your schedule.",
    },
    {
      number: "02",
      title: "Join Players",
      description:
        "Join a game, meet other basketball players, and get ready to hit the court.",
    },
    {
      number: "03",
      title: "Start Playing",
      description:
        "Show up, play hard, and enjoy the game with your new basketball community.",
    },
  ];

  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900">
            How It Works
          </h2>

          <p className="mt-4 text-gray-600">
            Find a game and get on the court in just a few simple steps.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {steps.map((step) => (
            <div
              key={step.number}
              className="bg-white rounded-2xl p-8 shadow-sm"
            >
              <span className="text-orange-500 font-bold text-lg">
                {step.number}
              </span>

              <h3 className="mt-4 text-2xl font-bold text-gray-900">
                {step.title}
              </h3>

              <p className="mt-3 text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;