import { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { toPng } from "html-to-image";
import { Download, MapPin, Sparkles, Clock, ShieldCheck, Building2, ExternalLink } from "lucide-react";
import { LogoWorkshop } from "../assets/LogoWorkshop";

interface Props {
  nome: string;
  empresa?: string;
  fotoUrl?: string;
  onBackToForm?: () => void;
}

export function CredentialCard({ nome, empresa, fotoUrl, onBackToForm }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);

  const kebabCaseName = nome.trim().toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-");

  const centralUrl = "https://cont.4blue.com.br/central-participantes-rib/";

  const saveAsImage = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 3, backgroundColor: "#0d0f14",
        style: { transform: 'none', boxShadow: 'none' }
      });
      const link = document.createElement("a");
      link.download = `credencial-2dias-${kebabCaseName}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) { console.error("Erro ao gerar imagem:", error); }
  };

  return (
    <div className="w-full max-w-md flex flex-col items-center gap-6 fade-in-up my-4">
      <div ref={cardRef} className="w-full flex flex-col items-center justify-between p-8 relative shadow-2xl overflow-hidden metallic-shine border transition-all duration-500"
        style={{ borderRadius: "2.25rem", background: "linear-gradient(155deg, #11141c 0%, #0a0c10 50%, #171308 100%)", borderColor: "rgba(212, 175, 55, 0.65)", boxShadow: "0 25px 60px rgba(212, 175, 55, 0.25), inset 0 1px 2px rgba(255, 215, 0, 0.3)" }}>

        <div className="absolute top-3.5 left-1/2 -translate-x-1/2 flex flex-col items-center z-20">
          <div className="badge-slot" />
        </div>

        <div className="w-full flex justify-between items-center mt-3 z-10">
          <div className="h-0.5 w-20 bg-gradient-to-r from-transparent via-[#FFD700] to-primary opacity-80" />
          <span className="text-[10px] uppercase tracking-[0.35em] font-mono text-muted-foreground/90 font-semibold">PASSE OFICIAL 2026</span>
          <div className="h-0.5 w-20 bg-gradient-to-l from-transparent via-[#FFD700] to-primary opacity-80" />
        </div>

        <div className="mt-5 mb-2 z-10 flex flex-col items-center">
          <LogoWorkshop className="h-16 object-contain w-[88%] drop-shadow-[0_4px_16px_rgba(255,215,0,0.35)]" />
        </div>

        <div className="w-full bg-gradient-to-r from-[#B8860B] via-[#FFD700] to-[#D4AF37] text-black py-2 px-4 rounded-xl my-3 flex items-center justify-between shadow-xl z-10 font-bold uppercase tracking-wider text-xs">
          <span className="flex items-center gap-1.5"><Sparkles className="w-4 h-4 fill-black/20" /> IMERSÃO PRESENCIAL • 2 DIAS</span>
          <span className="text-[11px] tracking-widest font-mono bg-black/20 px-2.5 py-0.5 rounded-md text-black font-extrabold">15 & 16 SET</span>
        </div>

        <div className="w-full flex flex-col items-center z-10 my-3">
          {fotoUrl ? (
            <div className="relative mb-3">
              <div className="w-28 h-28 rounded-2xl border-2 border-[#FFD700]/80 p-1.5 bg-black/90 shadow-2xl relative overflow-hidden">
                <img src={fotoUrl} alt={nome} className="w-full h-full rounded-xl object-cover" />
              </div>
              <div className="absolute -bottom-1.5 -right-1.5 bg-[#FFD700] text-black p-1.5 rounded-full shadow-lg border border-black">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
          ) : (
            <div className="w-20 h-20 rounded-2xl border-2 border-[#FFD700]/60 bg-gradient-to-br from-primary/20 to-black flex items-center justify-center mb-3 text-[#FFD700] font-heading font-black text-3xl shadow-xl">
              {nome.charAt(0).toUpperCase()}
            </div>
          )}

          <span className="text-[10px] tracking-[0.35em] uppercase text-muted-foreground/80 font-bold mb-1">PARTICIPANTE CONFIRMADO</span>
          <h2 className="font-heading text-2xl font-black uppercase tracking-tight text-center z-10 text-[#FFD700] drop-shadow-[0_2px_10px_rgba(255,215,0,0.4)] px-2 leading-tight">{nome}</h2>

          {empresa && (
            <div className="mt-2 flex items-center gap-1.5 bg-primary/10 px-4 py-1 rounded-full border border-primary/30 text-center max-w-[92%]">
              <Building2 className="w-3.5 h-3.5 text-[#FFD700] shrink-0" />
              <span className="text-xs font-bold text-white tracking-wide truncate">{empresa}</span>
            </div>
          )}
        </div>

        <div className="relative z-10 my-3 p-3 bg-white rounded-2xl shadow-xl border-2 border-[#FFD700]/50 flex flex-col items-center">
          <QRCodeSVG value={centralUrl} size={120} level="H" includeMargin={false} />
          <span className="text-[9px] font-mono font-bold text-black/80 mt-1.5 tracking-tight flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-600" /> CENTRAL DO PARTICIPANTE
          </span>
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#FFD700]/50 to-transparent my-3 opacity-70 z-10" />

        <div className="w-full grid grid-cols-2 gap-3 text-muted-foreground text-xs font-medium z-10 px-1">
          <div className="flex items-center gap-2 justify-center bg-black/50 p-2.5 rounded-xl border border-white/10 shadow-inner">
            <MapPin className="w-4 h-4 text-[#FFD700] shrink-0" />
            <div className="flex flex-col text-left leading-tight">
              <span className="text-[9px] text-muted-foreground uppercase font-semibold">Local</span>
              <strong className="text-white text-xs">Ribeirão Preto / SP</strong>
            </div>
          </div>
          <div className="flex items-center gap-2 justify-center bg-black/50 p-2.5 rounded-xl border border-white/10 shadow-inner">
            <Clock className="w-4 h-4 text-[#FFD700] shrink-0" />
            <div className="flex flex-col text-left leading-tight">
              <span className="text-[9px] text-muted-foreground uppercase font-semibold">Horário</span>
              <strong className="text-white text-xs">09h às 20h</strong>
            </div>
          </div>
        </div>

        <div className="mt-4 text-[9px] font-mono text-muted-foreground/70 flex items-center gap-1.5 z-10">
          <ShieldCheck className="w-3.5 h-3.5 text-[#FFD700]" />
          <span className="tracking-wider">4BLUE WORKSHOP • 15 E 16 DE SETEMBRO</span>
        </div>
      </div>

      <div className="flex flex-col w-full gap-3">
        <p className="text-xs text-center text-muted-foreground/90 font-medium leading-snug px-2">
          Baixe sua credencial e poste nos stories marcando <strong className="text-primary font-bold">@4blueoficial</strong> 📸
        </p>
        <button onClick={saveAsImage} className="neon-button h-14 w-full flex items-center justify-center gap-2 text-base shadow-xl cursor-pointer">
          <Download className="w-5 h-5" /> Baixar Credencial HD (Imagem)
        </button>
        <a href={centralUrl} target="_blank" rel="noopener noreferrer"
          className="h-14 w-full rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-heading font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-2.5 shadow-lg border border-blue-400/30 transition-all duration-300 cursor-pointer">
          <ExternalLink className="w-5 h-5 text-blue-200" /> Central do Participante
        </a>
        {onBackToForm ? (
          <button onClick={onBackToForm} className="text-xs text-muted-foreground hover:text-white transition-colors text-center mt-1 underline underline-offset-4 cursor-pointer py-1">
            Gerar outra credencial para outro participante
          </button>
        ) : (
          <button onClick={() => window.location.reload()} className="text-xs text-muted-foreground hover:text-white transition-colors text-center mt-1 underline underline-offset-4 cursor-pointer py-1">
            Gerar outra credencial para outro participante
          </button>
        )}
      </div>
    </div>
  );
}
