import { useState, useRef, ChangeEvent } from "react";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, User, Camera, Sparkles, Building2 } from "lucide-react";
import { toast } from "sonner";

const schema = z.object({
  nomeCompleto: z.string()
    .min(3, "Nome deve ter no mínimo 3 caracteres")
    .max(100, "Nome muito longo"),
  email: z.string()
    .email("E-mail inválido")
    .max(255, "E-mail muito longo"),
  ddd: z.string().min(1, "Campo obrigatório"),
  whatsapp: z.string()
    .min(8, "Número de WhatsApp inválido")
    .regex(/^[\d\s-()]+$/, "Apenas números, espaços, parênteses e traços permitidos"),
  empresa: z.string().max(80, "Nome da empresa muito longo").optional(),
  fotoUrl: z.string().optional(),
});

export type CredentialFormData = z.infer<typeof schema>;

interface Props {
  onSuccess: (data: CredentialFormData) => void;
  utmParams?: {
    utm_source: string;
    utm_medium: string;
    utm_campaign: string;
    utm_term: string;
    utm_content: string;
  };
}

export function CredentialForm({ onSuccess, utmParams }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm<CredentialFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      ddd: "+55",
      whatsapp: "",
      nomeCompleto: "",
      email: "",
      empresa: "",
      fotoUrl: ""
    }
  });

  const selectedDdd = watch("ddd");

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Imagem muito grande. Escolha uma de até 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPhotoPreview(result);
        setValue("fotoUrl", result);
        toast.success("Foto carregada para a credencial!");
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhotoPreview(null);
    setValue("fotoUrl", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  const getPlaceholder = (ddd: string) => {
    switch(ddd) {
      case "+1": return "(555) 000-0000";
      case "+351": return "900 000 000";
      case "+55": default: return "(11) 99999-9999";
    }
  };

  const onSubmit = async (data: CredentialFormData) => {
    setIsSubmitting(true);
    try {
      const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbyDKWLKA2A0EfzRVOTuBjztaXxURj0VLFrJzYItvnF1sqz3N9lhBuvBCr74g-j4HDhC/exec";
      
      const payload = {
        nome: data.nomeCompleto,
        email: data.email,
        whatsapp: `${data.ddd} ${data.whatsapp}`,
        empresa: data.empresa || "",
        temFoto: !!data.fotoUrl,
        timestamp: new Date().toISOString(),
        utm_source: utmParams?.utm_source || "",
        utm_medium: utmParams?.utm_medium || "",
        utm_campaign: utmParams?.utm_campaign || "",
        utm_term: utmParams?.utm_term || "",
        utm_content: utmParams?.utm_content || "",
      };

      console.log("Enviando dados para o webhook:", payload);

      await fetch(WEBHOOK_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      toast.success("Credencial de 2 Dias gerada com sucesso!");
      onSuccess(data);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao gerar credencial. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full fade-in-up">
      {/* Photo Upload Section */}
      <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-primary/30 bg-secondary/40 backdrop-blur-sm gap-3">
        <div className="text-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3" /> Foto da Credencial Digital (Opcional)
          </span>
          <p className="text-xs text-muted-foreground mt-0.5">
            Adicione sua foto para personalizar sua Credencial Digital dos 2 dias de imersão em Ribeirão Preto
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-full border-2 border-primary/60 overflow-hidden bg-black/60 flex items-center justify-center group shadow-md">
            {photoPreview ? (
              <img src={photoPreview} alt="Foto da Credencial Digital" className="w-full h-full object-cover" />
            ) : (
              <User className="w-8 h-8 text-muted-foreground/60" />
            )}
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              accept="image/*"
              className="hidden"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs bg-primary/20 hover:bg-primary/30 text-primary border border-primary/40 px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              {photoPreview ? "Trocar foto" : "Carregar foto"}
            </button>

            {photoPreview && (
              <button
                type="button"
                onClick={removePhoto}
                className="text-[11px] text-destructive hover:underline text-left cursor-pointer"
              >
                Remover foto
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2 text-left">
        <Label htmlFor="nomeCompleto" className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Nome Completo *</Label>
        <Input 
          id="nomeCompleto" 
          placeholder="Seu nome na Credencial Digital" 
          {...register("nomeCompleto")}
          className="h-12 rounded-lg bg-secondary border-border focus-visible:ring-primary focus-visible:border-primary text-foreground"
        />
        {errors.nomeCompleto && <span className="text-xs text-destructive">{errors.nomeCompleto.message}</span>}
      </div>

      <div className="space-y-2 text-left">
        <Label htmlFor="empresa" className="text-xs uppercase tracking-widest text-muted-foreground font-semibold flex items-center gap-1">
          <Building2 className="w-3 h-3 text-primary" /> Empresa (Opcional)
        </Label>
        <Input 
          id="empresa" 
          placeholder="Nome da sua empresa" 
          {...register("empresa")}
          className="h-12 rounded-lg bg-secondary border-border focus-visible:ring-primary focus-visible:border-primary text-foreground"
        />
        {errors.empresa && <span className="text-xs text-destructive">{errors.empresa.message}</span>}
      </div>

      <div className="space-y-2 text-left">
        <Label htmlFor="email" className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">E-mail *</Label>
        <Input 
          id="email" 
          type="email"
          placeholder="seu@email.com.br" 
          {...register("email")}
          className="h-12 rounded-lg bg-secondary border-border focus-visible:ring-primary focus-visible:border-primary text-foreground"
        />
        {errors.email && <span className="text-xs text-destructive">{errors.email.message}</span>}
      </div>

      <div className="space-y-2 text-left">
        <Label className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">WhatsApp *</Label>
        <div className="flex gap-3">
          <Controller 
            control={control}
            name="ddd"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-24 h-12 rounded-lg bg-secondary border-border focus:ring-primary">
                  <SelectValue placeholder="DDI" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="+55">🇧🇷 +55</SelectItem>
                  <SelectItem value="+1">🇺🇸 +1</SelectItem>
                  <SelectItem value="+351">🇵🇹 +351</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          <div className="flex-1 space-y-1">
            <Input 
              id="whatsapp" 
              placeholder={getPlaceholder(selectedDdd)}
              {...register("whatsapp")}
              className="h-12 rounded-lg bg-secondary border-border focus-visible:ring-primary focus-visible:border-primary w-full text-foreground"
            />
          </div>
        </div>
        {errors.whatsapp && <span className="text-xs text-destructive block mt-1">{errors.whatsapp.message}</span>}
        {errors.ddd && <span className="text-xs text-destructive block mt-1">{errors.ddd.message}</span>}
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="neon-button w-full h-14 rounded-lg mt-4 cursor-pointer text-base"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Gerando Credencial...
          </>
        ) : (
          "Gerar Minha Credencial (2 Dias)"
        )}
      </button>
    </form>
  );
}


