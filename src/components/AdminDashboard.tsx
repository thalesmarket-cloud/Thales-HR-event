import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  auth, db 
} from "../lib/firebase";
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged,
  signOut,
  type User
} from "firebase/auth";
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot,
  Timestamp,
  writeBatch,
  doc
} from "firebase/firestore";
import { 
  LogOut, 
  Download, 
  Search,
  MessageSquare,
  Star,
  Users,
  Calendar,
  ChevronRight,
  ShieldCheck,
  Lock,
  Trash2
} from "lucide-react";

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

// Admin email from metadata/request
const ADMIN_EMAIL = "thales.market@gmail.com";

export const AdminDashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [responses, setResponses] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user && user.email === ADMIN_EMAIL) {
      const q = query(collection(db, "responses"), orderBy("submittedAt", "desc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const docs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setResponses(docs);
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, 'responses');
      });
      return () => unsubscribe();
    }
  }, [user]);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleLogout = () => signOut(auth);

  const handleReset = async () => {
    if (!responses.length) return;
    
    if (!showResetConfirm) {
      setShowResetConfirm(true);
      // Auto-cancel after 3 seconds if not clicked again
      setTimeout(() => setShowResetConfirm(false), 3000);
      return;
    }

    setIsResetting(true);
    try {
      const batch = writeBatch(db);
      responses.forEach((res) => {
        const docRef = doc(db, "responses", res.id);
        batch.delete(docRef);
      });
      await batch.commit();
      setShowResetConfirm(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'responses');
    } finally {
      setIsResetting(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";
    const date = timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A1128] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen bg-[#0A1128] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-[2rem] p-10 text-center shadow-2xl"
        >
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-[#1B3769] mb-4 font-['Poppins']">Accès Réservé</h1>
          <p className="text-gray-500 text-sm mb-10 leading-relaxed font-['Poppins']">
            Veuillez vous connecter avec votre compte administrateur <strong>{ADMIN_EMAIL}</strong> pour accéder aux données.
          </p>
          <button 
            onClick={handleLogin}
            className="w-full py-4 bg-[#1B3769] text-white rounded-xl font-bold hover:bg-[#1B3769]/90 transition-all flex items-center justify-center gap-3 font-['Poppins'] uppercase text-xs tracking-widest"
          >
            Se connecter avec Google
          </button>
        </motion.div>
      </div>
    );
  }

  const filteredResponses = responses.filter(r => 
    r.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#1B3769] rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#1B3769] font-['Poppins']">Admin Thales</h1>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest font-['Poppins']">Dashboard Questionnaire</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-xs font-bold text-[#1B3769] font-['Poppins']">{user.displayName}</span>
              <span className="text-[10px] text-blue-500 font-bold font-['Poppins']">Administrateur</span>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              title="Déconnexion"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-['Poppins']">Total Réponses</p>
              <p className="text-2xl font-bold text-[#1B3769] font-['Poppins']">{responses.length}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-['Poppins']">Intérêt Factorial</p>
              <p className="text-2xl font-bold text-[#1B3769] font-['Poppins']">
                {responses.filter(r => r.interestedInFactorial === 'oui').length}
              </p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-['Poppins']">Dernière soumission</p>
              <p className="text-md font-bold text-[#1B3769] font-['Poppins']">
                {responses.length > 0 ? formatDate(responses[0].submittedAt) : 'Aucune'}
              </p>
            </div>
          </div>
        </div>

        {/* Content Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Rechercher un contact..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:bg-white transition-all font-['Poppins']"
              />
            </div>
            
            <button 
              onClick={handleReset}
              disabled={responses.length === 0 || isResetting}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed font-['Poppins'] ${
                showResetConfirm 
                  ? 'bg-red-600 text-white animate-pulse' 
                  : 'bg-red-50 text-red-600 hover:bg-red-100'
              }`}
            >
              {isResetting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              {isResetting 
                ? 'Suppression...' 
                : showResetConfirm 
                  ? 'Confirmer ?' 
                  : 'Réinitialiser les résultats'
              }
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-['Poppins']">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Contact</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Satisfaction</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Invites?</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Factorial</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Détails</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredResponses.map((res) => (
                  <tr key={res.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4 font-['Poppins']">
                      <div className="flex flex-col">
                        <span className="font-bold text-[#1B3769] text-sm">{res.firstName} {res.lastName}</span>
                        <span className="text-xs text-gray-400">{res.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        res.satisfaction?.includes('beaucoup') ? 'bg-green-50 text-green-600' :
                        res.satisfaction === 'Oui' ? 'bg-blue-50 text-blue-600' :
                        'bg-gray-100 text-gray-400'
                      }`}>
                        {res.satisfaction}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-gray-600 font-medium">{res.wantsInvites}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${res.interestedInFactorial === 'oui' ? 'text-green-600' : 'text-gray-400'}`}>
                          {res.interestedInFactorial === 'oui' ? 'Intéressé' : 'Non'}
                        </span>
                        {res.interestedInFactorial === 'oui' && (
                          <span className="text-[10px] text-blue-500 font-medium italic">{res.nextStep}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button className="p-2 text-gray-300 hover:text-blue-500 hover:bg-white hover:shadow-sm rounded-lg transition-all group-hover:translate-x-1">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredResponses.length === 0 && (
              <div className="py-20 text-center">
                <p className="text-gray-400 text-sm font-['Poppins']">Aucune réponse trouvée</p>
              </div>
            )}
          </div>
        </div>

        {/* Themes Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredResponses.filter(r => r.nextThemes).length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-bold text-[#1B3769] font-['Poppins']">Dernières thématiques suggérées</h3>
              </div>
              <div className="space-y-4">
                {filteredResponses.filter(r => r.nextThemes).slice(0, 5).map((res, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-xs text-gray-600 italic font-['Poppins']">"{res.nextThemes}"</p>
                    <p className="text-[9px] text-gray-400 font-bold uppercase mt-2 tracking-widest">{res.firstName} {res.lastName}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
