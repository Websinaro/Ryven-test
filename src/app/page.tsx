import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Work from "@/components/Work";
import About from "@/components/About";
import ContactCTA from "@/components/ContactCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative overflow-x-clip bg-background">
      <Navbar />
      <Hero />
      <Work />
      <About />
      <ContactCTA />
      <Footer />
    </main>
  );
}
