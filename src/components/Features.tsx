import { motion } from "motion/react";
import { 
  Users, 
  Clock, 
  TrendingUp, 
  Zap, 
  FileText, 
  BarChart3, 
  Calendar,
  CheckCircle2,
  Briefcase,
  PieChart,
  UserCheck
} from "lucide-react";

export const Stats = () => {
  const stats = [
    { label: "+40h gagnées par mois", description: "Récupérez du temps pour ce qui compte vraiment.", icon: Clock },
    { label: "-60% de tâches admin", description: "Automatisez vos workflows récurrents.", icon: Zap },
    { label: "Expérience collaborateur", description: "Un portail moderne et intuitif pour tous.", icon: UserCheck },
    { label: "Centralisation RH", description: "Toutes vos données au même endroit.", icon: PieChart },
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-[#1B3769] mb-4">Pourquoi digitaliser vos RH ?</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">Optimisez votre gestion quotidienne avec des indicateurs de performance en temps réel.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all group"
            >
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="text-2xl font-bold text-[#1B3769] mb-2">{stat.label}</div>
              <p className="text-sm text-gray-500 leading-relaxed">{stat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const Features = () => {
  const features = [
    { title: "Gestion des congés", icon: Calendar, color: "bg-orange-50 text-orange-600" },
    { title: "Notes de frais", icon: FileText, color: "bg-blue-50 text-blue-600" },
    { title: "Gestion des temps", icon: Clock, color: "bg-green-50 text-green-600" },
    { title: "Onboarding", icon: UserCheck, color: "bg-purple-50 text-purple-600" },
    { title: "Reporting RH", icon: BarChart3, color: "bg-red-50 text-red-600" },
    { title: "Dossiers collaborateurs", icon: Users, color: "bg-cyan-50 text-cyan-600" },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-[#1B3769] mb-4">Ce que vous découvrirez</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">Une suite complète d'outils pour transformer chaque aspect de votre gestion humaine.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="p-6 rounded-2xl border border-gray-100 flex items-center gap-6 hover:border-blue-200 hover:bg-blue-50/10 transition-all cursor-default"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${feature.color}`}>
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-semibold text-[#1B3769]">{feature.title}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};


