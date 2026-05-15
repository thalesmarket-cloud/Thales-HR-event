import { useState, type FormEvent, type ChangeEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  CheckCircle,
  Star,
  Smile,
  MessageSquare,
  CalendarDays
} from "lucide-react";
import { db, auth } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const LeadForm = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isInterested, setIsInterested] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    satisfaction: "Oui",
    wantsInvites: "Oui volontiers",
    nextThemes: "",
    nextStep: "Démo personnalisée"
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const path = 'responses';
      await addDoc(collection(db, path), {
        ...formData,
        interestedInFactorial: isInterested || "Non spécifié",
        submittedAt: serverTimestamp()
      });
      setSubmitted(true);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'responses');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Logo Header */}
      <div className="flex justify-center mb-10">
        <img 
          src="https://res.cloudinary.com/dmutnjgp8/image/upload/v1772030743/logo_thal%C3%A8s_1_tkhzkc.png" 
          alt="Thales Informatique" 
          className="h-16 w-auto object-contain brightness-0 invert"
        />
      </div>

      {/* Header Section */}
      <div className="text-center mb-8 font-['Poppins']">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">Merci pour votre participation</h2>
      </div>

      {/* Form Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/15 overflow-hidden"
      >
        <div className="p-8 md:p-12 font-['Poppins']">
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form 
                key="form"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                onSubmit={handleSubmit}
                className="space-y-10"
              >
                {/* Identification */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4 border-b border-white/5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Prénom</label>
                    <input 
                      required
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      type="text"
                      placeholder="Mohammed"
                      className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl focus:border-white/30 focus:bg-white/10 focus:outline-none transition-all text-sm text-white placeholder:text-white/20 font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Nom</label>
                    <input 
                      required
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      type="text"
                      placeholder="Berrada"
                      className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl focus:border-white/30 focus:bg-white/10 focus:outline-none transition-all text-sm text-white placeholder:text-white/20 font-medium"
                    />
                  </div>
                </div>

                {/* Identification Contact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Email Professionnel</label>
                    <input 
                      required
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      type="email"
                      placeholder="mohammed.berrada@entreprise.com"
                      className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl focus:border-white/30 focus:bg-white/10 focus:outline-none transition-all text-sm text-white placeholder:text-white/20 font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Téléphone</label>
                    <input 
                      required
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      type="tel"
                      placeholder="06 00 00 00 00"
                      className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl focus:border-white/30 focus:bg-white/10 focus:outline-none transition-all text-sm text-white placeholder:text-white/20 font-medium"
                    />
                  </div>
                </div>

                {/* Satisfaction Questions */}
                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Star className="w-4 h-4 text-blue-400" />
                      <label className="text-[11px] font-bold text-white/90 uppercase tracking-widest">Est-ce que l'événement vous a plû ?</label>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {['Oui, beaucoup', 'Oui', 'Moyennement', 'Non'].map((option) => (
                        <label key={option} className="flex-1 text-center p-3 border border-white/10 rounded-xl cursor-pointer hover:bg-white/5 transition-all text-[11px] font-bold text-white uppercase tracking-tighter has-[:checked]:bg-white has-[:checked]:text-[#1B3769] has-[:checked]:border-white">
                          <input 
                            type="radio" 
                            name="satisfaction" 
                            value={option}
                            checked={formData.satisfaction === option}
                            onChange={handleInputChange}
                            className="hidden" 
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Smile className="w-4 h-4 text-blue-400" />
                      <label className="text-[11px] font-bold text-white/90 uppercase tracking-widest">Est-ce que vous souhaitez qu'on vous invite à d'autres événements ?</label>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {['Oui volontiers', 'Pourquoi pas', 'Non merci'].map((option) => (
                        <label key={option} className="flex-1 text-center p-3 border border-white/10 rounded-xl cursor-pointer hover:bg-white/5 transition-all text-[11px] font-bold text-white uppercase tracking-tighter has-[:checked]:bg-white has-[:checked]:text-[#1B3769] has-[:checked]:border-white">
                          <input 
                            type="radio" 
                            name="wantsInvites" 
                            value={option}
                            checked={formData.wantsInvites === option}
                            onChange={handleInputChange}
                            className="hidden" 
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="w-4 h-4 text-blue-400" />
                      <label className="text-[11px] font-bold text-white/90 uppercase tracking-widest">Quelles thématiques souhaitez-vous qu'on aborde la prochaine fois ?</label>
                    </div>
                    <textarea 
                      name="nextThemes"
                      value={formData.nextThemes}
                      onChange={handleInputChange}
                      placeholder="Ex: Intelligence Artificielle en RH, Digitalisation de la paie..."
                      className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-white/30 focus:bg-white/10 focus:outline-none transition-all text-sm text-white placeholder:text-white/20 min-h-[120px] font-medium resize-none"
                    />
                  </div>
                </div>

                {/* Prospection Section */}
                <div className="space-y-6 pt-8 border-t border-white/5">
                  <div className="flex items-center gap-3">
                    <CalendarDays className="w-4 h-4 text-blue-400" />
                    <label className="text-[11px] font-bold text-white/90 uppercase tracking-widest">Est-ce que vous êtes interessé par la solution Factorial ?</label>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      type="button"
                      onClick={() => setIsInterested('oui')}
                      className={`p-4 rounded-xl border text-[11px] font-black uppercase tracking-widest transition-all ${isInterested === 'oui' ? 'bg-white text-[#1B3769] border-white shadow-xl shadow-black/20' : 'border-white/10 text-white hover:bg-white/5'}`}
                    >
                      Oui, je suis interessé
                    </button>
                    <button 
                      type="button"
                      onClick={() => setIsInterested('non')}
                      className={`p-4 rounded-xl border text-[11px] font-black uppercase tracking-widest transition-all ${isInterested === 'non' ? 'bg-white/10 text-white/40 border-white/5' : 'border-white/10 text-white hover:bg-white/5'}`}
                    >
                      Pas pour le moment
                    </button>
                  </div>

                  {isInterested === 'oui' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-5 pt-4 bg-white/5 p-6 rounded-2xl border border-white/10"
                    >
                      <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] text-center font-['Poppins']">Bénéficiez d'un accompagnement personnalisé</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-['Poppins']">
                        <label className="flex items-center p-4 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-all has-[:checked]:bg-white has-[:checked]:text-[#1B3769] has-[:checked]:border-white group">
                          <input 
                            type="radio" 
                            name="nextStep" 
                            value="Démo personnalisée"
                            checked={formData.nextStep === "Démo personnalisée"}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-blue-600 border-white/20" 
                          />
                          <span className="ml-3 text-[11px] font-bold uppercase tracking-tighter">Démo personnalisée</span>
                        </label>
                        <label className="flex items-center p-4 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-all has-[:checked]:bg-white has-[:checked]:text-[#1B3769] has-[:checked]:border-white group">
                          <input 
                            type="radio" 
                            name="nextStep" 
                            value="Prendre rendez-vous"
                            checked={formData.nextStep === "Prendre rendez-vous"}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-blue-600 border-white/20" 
                          />
                          <span className="ml-3 text-[11px] font-bold uppercase tracking-tighter">Prendre rendez-vous</span>
                        </label>
                      </div>
                    </motion.div>
                  )}
                </div>

                <div className="pt-8">
                  <button 
                    disabled={loading}
                    type="submit"
                    className="w-full py-5 bg-white text-[#1B3769] rounded-2xl font-black hover:bg-white/90 transition-all shadow-[0_15px_40px_rgba(0,0,0,0.3)] disabled:opacity-50 text-[11px] uppercase tracking-[0.2em] font-['Poppins']"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-[#1B3769]/30 border-t-[#1B3769] rounded-full animate-spin mx-auto" />
                    ) : (
                      "Envoyer mes réponses"
                    )}
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center py-20 font-['Poppins']"
              >
                <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mb-8 border border-white/20">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">Merci pour votre retour !</h3>
                <p className="text-white/60 text-sm max-w-sm mx-auto mb-10 leading-relaxed font-medium">
                  Vos réponses précieuses ont été enregistrées. Un expert Thales reviendra vers vous si nécessaire.
                </p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="text-white font-bold text-sm hover:underline tracking-tight opacity-80 hover:opacity-100 transition-opacity"
                >
                  Modifier mes réponses
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
