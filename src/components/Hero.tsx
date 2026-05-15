import { motion } from "motion/react";
import { 
  Users, 
  Calendar, 
  Clock, 
  BarChart3, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  MapPin
} from "lucide-react";

export const PhotoFrame = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, rotate: 0 }}
      animate={{ opacity: 1, rotate: -5 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="relative w-full max-w-lg mx-auto"
    >
      <div className="bg-white p-4 pb-12 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 relative group">
        {/* Sticky element */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-20 h-8 bg-blue-500/20 backdrop-blur-sm z-20" />
        
        <div className="aspect-[4/3] overflow-hidden bg-gray-200 relative">
          <img 
            src="https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?w=800&q=80" 
            alt="Event" 
            className="w-full h-full object-cover"
          />
          {/* Overlay to simulate the specific event photo look */}
          <div className="absolute inset-0 bg-blue-900/10 mix-blend-multiply" />
        </div>
        
        <div className="mt-6 px-2">
          <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
            Des événements qui ont marqué les professionnels RH <span className="inline-block w-1 h-1 bg-blue-500 rounded-full ml-1" />
          </div>
        </div>
      </div>

      {/* Background shadow/glow */}
      <div className="absolute -inset-10 bg-blue-500/5 blur-[100px] -z-10 rounded-full" />
    </motion.div>
  );
};

export const Hero = () => {
  return (
    <section className="relative min-h-screen pt-40 pb-20 px-4 overflow-hidden bg-white">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center relative z-10">
        <div className="space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 font-bold text-[10px] uppercase tracking-widest mb-10 border border-blue-100">
              Thématique de l'événement
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-black text-[#1B3769] leading-[1.05] tracking-tighter">
              L'ENTREPRISE AGILE À L'ÈRE DU DIGITAL :<br />
              COMMENT LA STRATÉGIE RH ET LE SIRH SOUTIENNENT LA CROISSANCE
            </h1>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base text-gray-500 max-w-2xl leading-relaxed"
          >
            Explorez l'avenir de la gestion RH à l'ère du digital : comment le SIRH devient un levier clé de performance, d'agilité et d'expérience collaborateur. Une demi-journée stratégique pour transformer vos processus et accompagner la croissance de votre organisation.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-8 py-4"
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-500" />
              <div className="text-[11px] font-bold text-[#1B3769]">13 Mai 2026</div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              <div className="text-[11px] font-bold text-[#1B3769]">14:00 - 17:00</div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-500" />
              <div className="text-[11px] font-bold text-[#1B3769]">Hôtel Onomo, Casablanca</div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex items-center gap-6"
          >
            <button className="px-10 py-4 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all shadow-[0_10px_30px_rgba(59,130,246,0.3)] group flex items-center justify-center gap-3 text-sm tracking-tight">
              Confirmer ma participation
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <div className="flex items-center gap-4">
               <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <img key={i} src={`https://i.pravatar.cc/100?u=${i}`} className="w-8 h-8 rounded-full border-2 border-white" alt="Avatar" />
                  ))}
               </div>
               <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Places limitées</div>
            </div>
          </motion.div>
        </div>

        <div className="relative pt-12 lg:pt-0">
          <PhotoFrame />
        </div>
      </div>
    </section>
  );
};
