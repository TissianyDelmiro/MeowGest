"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import type { GatoComStatus } from "@/lib/types/database";

type Props = {
  gato: GatoComStatus;
};

export function ShareButton({ gato }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [compartilhando, setCompartilhando] = useState(false);

  async function handleCompartilhar() {
    if (!cardRef.current) return;
    setCompartilhando(true);

    try {
      // Import dinâmico para não bloquear o carregamento inicial da página
      const html2canvas = (await import("html2canvas")).default;

      const canvas = await html2canvas(cardRef.current, {
        useCORS: true,
        scale: 2, // Alta resolução para ficar bonito no Instagram/WhatsApp
        backgroundColor: "#f5f0e8",
        logging: false,
      });

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error("Falha ao gerar imagem"))),
          "image/png",
          0.95
        );
      });

      const arquivo = new File([blob], `${gato.name}-meowgest.png`, {
        type: "image/png",
      });

      // Tenta compartilhar nativamente (funciona no celular no Chrome/Safari)
      if (
        typeof navigator !== "undefined" &&
        navigator.share &&
        navigator.canShare?.({ files: [arquivo] })
      ) {
        await navigator.share({
          title: `${gato.name} — MeowGest`,
          text: "Ajude a cuidar da minha colônia! 🐾",
          files: [arquivo],
        });
      } else {
        // Fallback: download direto no desktop ou browsers sem suporte
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${gato.name}-meowgest.png`;
        link.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      // Usuário cancelou ou outro erro não crítico
      if (err instanceof Error && err.name !== "AbortError") {
        alert("Não foi possível gerar a imagem. Tente novamente.");
      }
    } finally {
      setCompartilhando(false);
    }
  }

  const statusVacina = gato.vacina_vencida
    ? "⚠️ Vacina vencida"
    : gato.vacina_proxima
      ? "📅 Vacina próxima do vencimento"
      : gato.last_vaccine_date
        ? "✅ Vacina em dia"
        : "Vacina não informada";

  const corVacina = gato.vacina_vencida
    ? "#b91c1c" // red-700
    : gato.vacina_proxima
      ? "#d97706" // amber-600
      : "#4a7c5e"; // salvia verde

  return (
    <>
      {/* Botão de compartilhar visível ao usuário */}
      <button
        onClick={handleCompartilhar}
        disabled={compartilhando}
        className="w-full flex items-center justify-center gap-2 border border-terracota-500 text-terracota-600 font-semibold rounded-card py-3 px-4 hover:bg-terracota-50 transition-colors disabled:opacity-60 disabled:cursor-wait"
        aria-label={`Compartilhar card de divulgação de ${gato.name}`}
      >
        {compartilhando ? (
          <>
            <span className="animate-spin text-lg">⏳</span>
            Gerando imagem…
          </>
        ) : (
          <>
            <span aria-hidden="true">📤</span>
            Compartilhar card de divulgação
          </>
        )}
      </button>

      {/* Card de divulgação — fica fora da tela mas é capturado pelo html2canvas */}
      <div
        className="fixed"
        style={{ top: "-9999px", left: "-9999px", zIndex: -1 }}
        aria-hidden="true"
      >
        <div
          ref={cardRef}
          style={{
            width: "400px",
            background: "linear-gradient(135deg, #f5f0e8 0%, #ede8dc 100%)",
            borderRadius: "20px",
            padding: "28px",
            fontFamily: "'Nunito Sans', 'Segoe UI', sans-serif",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* Decoração de fundo */}
          <div
            style={{
              position: "absolute",
              top: "-30px",
              right: "-30px",
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              background: "rgba(193, 89, 50, 0.1)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-20px",
              left: "-20px",
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "rgba(193, 89, 50, 0.08)",
            }}
          />

          {/* Logo/Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              marginBottom: "18px",
            }}
          >
            <span style={{ fontSize: "18px" }}>🐾</span>
            <span
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#c15932",
                letterSpacing: "0.05em",
              }}
            >
              MeowGest
            </span>
          </div>

          {/* Foto do gato */}
          <div
            style={{
              width: "100%",
              height: "220px",
              borderRadius: "14px",
              overflow: "hidden",
              marginBottom: "18px",
              background: "#e8e0d0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "72px",
            }}
          >
            {gato.photo_url ? (
              <img
                src={gato.photo_url}
                alt={gato.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                crossOrigin="anonymous"
              />
            ) : (
              <span>🐱</span>
            )}
          </div>

          {/* Nome do gato */}
          <h2
            style={{
              fontSize: "28px",
              fontWeight: 800,
              color: "#292524",
              marginBottom: "12px",
              lineHeight: 1.1,
            }}
          >
            {gato.name}
          </h2>

          {/* Badges de status */}
          <div
            style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}
          >
            <span
              style={{
                padding: "5px 12px",
                borderRadius: "999px",
                fontSize: "12px",
                fontWeight: 700,
                background: gato.is_neutered ? "#d1fae5" : "#fef3c7",
                color: gato.is_neutered ? "#065f46" : "#92400e",
              }}
            >
              {gato.is_neutered ? "✂️ Castrado(a)" : "⚪ Não castrado(a)"}
            </span>

            <span
              style={{
                padding: "5px 12px",
                borderRadius: "999px",
                fontSize: "12px",
                fontWeight: 700,
                background: gato.vacina_vencida
                  ? "#fee2e2"
                  : gato.vacina_proxima
                    ? "#fef3c7"
                    : gato.last_vaccine_date
                      ? "#d1fae5"
                      : "#f5f5f4",
                color: corVacina,
              }}
            >
              {statusVacina}
            </span>
          </div>

          {/* Divisor */}
          <div
            style={{
              height: "1px",
              background: "rgba(0,0,0,0.08)",
              marginBottom: "16px",
            }}
          />

          {/* Mensagem de chamada */}
          <p
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: "#c15932",
              textAlign: "center",
              letterSpacing: "0.01em",
            }}
          >
            Ajude a cuidar da minha colônia! 🐾
          </p>
        </div>
      </div>
    </>
  );
}
