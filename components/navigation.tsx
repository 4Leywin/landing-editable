"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { NAV_ITEMS as NAV_FALLBACK } from "../lib/content";

type NavItem = { label: string; href: string };

export default function Navigation({
    navItems: navProp,
}: {
    navItems?: NavItem[];
}) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        handleScroll();
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navItems: NavItem[] =
        navProp && navProp.length ? navProp : NAV_FALLBACK;

    return (
        <nav
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${
                scrolled
                    ? "bg-background/95 backdrop-blur-md border-b border-border"
                    : "bg-transparent"
            }`}
        >
            <div className="max-w-7xl mx-auto  sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20 px-4">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                            <span className="text-background font-serif font-bold text-lg">
                                ✦
                            </span>
                        </div>
                        <span className="font-serif text-xl font-bold text-primary hidden sm:inline">
                            Ritual Dorado
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* CTA Button */}
                    <div className="hidden md:block">
                        <button className="px-6 py-2 bg-primary text-background font-semibold rounded-full hover:bg-primary-dark transition-colors">
                            Agendar
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-primary"
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileOpen && (
                    <div className="md:hidden pb-4 border-t border-border bg-secondary w-full">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="block py-2 px-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
                                onClick={() => setMobileOpen(false)}
                            >
                                {item.label}
                            </Link>
                        ))}
                        <button className="w-full mt-4 px-6 py-2 bg-primary text-background font-semibold rounded-full hover:bg-primary-dark transition-colors">
                            Agendar
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}
