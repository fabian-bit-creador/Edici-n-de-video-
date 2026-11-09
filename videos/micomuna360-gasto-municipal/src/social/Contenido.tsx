import { useEffect, useState } from 'react';
import { AbsoluteFill, Audio, cancelRender, continueRender, delayRender, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { FUENTE } from '../tema.ts';
import type { EscenaSocial, PropsContenido } from './modelo.ts';

const tinta = '#132136';
const fuentes = ['800 48px "Bricolage Grotesque"', '700 48px "Nunito"'];

export function ContenidoSocial(props: PropsContenido) {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useVideoConfig();
  const [espera] = useState(() => delayRender('Cargando tipografías de contenido'));
  useEffect(() => {
    Promise.all(fuentes.map((f) => document.fonts.load(f)))
      .then(() => continueRender(espera))
      .catch((error: unknown) => cancelRender(error instanceof Error ? error : new Error(String(error))));
  }, [espera]);
  const unidad = Math.min(width, height);
  const dominio = new URL(props.destino).hostname;
  let inicio = 0;
  return (
    <AbsoluteFill style={{ background: '#F5F4EF', color: tinta, fontFamily: FUENTE.texto }}>
      <div style={{ position: 'absolute', width: unidad * 0.9, height: unidad * 0.9, right: -unidad * 0.35, top: -unidad * 0.35, border: `${unidad * 0.13}px solid ${props.color}`, opacity: 0.08, borderRadius: '50%' }} />
      <div style={{ position: 'absolute', left: width * 0.08, right: width * 0.12, top: height * 0.095, display: 'flex', alignItems: 'center', gap: unidad * 0.02 }}>
        <div style={{ width: unidad * 0.055, height: unidad * 0.055, background: props.color, borderRadius: unidad * 0.017, flexShrink: 0 }} />
        <div style={{ fontSize: unidad * 0.033, fontWeight: 800, lineHeight: 1.2 }}>{props.marca}</div>
      </div>
      {props.escenas.map((escena, indice) => {
        const desde = inicio;
        inicio += escena.segundos * fps;
        return (
          <Sequence key={`${indice}-${escena.etiqueta}`} from={desde} durationInFrames={escena.segundos * fps} name={escena.etiqueta}>
            <Escena escena={escena} indice={indice} color={props.color} />
          </Sequence>
        );
      })}
      <div style={{ position: 'absolute', left: width * 0.08, right: width * 0.14, bottom: height * (width >= height ? 0.09 : 0.205) }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: unidad * 0.012, background: props.color, color: '#FFF', padding: `${unidad * 0.019}px ${unidad * 0.028}px`, borderRadius: unidad * 0.018, fontSize: unidad * 0.028, fontWeight: 800, maxWidth: '100%', lineHeight: 1.25 }}>
          {props.cta}
          <svg aria-hidden width={unidad * 0.027} height={unidad * 0.027} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <div style={{ fontSize: unidad * 0.022, fontWeight: 700, marginTop: unidad * 0.016, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{dominio}</div>
        <div style={{ fontSize: unidad * 0.0185, marginTop: unidad * 0.01, color: '#4B5563' }}>{props.fuente}</div>
        {props.es_demo ? <div style={{ fontSize: unidad * 0.018, marginTop: unidad * 0.015, fontWeight: 800, letterSpacing: 2 }}>DEMOSTRACIÓN · SIN PUBLICAR</div> : null}
      </div>
      <div style={{ position: 'absolute', left: width * 0.08, right: width * 0.14, top: height * 0.165, height: unidad * 0.006, background: '#DCDDD7', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ width: `${Math.min(100, (frame + 1) / durationInFrames * 100)}%`, height: '100%', background: props.color }} />
      </div>
      {props.audio ? <Audio src={staticFile(props.audio)} /> : null}
    </AbsoluteFill>
  );
}

function Escena({ escena, indice, color }: { escena: EscenaSocial; indice: number; color: string }) {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const unidad = Math.min(width, height);
  const horizontal = width > height;
  const cuadrado = width === height;
  const entrada = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 20 });
  const salida = interpolate(frame, [escena.segundos * fps - 7, escena.segundos * fps - 1], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const factorTitulo = cuadrado ? 0.057 : horizontal ? 0.068 : 0.079;
  const tituloPx = unidad * factorTitulo * (escena.titulo.length > 60 ? 0.88 : 1);
  return (
    <div style={{ position: 'absolute', left: width * 0.08, right: width * (horizontal ? 0.22 : 0.14), top: height * (horizontal ? 0.245 : cuadrado ? 0.235 : 0.26), opacity: entrada * salida, transform: `translateY(${(1 - entrada) * 28}px)` }}>
      <div style={{ color, fontSize: unidad * 0.025, fontWeight: 800, letterSpacing: 2, lineHeight: 1.3, marginBottom: unidad * 0.026 }}>{String(indice + 1).padStart(2, '0')} / 04 · {escena.etiqueta.toLocaleUpperCase('es-CL')}</div>
      <div style={{ fontFamily: FUENTE.titulo, fontWeight: 800, fontSize: tituloPx, letterSpacing: -tituloPx * 0.035, lineHeight: 1.04, overflowWrap: 'anywhere', textWrap: 'balance' }}>{escena.titulo}</div>
      <div style={{ fontSize: unidad * (cuadrado ? 0.031 : 0.036), fontWeight: 700, lineHeight: 1.35, color: '#4B5563', marginTop: unidad * 0.032, textWrap: 'pretty', overflowWrap: 'anywhere' }}>{escena.detalle}</div>
    </div>
  );
}
