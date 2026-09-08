import type { CSSProperties } from "react";
import { headOutline } from "./BrandMark";
import styles from "./EchoBackdrop.module.css";

const ECHOES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

// The "lines motif" — the Jackalope head fanned into layered strokes that
// fold toward a single silhouette and back, echoing the desktop app brand.
export function EchoBackdrop() {
  return (
    <div className={styles.backdrop} aria-hidden="true">
      <div className={styles.stage}>
        <svg className={styles.svg} viewBox="34 -6 118 132" fill="none">
          {ECHOES.map((echo) => (
            <path
              key={echo}
              d={headOutline}
              className={styles.line}
              style={
                {
                  "--echo": echo,
                  animationDelay: `${echo * -0.16}s`,
                } as CSSProperties
              }
            />
          ))}
          <path d={headOutline} className={styles.core} />
        </svg>
      </div>
    </div>
  );
}
