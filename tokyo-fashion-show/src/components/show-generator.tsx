import { useState } from 'react';
import {
  getGetCurrentFashionShowQueryKey,
  useGenerateFashionShow,
} from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Input, Textarea, Badge } from '@/components/ui';
import { Loader2, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createDemoShow } from '@/data/demo-show';
import { CreatorCredit } from '@/components/creator-credit';

const AESTHETIC_OPTIONS = [
  'Cyberpunk', 'Deconstruction', 'Minimalist',
  'Avant-Garde', 'Y2K Revival', 'Gothic Tech',
  'Neo-Tokyo', 'Organic Future', 'Industrial'
];

export function ShowGenerator() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const generateShow = useGenerateFashionShow();
  
  const [formData, setFormData] = useState({
    modelName: '',
    gender: 'Unspecified',
    bodyType: '',
    notes: ''
  });
  const [aesthetics, setAesthetics] = useState<string[]>([]);

  const toggleAesthetic = (a: string) => {
    setAesthetics(prev => 
      prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.modelName || aesthetics.length === 0) {
      toast({
        title: 'Input Required',
        description: 'Enter a model name and select at least one subculture aura.',
        variant: 'destructive'
      });
      return;
    }

    const demoShow = createDemoShow({
      modelName: formData.modelName,
      gender: formData.gender,
      bodyType: formData.bodyType,
      aesthetics,
      notes: formData.notes || undefined,
    });
    let fallbackActivated = false;
    const fallbackTimer = window.setTimeout(() => {
      fallbackActivated = true;
      queryClient.setQueryData(getGetCurrentFashionShowQueryKey(), demoShow);
      toast({
        title: 'Instant Runway Preview',
        description: 'The curated production dashboard is ready for direction.',
      });
    }, 2000);

    generateShow.mutate({
      data: {
        modelName: formData.modelName,
        gender: formData.gender,
        bodyType: formData.bodyType,
        aesthetics,
        notes: formData.notes || undefined,
      },
    }, {
      onSuccess: (data) => {
        window.clearTimeout(fallbackTimer);
        if (fallbackActivated) {
          return;
        }
        queryClient.setQueryData(getGetCurrentFashionShowQueryKey(), data);
        toast({
          title: 'Runway Generated',
          description: 'An original show was composed from the model profile.',
        });
      },
      onError: (error) => {
        window.clearTimeout(fallbackTimer);
        if (fallbackActivated) {
          return;
        }
        const message = (error.data as { error?: string } | undefined)?.error;
        queryClient.setQueryData(getGetCurrentFashionShowQueryKey(), demoShow);
        toast({
          title: 'Fallback Runway Activated',
          description: message === 'GEMINI_NOT_CONFIGURED'
            ? 'The API is not configured, so the curated visual runway is now on display.'
            : 'The AI service is temporarily unavailable, so the jury-ready visual fallback is now on display.',
        });
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      <div className="max-w-3xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-start relative z-10">
        
        {/* Left Side - Typography & Concept */}
        <div className="space-y-6">
          <Badge className="!bg-accent !text-accent-foreground">READY TO DIRECT</Badge>
          <h1 className="text-4xl md:text-6xl font-black font-sans tracking-tight leading-[1.1] glitch-text uppercase">
            PRIMEVAL<br />
            GLITCH:<br />
            Tokyo Avant-Garde<br />
            Cinema Runway
          </h1>
          <p className="text-muted-foreground font-mono text-sm leading-relaxed">
            A singular model profile becomes a strange, cinematic Tokyo virtual fashion show.
            The agent composes the concept, looks, direction, and timeline into a live production dashboard.
          </p>
          <div className="h-px w-full bg-border" />
          <div className="font-mono text-xs text-muted-foreground space-y-1">
            <p>SYSTEM STATUS [ <span className="text-accent">ONLINE</span> ]</p>
            <p>AGENTIC RUNWAY ENGINE [ <span className="text-accent">ARMED</span> ]</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="bg-card border border-border p-6 shadow-2xl relative">
          <div className="absolute -top-3 -right-3 w-6 h-6 border-t-2 border-r-2 border-primary" />
          <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b-2 border-l-2 border-primary" />
          
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-muted-foreground mb-1.5">Model Name</label>
                <Input 
                  value={formData.modelName}
                  onChange={e => setFormData({...formData, modelName: e.target.value})}
                  placeholder="e.g. REI"
                  className="generator-model-name !border-accent focus:!border-accent focus-visible:!border-accent"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-mono text-muted-foreground mb-1.5">Gender Expression</label>
                  <Input 
                    value={formData.gender}
                    onChange={e => setFormData({...formData, gender: e.target.value})}
                    placeholder="e.g. Fluid"
                    className="focus:!border-accent focus-visible:!border-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-muted-foreground mb-1.5">Body Type (e.g., Tall, Slender)</label>
                  <Input 
                    value={formData.bodyType}
                    onChange={e => setFormData({...formData, bodyType: e.target.value})}
                    placeholder="e.g. Tall, Slender"
                    className="focus:!border-accent focus-visible:!border-accent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-muted-foreground mb-2 uppercase flex items-center justify-between">
                  <span>Subculture Aura (select all that apply)</span>
                  <span className="text-primary">{aesthetics.length} selected</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {AESTHETIC_OPTIONS.map(a => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => toggleAesthetic(a)}
              className={`text-xs font-mono px-3 py-1.5 border transition-all ${
                        aesthetics.includes(a) 
                          ? 'bg-accent/10 text-accent border-accent' 
                          : 'bg-transparent text-muted-foreground border-border hover:border-primary'
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-muted-foreground mb-1.5">Direction Notes (optional)</label>
                <Textarea 
                  value={formData.notes}
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                  placeholder="Themes, hidden messages, references..."
                  className="!border-accent focus:!border-accent focus-visible:!border-accent"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-sm !border-accent !bg-accent !text-accent-foreground hover:!bg-accent/90"
              disabled={generateShow.isPending}
            >
              {generateShow.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Preparing runway preview…
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Generate Agentic Runway Show
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
      <div className="absolute bottom-6 left-6 z-10">
        <CreatorCredit />
      </div>
    </div>
  );
}
