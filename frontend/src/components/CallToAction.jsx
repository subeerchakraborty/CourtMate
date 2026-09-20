import { Link } from "react-router-dom";

function CallToAction() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-6xl rounded-[2rem] bg-gradient-to-r from-orange-500 to-red-600 px-6 py-16 text-center text-white shadow-xl shadow-orange-200 md:px-12">
        <h2 className="text-4xl font-black md:text-5xl">Ready to run it back?</h2>
        <p className="mx-auto mt-4 max-w-xl text-orange-50">Join CourtMate and never miss a chance to hoop.</p>
        <Link to="/games" className="mt-8 inline-flex rounded-xl bg-gray-950 px-6 py-3 font-bold text-white transition hover:bg-gray-800">Get Started →</Link>
      </div>
    </section>
  );
}

export default CallToAction;
