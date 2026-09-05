import { ProductionDirection } from '@workspace/api-client-react';
import { Sliders, Camera, Music, Lightbulb, MapPin } from 'lucide-react';
import { Input, Badge } from '@/components/ui';
import { RunwayMusicPlayer } from './runway-music-player';

interface Props {
  production: ProductionDirection;
  onChange: (p: ProductionDirection) => void;
  venue: string;
  sceneLabel: string;
  sceneDescription: string;
}

export function ProductionControls({
  production,
  onChange,
  venue,
  sceneLabel,
  sceneDescription,
}: Props) {
  
  const updateField = (field: keyof ProductionDirection, value: any) => {
    onChange({ ...production, [field]: value });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border bg-secondary/20 flex items-center gap-2">
        <Sliders className="w-4 h-4 text-primary" />
        <div className="min-w-0">
          <h2 className="font-mono text-sm font-bold tracking-widest uppercase">Directing Panel</h2>
          <p className="mt-1 truncate font-mono text-[10px] uppercase tracking-widest text-primary">
            ACTIVE / {sceneLabel}
          </p>
        </div>
      </div>

      <div className="p-4 flex-1 overflow-y-auto space-y-6">
        <div className="border border-primary/30 bg-primary/5 p-3">
          <p className="font-mono text-[10px] uppercase tracking-widest text-primary">
            Scene Direction
          </p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            {sceneDescription}
          </p>
        </div>
        
        {/* Venue Info */}
        <div className="space-y-2 pb-4 border-b border-border/50">
          <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
            <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3"/> VENUE</span>
          </div>
          <p className="text-sm font-medium">{venue}</p>
        </div>

        {/* Lighting */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-primary">
            <span className="flex items-center gap-1.5"><Lightbulb className="w-3 h-3"/> LIGHTING</span>
            <Badge variant="outline">{production.lightingHex}</Badge>
          </div>
          
          <div className="flex gap-3">
            <div 
              className="w-10 h-10 rounded-sm border-2 border-border flex-none overflow-hidden relative cursor-pointer"
            >
              <input 
                type="color" 
                value={production.lightingHex}
                onChange={e => updateField('lightingHex', e.target.value)}
                className="absolute inset-[-10px] w-16 h-16 cursor-pointer opacity-0"
              />
              <div className="w-full h-full" style={{ backgroundColor: production.lightingHex }} />
            </div>
            <div className="flex-1">
              <Input 
                value={production.lighting}
                onChange={e => updateField('lighting', e.target.value)}
                className="h-10 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Music & Tempo */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-primary">
            <span className="flex items-center gap-1.5"><Music className="w-3 h-3"/> SOUNDSCAPE</span>
            <span>{production.tempo} BPM</span>
          </div>
          
          <Input 
            value={production.music}
            onChange={e => updateField('music', e.target.value)}
            className="text-xs mb-2"
          />
          
          <input 
            type="range" 
            min="60" 
            max="180" 
            step="1"
            value={production.tempo}
            onChange={e => updateField('tempo', parseInt(e.target.value))}
            className="w-full h-1 bg-border rounded-none appearance-none cursor-pointer accent-primary"
            style={{
              background: `linear-gradient(to right, hsl(var(--primary)) ${(production.tempo - 60) / 120 * 100}%, hsl(var(--border)) ${(production.tempo - 60) / 120 * 100}%)`
            }}
          />

          <RunwayMusicPlayer tempo={production.tempo} />
        </div>

        {/* Camera */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-primary">
            <span className="flex items-center gap-1.5"><Camera className="w-3 h-3"/> CAMERAWORK</span>
          </div>
          <Input 
            value={production.camera}
            onChange={e => updateField('camera', e.target.value)}
            className="text-xs"
          />
        </div>
        
        {/* Background */}
        <div className="space-y-3 pb-4">
          <div className="flex items-center justify-between text-xs font-mono text-primary">
            <span className="flex items-center gap-1.5">SCREEN BG</span>
          </div>
          <Input 
            value={production.background}
            onChange={e => updateField('background', e.target.value)}
            className="text-xs"
          />
        </div>

      </div>
    </div>
  );
}
