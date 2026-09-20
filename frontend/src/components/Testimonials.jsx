function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: "Rahul Sharma",
      role: "Basketball Player",
      message:
        "CourtMate made it really easy to find people to play basketball with. I found a game near me in minutes!",
    },
    {
      id: 2,
      name: "Arjun Singh",
      role: "Regular Player",
      message:
        "I used to struggle to find enough players for a game. Now I can host a game and quickly fill the spots.",
    },
    {
      id: 3,
      name: "Rohan Verma",
      role: "College Player",
      message:
        "A simple and useful platform for anyone who loves basketball. Definitely makes finding games easier.",
    },
  ];

  return (
    <section className="bg-[#120b0a] px-6 py-24 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="font-bold uppercase tracking-[0.25em] text-orange-400">Loved by players</p>
          <h2 className="mt-3 text-4xl font-bold text-white">
            What Players Say
          </h2>

          <p className="mt-4 text-orange-100/60">
            See what our basketball community has to say.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-sm"
            >
              <div className="text-orange-500 text-2xl">
                ★★★★★
              </div>

              <p className="mt-5 leading-relaxed text-orange-50/75">
                "{testimonial.message}"
              </p>

              <div className="mt-6">
                <h3 className="font-bold text-white">
                  {testimonial.name}
                </h3>

                <p className="text-sm text-orange-100/50">
                  {testimonial.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
