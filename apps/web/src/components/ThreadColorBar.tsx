import type { ThreadColor } from "@t3tools/contracts";
import { XIcon } from "lucide-react";
import { useState } from "react";

import { THREAD_COLOR_OPTIONS, threadColorHex } from "../threadColors";
import { cn } from "../lib/utils";
import { Popover, PopoverPopup, PopoverTrigger } from "./ui/popover";

export function ThreadColorBar(props: {
  color: ThreadColor;
  onChange: (color: ThreadColor | null) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <button
            type="button"
            aria-label="Change thread color"
            title="Change thread color"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={(event) => event.stopPropagation()}
            onDoubleClick={(event) => event.stopPropagation()}
            className={cn(
              "absolute inset-y-1 left-0 z-20 w-0.5 cursor-pointer rounded-r-full outline-none transition-[width] duration-150 group-hover/sidebar-row:w-1.5 hover:w-1.5 focus-visible:w-1.5",
              open && "w-1.5",
            )}
            style={{ backgroundColor: threadColorHex(props.color) }}
          />
        }
      />
      <PopoverPopup side="right" align="center" className="w-auto" viewportClassName="p-2">
        <div className="grid grid-cols-4 gap-1.5" aria-label="Thread colors">
          {THREAD_COLOR_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-label={option.label}
              aria-pressed={props.color === option.value}
              title={option.label}
              onClick={(event) => {
                event.stopPropagation();
                setOpen(false);
                props.onChange(option.value);
              }}
              className="size-6 cursor-pointer rounded-full border-2 border-transparent outline-none hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring aria-pressed:border-foreground"
              style={{ backgroundColor: option.hex }}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            setOpen(false);
            props.onChange(null);
          }}
          className="mt-2 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <XIcon className="size-3" />
          Clear color
        </button>
      </PopoverPopup>
    </Popover>
  );
}
