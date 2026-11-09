import { spring, useCurrentFrame, useVideoConfig } from "remotion";

import type { SubtituloPlan } from "../tiempos.ts";
import { C, FUENTE, MARGEN, ZONA_SUBTITULOS } from "../tema.ts";

/**
 * Subtítulos quemados en el video, sincronizados con la voz. Van sobre la
 * franja que Reels y TikTok dejan libre (encima de la descripción y a la
 * izquierda de los botones).
 */
export function Subtitulos({ subtitulos, oscuro = false }: { subtitulos: SubtituloPlan[]; oscuro?: boolean }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const actual = subtitulos.find((s) => frame >= s.desde && frame < s.hasta);
  if (!actual) return null;
  const p = spring({ frame: frame - actual.desde, fps, config: { damping: 16, stiffness: 220 } });
  return (
    <div
      style={{
        position: "absolute",
        top: ZONA_SUBTITULOS.arriba,
        left: MARGEN,
        right: MARGEN + 70,
        height: ZONA_SUBTITULOS.alto,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          transform: `scale(${0.94 + 0.06 * p})`,
          opacity: Math.min(p * 2, 1),
          background: oscuro ? C.ivory : C.navy,
          color: oscuro ? C.navy : C.ivory,
          fontFamily: FUENTE.texto,
          fontWeight: 800,
          fontSize: 50,
          lineHeight: 1.22,
          textAlign: "center",
          padding: "18px 34px",
          borderRadius: 28,
          boxShadow: "0 10px 30px rgba(15,32,56,0.25)",
          maxWidth: "100%",
        }}
      >
        {actual.texto}
      </div>
    </div>
  );
}
