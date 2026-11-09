import "@fontsource/nunito/600.css";
import "@fontsource/nunito/700.css";
import "@fontsource/nunito/800.css";
import "@fontsource/bricolage-grotesque/700.css";
import "@fontsource/bricolage-grotesque/800.css";
import { Composition } from "remotion";

import { hoyEnChile } from "./palabras.ts";
import { ALTO, ANCHO, FPS } from "./tema.ts";
import { duracionDe, Video, type PropsVideo } from "./Video.tsx";
import { ContenidoSocial } from "./social/Contenido.tsx";
import { duracionContenido, ejemploContenido } from "./social/modelo.ts";

export function Raiz() {
  const comunes = { musica: true, fechaGeneracion: hoyEnChile() };
  return (
    <>
      {[
        { id: "ContenidoVertical", width: 1080, height: 1920 },
        { id: "ContenidoCuadrado", width: 1080, height: 1080 },
        { id: "ContenidoHorizontal", width: 1920, height: 1080 },
      ].map((formato) => (
        <Composition
          key={formato.id}
          {...formato}
          component={ContenidoSocial}
          fps={FPS}
          durationInFrames={duracionContenido(ejemploContenido.escenas, FPS)}
          defaultProps={ejemploContenido}
          calculateMetadata={({ props }) => ({ durationInFrames: duracionContenido(props.escenas, FPS) })}
        />
      ))}
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
