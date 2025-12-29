"use client";

import * as React from "react";
import Link from "next/link";
import { useScroll, motion, useMotionValueEvent } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export function Navbar() {
    const { scrollY } = useScroll();
    const [isScrolled, setIsScrolled] = React.useState(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 50);
    });

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 flex items-center justify-center p-4 transition-all duration-300",
                isScrolled ? "py-4" : "py-6"
            )}
        >
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={cn(
                    "flex items-center justify-between px-6 py-3 rounded-full border border-transparent transition-all duration-300",
                    isScrolled
                        ? "bg-background/80 backdrop-blur-md border-border shadow-lg w-full max-w-2xl"
                        : "w-full max-w-5xl bg-transparent"
                )}
            >
                <Link href="/" className="text-lg font-bold tracking-tighter">
                    Portfolio.
                </Link>

                <div className="flex items-center gap-6 text-sm font-medium">
                    <Link href="#about" className="hover:text-primary/80 transition-colors">
                        About
                    </Link>
                    <Link href="#projects" className="hover:text-primary/80 transition-colors">
                        Projects
                    </Link>
                    <Link href="#features" className="hover:text-primary/80 transition-colors">
                        Playground
                    </Link>
                </div>

                <Button size="sm" variant={isScrolled ? "default" : "outline"} className="rounded-full">
                    Contact Me
                </Button>
            </motion.nav>
        </header>
    );
}
