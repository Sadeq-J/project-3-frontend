import { Link } from "react-router";

const featureCards = [
  {
    title: "Instant booking",
    description: "Reserve elite courts, pitches, and training spaces in minutes.",
    accent: "bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-600/15",
  },
  {
    title: "Team coordination",
    description: "Create squads, invite teammates, and set balanced formations for match-day play.",
    accent: "bg-sky-500/10 text-sky-700 ring-1 ring-sky-600/15",
  },
  {
    title: "Sports-first management",
    description: "Track venue availability, payments, and operational workflows from one place.",
    accent: "bg-violet-500/10 text-violet-700 ring-1 ring-violet-600/15",
  },
];

function Homepage() {
  return (
    <div className="space-y-10 py-8 sm:py-12">
      <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 shadow-xl shadow-slate-900/10">
        <div className="grid items-center gap-8 px-6 py-10 sm:px-8 lg:grid-cols-[1.25fr_0.75fr] lg:px-12 lg:py-14">
          <div className="space-y-6">
            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">
              Sports booking platform
            </span>

            <div className="space-y-4">
              <h1 className="max-w-xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                Book premium venues for every session.
              </h1>
              <p className="max-w-xl text-base text-slate-300 sm:text-lg">
                Seamlessly manage venue reservations, team bookings, and athlete coordination in one polished sports-tech experience.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to="/venues" className="primary-button bg-white text-slate-900 hover:bg-slate-100">
                Explore venues
              </Link>
              <Link to="/sign-up" className="secondary-button border-white/20 bg-white/5 text-white hover:bg-white/10">
                Join now
              </Link>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <div className="rounded-[22px] bg-slate-900 p-5 shadow-2xl shadow-slate-950/30 ring-1 ring-white/10">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Today</p>
                  <p className="mt-1 text-2xl font-bold text-white">Matchday</p>
                </div>
                <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-300">
                  Live slots
                </span>
              </div>

              <div className="space-y-3">
                {[
                  ["Football Arena", "18:00", "6 slots"],
                  ["Padel Court 3", "19:30", "4 slots"],
                  ["Tennis Center", "20:00", "3 slots"],
                ].map(([name, time, availability]) => (
                  <div key={name} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/40 px-4 py-3">
                    <div>
                      <p className="font-semibold text-white">{name}</p>
                      <p className="text-xs text-slate-400">{time}</p>
                    </div>
                    <span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs text-slate-200">{availability}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {featureCards.map((feature) => (
          <article key={feature.title} className="panel-surface p-6">
            <div className={`mb-4 inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${feature.accent}`}>
              Featured
            </div>
            <h2 className="mb-3 text-xl font-bold text-slate-900">{feature.title}</h2>
            <p className="text-sm leading-6 text-slate-600">{feature.description}</p>
          </article>
        ))}
      </section>
    </div>
  );
}

export default Homepage;