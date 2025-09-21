import { Loading } from "@/components/ui/loading";

export default function PageLoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-6">
        <Loading size="lg" />
        <div className="space-y-2">
          <h2 className="text-2xl font-display text-foreground">Loading</h2>
          <p className="text-muted-foreground">Please wait while we prepare your experience</p>
        </div>
      </div>
    </div>
  );
}