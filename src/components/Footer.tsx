import { motion, useScroll, useSpring } from "motion/react";
import { useState, useEffect } from "react";
import { 
  Linkedin, 
  Twitter, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink,
  ChevronRight
} from "lucide-react";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b ${isScrolled ? 'bg-white/90 backdrop-blur-lg shadow-sm py-2 border-gray-100' : 'bg-white py-4 border-transparent'}`}>
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-[1px] bg-blue-500 origin-left"
        style={{ scaleX }}
      />
      <div className="max-w-[1400px] mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          {/* Logo */}
          <div className="flex items-center pr-6 border-r border-gray-200">
            <img 
              src="https://res.cloudinary.com/dmutnjgp8/image/upload/v1772030743/logo_thal%C3%A8s_1_tkhzkc.png" 
              alt="Thales Informatique" 
              className="h-10 w-auto object-contain"
            />
          </div>
          
          {/* Links */}
          <div className="hidden lg:flex items-center px-6 gap-6">
            <a href="#" className="text-[10px] font-bold text-gray-400 hover:text-[#1B3769] transition-colors uppercase tracking-widest">Factorial</a>
            <a href="#" className="text-[10px] font-bold text-gray-400 hover:text-[#1B3769] transition-colors uppercase tracking-widest">Sage</a>
            <a href="#" className="text-[10px] font-bold text-gray-400 hover:text-[#1B3769] transition-colors uppercase tracking-widest">Héliolys</a>
          </div>

          <div className="hidden xl:flex items-center pl-6 border-l border-gray-200">
             <a href="#" className="text-[10px] font-bold text-gray-400 hover:text-[#1B3769] transition-colors uppercase tracking-widest">Event 2026</a>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-4 text-[10px] font-bold tracking-widest text-[#1B3769]">
            <span>13 MAI 2026</span>
            <span className="text-gray-300">|</span>
            <span>CASABLANCA - HÔTEL ONOMO</span>
          </div>
          <button 
            onClick={() => document.getElementById('demo-form')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-[11px] font-bold hover:bg-blue-700 transition-all uppercase tracking-wider"
          >
            Inscription Prioritaire
          </button>
        </div>
      </div>
    </nav>
  );
};

export const Partners = () => {
  const partners = [
    { name: "Thales Informatique", logo: "THALES" },
    { name: "Factorial", logo: "FACTORIAL" },
    { name: "Sage", logo: "SAGE" },
    { name: "Héliolys", logo: "HÉLIOLYS" },
  ];

  return (
    <div className="py-6 bg-white border-b border-gray-100 hidden md:block">
      <div className="max-w-7xl mx-auto px-4 flex justify-center items-center gap-12 text-[10px] font-bold text-gray-300 tracking-[0.2em]">
        {partners.map((partner, i) => (
          <div key={i} className="flex items-center gap-4">
            {i > 0 && <span className="text-gray-200">|</span>}
            <span className="hover:text-blue-500 transition-colors cursor-default">{partner.logo}</span>
          </div>
        ))}
      </div>
    </div>
  );
};



export const Footer = () => {
  return (
    <footer className="bg-[#0B1A3B] text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="space-y-6">
            <div className="flex items-center">
              <img 
                src="https://res.cloudinary.com/dmutnjgp8/image/upload/v1772030743/logo_thal%C3%A8s_1_tkhzkc.png" 
                alt="Thales Informatique" 
                className="h-12 w-auto object-contain brightness-0 invert"
              />
            </div>
            <p className="text-blue-200/60 text-sm leading-relaxed">
              Expert en solutions SIRH et transformation digitale pour les entreprises. Partenaire officiel Factorial et Sage.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Globe className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-6 flex items-center gap-2">
              Contact <ChevronRight className="w-4 h-4 text-blue-500" />
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 group cursor-pointer">
                <MapPin className="w-5 h-5 text-blue-400 shrink-0" />
                <span className="text-sm text-blue-200/80 group-hover:text-white transition-colors">123 Boulevard Haussmann, 75008 Paris</span>
              </li>
              <li className="flex items-center gap-3 group cursor-pointer">
                <Phone className="w-5 h-5 text-blue-400 shrink-0" />
                <span className="text-sm text-blue-200/80 group-hover:text-white transition-colors">01 80 00 00 00</span>
              </li>
              <li className="flex items-center gap-3 group cursor-pointer">
                <Mail className="w-5 h-5 text-blue-400 shrink-0" />
                <span className="text-sm text-blue-200/80 group-hover:text-white transition-colors">contact@thales-it.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 flex items-center gap-2">
              Solutions <ChevronRight className="w-4 h-4 text-blue-500" />
            </h4>
            <ul className="space-y-3">
              {["Factorial SIRH", "Sage Paie", "Héliolys Cloud", "Digitalisation RH", "Audit & Conseil"].map((item, i) => (
                <li key={i}>
                  <a href="#" className="text-sm text-blue-200/60 hover:text-white transition-colors flex items-center gap-2">
                    <div className="w-1 h-1 bg-blue-500 rounded-full" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white/5 p-8 rounded-3xl border border-white/10 flex flex-col justify-center text-center">
            <h4 className="font-bold mb-4">Prêt à transformer vos RH ?</h4>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-500 transition-all flex items-center justify-center gap-2">
              Démarrer ici <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:row justify-between items-center gap-4 text-[10px] text-blue-200/30 uppercase tracking-[0.2em] font-bold">
          <div>© 2026 Thales Informatique. Tous droits réservés.</div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Mentions Légales</a>
            <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
