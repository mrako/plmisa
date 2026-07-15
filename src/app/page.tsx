import { Suspense } from "react";
import TaskApp from "@/components/TaskApp";

export default function Home() {
  return (
    <Suspense>
      <TaskApp />
    </Suspense>
  );
}
