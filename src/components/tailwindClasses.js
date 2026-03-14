const colors = [
  'slate', 'gray', 'zinc', 'neutral', 'stone',
  'red', 'orange', 'amber', 'yellow', 'lime',
  'green', 'emerald', 'teal', 'cyan', 'sky',
  'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose',
];

const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

const spacing = [
  'px', '0', '0.5', '1', '1.5', '2', '2.5', '3', '3.5', '4', '5', '6', '7', '8',
  '9', '10', '11', '12', '14', '16', '20', '24', '28', '32', '36', '40', '44',
  '48', '52', '56', '60', '64', '72', '80', '96',
];

const fractions = [
  '1/2', '1/3', '2/3', '1/4', '2/4', '3/4',
  '1/5', '2/5', '3/5', '4/5', '1/6', '2/6', '3/6', '4/6', '5/6',
];

const colorClasses = colors.flatMap((c) => shades.map((s) => `${c}-${s}`));

const raw = [
  // ── Layout ──────────────────────────────────────────────────────────────
  'block', 'inline-block', 'inline', 'flex', 'inline-flex', 'table', 'grid',
  'inline-grid', 'contents', 'hidden', 'flow-root', 'list-item',

  // ── Overflow ──────────────────────────────────────────────────────────
  'overflow-auto', 'overflow-hidden', 'overflow-clip', 'overflow-visible', 'overflow-scroll',
  'overflow-x-auto', 'overflow-x-hidden', 'overflow-x-visible', 'overflow-x-scroll',
  'overflow-y-auto', 'overflow-y-hidden', 'overflow-y-visible', 'overflow-y-scroll',

  // ── Position ──────────────────────────────────────────────────────────
  'static', 'fixed', 'absolute', 'relative', 'sticky',
  'inset-0', 'inset-auto', 'inset-x-0', 'inset-y-0',
  'top-0', 'top-auto', 'top-full', 'top-1/2',
  'right-0', 'right-auto', 'right-full', 'right-1/2',
  'bottom-0', 'bottom-auto', 'bottom-full', 'bottom-1/2',
  'left-0', 'left-auto', 'left-full', 'left-1/2',
  ...spacing.map((s) => `top-${s}`),
  ...spacing.map((s) => `right-${s}`),
  ...spacing.map((s) => `bottom-${s}`),
  ...spacing.map((s) => `left-${s}`),

  // ── Z-index ────────────────────────────────────────────────────────────
  ...[0, 10, 20, 30, 40, 50].map((n) => `z-${n}`), 'z-auto',

  // ── Visibility ────────────────────────────────────────────────────────
  'visible', 'invisible', 'collapse',

  // ── Flex ──────────────────────────────────────────────────────────────
  'flex-row', 'flex-row-reverse', 'flex-col', 'flex-col-reverse',
  'flex-wrap', 'flex-wrap-reverse', 'flex-nowrap',
  'flex-1', 'flex-auto', 'flex-initial', 'flex-none',
  'grow', 'grow-0', 'shrink', 'shrink-0',
  'justify-normal', 'justify-start', 'justify-end', 'justify-center',
  'justify-between', 'justify-around', 'justify-evenly', 'justify-stretch',
  'justify-items-start', 'justify-items-end', 'justify-items-center', 'justify-items-stretch',
  'justify-self-auto', 'justify-self-start', 'justify-self-end', 'justify-self-center', 'justify-self-stretch',
  'items-start', 'items-end', 'items-center', 'items-baseline', 'items-stretch',
  'content-normal', 'content-start', 'content-end', 'content-center',
  'content-between', 'content-around', 'content-evenly', 'content-stretch',
  'self-auto', 'self-start', 'self-end', 'self-center', 'self-stretch', 'self-baseline',
  'place-content-center', 'place-content-start', 'place-content-end',
  'place-items-center', 'place-items-start', 'place-items-end', 'place-items-baseline', 'place-items-stretch',
  'place-self-auto', 'place-self-start', 'place-self-end', 'place-self-center', 'place-self-stretch',

  // ── Grid ──────────────────────────────────────────────────────────────
  ...Array.from({ length: 12 }, (_, i) => `grid-cols-${i + 1}`),
  'grid-cols-none', 'grid-cols-subgrid',
  ...Array.from({ length: 13 }, (_, i) => `col-span-${i + 1}`), 'col-span-full',
  'col-start-auto', 'col-end-auto',
  ...Array.from({ length: 12 }, (_, i) => `grid-rows-${i + 1}`), 'grid-rows-none',
  ...Array.from({ length: 13 }, (_, i) => `row-span-${i + 1}`), 'row-span-full',
  'auto-cols-auto', 'auto-cols-min', 'auto-cols-max', 'auto-cols-fr',
  'auto-rows-auto', 'auto-rows-min', 'auto-rows-max', 'auto-rows-fr',
  'grid-flow-row', 'grid-flow-col', 'grid-flow-dense', 'grid-flow-row-dense', 'grid-flow-col-dense',

  // ── Gap ───────────────────────────────────────────────────────────────
  ...spacing.map((s) => `gap-${s}`),
  ...spacing.map((s) => `gap-x-${s}`),
  ...spacing.map((s) => `gap-y-${s}`),

  // ── Padding ───────────────────────────────────────────────────────────
  ...spacing.map((s) => `p-${s}`),
  ...spacing.map((s) => `px-${s}`),
  ...spacing.map((s) => `py-${s}`),
  ...spacing.map((s) => `pt-${s}`),
  ...spacing.map((s) => `pr-${s}`),
  ...spacing.map((s) => `pb-${s}`),
  ...spacing.map((s) => `pl-${s}`),

  // ── Margin ────────────────────────────────────────────────────────────
  ...spacing.map((s) => `m-${s}`),
  ...spacing.map((s) => `mx-${s}`),
  ...spacing.map((s) => `my-${s}`),
  ...spacing.map((s) => `mt-${s}`),
  ...spacing.map((s) => `mr-${s}`),
  ...spacing.map((s) => `mb-${s}`),
  ...spacing.map((s) => `ml-${s}`),
  'm-auto', 'mx-auto', 'my-auto', 'mt-auto', 'mr-auto', 'mb-auto', 'ml-auto',
  ...spacing.filter((s) => s !== '0').map((s) => `-m-${s}`),
  ...spacing.filter((s) => s !== '0').map((s) => `-mx-${s}`),
  ...spacing.filter((s) => s !== '0').map((s) => `-my-${s}`),
  ...spacing.filter((s) => s !== '0').map((s) => `-mt-${s}`),
  ...spacing.filter((s) => s !== '0').map((s) => `-mr-${s}`),
  ...spacing.filter((s) => s !== '0').map((s) => `-mb-${s}`),
  ...spacing.filter((s) => s !== '0').map((s) => `-ml-${s}`),

  // ── Space between ─────────────────────────────────────────────────────
  ...spacing.map((s) => `space-x-${s}`),
  ...spacing.map((s) => `space-y-${s}`),
  'space-x-reverse', 'space-y-reverse',

  // ── Sizing ────────────────────────────────────────────────────────────
  ...spacing.map((s) => `w-${s}`),
  ...fractions.map((f) => `w-${f}`),
  'w-full', 'w-screen', 'w-svw', 'w-lvw', 'w-dvw', 'w-min', 'w-max', 'w-fit', 'w-auto',
  ...spacing.map((s) => `h-${s}`),
  ...fractions.map((f) => `h-${f}`),
  'h-full', 'h-screen', 'h-svh', 'h-lvh', 'h-dvh', 'h-min', 'h-max', 'h-fit', 'h-auto',
  ...spacing.map((s) => `size-${s}`),
  'size-full', 'size-auto', 'size-min', 'size-max', 'size-fit',

  // ── Min / Max ─────────────────────────────────────────────────────────
  'min-w-0', 'min-w-full', 'min-w-min', 'min-w-max', 'min-w-fit',
  ...spacing.map((s) => `min-w-${s}`),
  'max-w-none', 'max-w-xs', 'max-w-sm', 'max-w-md', 'max-w-lg', 'max-w-xl',
  'max-w-2xl', 'max-w-3xl', 'max-w-4xl', 'max-w-5xl', 'max-w-6xl', 'max-w-7xl',
  'max-w-full', 'max-w-min', 'max-w-max', 'max-w-fit',
  'max-w-screen-sm', 'max-w-screen-md', 'max-w-screen-lg', 'max-w-screen-xl', 'max-w-screen-2xl',
  ...spacing.map((s) => `max-w-${s}`),
  'min-h-0', 'min-h-full', 'min-h-screen', 'min-h-svh', 'min-h-lvh', 'min-h-dvh', 'min-h-min', 'min-h-max', 'min-h-fit',
  ...spacing.map((s) => `min-h-${s}`),
  'max-h-none', 'max-h-full', 'max-h-screen', 'max-h-svh', 'max-h-lvh', 'max-h-dvh', 'max-h-min', 'max-h-max', 'max-h-fit',
  ...spacing.map((s) => `max-h-${s}`),

  // ── Typography ────────────────────────────────────────────────────────
  'text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl',
  'text-2xl', 'text-3xl', 'text-4xl', 'text-5xl', 'text-6xl', 'text-7xl', 'text-8xl', 'text-9xl',
  'font-thin', 'font-extralight', 'font-light', 'font-normal', 'font-medium',
  'font-semibold', 'font-bold', 'font-extrabold', 'font-black',
  'font-sans', 'font-serif', 'font-mono',
  'italic', 'not-italic',
  'underline', 'overline', 'line-through', 'no-underline',
  'uppercase', 'lowercase', 'capitalize', 'normal-case',
  'truncate', 'text-ellipsis', 'text-clip',
  'text-left', 'text-center', 'text-right', 'text-justify', 'text-start', 'text-end',
  'whitespace-normal', 'whitespace-nowrap', 'whitespace-pre',
  'whitespace-pre-line', 'whitespace-pre-wrap', 'whitespace-break-spaces',
  'break-normal', 'break-words', 'break-all', 'break-keep',
  'leading-none', 'leading-tight', 'leading-snug', 'leading-normal', 'leading-relaxed', 'leading-loose',
  ...['3', '4', '5', '6', '7', '8', '9', '10'].map((n) => `leading-${n}`),
  'tracking-tighter', 'tracking-tight', 'tracking-normal', 'tracking-wide', 'tracking-wider', 'tracking-widest',
  'list-none', 'list-disc', 'list-decimal', 'list-inside', 'list-outside',
  'align-baseline', 'align-top', 'align-middle', 'align-bottom', 'align-text-top', 'align-text-bottom',

  // ── Text colors ───────────────────────────────────────────────────────
  ...colorClasses.map((c) => `text-${c}`),
  'text-white', 'text-black', 'text-transparent', 'text-inherit', 'text-current',

  // ── Background colors ─────────────────────────────────────────────────
  ...colorClasses.map((c) => `bg-${c}`),
  'bg-white', 'bg-black', 'bg-transparent', 'bg-inherit', 'bg-current', 'bg-none',
  'bg-fixed', 'bg-local', 'bg-scroll',
  'bg-clip-border', 'bg-clip-padding', 'bg-clip-content', 'bg-clip-text',
  'bg-repeat', 'bg-no-repeat', 'bg-repeat-x', 'bg-repeat-y', 'bg-repeat-round', 'bg-repeat-space',
  'bg-auto', 'bg-cover', 'bg-contain',
  'bg-bottom', 'bg-center', 'bg-left', 'bg-left-bottom', 'bg-left-top',
  'bg-right', 'bg-right-bottom', 'bg-right-top', 'bg-top',
  'bg-gradient-to-t', 'bg-gradient-to-tr', 'bg-gradient-to-r', 'bg-gradient-to-br',
  'bg-gradient-to-b', 'bg-gradient-to-bl', 'bg-gradient-to-l', 'bg-gradient-to-tl',
  ...colorClasses.map((c) => `from-${c}`), 'from-transparent',
  ...colorClasses.map((c) => `via-${c}`), 'via-transparent',
  ...colorClasses.map((c) => `to-${c}`), 'to-transparent',

  // ── Borders ───────────────────────────────────────────────────────────
  'border', 'border-0', 'border-2', 'border-4', 'border-8',
  'border-x', 'border-x-0', 'border-x-2', 'border-x-4', 'border-x-8',
  'border-y', 'border-y-0', 'border-y-2', 'border-y-4', 'border-y-8',
  'border-t', 'border-t-0', 'border-t-2', 'border-t-4', 'border-t-8',
  'border-r', 'border-r-0', 'border-r-2', 'border-r-4', 'border-r-8',
  'border-b', 'border-b-0', 'border-b-2', 'border-b-4', 'border-b-8',
  'border-l', 'border-l-0', 'border-l-2', 'border-l-4', 'border-l-8',
  'border-solid', 'border-dashed', 'border-dotted', 'border-double', 'border-hidden', 'border-none',
  ...colorClasses.map((c) => `border-${c}`),
  'border-white', 'border-black', 'border-transparent', 'border-inherit', 'border-current',

  // ── Border Radius ─────────────────────────────────────────────────────
  'rounded-none', 'rounded-sm', 'rounded', 'rounded-md', 'rounded-lg', 'rounded-xl', 'rounded-2xl', 'rounded-3xl', 'rounded-full',
  'rounded-t-none', 'rounded-t-sm', 'rounded-t', 'rounded-t-md', 'rounded-t-lg', 'rounded-t-xl', 'rounded-t-2xl', 'rounded-t-3xl', 'rounded-t-full',
  'rounded-r-none', 'rounded-r-sm', 'rounded-r', 'rounded-r-md', 'rounded-r-lg', 'rounded-r-xl', 'rounded-r-2xl', 'rounded-r-3xl', 'rounded-r-full',
  'rounded-b-none', 'rounded-b-sm', 'rounded-b', 'rounded-b-md', 'rounded-b-lg', 'rounded-b-xl', 'rounded-b-2xl', 'rounded-b-3xl', 'rounded-b-full',
  'rounded-l-none', 'rounded-l-sm', 'rounded-l', 'rounded-l-md', 'rounded-l-lg', 'rounded-l-xl', 'rounded-l-2xl', 'rounded-l-3xl', 'rounded-l-full',
  'rounded-tl-none', 'rounded-tl-sm', 'rounded-tl', 'rounded-tl-md', 'rounded-tl-lg', 'rounded-tl-xl', 'rounded-tl-2xl', 'rounded-tl-3xl', 'rounded-tl-full',
  'rounded-tr-none', 'rounded-tr-sm', 'rounded-tr', 'rounded-tr-md', 'rounded-tr-lg', 'rounded-tr-xl', 'rounded-tr-2xl', 'rounded-tr-3xl', 'rounded-tr-full',
  'rounded-br-none', 'rounded-br-sm', 'rounded-br', 'rounded-br-md', 'rounded-br-lg', 'rounded-br-xl', 'rounded-br-2xl', 'rounded-br-3xl', 'rounded-br-full',
  'rounded-bl-none', 'rounded-bl-sm', 'rounded-bl', 'rounded-bl-md', 'rounded-bl-lg', 'rounded-bl-xl', 'rounded-bl-2xl', 'rounded-bl-3xl', 'rounded-bl-full',

  // ── Divide ────────────────────────────────────────────────────────────
  'divide-x', 'divide-y', 'divide-x-reverse', 'divide-y-reverse',
  ...['0', '2', '4', '8'].map((n) => `divide-x-${n}`),
  ...['0', '2', '4', '8'].map((n) => `divide-y-${n}`),
  'divide-solid', 'divide-dashed', 'divide-dotted', 'divide-double', 'divide-none',
  ...colorClasses.map((c) => `divide-${c}`),
  'divide-white', 'divide-black', 'divide-transparent',

  // ── Outline ───────────────────────────────────────────────────────────
  'outline', 'outline-none', 'outline-0', 'outline-1', 'outline-2', 'outline-4', 'outline-8',
  'outline-solid', 'outline-dashed', 'outline-dotted', 'outline-double',
  ...['0', '1', '2', '4', '8'].map((n) => `outline-offset-${n}`),
  ...colorClasses.map((c) => `outline-${c}`),

  // ── Ring ──────────────────────────────────────────────────────────────
  'ring', 'ring-0', 'ring-1', 'ring-2', 'ring-4', 'ring-8', 'ring-inset',
  ...['0', '1', '2', '4', '8'].map((n) => `ring-offset-${n}`),
  ...colorClasses.map((c) => `ring-${c}`),
  'ring-white', 'ring-black', 'ring-transparent',
  ...colorClasses.map((c) => `ring-offset-${c}`),

  // ── Shadow ────────────────────────────────────────────────────────────
  'shadow-sm', 'shadow', 'shadow-md', 'shadow-lg', 'shadow-xl', 'shadow-2xl', 'shadow-inner', 'shadow-none',
  ...colorClasses.map((c) => `shadow-${c}`),

  // ── Opacity ───────────────────────────────────────────────────────────
  ...[0, 5, 10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90, 95, 100].map((n) => `opacity-${n}`),

  // ── Filters ───────────────────────────────────────────────────────────
  'blur-none', 'blur-sm', 'blur', 'blur-md', 'blur-lg', 'blur-xl', 'blur-2xl', 'blur-3xl',
  ...[0, 50, 75, 90, 95, 100, 105, 110, 125, 150, 200].map((n) => `brightness-${n}`),
  ...[0, 50, 75, 100, 125, 150, 200].map((n) => `contrast-${n}`),
  'grayscale', 'grayscale-0', 'invert', 'invert-0',
  ...[0, 50, 100, 150, 200].map((n) => `saturate-${n}`),
  'sepia', 'sepia-0',
  'drop-shadow-sm', 'drop-shadow', 'drop-shadow-md', 'drop-shadow-lg', 'drop-shadow-xl', 'drop-shadow-2xl', 'drop-shadow-none',
  'backdrop-blur-none', 'backdrop-blur-sm', 'backdrop-blur', 'backdrop-blur-md',
  'backdrop-blur-lg', 'backdrop-blur-xl', 'backdrop-blur-2xl', 'backdrop-blur-3xl',

  // ── Mix blend / BG blend ──────────────────────────────────────────────
  'mix-blend-normal', 'mix-blend-multiply', 'mix-blend-screen', 'mix-blend-overlay',
  'mix-blend-darken', 'mix-blend-lighten', 'mix-blend-color-dodge', 'mix-blend-color-burn',
  'mix-blend-hard-light', 'mix-blend-soft-light', 'mix-blend-difference',
  'mix-blend-exclusion', 'mix-blend-hue', 'mix-blend-saturation', 'mix-blend-color', 'mix-blend-luminosity',
  'bg-blend-normal', 'bg-blend-multiply', 'bg-blend-screen', 'bg-blend-overlay',
  'bg-blend-darken', 'bg-blend-lighten',

  // ── Transitions ───────────────────────────────────────────────────────
  'transition-none', 'transition-all', 'transition', 'transition-colors',
  'transition-opacity', 'transition-transform', 'transition-shadow',
  ...[0, 75, 100, 150, 200, 300, 500, 700, 1000].map((n) => `duration-${n}`),
  'ease-linear', 'ease-in', 'ease-out', 'ease-in-out',
  ...[0, 75, 100, 150, 200, 300, 500, 700, 1000].map((n) => `delay-${n}`),

  // ── Animation ─────────────────────────────────────────────────────────
  'animate-none', 'animate-spin', 'animate-ping', 'animate-pulse', 'animate-bounce',

  // ── Transforms ────────────────────────────────────────────────────────
  'transform', 'transform-gpu', 'transform-cpu', 'transform-none',
  ...[0, 1, 2, 3, 6, 12, 45, 90, 180].map((n) => `rotate-${n}`),
  ...[1, 2, 3, 6, 12, 45, 90, 180].map((n) => `-rotate-${n}`),
  ...[0, 50, 75, 90, 95, 100, 105, 110, 125, 150].map((n) => `scale-${n}`),
  ...[0, 50, 75, 90, 95, 100, 105, 110, 125, 150].map((n) => `scale-x-${n}`),
  ...[0, 50, 75, 90, 95, 100, 105, 110, 125, 150].map((n) => `scale-y-${n}`),
  ...spacing.map((s) => `translate-x-${s}`),
  ...spacing.map((s) => `translate-y-${s}`),
  ...spacing.map((s) => `-translate-x-${s}`),
  ...spacing.map((s) => `-translate-y-${s}`),
  'translate-x-1/2', 'translate-y-1/2', '-translate-x-1/2', '-translate-y-1/2',
  'translate-x-full', 'translate-y-full', '-translate-x-full', '-translate-y-full',
  ...[0, 1, 2, 3, 6, 12].map((n) => `skew-x-${n}`),
  ...[0, 1, 2, 3, 6, 12].map((n) => `skew-y-${n}`),
  'origin-center', 'origin-top', 'origin-top-right', 'origin-right', 'origin-bottom-right',
  'origin-bottom', 'origin-bottom-left', 'origin-left', 'origin-top-left',

  // ── Interactivity ─────────────────────────────────────────────────────
  'appearance-none', 'appearance-auto',
  'cursor-auto', 'cursor-default', 'cursor-pointer', 'cursor-wait', 'cursor-text',
  'cursor-move', 'cursor-not-allowed', 'cursor-grab', 'cursor-grabbing',
  'cursor-crosshair', 'cursor-zoom-in', 'cursor-zoom-out',
  'pointer-events-none', 'pointer-events-auto',
  'resize-none', 'resize', 'resize-x', 'resize-y',
  'scroll-auto', 'scroll-smooth',
  'select-none', 'select-text', 'select-all', 'select-auto',
  'touch-auto', 'touch-none', 'touch-pan-x', 'touch-pan-y', 'touch-pinch-zoom', 'touch-manipulation',

  // ── Accent / Caret / Fill / Stroke ────────────────────────────────────
  ...colorClasses.map((c) => `accent-${c}`),
  ...colorClasses.map((c) => `caret-${c}`),
  ...colorClasses.map((c) => `fill-${c}`),
  'fill-none',
  ...colorClasses.map((c) => `stroke-${c}`),
  'stroke-0', 'stroke-1', 'stroke-2',

  // ── Text decoration colors ────────────────────────────────────────────
  ...colorClasses.map((c) => `decoration-${c}`),
  'decoration-solid', 'decoration-double', 'decoration-dotted', 'decoration-dashed', 'decoration-wavy',
  ...[0, 1, 2, 4, 8].map((n) => `decoration-${n}`),
  ...[0, 1, 2, 4, 8].map((n) => `underline-offset-${n}`),

  // ── Columns ───────────────────────────────────────────────────────────
  ...['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12',
    'auto', '3xs', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'].map((n) => `columns-${n}`),

  // ── Object ────────────────────────────────────────────────────────────
  'object-contain', 'object-cover', 'object-fill', 'object-none', 'object-scale-down',
  'object-bottom', 'object-center', 'object-left', 'object-left-bottom',
  'object-left-top', 'object-right', 'object-right-bottom', 'object-right-top', 'object-top',

  // ── Aspect ratio ──────────────────────────────────────────────────────
  'aspect-auto', 'aspect-square', 'aspect-video',

  // ── Table ─────────────────────────────────────────────────────────────
  'table-auto', 'table-fixed', 'border-collapse', 'border-separate',
  'caption-top', 'caption-bottom',

  // ── Accessibility ─────────────────────────────────────────────────────
  'sr-only', 'not-sr-only',

  // ── Will-change ───────────────────────────────────────────────────────
  'will-change-auto', 'will-change-scroll', 'will-change-contents', 'will-change-transform',
];

// Deduplicate and export
const tailwindClasses = [...new Set(raw)];

export default tailwindClasses;
