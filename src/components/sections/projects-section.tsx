"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import { Button } from "../ui/button";

const projects = [
    {
        title: "Project Alpha",
        description: "A cutting-edge web application built with Next.js and AI integration.",
        tags: ["Next.js", "AI", "Tailwind"],
    },
    {
        title: "E-Commerce Hub",
        description: "Full-stack e-commerce solution with real-time inventory management.",
        tags: ["React", "Node.js", "Stripe"],
    },
    {
        title: "Task Master",
        description: "Productivity tool for managing complex workflows and team collaboration.",
        tags: ["Vue", "Firebase", "PWA"],
    },
];

export function ProjectsSection() {
    return (
        <section id="projects" className="py-20 px-4 md:px-6 container mx-auto">
            <div className="flex flex-col items-center text-center space-y-4 mb-12">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tighter">Featured Projects</h2>
                <p className="text-muted-foreground max-w-2xl">
                    A selection of projects that demonstrate my passion for building high-quality software.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex flex-col h-full justify-between space-y-4">
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold">{project.title}</h3>
                                <p className="text-muted-foreground">{project.description}</p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex flex-wrap gap-2">
                                    {project.tags.map((tag) => (
                                        <span key={tag} className="text-xs font-semibold px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <Button variant="outline" size="sm" className="w-full">
                                        <Github className="w-4 h-4 mr-2" /> Code
                                    </Button>
                                    <Button size="sm" className="w-full">
                                        <ExternalLink className="w-4 h-4 mr-2" /> Live
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
