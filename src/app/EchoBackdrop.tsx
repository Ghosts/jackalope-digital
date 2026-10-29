import type { CSSProperties } from "react";
import { AsciiField } from "./AsciiField";
import { characterPaths, headOutline } from "./BrandMark";
import styles from "./EchoBackdrop.module.css";

const ECHOES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

// The "lines motif" — the Jackalope head fanned into layered strokes that
// fold toward a single silhouette and back, echoing the desktop app brand.
export function EchoBackdrop() {
  return (
    <div className={styles.backdrop} aria-hidden="true">
      <div className={styles.stage}>
        <svg className={styles.svg} viewBox="34 -6 118 132" fill="none" aria-hidden="true">
          <defs>
            {/* Hides the inner half of each stroke, so overlapping parts (antler and ear
                bases inside the head) read as one silhouette instead of crossing lines. */}
            <mask
              id="echo-silhouette"
              maskUnits="userSpaceOnUse"
              x="0"
              y="-40"
              width="200"
              height="200"
            >
              <rect x="0" y="-40" width="200" height="200" fill="#fff" />
              {Object.values(characterPaths).map((d) => (
                <path key={d} d={d} fill="#000" />
              ))}
            </mask>
          </defs>
          {ECHOES.map((echo) => (
            <g
              key={echo}
              className={styles.line}
              style={
                {
                  "--echo": echo,
                  animationDelay: `${echo * -0.25}s`,
                } as CSSProperties
              }
            >
              <path d={headOutline} mask="url(#echo-silhouette)" />
            </g>
          ))}
          <path d={headOutline} className={styles.core} />
        </svg>
      </div>
      <AsciiField />
    </div>
  );
}
