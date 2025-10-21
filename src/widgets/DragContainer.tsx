import { useEffect, useRef } from "react";
import "../styles/DragContainer.css";
import { initDrag } from "./DragLogic";

const DragContainer = () => {
  const dragRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dragElement = dragRef.current;
    if (!dragElement) return;
    initDrag(dragElement, window.electronAPI);
  }, []);

  return (
    <div id="dragme" ref={dragRef}>
      Drag me around!
    </div>
  );
};

export default DragContainer;
