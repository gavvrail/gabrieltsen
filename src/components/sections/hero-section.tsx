"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "../ui/button";

export function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/20 rounded-full blur-[120px] opacity-50 animate-blob pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-secondary/20 rounded-full blur-[100px] opacity-30 pointer-events-none" />

            <div className="container relative z-10 px-4 md:px-6 flex flex-col items-center text-center gap-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-border backdrop-blur-sm text-sm text-muted-foreground"
                >
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span>Welcome to my digital garden</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50"
                >
                    Building Digital <br />
                    Experiences.
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="max-w-2xl text-lg md:text-xl text-muted-foreground"
                >
                    I'm a developer passionate about crafting intuitive, dynamic, and beautiful web applications.
                    Exploring the intersection of design and engineering.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4"
                >
                    <Button size="lg" className="rounded-full text-base h-12 px-8">
                        View Projects
                    </Button>
                    <Button size="lg" variant="outline" className="rounded-full text-base h-12 px-8 group">
                        Contact Me <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                </motion.div>
            </div>
        </section>
    );
}
