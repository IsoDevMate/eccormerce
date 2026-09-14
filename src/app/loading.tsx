import { PlpSkeleton } from "@/components/site/skeletons";

/** Index (`/`) — dense codes grid skeleton */
export default function Loading() {
  return <PlpSkeleton cards={12} showChips={false} dense />;
}
