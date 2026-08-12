import { useState, useEffect } from "react";
import { CredentialForm, CredentialFormData } from "./components/CredentialForm";
import { CredentialCard } from "./components/CredentialCard";
import { Toaster } from "@/components/ui/sonner";
import { LogoWorkshop } from "./assets/LogoWorkshop";

export interface UtmParams {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
}

export default function App() {
  const [formData, setFormData] = useState<CredentialFormData | null>(null);
  const [utmParams, setUtmParams] = useState<UtmParams>({
    utm_source: "", utm_medium: "", utm_campaign: "", utm_term: "", utm_content: ""
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nomeParam = params.get("n") || params.get("nome");
    const empresaParam = params.get("e") || params.get("empresa") || "";

    if (nomeParam) {
      setFormData({ nomeCompleto: nomeParam, empresa: empresaParam, ddd: "+55", whatsapp: "", email: "" });
    }

    setUtmParams({
      utm_source: params.get("utm_source") || "",
      utm_medium: params.get("utm_medium") || "",
      utm_campaign: params.get("utm_campaign") || "",
      utm_term: params.get("utm_term") || "",
      utm_content: params.get("utm_content") || ""
    });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center relative overflow-hidden">
      <div className="bg-glow"></div>
      <main className="w-full max-w-6xl px-4 sm:px-8 py-8 flex flex-col md:flex-row gap-8 md:gap-12 items-center justify-center z-10">
        {!formData ? (
          <div className="w-full max-w-md flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col gap-2 items-center">
              <LogoWorkshop className="h-[120px] sm:h-[139px] w-fit object-contain mb-4 drop-shadow-lg mx-auto" />
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-primary mb-2">
                <span>✨ Imersão Presencial de 2 Dias</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-heading font-bold uppercase leading-tight text-center">
                Gere sua <br/><span className="neon-text">Credencial Digital</span>
              </h1>
              <p className="text-muted-foreground text-sm max-w-md text-center leading-relaxed">
                Preencha seus dados para garantir seu passe de acesso ao evento em Ribeirão Preto/SP <strong className="text-white">(15 e 16 de Setembro)</strong>.
              </p>
            </div>
            <CredentialForm onSuccess={(data) => setFormData(data)} utmParams={utmParams} />
          </div>
        ) : (
          <div className="w-full flex justify-center animate-in fade-in zoom-in-95 duration-700">
            <CredentialCard
              nome={formData.nomeCompleto}
              empresa={formData.empresa}
              fotoUrl={formData.fotoUrl}
              onBackToForm={() => setFormData(null)}
            />
          </div>
        )}
      </main>
      <Toaster theme="dark" position="top-center" />
    </div>
  );
}
