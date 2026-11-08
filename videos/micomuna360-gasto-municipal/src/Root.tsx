import "@fontsource/nunito/600.css";
import "@fontsource/nunito/700.css";
import "@fontsource/nunito/800.css";
import "@fontsource/bricolage-grotesque/700.css";
import "@fontsource/bricolage-grotesque/800.css";
import { Composition } from "remotion";

import { hoyEnChile } from "./palabras.ts";
import { ALTO, ANCHO, FPS } from "./tema.ts";
import { duracionDe, Video, type PropsVideo } from "./Video.tsx";

export function Raiz() {
  const comunes = { musica: true, fechaGeneracion: hoyEnChile() };
  return (
    <>
      <Composition
        id="GastoLaPintana"
        component={Video}
        width={ANCHO}
        height={ALTO}
        fps={FPS}
        durationInFrames={duracionDe("completo", FPS)}
        defaultProps={{ version: "completo", ...comunes } satisfies PropsVideo}
      />
      <Composition
        id="GastoLaPintana60"
        component={Video}
        width={ANCHO}
        height={ALTO}
        fps={FPS}
        durationInFrames={duracionDe("corto", FPS)}
        defaultProps={{ version: "corto", ...comunes } satisfies PropsVideo}
      />
    </>
  );
}
