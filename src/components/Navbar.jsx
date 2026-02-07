import { cn } from "@/library/utils";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const navItems = [
    { name: "Home", href: "#hero" },
    { name: "About", href: "#about" },
    { name: "Projects", href: "#projects" },
];

export const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll);    
    }, []);

    return (
        <nav className={cn(
            "fixed w-full z-40 transition-all duration-300", 
            isScrolled ? "py-3 bg-background/95 backdrop-blur-md shadow-lg" : "py-5"
        )}>
            <div className="container flex items-center justify-between px-4 lg:px-8">
                <a className="text-xl font-bold text-foreground flex items-center" href="#hero">
                    John Patrick Yadao
                </a>

                {/* desktop nav */}
                <div className="hidden md:flex items-center gap-8">
                    {navItems.map((item, key) => (
                        <a 
                            key={key} 
                            href={item.href} 
                            className="text-foreground/70 hover:text-foreground transition-colors duration-300 font-medium"
                        >
                            {item.name}
                        </a>
                    ))}
                    
                </div>

                {/* mobile menu button */}
                <button 
                    onClick={() => setIsMenuOpen((prev) => !prev)} 
                    className="md:hidden p-2 text-foreground z-50" 
                    aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            
                {/* mobile nav */}
                <div className={cn(
                    "fixed inset-0 bg-background/95 backdrop-blur-md z-40 flex flex-col items-center justify-center",
                    "transition-all duration-300 md:hidden",
                    isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}>
                    <div className="flex flex-col space-y-8 text-xl">
                        {navItems.map((item, key) => (
                            <a 
                                key={key} 
                                href={item.href} 
                                className="text-foreground/70 hover:text-foreground transition-colors duration-300"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {item.name}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
};