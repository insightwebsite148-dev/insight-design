"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Compass, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center select-none overflow-hidden relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="mb-8 inline-block"
        >
          <Compass className="w-24 h-24 text-accent/40 stroke-[1]" />
        </motion.div>

        <h1 className="text-[120px] md:text-[180px] font-black tracking-tighter leading-none text-primary/10 absolute -top-12 left-1/2 -translate-x-1/2 pointer-events-none">
          404
        </h1>

        <div className="relative">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 text-gradient">
            Lost in Space
          </h2>
          <p className="text-muted text-lg max-w-md mx-auto mb-12 leading-relaxed font-light">
            The masterpiece you're looking for doesn't exist yet, or it has been relocated to another dimension of excellence.
          </p>
        </div>

        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Link
            href="/"
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-primary text-background rounded-full font-bold uppercase tracking-widest text-xs hover:bg-accent hover:text-primary transition-all duration-500 overflow-hidden shadow-2xl"
          >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="relative">Return to Insight</span>
          </Link>
        </motion.div>
      </motion.div>

      {/* Modern Grid Background */}
      <div className="absolute inset-0 -z-10 opacity-[0.03] [mask-image:radial-gradient(ellipse_at_center,black,transparent)] pointer-events-none">
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)', backgroundSize: '4rem 4rem' }} />
      </div>
    </div>
  );
}
