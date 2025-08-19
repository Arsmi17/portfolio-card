"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bold, Italic, Underline, List, ListOrdered } from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  id: string;
  name: string;
  defaultValue?: string;
  onContentChange: (content: string) => void;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  id,
  name,
  defaultValue = "",
  onContentChange,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (editorRef.current && defaultValue) {
      editorRef.current.innerHTML = defaultValue;
    }
  }, [defaultValue]);

  const handleInput = () => {
    if (editorRef.current) {
      onContentChange(editorRef.current.innerHTML);
    }
  };

  const formatDoc = (cmd: string, value: string | null = null) => {
    if (editorRef.current) {
      document.execCommand(cmd, false, value);
      editorRef.current.focus();
      onContentChange(editorRef.current.innerHTML);
    }
  };

  if (!isMounted) {
    return null; // Or a loading skeleton
  }

  return (
    <div className="border border-input rounded-md">
      <div className="flex items-center p-2 border-b">
        <button
          type="button"
          onClick={() => formatDoc("bold")}
          className="p-2 rounded hover:bg-accent"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => formatDoc("italic")}
          className="p-2 rounded hover:bg-accent"
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => formatDoc("underline")}
          className="p-2 rounded hover:bg-accent"
        >
          <Underline className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => formatDoc("insertUnorderedList")}
          className="p-2 rounded hover:bg-accent"
        >
          <List className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => formatDoc("insertOrderedList")}
          className="p-2 rounded hover:bg-accent"
        >
          <ListOrdered className="h-4 w-4" />
        </button>
      </div>
      <div
        id={id}
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className={cn(
          "min-h-[120px] w-full rounded-b-md bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        )}
      />
      <input type="hidden" name={name} value={defaultValue} />
    </div>
  );
};