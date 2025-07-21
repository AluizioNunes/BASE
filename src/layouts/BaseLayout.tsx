import { BaseButton } from "../components/ui/Button";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

export function BaseLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      <header className="px-6 py-4 bg-primary text-white flex items-center gap-2 shadow">
        <Calendar size={28} className="mr-2" />
        <span className="font-bold text-lg tracking-wide">BASE - SISTEMA BASE TEMPLATE</span>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold mb-4">Bem-vindo ao sistema base!</h1>
          <p className="mb-4 text-gray-700">Hoje é {format(new Date(), "dd/MM/yyyy")}.</p>
          <BaseButton icon={<Calendar size={18} />} onClick={() => alert("Exemplo de ação!")}>Ação Exemplo</BaseButton>
        </motion.div>
        {children}
      </main>
      <footer className="px-6 py-2 text-xs text-gray-500 text-center">&copy; {new Date().getFullYear()} BASE TEMPLATE</footer>
    </div>
  );
} 