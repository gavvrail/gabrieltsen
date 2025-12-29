import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { HeroSection } from "@/components/sections/hero-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { BMICalculator } from "@/components/features/bmi-calculator";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-background selection:bg-primary selection:text-primary-foreground">
      <Navbar />

      <HeroSection />

      <section id="about" className="py-20 px-4 md:px-6 container mx-auto">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter">About Me</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            I am a creative technologist based in the cloud. I love building things that live on the internet,
            blending technical expertise with a keen eye for design. My goal is to always build products
            that provide pixel-perfect, performant experiences.
          </p>
        </div>
      </section>

      <section id="features" className="py-20 px-4 md:px-6 bg-secondary/10">
        <div className="container mx-auto">
          <div className="mb-12 text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter">My Playground</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Here are some interactive experiments and tools I've built. Try them out!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1: BMI Calculator */}
            <div className="flex flex-col items-center">
              <BMICalculator />
            </div>

            {/* Feature 2: Placeholder for now */}
            <div className="bg-card border border-border rounded-2xl p-6 h-full flex flex-col items-center justify-center text-center opacity-50 hover:opacity-100 transition-opacity">
              <h3 className="text-xl font-bold">More Coming Soon</h3>
              <p className="text-sm text-muted-foreground">Watch this space for new experiments.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
