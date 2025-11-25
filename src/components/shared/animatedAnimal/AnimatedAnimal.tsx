"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedAnimalProps {
  className?: string;
  svgPath?: string;
  maxPupilMovement?: number;
  fetchPriority?: "high" | "low" | "auto";
}

interface EyeData {
  pupil: SVGPathElement;
  centerX: number;
  centerY: number;
  maxRadius: number;
}

export default function AnimatedAnimal({
  className = "",
  svgPath = "/images/animal.svg",
  maxPupilMovement = 10,
  fetchPriority = "auto",
}: AnimatedAnimalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [eyes, setEyes] = useState<EyeData[]>([]);

  // Додаємо preload hint для high priority
  useEffect(() => {
    if (fetchPriority === "high") {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = svgPath;
      link.setAttribute("fetchpriority", "high");
      document.head.appendChild(link);

      return () => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      };
    }
  }, [svgPath, fetchPriority]);

  // Завантаження SVG
  useEffect(() => {
    fetch(svgPath)
      .then((res) => res.text())
      .then((svgText) => {
        if (containerRef.current) {
          containerRef.current.innerHTML = svgText;

          const svg = containerRef.current.querySelector("svg");
          if (!svg) return;

          // Робимо SVG адаптивним до розміру контейнера
          svg.style.width = "100%";
          svg.style.height = "100%";
          svg.removeAttribute("width");
          svg.removeAttribute("height");

          const allPaths = Array.from(
            svg.querySelectorAll("path")
          ) as SVGPathElement[];

          // Знаходимо біле око
          const whiteEyes = allPaths.filter((p) => {
            const fill = p.getAttribute("fill")?.toLowerCase() || "";
            return fill === "white" || fill === "#fff" || fill === "#ffffff";
          });

          // Знаходимо чорні зіниці
          const pupils = allPaths.filter((p) => {
            const fill = p.getAttribute("fill")?.toLowerCase() || "";
            return fill === "black" || fill === "#000" || fill === "#000000";
          });

          const eyesData: EyeData[] = whiteEyes.map((eye, i) => {
            const bbox = eye.getBBox();
            const pupil = pupils[i];
            return {
              pupil,
              centerX: bbox.x + bbox.width / 2,
              centerY: bbox.y + bbox.height / 2,
              maxRadius: maxPupilMovement,
            };
          });

          setEyes(eyesData);
        }
      })
      .catch(console.error);
  }, [svgPath, maxPupilMovement]);

  // Рух за мишею
  useEffect(() => {
    if (!eyes.length) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      eyes.forEach((eye) => {
        const dx = mouseX - eye.centerX;
        const dy = mouseY - eye.centerY;
        const distance = Math.min(Math.sqrt(dx * dx + dy * dy), eye.maxRadius);
        const angle = Math.atan2(dy, dx);
        const x = distance * Math.cos(angle);
        const y = distance * Math.sin(angle);
        eye.pupil.setAttribute("transform", `translate(${x},${y})`);
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [eyes]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ display: "inline-block" }}
    />
  );
}
