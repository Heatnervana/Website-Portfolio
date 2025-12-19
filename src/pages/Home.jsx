import { Background } from "../components/Background";
import { HeroSection } from "../components/HeroSection";
import { Navbar } from "../components/Navbar";
import { ThemeToggle } from "../components/ThemeToggle";

export const Home = () => {
    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
        
        
            {/* Theme Toggle*/}
            <ThemeToggle />
            {/* Background*/}
            <Background />
            {/* Navbar*/}
            <Navbar />
            {/* Main Content =  Hero, About, Skill, Project*/}
            <HeroSection/>

            {/* Footer*/}
        </div>
    );
};




