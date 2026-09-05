import { X } from 'lucide-react';
import { Button } from '@/components/ui';
import { extendedLookbook, type ExtendedLook } from '@/data/extended-lookbook';

interface ExtendedLookbookProps {
  open: boolean;
  onClose: () => void;
}

function LookbookCard({ look }: { look: ExtendedLook }) {
  return (
    <article className="group flex min-w-0 flex-col overflow-hidden border border-border bg-card">
      <div className="look-image-container relative aspect-square overflow-hidden border-b border-border bg-black">
        <img
          src={look.imageSrc}
          alt={`${look.title} — ${look.modelType}`}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <span className="font-mono text-3xl font-black text-primary glitch-text">
            {String(look.number).padStart(2, '0')}
          </span>
          <span className="border border-white/25 bg-black/60 px-2 py-1 font-mono text-[9px] tracking-widest text-white/80">
            SQUARE / 1:1
          </span>
        </div>
        <p className="absolute inset-x-3 bottom-3 font-mono text-[10px] uppercase tracking-widest text-white/80">
          {look.modelType}
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-primary">
            LOOK {look.number}
          </p>
          <h3 className="mt-1 text-lg font-bold uppercase leading-tight">{look.title}</h3>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">{look.specs}</p>
        <div className="mt-auto space-y-2 border-t border-border/60 pt-3">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-widest text-primary">Palette</p>
            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{look.colorPalette}</p>
          </div>
          <div>
            <p className="font-mono text-[9px] uppercase tracking-widest text-primary">Camera Direction</p>
            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{look.cameraDirection}</p>
          </div>
        </div>
      </div>
    </article>
  );
}

export function ExtendedLookbook({ open, onClose }: ExtendedLookbookProps) {
  if (!open) return null;

  return (
    <div
      className="absolute inset-0 z-50 flex min-h-0 flex-col bg-black/95 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="extended-lookbook-title"
    >
      <div className="flex min-h-0 flex-1 flex-col border border-primary/40 bg-background/95">
        <header className="flex flex-none items-center justify-between gap-4 border-b border-border bg-card p-4">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs tracking-[0.24em] text-primary">ARCHIVE / 1:1</span>
              <span className="font-mono text-[10px] text-muted-foreground">11 ASSETS / UPLOADED + GENERATED</span>
            </div>
            <h2 id="extended-lookbook-title" className="mt-1 text-xl font-black uppercase tracking-[0.12em] sm:text-2xl">
              Extended Lookbook / 10—20
            </h2>
            <p className="mt-1 max-w-3xl font-mono text-[10px] leading-relaxed text-muted-foreground">
              Square-format guerrilla fashion studies for the Shibuya virtual runway.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            aria-label="Close extended lookbook"
            className="flex-none"
          >
            <X className="h-3 w-3" />
            CLOSE
          </Button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {extendedLookbook.map((look) => (
              <LookbookCard key={look.number} look={look} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}