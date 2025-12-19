import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "../library/utils";

export const ThemeToggle = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        // Check localStorage for saved theme preference
        const storedTheme = localStorage.getItem("theme");
        if (storedTheme === "dark") {
            setIsDarkMode(true);
            document.documentElement.classList.add("dark");
        } else {
            localStorage.setItem("theme", "light");
            setIsDarkMode(false);
        }
    }, []);

    const toggleTheme = () => {
        if (isDarkMode) {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
            setIsDarkMode(false);
        } else {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
            setIsDarkMode(true);
        }
    };

    return (
        <button 
            onClick={toggleTheme} 
            className={cn(
                "fixed top-4 right-4 p-3 rounded-full",
                "bg-card border border-border",
                "transition-all duration-300 hover:scale-110",
                "shadow-lg hover:shadow-xl",
                "z-50"
            )}
            aria-label="Toggle theme"
        >
            {isDarkMode ? (
                <Sun className="h-6 w-6 text-yellow-400" />
            ) : (
                <Moon className="h-6 w-6 text-blue-600" />
            )}
        </button>
    );
};