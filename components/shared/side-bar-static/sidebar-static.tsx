import Link from "next/link";


const stats = [{
    icon: "👨‍👩‍👧‍👦",
    description: "2,400+ NRN Families",
    span: "Across 18 countries worldwide"
},
{
    icon: "🏥",
    description: "14 Cities in Nepal",
    span: "With trained care companions"
},
{
    icon: "⚡",
    description: "24/7 Emergency Response",
    span: "Average 8-minute dispatch time"
}]


export function StaticSidebar() {
    return (
        <div className="hidden md:flex flex-col justify-between relative overflow-hidden bg-(--green-deep) text-white px-14 py-12">
            <div className="absolute -top-32 -right-36 h-105 w-105 rounded-full bg-[radial-gradient(circle,rgba(74,155,140,.35)_0%,transparent_70%)]" />

            <div className="absolute bottom-16 -left-20 h-75 w-75 rounded-full bg-[radial-gradient(circle,rgba(232,134,26,.2)_0%,transparent_70%)]" />

            <div className="absolute left-[55%] top-1/2 h-45 w-45 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,.04)_0%,transparent_70%)]" />
            <div className="absolute inset-0 z-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] bg-size-[28px_28px]"></div>
            <div className="relative z-1">
                <Link
                    href="/"
                    className="mb-14 flex items-center gap-3"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-[11px] border border-white/18 bg-white/12 backdrop-blur-[6px]">
                        <div className="flex h-10 w-10 items-center justify-center rounded-[11px] border border-white/18 bg-white/12 backdrop-blur-[6px]">
                            <svg className="h-5.5 w-5.5 fill-white" viewBox="0 0 24 24">
                                <path d="M12 21C12 21 3 14.5 3 8.5C3 5.46 5.46 3 8.5 3C10.24 3 11.91 3.81 13 5.08C14.09 3.81 15.76 3 17.5 3C20.54 3 23 5.46 23 8.5C23 14.5 12 21 12 21Z" opacity=".4" />
                                <path d="M9 11H11V9H13V11H15V13H13V15H11V13H9V11Z" />
                            </svg>
                        </div>

                    </div>
                    <span className="font-['Playfair_Display',serif] text-[1.5rem] font-bold text-white tracking-[-0.02em]">Pariwaar<span> +</span></span>
                </Link>

                <h2 className="font-['Playfair_Display',serif] text-[clamp(2rem,3vw,2.8rem)] font-bold leading-[1.18] text-white mb-[1.2rem]">
                    Care that travels<br />
                    <em>every distance.</em>
                </h2>
                <p className="text-[0.97rem] leading-[1.75] text-white/62 max-w-85">
                    Connecting Nepali families abroad with real-time health monitoring, companion visits, and peace of mind — for आमाबुवा back home.
                </p>

                <div className="relative z-10 flex flex-col gap-[0.85rem] mt-12">
                    {stats.map((stat, index) => (
                        <div key={index} className="flex items-center gap-[0.9rem] bg-white/[0.07] border border-white/10 rounded-[14px] px-[1.1rem] py-[0.85rem] backdrop-blur-sm animate-[slideInLeft_0.5s_ease_both]">
                            <div className="flex h-9.5 w-9.5 shrink-0 items-center justify-center rounded-[10px] bg-white/10 text-[1.1rem]">{stat.icon}</div>
                            <div className="block text-[0.95rem] font-semibold text-white">
                                <strong>{stat.description}</strong>
                                <span> {stat.span}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="relative z-10 text-[0.78rem] text-white/35 mt-8">
                © 2025 Pariwaar Plus Pvt. Ltd. · Registered in Nepal 🇳🇵
            </div>
        </div>
    )
}
