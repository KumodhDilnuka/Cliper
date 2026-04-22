import React from "react";
import SidebarStudent from "../../../components/Sidebar_student";
import TopBar from "../../../components/TopBar";

const resourceCards = [
  {
    title: "Lecture Slides",
    description: "Access weekly slide decks and lesson summaries for each course.",
    icon: "slideshow",
  },
  {
    title: "Study Notes",
    description: "Review lecturer-approved notes, references, and revision sheets.",
    icon: "menu_book",
  },
  {
    title: "Past Materials",
    description: "Browse archived documents to prepare for assessments and discussions.",
    icon: "inventory_2",
  },
];

const StudentResources = () => {
  return (
    <div className="bg-[#f8f9fb] text-[#191c1e] flex min-h-screen">
      <SidebarStudent />

      <main className="flex-1 md:ml-64 overflow-y-auto">
        <TopBar mode="student" title="Academic Atelier" />

        <div className="p-6 lg:p-8 mt-16">
          <div className="max-w-6xl mx-auto space-y-8">
            <section className="rounded-3xl bg-white border border-slate-200/50 shadow-[0px_12px_36px_rgba(25,28,30,0.06)] p-8">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#dae2ff] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#0040a1]">
                <span className="material-symbols-outlined text-sm">
                  library_books
                </span>
                Lecture Resources
              </span>
              <h1 className="mt-5 text-3xl font-extrabold tracking-tight">
                Everything you need for this week’s learning
              </h1>
              <p className="mt-3 max-w-2xl text-slate-600 leading-relaxed">
                Explore lecture materials, curated notes, and reference packs
                prepared to support your classes and self-study.
              </p>
            </section>

            <section className="grid gap-6 md:grid-cols-3">
              {resourceCards.map((card) => (
                <article
                  key={card.title}
                  className="rounded-3xl bg-white border border-slate-200/50 p-6 shadow-[0px_10px_30px_rgba(25,28,30,0.06)]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#dae2ff] text-[#0040a1]">
                    <span className="material-symbols-outlined">
                      {card.icon}
                    </span>
                  </div>
                  <h2 className="mt-5 text-xl font-bold">{card.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {card.description}
                  </p>
                </article>
              ))}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentResources;
