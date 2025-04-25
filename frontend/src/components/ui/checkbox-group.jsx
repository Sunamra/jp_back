import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react"; // Replace Circle with Check for checkbox behavior

import { cn } from "@/lib/utils";

const CheckboxGroup = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div className={cn("grid gap-2", className)} ref={ref} {...props}>
      {children}
    </div>
  );
});
CheckboxGroup.displayName = "CheckboxGroup";

const CheckboxGroupItem = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(
        "aspect-square h-4 w-4 rounded-md border border-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center">
        <Check className="h-3 w-3 text-current" /> {/* Checkmark icon */}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});
CheckboxGroupItem.displayName = "CheckboxGroupItem";

export { CheckboxGroup, CheckboxGroupItem };
