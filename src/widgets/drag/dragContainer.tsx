import { ReactNode, useEffect, useRef } from "react";
import "../../styles/DragContainer.css";
import { initDrag } from "./DragLogic";

interface DragContainerProps {
  children?: ReactNode;
}

const DragContainer = ({ children }: DragContainerProps) => {
  const dragRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dragElement = dragRef.current;
    if (!dragElement) return;
    initDrag(dragElement, window.electronAPI);
  }, []);

  return (
    <div id="dragme" ref={dragRef}>
      {children}
    </div>
  );
};

export default DragContainer;
