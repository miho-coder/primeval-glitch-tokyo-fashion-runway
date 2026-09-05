import {
  getGetCurrentFashionShowQueryKey,
  useGetCurrentFashionShow,
} from '@workspace/api-client-react';
import { ShowGenerator } from '@/components/show-generator';
import { Dashboard } from '@/components/dashboard';
import { Loader2 } from 'lucide-react';

export default function Home() {
  // Start with model registration and switch to the cached show after generation.
  const { data: show, isLoading } = useGetCurrentFashionShow({
    query: { enabled: false, queryKey: getGetCurrentFashionShowQueryKey() },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-primary flex-col gap-4">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="font-mono text-xs uppercase tracking-[0.3em]">System Initializing...</span>
      </div>
    );
  }

  return (
    <main className="min-h-screen w-full text-foreground relative overflow-hidden">
      {/* Decorative header line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/50 to-transparent z-50" />
      
      {show ? (
        <Dashboard show={show} />
      ) : (
        <ShowGenerator />
      )}
    </main>
  );
}
