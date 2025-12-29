"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

export function BMICalculator() {
    const [height, setHeight] = useState(170); // cm
    const [weight, setWeight] = useState(70); // kg

    const bmi = useMemo(() => {
        const h = height / 100;
        return (weight / (h * h)).toFixed(1);
    }, [height, weight]);

    const category = useMemo(() => {
        const val = parseFloat(bmi);
        if (val < 18.5) return { label: "Underweight", color: "text-blue-400" };
        if (val < 25) return { label: "Normal Weight", color: "text-green-400" };
        if (val < 30) return { label: "Overweight", color: "text-yellow-400" };
        return { label: "Obese", color: "text-red-400" };
    }, [bmi]);

    return (
        <div className="w-full max-w-md mx-auto bg-card border border-border rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col gap-6">
                <div className="text-center space-y-2">
                    <h3 className="text-2xl font-bold tracking-tight">BMI Calculator</h3>
                    <p className="text-muted-foreground text-sm">Interactive health check</p>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <label>Height</label>
                            <span className="font-mono">{height} cm</span>
                        </div>
                        <input
                            type="range"
                            min="100"
                            max="220"
                            value={height}
                            onChange={(e) => setHeight(Number(e.target.value))}
                            className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <label>Weight</label>
                            <span className="font-mono">{weight} kg</span>
                        </div>
                        <input
                            type="range"
                            min="30"
                            max="150"
                            value={weight}
                            onChange={(e) => setWeight(Number(e.target.value))}
                            className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                    </div>
                </div>

                <div className="relative h-32 flex items-center justify-center bg-secondary/30 rounded-xl overflow-hidden">
                    {/* Background Gauge Visual (Simple) */}
                    <motion.div
                        className="absolute inset-0 bg-primary/5"
                        animate={{
                            scaleX: Math.min(parseFloat(bmi) / 40, 1),
                            transformOrigin: "left"
                        }}
                        transition={{ type: "spring", stiffness: 100 }}
                    />

                    <div className="text-center z-10">
                        <motion.div
                            key={bmi}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-4xl font-black tracking-tighter"
                        >
                            {bmi}
                        </motion.div>
                        <motion.div
                            key={category.label}
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className={cn("text-sm font-bold uppercase tracking-wider", category.color)}
                        >
                            {category.label}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
