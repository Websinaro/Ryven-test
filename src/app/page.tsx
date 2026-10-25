import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import ProjectSection from "@/components/ProjectSection";
import Testimonials from "@/components/Testimonials";
import About from "@/components/About";
import SectionHeading from "@/components/SectionHeading";
import ContactCTA from "@/components/ContactCTA";
import { portfolio, resolveProjectMedia } from "@/data/portfolio";

export default function Home() {
  const resolvedProjects = portfolio.projects.map((project, index) => ({
    project,
    resolved: resolveProjectMedia(index),
  }));

  return (
    <main className="relative bg-background">
      <Navbar />
      <Hero />
      <Marquee />

      <section id="work" className="relative border-t border-line px-6 py-20 md:px-12 md:py-32">
        <div className="mx-auto max-w-6xl">
          <SectionHeading eyebrow="SELECTED WORK">Edits built to hold attention.</SectionHeading>
          <div className="mt-12 grid grid-cols-1 gap-4 md:mt-16 md:grid-cols-12 md:gap-5">
            {resolvedProjects.map(({ project, resolved }, index) => (
              <ProjectSection key={project.id} project={project} resolved={resolved} index={index} />
            ))}
          </div>
        </div>
      </section>

      <Testimonials />
      <About />
      <ContactCTA />
    </main>
  );
}
