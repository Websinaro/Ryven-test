import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProjectSection from "@/components/ProjectSection";
import About from "@/components/About";
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

      <section id="work" className="relative">
        {resolvedProjects.map(({ project, resolved }, index) => (
          <ProjectSection key={project.id} project={project} resolved={resolved} index={index} />
        ))}
      </section>

      <About />
      <ContactCTA />
    </main>
  );
}
