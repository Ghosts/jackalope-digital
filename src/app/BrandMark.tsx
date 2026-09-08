// Jackalope head mark — shared geometry with the Jackalope desktop app brand.
export const characterPaths = {
  farEar: "M85 65 C77 48 74 16 84 9 C94 3 97 20 95 34 L93 62 Z",
  nearEar: "M80 68 C64 58 43 23 51 17 C60 9 79 32 88 61 Z",
  antler:
    "M99 64 C100 49 111 40 115 28 C117 23 115 17 117 14 C121 10 124 16 123 23 C128 22 131 17 134 19 C139 24 128 32 121 32 C119 39 115 44 113 48 C122 47 127 43 130 45 C135 50 122 57 108 57 L107 67 Z",
  head: "M78 59 C86 53 100 53 109 60 C116 65 116 73 124 76 L132 80 C139 85 132 96 122 98 L109 100 C102 103 100 110 102 116 C84 116 73 108 69 99 C80 98 80 89 76 81 C72 73 71 65 78 59 Z",
};

export const headOutline = [
  characterPaths.farEar,
  characterPaths.nearEar,
  characterPaths.antler,
  characterPaths.head,
].join(" ");

export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="38 3 105 117"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d={characterPaths.farEar} />
      <path d={characterPaths.nearEar} />
      <path d={characterPaths.antler} />
      <path d={characterPaths.head} />
    </svg>
  );
}
