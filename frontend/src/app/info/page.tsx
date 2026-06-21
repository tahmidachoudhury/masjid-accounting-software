import Link from "next/link"
import {
  ArrowRight,
  BadgePoundSterling,
  CheckCircle2,
  Eye,
  Landmark,
  LockKeyhole,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react"

const principles = [
  {
    icon: LockKeyhole,
    title: "Intent stays attached",
    text: "Zakat, sadaqah and restricted appeals are identified when a donor gives—not reconstructed from a bank statement later.",
  },
  {
    icon: Eye,
    title: "Trust is visible",
    text: "Every fund has a clear balance, a purpose and an audit trail, so trustees can explain exactly where money sits.",
  },
  {
    icon: Landmark,
    title: "Built around amanah",
    text: "Islamic principles are the system rules from day one, not a cosmetic layer added after the accounting is finished.",
  },
]

const roadmap = [
  ["Now", "Protected funds", "Capture donation type and cause at the point of payment; give treasurers a live, intelligible view."],
  ["Next", "Accountable spending", "Expense requests, approvals and fund-eligibility checks before money leaves the organisation."],
  ["Then", "Community capital", "Forecasting, reporting and ethical capital tools that help Muslim institutions plan and grow together."],
]

export default function InfoPage() {
  return (
    <div className="-mx-4 -my-8 overflow-hidden bg-[#fbfaf6] sm:-mx-6 lg:-mx-8">
      <section className="relative overflow-hidden bg-[#073d3b] px-4 pb-18 pt-12 text-white sm:px-6 sm:pt-18 lg:px-8">
        <div className="pointer-events-none absolute -right-32 -top-32 size-96 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -right-10 -top-10 size-72 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute bottom-0 left-[12%] size-56 translate-y-2/3 rounded-full bg-[#c6a866]/10 blur-3xl" />

        <div className="relative mx-auto max-w-6xl">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#d8bf82]/40 bg-white/8 px-3 py-1.5 text-xs font-semibold tracking-wide text-[#f5dfaa]">
            <Sparkles className="size-3.5" />
            FINANCIAL INFRASTRUCTURE FOR MUSLIM COMMUNITIES
          </div>
          <div className="grid gap-12 lg:grid-cols-[1.1fr_.9fr] lg:items-end">
            <div>
              <p className="mb-4 font-serif text-lg italic text-[#d8bf82]">Masjid Treasury</p>
              <h1 className="max-w-3xl text-4xl font-semibold leading-[1.06] tracking-tight sm:text-6xl">
                Money given with purpose should be managed with purpose.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75">
                A treasury operating system for masjids and Muslim charities—making every donation traceable, every fund protected and every financial decision clearer.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/donations/new" className="inline-flex items-center gap-2 rounded-lg bg-[#d8bf82] px-4 py-2.5 text-sm font-semibold text-[#123f3d] transition hover:bg-[#f1d898]">
                  Explore the donation flow <ArrowRight className="size-4" />
                </Link>
                <Link href="/" className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10">
                  View fund dashboard
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-white/12 bg-white/8 p-5 shadow-2xl backdrop-blur-sm">
              <p className="text-xs font-semibold tracking-[0.16em] text-[#d8bf82]">ONE DONATION, COMPLETE CLARITY</p>
              <div className="mt-5 space-y-3">
                <div className="flex items-center gap-3 rounded-xl bg-white/10 p-3">
                  <div className="grid size-9 place-items-center rounded-lg bg-[#d8bf82] text-[#123f3d]"><BadgePoundSterling className="size-5" /></div>
                  <div><p className="text-sm font-semibold">£250 donation received</p><p className="text-xs text-white/60">Donor chooses its intention</p></div>
                </div>
                <div className="ml-7 h-4 border-l border-dashed border-[#d8bf82]/70" />
                <div className="flex items-center gap-3 rounded-xl border border-[#d8bf82]/25 bg-[#d8bf82]/10 p-3">
                  <div className="grid size-9 place-items-center rounded-lg bg-[#d8bf82]/20 text-[#f5dfaa]"><ShieldCheck className="size-5" /></div>
                  <div><p className="text-sm font-semibold">Zakat · Emergency Relief</p><p className="text-xs text-white/60">Restrictions recorded automatically</p></div>
                </div>
                <div className="ml-7 h-4 border-l border-dashed border-[#d8bf82]/70" />
                <div className="flex items-center gap-3 rounded-xl bg-white/10 p-3">
                  <div className="grid size-9 place-items-center rounded-lg bg-white/15 text-white"><ReceiptText className="size-5" /></div>
                  <div><p className="text-sm font-semibold">Live fund balance updated</p><p className="text-xs text-white/60">Ready for accountable allocation</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold tracking-[0.14em] text-[#0f5f5a]">THE PROBLEM</p>
          <h2 className="mt-3 text-3xl font-semibold text-[#172d36] sm:text-4xl">Community wealth should build community power.</h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">Masjids and charities hold a profound responsibility: to honour the intention behind every pound entrusted to them. Yet the tools available are fragmented, opaque and designed around generic accounting—not the distinct rules, causes and trust relationships within our communities.</p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {principles.map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-2xl border border-[#e6e0d4] bg-white p-6 shadow-[0_8px_30px_rgba(31,53,50,0.04)]">
              <div className="grid size-10 place-items-center rounded-xl bg-[#e6f1ee] text-[#0f5f5a]"><Icon className="size-5" /></div>
              <h3 className="mt-5 text-xl font-semibold text-[#172d36]">{title}</h3>
              <p className="mt-2 leading-relaxed text-slate-600">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-[#e6e0d4] bg-[#f2f6f2] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold tracking-[0.14em] text-[#0f5f5a]">OUR FIRST WEDGE</p>
            <h2 className="mt-3 text-3xl font-semibold text-[#172d36]">Protect the money before it gets lost in the ledger.</h2>
            <p className="mt-4 leading-relaxed text-slate-600">We start where trust begins: the donation itself. Masjid Treasury records both the charitable type and the specific cause at payment time, creating separate, intelligible pots from the start.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {["Zakat: restricted, protected", "Sadaqah: voluntary giving", "Cause: Wudu area upgrade", "Cause: Youth programme"].map((label, index) => (
              <div key={label} className={`rounded-xl border p-4 ${index === 0 ? "border-amber-200 bg-amber-50" : "border-white bg-white"}`}>
                <CheckCircle2 className={`size-5 ${index === 0 ? "text-amber-700" : "text-[#0f5f5a]"}`} />
                <p className="mt-3 font-semibold text-[#172d36]">{label}</p>
                <p className="mt-1 text-sm text-slate-500">Tracked as its own fund</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div><p className="text-sm font-semibold tracking-[0.14em] text-[#0f5f5a]">THE VISION</p><h2 className="mt-3 text-3xl font-semibold text-[#172d36]">From clarity today to resilient institutions tomorrow.</h2></div>
          <div className="inline-flex items-center gap-2 text-sm font-medium text-slate-500"><UsersRound className="size-4 text-[#0f5f5a]" /> Designed with community at the centre</div>
        </div>
        <ol className="mt-10 grid gap-4 md:grid-cols-3">
          {roadmap.map(([phase, title, text], index) => (
            <li key={phase} className="relative rounded-2xl border border-[#e6e0d4] bg-white p-6">
              <span className="text-sm font-semibold text-[#0f5f5a]">0{index + 1} / {phase}</span>
              <h3 className="mt-5 text-xl font-semibold text-[#172d36]">{title}</h3>
              <p className="mt-2 leading-relaxed text-slate-600">{text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-[#d8bf82] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div><p className="font-serif text-xl italic text-[#31504a]">Amanah, made operational.</p><h2 className="mt-1 text-3xl font-semibold tracking-tight text-[#123f3d]">See the prototype in action.</h2></div>
          <Link href="/" className="inline-flex items-center gap-2 rounded-lg bg-[#123f3d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0b302e]">Open treasury dashboard <ArrowRight className="size-4" /></Link>
        </div>
      </section>
    </div>
  )
}
