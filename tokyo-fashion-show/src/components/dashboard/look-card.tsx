import { useState } from 'react';
import { FashionLook, FashionShow, useGenerateFashionLook, getGetCurrentFashionShowQueryKey } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Badge } from '@/components/ui';
import { RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function LookCard({ look, show }: { look: FashionLook; show: FashionShow }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const generateLook = useGenerateFashionLook();
  const [isHovered, setIsHovered] = useState(false);
  const fallbackImageUrl = `/extended-look-${String(look.number + 9).padStart(2, '0')}.png`;

  const handleRegenerate = () => {
    generateLook.mutate({
      data: {
        lookNumber: look.number,
        theme: show.concept.direction,
        modelName: show.model.name,
        aesthetics: show.model.aesthetics
      }
    }, {
      onSuccess: (newLook) => {
        queryClient.setQueryData(getGetCurrentFashionShowQueryKey(), (old: FashionShow | undefined) => {
          if (!old) return old;
          return {
            ...old,
            looks: old.looks.map(l => l.number === newLook.number ? newLook : l)
          };
        });
        toast({
          title: `LOOK ${look.number} RECONSTRUCTED`,
          description: 'A new couture look has been generated.'
        });
      },
      onError: (err) => {
        toast({
          title: 'GENERATION ERROR',
          description: err.message || 'The look could not be regenerated.',
          variant: 'destructive'
        });
      }
    });
  };

  return (
    <div 
      className="h-full w-full relative group border border-border bg-card flex flex-col overflow-hidden transition-all duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-[46%] min-h-[220px] flex-none overflow-hidden border-b border-border bg-black">
        <img
          src={look.imageUrl || fallbackImageUrl}
          alt={`${look.name} — ${look.category}`}
          className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = fallbackImageUrl;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
          <div>
            <div className="font-mono text-4xl font-black text-primary glitch-text">0{look.number}</div>
            <div className="font-mono text-[10px] tracking-widest text-white/70">AI LOOK VISUAL</div>
          </div>
          <Button 
            size="sm" 
            variant="outline" 
            className="border-white/30 bg-black/50 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleRegenerate}
            disabled={generateLook.isPending}
          >
            <RefreshCw className={`w-3 h-3 mr-2 ${generateLook.isPending ? 'animate-spin' : ''}`} />
            REGEN
          </Button>
        </div>
        <div className="absolute bottom-3 left-4 right-4 font-mono text-[10px] tracking-widest text-white/70 uppercase">
          {look.category}
        </div>
      </div>

      <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-y-auto p-5">
        <div className={`transition-transform duration-500 ${isHovered ? 'translate-y-0' : 'translate-y-1'}`}>
          <h3 className="text-xl font-bold mb-2 uppercase">{look.name}</h3>
          <p className="text-sm leading-relaxed text-muted-foreground mb-4">
            {look.description}
          </p>
          
          <div className="space-y-3">
            <div>
              <p className="font-mono text-[10px] text-primary uppercase mb-1">Materials</p>
              <div className="flex flex-wrap gap-1">
                {(look.materials ?? []).map(m => (
                  <span key={m} className="px-1.5 py-0.5 bg-secondary text-secondary-foreground text-[10px] font-mono">{m}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="font-mono text-[10px] text-primary uppercase mb-1">Accent</p>
              <p className="text-xs font-mono">{look.accent}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative accent bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
    </div>
  );
}
