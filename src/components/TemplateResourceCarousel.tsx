"use client";

const templates = [
  {
    title: "Classic award",
    image: "https://res.cloudinary.com/druuhwmtw/image/upload/v1750489424/1_apqifw.png",
    href: "https://www.canva.com/templates/?query=certificate",
  },
  {
    title: "Academic landscape",
    image: "https://res.cloudinary.com/druuhwmtw/image/upload/v1750489424/2_fdk1r3.png",
    href: "https://www.canva.com/templates/?query=academic-certificate",
  },
  {
    title: "Competition winner",
    image: "https://res.cloudinary.com/druuhwmtw/image/upload/v1750489424/3_ti9ldy.png",
    href: "https://www.canva.com/templates/?query=winner-certificate",
  },
  {
    title: "Workshop proof",
    image: "https://res.cloudinary.com/druuhwmtw/image/upload/v1750489424/4_ueiiaq.png",
    href: "https://www.canva.com/templates/?query=workshop-certificate",
  },
  {
    title: "Minimal credential",
    image: "https://res.cloudinary.com/druuhwmtw/image/upload/v1750489424/5_k4bbbw.png",
    href: "https://www.canva.com/templates/?query=professional-certificate",
  },
];

export default function TemplateResourceCarousel() {
  const items = [...templates, ...templates];

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">Canva starters</h3>
        <span className="text-xs text-slate-500">opens editor resources</span>
      </div>
      <div className="flex w-96 animate-[template-marquee_28s_linear_infinite] gap-4">
        {items.map((template, index) => (
          <a
            key={`${template.title}-${index}`}
            href={template.href}
            target="_blank"
            rel="noreferrer"
            className="group block w-56 shrink-0 overflow-hidden rounded-xl border border-slate-800 bg-slate-900"
          >
            <img src={template.image} alt={template.title} className="aspect-[16/9] w-full object-cover transition group-hover:scale-105" />
            <div className="px-3 py-2 text-sm text-slate-200">{template.title}</div>
          </a>
        ))}
      </div>
      <style jsx>{`
        @keyframes template-marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
