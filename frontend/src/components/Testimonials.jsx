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
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900">
            What Players Say
          </h2>

          <p className="mt-4 text-gray-600">
            See what our basketball community has to say.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-2xl p-8 shadow-sm"
            >
              <div className="text-orange-500 text-2xl">
                ★★★★★
              </div>

              <p className="mt-5 text-gray-600 leading-relaxed">
                "{testimonial.message}"
              </p>

              <div className="mt-6">
                <h3 className="font-bold text-gray-900">
                  {testimonial.name}
                </h3>

                <p className="text-sm text-gray-500">
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