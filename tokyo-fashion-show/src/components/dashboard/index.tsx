import { useState, useEffect } from 'react';
import { FashionShow } from '@workspace/api-client-react';
import { Badge } from '@/components/ui';
import { ProductionControls } from './production-controls';
import { TimelinePlayer } from './timeline-player';
import { ExtendedStageCard } from './extended-stage-card';
import { getSceneDirection } from './scene-direction';
import { ExtendedLookbook } from './extended-lookbook';
import { Activity, BookOpen, Radio } from 'lucide-react';
import { Button } from '@/components/ui';
import { extendedLookbook } from '@/data/extended-lookbook';
import { CreatorCredit } from '@/components/creator-credit';

export function Dashboard({ show }: { show: FashionShow }) {
  const [activeBeatIndex, setActiveBeatIndex] = useState(0);
  const timelineLookIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const [activeExtendedLookIndex, setActiveExtendedLookIndex] = useState(0);
  const [isExtendedLookbookOpen, setIsExtendedLookbookOpen] = useState(false);
  const initialBeat = show.timeline[0];
  const [production, setProduction] = useState(
    initialBeat ? getSceneDirection(show.production, initialBeat) : show.production,
  );

  useEffect(() => {
    const firstBeat = show.timeline[0];
    setActiveBeatIndex(0);
    setActiveExtendedLookIndex(0);
    setProduction(
      firstBeat ? getSceneDirection(show.production, firstBeat) : show.production,
    );
  }, [show.id]);

  const activeBeat = show.timeline[activeBeatIndex] ?? show.timeline[0];
  const activeExtendedLook = extendedLookbook[activeExtendedLookIndex];

  useEffect(() => {
    setActiveExtendedLookIndex(timelineLookIndices[activeBeatIndex] ?? 0);
  }, [activeBeatIndex]);

  const handleSceneSelect = (index: number) => {
    const beat = show.timeline[index];
    if (!beat) return;
    setActiveBeatIndex(index);
    setProduction(getSceneDirection(show.production, beat));
  };

  const moveThroughLookbook = (direction: -1 | 1) => {
    const nextLookIndex =
      (activeExtendedLookIndex + direction + extendedLookbook.length) % extendedLookbook.length;
    setActiveExtendedLookIndex(nextLookIndex);
  };

  useEffect(() => {
    document.documentElement.style.setProperty('--scene-lighting', production.lightingHex);
  }, [production.lightingHex]);

  return (
    <div className="desktop-fit-scale relative z-10 flex min-h-screen w-full flex-col gap-3 overflow-x-hidden overflow-y-auto p-3 md:h-screen md:min-h-0 md:overflow-hidden">
      {/* Background Lighting Tint */}
      <div 
        className="absolute inset-0 z-[-1] opacity-[0.03] pointer-events-none transition-colors duration-1000"
        style={{ backgroundColor: production.lightingHex }}
      />
      
      {/* HEADER */}
      <header className="flex-none bg-card border border-border p-3 flex items-start justify-between md:h-[25vh] md:min-h-0 md:overflow-hidden">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Badge variant="outline" className="!border-foreground !text-foreground flex items-center gap-1.5">
              <Activity className="w-3 h-3 animate-pulse" />
              LIVE
            </Badge>
            <span className="font-mono text-xs text-muted-foreground">ID: {show.id.split('-')[0]}</span>
          </div>
          <h1 className="text-xl font-black uppercase tracking-widest">{show.title}</h1>
          <p className="font-mono text-sm text-primary uppercase mt-1">{show.subtitle}</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono text-muted-foreground">
            <span className="text-foreground">MODEL / {show.model.name}</span>
            <span>GENDER / {show.model.gender}</span>
            <span>BODY TYPE / {show.model.bodyType}</span>
          </div>
          <div className="mt-2 hidden max-w-3xl flex-wrap gap-1.5 2xl:flex">
            {(show.model.features ?? []).map((feature, index) => (
              <span
                key={feature}
                className="border border-primary/25 bg-primary/5 px-2 py-1 font-mono text-[10px] leading-relaxed text-muted-foreground"
              >
                0{index + 1} / {feature}
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsExtendedLookbookOpen(true)}
            className="!border-foreground !text-foreground"
          >
            <BookOpen className="h-3 w-3" />
            EXTENDED LOOKBOOK / 10—20
          </Button>
          <div className="text-right max-w-sm hidden md:block">
            <p className="font-mono text-[10px] text-muted-foreground uppercase mb-1">Concept</p>
            <p className="text-sm">{show.concept.logline}</p>
            <p className="mt-1 font-mono text-[10px] leading-relaxed text-muted-foreground">
              {show.concept.direction}
            </p>
            <div className="mt-2 flex justify-end gap-2">
              {(show.concept.palette ?? []).map(p => (
                <div key={p} className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full border border-border" style={{ backgroundColor: p }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT GRID */}
      <div className="flex flex-col gap-3 md:flex-1 md:min-h-0 md:flex-row">
        
        {/* Left Column: Production Controls (25%) */}
        <aside className="w-full md:w-[18%] flex-none bg-card border border-border flex flex-col min-h-0">
          <ProductionControls 
            production={production} 
            onChange={setProduction} 
            venue={show.concept.venue}
            sceneLabel={activeBeat?.label ?? 'STANDBY'}
            sceneDescription={activeBeat?.description ?? 'Select a stage scene.'}
          />
        </aside>
        
        {/* Center Column: Active stage visual (50%) */}
        <section className="flex w-full min-h-[680px] flex-none min-w-0 relative overflow-y-auto bg-background border border-border p-3 md:min-h-0 md:flex-1 md:overflow-hidden">
          {activeExtendedLook && activeBeat ? (
            <div className="flex min-h-0 w-full flex-col gap-3">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <Radio className="h-4 w-4 text-foreground animate-pulse" />
                  <span className="font-mono text-xs font-bold tracking-[0.22em] text-foreground">
                    ACTIVE STAGE / LOOK {activeExtendedLook.number}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {activeBeat.label} · {activeBeat.time} — {activeBeat.duration}
                </span>
              </div>
              <div className="min-h-0 flex-1">
                <ExtendedStageCard
                  looks={extendedLookbook}
                  selectedIndex={activeExtendedLookIndex}
                  onSelect={setActiveExtendedLookIndex}
                    onPrevious={() => moveThroughLookbook(-1)}
                    onNext={() => moveThroughLookbook(1)}
                />
              </div>
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center font-mono text-xs text-muted-foreground">
              NO ACTIVE STAGE
            </div>
          )}
        </section>
        
        {/* Right Column: Timeline (25%) */}
        <aside className="w-full md:w-[18%] flex-none bg-card border border-border flex flex-col min-h-0">
          <TimelinePlayer
            beats={show.timeline}
            activeBeatIndex={activeBeatIndex}
            onSelect={handleSceneSelect}
          />
        </aside>

      </div>
      <footer className="flex-none border-t border-border pt-2">
        <CreatorCredit />
      </footer>
      <ExtendedLookbook
        open={isExtendedLookbookOpen}
        onClose={() => setIsExtendedLookbookOpen(false)}
      />
    </div>
  );
}
