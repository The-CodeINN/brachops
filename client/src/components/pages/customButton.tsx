import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

export function CustomButton({ className }: { className?: string }) {
  return <Button className={cn("bg-blue-500", className)}></Button>;
}
