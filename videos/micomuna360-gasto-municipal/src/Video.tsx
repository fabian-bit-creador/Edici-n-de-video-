import { useEffect, useState } from "react";
import { AbsoluteFill, Audio, continueRender, delayRender, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";

import type { Manifiesto } from "./config-voz.ts";
import { Subtitulos } from "./componentes/subtitulos.tsx";
import { Ejemplo, Gancho } from "./escenas/apertura.tsx";
import { Cierre, Ojo, Origen, Pregunta } from "./escenas/cierre.tsx";
import { Puesto } from "./escenas/puesto.tsx";
import type { Version } from "./guion.ts";
import { C } from "./tema.ts";
import { planificar, type EscenaPlan } from "./tiempos.ts";
import manifiestoJson from "../public/audio/manifiesto.json";

const manifiesto = manifiestoJson as unknown as Manifiesto;

export type PropsVideo = {
  version: Version;
  musica: boolean;
  fechaGeneracion: string;
};

export function duracionDe(version: Version, fps: number): number {
  return planificar(version, manifiesto, fps).total;
}

const FUENTES = ['800 40px "Bricolage Grotesque"', '700 40px "Bricolage Grotesque"', '600 40px "Nunito"', '700 40px "Nunito"', '800 40px "Nunito"'];

export function Video({ version, musica, fechaGeneracion }: PropsVideo) {
  const { fps } = useVideoConfig();
  const [espera] = useState(() => delayRender("Cargando tipografías"));
  useEffect(() => {
    Promise.all(FUENTES.map((f) => document.fonts.load(f))).then(() => continueRender(espera));
  }, [espera]);

  const { escenas, total } = planificar(version, manifiesto, fps);
  const cierre = escenas.find((e) => e.escena.tipo === "cierre");

  /* La música baja mientras habla la voz y sube en el cierre. */
  const volumenMusica = (f: number) => {
    const base = cierre && f >= cierre.desde ? 0.42 : 0.15;
    return base * interpolate(f, [0, 20, total - 45, total], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  };

  return (
    <AbsoluteFill style={{ background: C.ivory }}>
      {musica && <Audio src={staticFile("musica.mp3")} volume={volumenMusica} />}
      {escenas.map((plan) => (
        <Sequence key={plan.escena.id} from={plan.desde} durationInFrames={plan.duracion} name={plan.escena.id}>
          <Escena plan={plan} fechaGeneracion={fechaGeneracion} />
          {plan.audio && (
            <Sequence from={plan.inicioVoz} name={`voz ${plan.escena.id}`}>
              <Audio src={staticFile(`audio/${plan.audio}`)} />
            </Sequence>
          )}
          <Subtitulos subtitulos={plan.subtitulos} oscuro={plan.escena.tipo === "gancho" || plan.escena.tipo === "pregunta"} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
}

function Escena({ plan, fechaGeneracion }: { plan: EscenaPlan; fechaGeneracion: string }) {
  switch (plan.escena.tipo) {
    case "gancho":
      return <Gancho plan={plan} />;
    case "ejemplo":
      return <Ejemplo plan={plan} />;
    case "puesto":
      return <Puesto plan={plan} />;
    case "ojo":
      return <Ojo plan={plan} />;
    case "origen":
      return <Origen plan={plan} />;
    case "pregunta":
      return <Pregunta plan={plan} />;
    case "cierre":
      return <Cierre fechaGeneracion={fechaGeneracion} />;
  }
}
