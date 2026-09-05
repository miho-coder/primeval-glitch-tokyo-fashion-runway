import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui';
import type { ExtendedLook } from '@/data/extended-lookbook';

interface ExtendedStageCardProps {
  looks: ExtendedLook[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  onPrevious: () => void;
  onNext: () => void;
}

export function ExtendedStageCard({
  looks,
  selectedIndex,
  onSelect,
  onPrevious,
  onNext,
}: ExtendedStageCardProps) {
  const look = looks[selectedIndex] ?? looks[0];

  if (!look) return null;

  return (
    <div className="group flex h-auto min-h-full w-full flex-col overflow-hidden border border-border bg-card md:h-full md:min-h-0">
      <div className="flex-none border-b border-border bg-card px-3 py-2.5">
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-primary">
            SELECT LOOK / 10—20
          </span>
          <span className="flex-none font-mono text-[10px] text-muted-foreground">
            ASSET {String(selectedIndex + 1).padStart(2, '0')} OF {looks.length} · LOOK {look.number}
          </span>
        </div>
        <div
          className="mt-2 flex touch-pan-x gap-2 overflow-x-auto overscroll-x-contain pb-1"
          aria-label="Choose an extended look"
        >
          {looks.map((item, itemIndex) => {
            const isSelected = itemIndex === selectedIndex;
            return (
              <button
                key={item.number}
                type="button"
                onClick={() => onSelect(itemIndex)}
                aria-label={`Show LOOK ${item.number}`}
                aria-current={isSelected ? 'true' : undefined}
                className={`group/thumb flex flex-none items-center gap-1.5 border px-1.5 py-1 transition-colors ${
                  isSelected
                    ? 'border-foreground bg-foreground/10 text-foreground'
                    : 'border-border bg-background text-muted-foreground hover:border-foreground/60 hover:text-foreground'
                }`}
              >
                <img
                  src={item.imageSrc}
                  alt=""
                  className="h-10 w-10 object-cover object-center"
                />
                <span className="pr-0.5 font-mono text-xs font-bold">
                  {item.number}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <div className="look-image-container relative aspect-video w-full flex-none overflow-hidden border-b border-border bg-black md:h-auto md:w-[46%] md:border-b-0 md:border-r">
          <div className="cinematic-stage-media">
            <img
              src={look.imageSrc}
              alt=""
              className="cinematic-stage-backdrop"
            />
            <div className="cinematic-stage-glow" />
            <div className="cinematic-stage-subject">
              <img
                src={look.imageSrc}
                alt={`${look.title} — ${look.modelType}`}
                className="cinematic-stage-image"
              />
            </div>
          </div>
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
          <div className="absolute inset-x-0 top-0 z-20 p-4">
            <div className="font-mono text-4xl font-black text-accent glitch-text">
              {String(look.number).padStart(2, '0')}
            </div>
            <div className="font-mono text-[10px] tracking-widest text-white/70">
              ORIGINAL SOURCE / 1:1
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onPrevious}
            aria-label="Show previous extended look"
            className="absolute left-3 top-1/2 z-20 h-11 w-11 -translate-y-1/2 border-white/40 bg-black/65 p-0 text-white hover:bg-white/20"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onNext}
            aria-label="Show next extended look"
            className="absolute right-3 top-1/2 z-20 h-11 w-11 -translate-y-1/2 border-white/40 bg-black/65 p-0 text-white hover:bg-white/20"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
          <div className="absolute inset-x-4 bottom-3 z-20 flex items-end justify-between gap-3 font-mono text-[10px] uppercase tracking-widest text-white/80">
            <span>{look.modelType}</span>
            <span className="flex-none text-primary">
              LOOK {look.number}
            </span>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          <p className="font-mono text-[10px] uppercase tracking-widest text-primary">
            LOOK {look.number}
          </p>
          <h3 className="mt-1 text-xl font-bold uppercase leading-tight">{look.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{look.specs}</p>

          <div className="mt-5 grid gap-4 border-t border-border/60 pt-4 sm:grid-cols-2">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-primary">Palette</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{look.colorPalette}</p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-primary">Camera Direction</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{look.cameraDirection}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}