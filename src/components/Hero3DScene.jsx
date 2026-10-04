import React, { useEffect, useRef } from "react";
import { Users, Sparkles, ChevronDown } from "lucide-react";

export default function Hero3DScene({ onLaunchTriage, onOpenRoster }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let cssWidth = 0;
    let cssHeight = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const updateDimensions = () => {
      if (!canvas.parentElement) return;
      const rect = canvas.parentElement.getBoundingClientRect();
      cssWidth = rect.width;
      cssHeight = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(cssWidth * dpr);
      canvas.height = Math.round(cssHeight * dpr);
      canvas.style.width = `${cssWidth}px`;
      canvas.style.height = `${cssHeight}px`;
    };
    updateDimensions();

    const handleResize = () => {
      updateDimensions();
    };
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      mouseRef.current.targetX = Math.max(-1, Math.min(1, nx));
      mouseRef.current.targetY = Math.max(-1, Math.min(1, ny));
    };
    window.addEventListener("mousemove", handleMouseMove);

    // ─────────────────────────────────────────────────────────────
    // 3D Camera & Projection (Compact, responsive single-frame fit)
    // ─────────────────────────────────────────────────────────────
    const camera = {
      x: 0,
      y: -10,
      z: -700,
      rotX: 0.12,
      rotY: 0,
      focal: 740,
    };

    function project(p, cam) {
      const cosY = Math.cos(cam.rotY);
      const sinY = Math.sin(cam.rotY);
      const x1 = p.x * cosY - p.z * sinY;
      const z1 = p.x * sinY + p.z * cosY;

      const cosX = Math.cos(cam.rotX);
      const sinX = Math.sin(cam.rotX);
      const y2 = p.y * cosX - z1 * sinX;
      const z2 = p.y * sinX + z1 * cosX;

      const totalZ = z2 - cam.z;
      if (totalZ <= 10) return null;

      const scale = cam.focal / totalZ;
      return {
        x: cssWidth / 2 + (x1 - cam.x) * scale,
        y: cssHeight / 2 + (y2 - cam.y) * scale,
        scale,
        depth: totalZ,
      };
    }

    function rotatePointY(p, angle, origin = { x: 0, y: 0, z: 0 }) {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const dx = p.x - origin.x;
      const dz = p.z - origin.z;
      return {
        x: origin.x + dx * cos - dz * sin,
        y: p.y,
        z: origin.z + dx * sin + dz * cos,
      };
    }

    function rotatePointX(p, angle, origin = { x: 0, y: 0, z: 0 }) {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const dy = p.y - origin.y;
      const dz = p.z - origin.z;
      return {
        x: p.x,
        y: origin.y + dy * cos - dz * sin,
        z: origin.z + dy * sin + dz * cos,
      };
    }

    // ─────────────────────────────────────────────────────────────
    // Particles (Voice to Legal Redressal)
    // ─────────────────────────────────────────────────────────────
    const PARTICLE_COUNT = 320;
    const particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        phase: Math.random(),
        speed: 0.0032 + Math.random() * 0.0042,
        track: Math.floor(Math.random() * 3),
        angle: Math.random() * Math.PI * 2,
        radius: 35 + Math.random() * 85,
        heightOffset: (Math.random() - 0.5) * 80,
        size: 1.1 + Math.random() * 2.2,
        alpha: 0.4 + Math.random() * 0.6,
      });
    }

    let time = 0;

    const render = () => {
      time += 0.016;

      // Responsive Focal Length scaling based on available width & height
      const widthScale = Math.min(1, Math.max(0.6, cssWidth / 780));
      const heightScale = Math.min(1, Math.max(0.65, cssHeight / 480));
      const responsiveScale = Math.min(widthScale, heightScale);
      camera.focal = 720 * responsiveScale;

      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.04;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.04;

      camera.rotY = mouseRef.current.x * 0.25;
      camera.rotX = 0.12 - mouseRef.current.y * 0.14;

      // High-DPI Context Reset & Scale
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dpr, dpr);

      // ─────────────────────────────────────────────────────────────
      // 1. BASE CYBERNETIC DAIS
      // ─────────────────────────────────────────────────────────────
      const daisY = 125;
      const rings = [
        { r: 420, color: "rgba(255, 153, 51, 0.08)", width: 1 },
        { r: 340, color: "rgba(255, 180, 50, 0.28)", width: 1.5 },
        { r: 250, color: "rgba(255, 153, 51, 0.16)", width: 1 },
        { r: 160, color: "rgba(255, 210, 80, 0.45)", width: 2 },
      ];

      rings.forEach(({ r, color, width: lw }) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = lw;
        ctx.beginPath();
        let first = true;
        for (let a = 0; a <= Math.PI * 2 + 0.1; a += 0.12) {
          const px = Math.cos(a) * r;
          const pz = Math.sin(a) * (r * 0.38);
          const pt = project({ x: px, y: daisY, z: pz }, camera);
          if (pt) {
            if (first) {
              ctx.moveTo(pt.x, pt.y);
              first = false;
            } else {
              ctx.lineTo(pt.x, pt.y);
            }
          }
        }
        ctx.stroke();
      });

      // Rotating tick marks along dais perimeter
      for (let i = 0; i < 36; i++) {
        const angle = (i / 36) * Math.PI * 2 + time * 0.08;
        const r1 = 340;
        const r2 = i % 3 === 0 ? 360 : 350;
        const p1 = project({ x: Math.cos(angle) * r1, y: daisY, z: Math.sin(angle) * (r1 * 0.38) }, camera);
        const p2 = project({ x: Math.cos(angle) * r2, y: daisY, z: Math.sin(angle) * (r2 * 0.38) }, camera);
        if (p1 && p2) {
          ctx.strokeStyle = i % 3 === 0 ? "rgba(255, 190, 60, 0.7)" : "rgba(255, 153, 51, 0.25)";
          ctx.lineWidth = i % 3 === 0 ? 1.8 : 1;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }

      // ─────────────────────────────────────────────────────────────
      // 2. KINETIC SCALES OF JUSTICE (Nyaya / Dharma Tula)
      // ─────────────────────────────────────────────────────────────
      const scaleTilt = Math.sin(time * 0.8) * 0.05 - mouseRef.current.x * 0.07;
      const beamHalfWidth = 230;
      const beamCenterY = -85;

      // Central Pillar (Column of Law)
      const pillarTop = project({ x: 0, y: beamCenterY - 14, z: 0 }, camera);
      const pillarBottom = project({ x: 0, y: daisY, z: 0 }, camera);
      if (pillarTop && pillarBottom) {
        const pillarGrad = ctx.createLinearGradient(pillarTop.x, pillarTop.y, pillarBottom.x, pillarBottom.y);
        pillarGrad.addColorStop(0, "#FBBF24");
        pillarGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.25)");
        pillarGrad.addColorStop(1, "rgba(217, 119, 6, 0.4)");

        ctx.strokeStyle = pillarGrad;
        ctx.lineWidth = 4 * pillarTop.scale;
        ctx.beginPath();
        ctx.moveTo(pillarTop.x, pillarTop.y);
        ctx.lineTo(pillarBottom.x, pillarBottom.y);
        ctx.stroke();

        ctx.fillStyle = "#FFD700";
        ctx.shadowColor = "#FF9933";
        ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.arc(pillarTop.x, pillarTop.y, 6 * pillarTop.scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Balance Beam
      const leftTipRaw = {
        x: -Math.cos(scaleTilt) * beamHalfWidth,
        y: beamCenterY - Math.sin(scaleTilt) * beamHalfWidth,
        z: 0,
      };
      const rightTipRaw = {
        x: Math.cos(scaleTilt) * beamHalfWidth,
        y: beamCenterY + Math.sin(scaleTilt) * beamHalfWidth,
        z: 0,
      };

      const bCenter = project({ x: 0, y: beamCenterY, z: 0 }, camera);
      const bLeft = project(leftTipRaw, camera);
      const bRight = project(rightTipRaw, camera);

      if (bLeft && bRight && bCenter) {
        const beamGrad = ctx.createLinearGradient(bLeft.x, bLeft.y, bRight.x, bRight.y);
        beamGrad.addColorStop(0, "#D97706");
        beamGrad.addColorStop(0.5, "#FEF3C7");
        beamGrad.addColorStop(1, "#D97706");

        ctx.strokeStyle = beamGrad;
        ctx.lineWidth = 4.2 * bCenter.scale;
        ctx.beginPath();
        ctx.moveTo(bLeft.x, bLeft.y);
        ctx.lineTo(bRight.x, bRight.y);
        ctx.stroke();

        ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
        ctx.lineWidth = 1.2 * bCenter.scale;
        ctx.beginPath();
        ctx.moveTo(bLeft.x, bLeft.y - 1);
        ctx.lineTo(bRight.x, bRight.y - 1);
        ctx.stroke();
      }

      // ─────────────────────────────────────────────────────────────
      // 3. TWIN BALANCE PANS (Voice Grievance vs Legal Recovery)
      // ─────────────────────────────────────────────────────────────
      const panDrop = 130;
      const panRadius = 52;

      const drawScalePan = (tipPos, label, isVoice) => {
        const panCenter = {
          x: tipPos.x,
          y: tipPos.y + panDrop,
          z: tipPos.z,
        };

        const cordAngles = [0, (Math.PI * 2) / 3, (Math.PI * 4) / 3];
        const tipProj = project(tipPos, camera);
        const panCenterProj = project(panCenter, camera);

        if (tipProj && panCenterProj) {
          cordAngles.forEach((ca) => {
            const rimPos = {
              x: panCenter.x + Math.cos(ca + time * 0.4) * panRadius,
              y: panCenter.y,
              z: panCenter.z + Math.sin(ca + time * 0.4) * (panRadius * 0.6),
            };
            const rimProj = project(rimPos, camera);
            if (rimProj) {
              ctx.strokeStyle = "rgba(255, 190, 60, 0.4)";
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(tipProj.x, tipProj.y);
              ctx.lineTo(rimProj.x, rimProj.y);
              ctx.stroke();
            }
          });

          ctx.strokeStyle = "#FF9933";
          ctx.lineWidth = 2 * panCenterProj.scale;
          ctx.fillStyle = "rgba(217, 119, 6, 0.08)";
          ctx.beginPath();
          ctx.ellipse(
            panCenterProj.x,
            panCenterProj.y,
            panRadius * panCenterProj.scale,
            (panRadius * 0.4) * panCenterProj.scale,
            0,
            0,
            Math.PI * 2
          );
          ctx.fill();
          ctx.stroke();

          if (isVoice) {
            ctx.save();
            for (let w = 1; w <= 3; w++) {
              const waveH = Math.sin(time * 4 + w) * 16 + 20;
              const pW1 = project({ x: panCenter.x - 22 + w * 11, y: panCenter.y - waveH, z: panCenter.z }, camera);
              const pW2 = project({ x: panCenter.x - 22 + w * 11, y: panCenter.y - 2, z: panCenter.z }, camera);
              if (pW1 && pW2) {
                ctx.strokeStyle = "rgba(255, 190, 60, 0.85)";
                ctx.lineWidth = 2.5 * pW1.scale;
                ctx.beginPath();
                ctx.moveTo(pW1.x, pW1.y);
                ctx.lineTo(pW2.x, pW2.y);
                ctx.stroke();
              }
            }
            ctx.restore();
          } else {
            const sealTop = project({ x: panCenter.x, y: panCenter.y - 28, z: panCenter.z }, camera);
            if (sealTop) {
              ctx.strokeStyle = "rgba(253, 230, 138, 0.9)";
              ctx.fillStyle = "rgba(245, 158, 11, 0.2)";
              ctx.lineWidth = 1.6;
              ctx.beginPath();
              ctx.arc(sealTop.x, sealTop.y, 14 * sealTop.scale, 0, Math.PI * 2);
              ctx.fill();
              ctx.stroke();

              ctx.fillStyle = "#FFD700";
              ctx.font = `bold ${Math.round(15 * sealTop.scale)}px sans-serif`;
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              ctx.fillText("₹", sealTop.x, sealTop.y);
            }
          }

          ctx.fillStyle = "rgba(255, 200, 100, 0.85)";
          ctx.font = `bold ${Math.max(9, Math.round(10 * panCenterProj.scale))}px monospace`;
          ctx.textAlign = "center";
          ctx.fillText(label, panCenterProj.x, panCenterProj.y + 22 * panCenterProj.scale);
        }
      };

      drawScalePan(leftTipRaw, "VOICE GRIEVANCE", true);
      drawScalePan(rightTipRaw, "LEGAL RECOVERY", false);

      // ─────────────────────────────────────────────────────────────
      // 4. THE 3D HOLOGRAPHIC RAKSHAK AEGIS SHIELD
      // ─────────────────────────────────────────────────────────────
      const shieldY = 5;
      const shieldScale = 1.25;

      const baseVertices = {
        topC:   { x: 0,    y: shieldY - 70 * shieldScale, z: 0 },
        topL:   { x: -50 * shieldScale, y: shieldY - 55 * shieldScale, z: 10 },
        topR:   { x: 50 * shieldScale,  y: shieldY - 55 * shieldScale, z: 10 },
        midL:   { x: -58 * shieldScale, y: shieldY + 5 * shieldScale,  z: 22 },
        midR:   { x: 58 * shieldScale,  y: shieldY + 5 * shieldScale,  z: 22 },
        botP:   { x: 0,    y: shieldY + 80 * shieldScale, z: 12 },
        apexF:  { x: 0,    y: shieldY - 5 * shieldScale,  z: 42 },
      };

      const shieldYaw = Math.sin(time * 1.2) * 0.12 + mouseRef.current.x * 0.2;
      const shieldPitch = Math.cos(time * 0.9) * 0.05;

      const rotV = {};
      Object.keys(baseVertices).forEach((k) => {
        let pt = rotatePointY(baseVertices[k], shieldYaw, { x: 0, y: shieldY, z: 0 });
        pt = rotatePointX(pt, shieldPitch, { x: 0, y: shieldY, z: 0 });
        rotV[k] = project(pt, camera);
      });

      if (rotV.topC && rotV.topL && rotV.topR && rotV.midL && rotV.midR && rotV.botP && rotV.apexF) {
        const facets = [
          { pts: [rotV.topC, rotV.topL, rotV.apexF], fill: "rgba(245, 158, 11, 0.12)", border: "#F59E0B" },
          { pts: [rotV.topC, rotV.topR, rotV.apexF], fill: "rgba(251, 191, 36, 0.18)", border: "#FDE68A" },
          { pts: [rotV.topL, rotV.midL, rotV.apexF], fill: "rgba(217, 119, 6, 0.15)", border: "#D97706" },
          { pts: [rotV.topR, rotV.midR, rotV.apexF], fill: "rgba(245, 158, 11, 0.24)", border: "#F59E0B" },
          { pts: [rotV.midL, rotV.botP, rotV.apexF], fill: "rgba(180, 83, 9, 0.18)",  border: "#B45309" },
          { pts: [rotV.midR, rotV.botP, rotV.apexF], fill: "rgba(245, 158, 11, 0.26)", border: "#FCD34D" },
        ];

        facets.forEach(({ pts, fill, border }) => {
          ctx.beginPath();
          ctx.moveTo(pts[0].x, pts[0].y);
          ctx.lineTo(pts[1].x, pts[1].y);
          ctx.lineTo(pts[2].x, pts[2].y);
          ctx.closePath();
          ctx.fillStyle = fill;
          ctx.fill();
          ctx.strokeStyle = border;
          ctx.lineWidth = 1.6;
          ctx.stroke();
        });

        // Shield Outer Rim
        ctx.beginPath();
        ctx.moveTo(rotV.topC.x, rotV.topC.y);
        ctx.lineTo(rotV.topR.x, rotV.topR.y);
        ctx.lineTo(rotV.midR.x, rotV.midR.y);
        ctx.lineTo(rotV.botP.x, rotV.botP.y);
        ctx.lineTo(rotV.midL.x, rotV.midL.y);
        ctx.lineTo(rotV.topL.x, rotV.topL.y);
        ctx.closePath();
        ctx.strokeStyle = "#FF9933";
        ctx.lineWidth = 3;
        ctx.stroke();

        // Central Shield Emblem: Ashoka Protection Chakra
        const chakraCenter = rotV.apexF;
        const chakraRadius = 24 * chakraCenter.scale;

        ctx.strokeStyle = "#FFFBEB";
        ctx.fillStyle = "rgba(255, 153, 51, 0.35)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(chakraCenter.x, chakraCenter.y, chakraRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        for (let s = 0; s < 12; s++) {
          const sAngle = (s / 12) * Math.PI * 2 + time * 0.5;
          ctx.strokeStyle = "rgba(255, 235, 160, 0.85)";
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(chakraCenter.x, chakraCenter.y);
          ctx.lineTo(
            chakraCenter.x + Math.cos(sAngle) * (chakraRadius * 0.9),
            chakraCenter.y + Math.sin(sAngle) * (chakraRadius * 0.9)
          );
          ctx.stroke();
        }

        ctx.fillStyle = "#FFFFFF";
        ctx.shadowColor = "#FFD700";
        ctx.shadowBlur = 16;
        ctx.beginPath();
        ctx.arc(chakraCenter.x, chakraCenter.y, 4.5 * chakraCenter.scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // ─────────────────────────────────────────────────────────────
      // 5. GYROSCOPIC ORBIT RINGS AROUND SHIELD
      // ─────────────────────────────────────────────────────────────
      const ringRadius = 145;
      ctx.save();
      for (let g = 0; g < 2; g++) {
        const ringAngle = time * (g === 0 ? 0.6 : -0.4) + (g * Math.PI) / 3;
        ctx.strokeStyle = g === 0 ? "rgba(255, 180, 50, 0.45)" : "rgba(255, 220, 100, 0.3)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();

        let started = false;
        for (let a = 0; a <= Math.PI * 2 + 0.1; a += 0.15) {
          let ringPt = {
            x: Math.cos(a) * ringRadius,
            y: Math.sin(a) * (ringRadius * 0.35),
            z: Math.sin(a) * (ringRadius * 0.85),
          };
          ringPt = rotatePointY(ringPt, ringAngle, { x: 0, y: 0, z: 0 });
          ringPt.y += shieldY;

          const proj = project(ringPt, camera);
          if (proj) {
            if (!started) {
              ctx.moveTo(proj.x, proj.y);
              started = true;
            } else {
              ctx.lineTo(proj.x, proj.y);
            }
          }
        }
        ctx.stroke();
      }
      ctx.restore();

      // ─────────────────────────────────────────────────────────────
      // 6. DYNAMIC ENERGY FLOW
      // ─────────────────────────────────────────────────────────────
      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      particles.forEach((p) => {
        p.phase += p.speed;
        if (p.phase > 1) p.phase = 0;

        let curX, curY, curZ;

        if (p.track === 0) {
          const t = p.phase;
          curX = leftTipRaw.x + t * (-leftTipRaw.x);
          curY = (leftTipRaw.y + panDrop) + t * (shieldY - (leftTipRaw.y + panDrop)) + Math.sin(t * Math.PI * 4 + time * 3) * 12;
          curZ = Math.sin(t * Math.PI * 2 + p.angle) * 35;
        } else if (p.track === 1) {
          const vRadius = p.radius * (0.6 + Math.sin(time + p.angle) * 0.4);
          const vAngle = p.angle + time * 1.5;
          curX = Math.cos(vAngle) * vRadius;
          curY = shieldY + Math.sin(vAngle) * (vRadius * 0.5) + p.heightOffset * 0.5;
          curZ = Math.sin(vAngle) * vRadius;
        } else {
          const t = p.phase;
          curX = t * rightTipRaw.x;
          curY = shieldY + t * ((rightTipRaw.y + panDrop) - shieldY) + Math.cos(t * Math.PI * 4 + time * 3) * 12;
          curZ = Math.cos(t * Math.PI * 2 + p.angle) * 35;
        }

        const pt = project({ x: curX, y: curY, z: curZ }, camera);
        if (pt) {
          const pSize = Math.max(0.8, p.size * pt.scale);
          const alpha = p.alpha * Math.sin(p.phase * Math.PI);

          const rad = pSize * 2.5;
          const pGrad = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, rad);
          pGrad.addColorStop(0, `rgba(255, 250, 220, ${alpha})`);
          pGrad.addColorStop(0.4, `rgba(255, 180, 50, ${alpha * 0.7})`);
          pGrad.addColorStop(1, "rgba(255, 120, 10, 0)");

          ctx.fillStyle = pGrad;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, rad, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pSize * 0.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen max-h-[100dvh] flex flex-col items-center justify-between overflow-hidden select-none bg-black pt-16 pb-4"
    >
      {/* ─────────────────────────────────────────────────────────────
          1. TOP REGION: THE 3D OBJECT (Aegis Shield & Scales of Justice)
          Positioned ABOVE the RAKSHAK logo with zero empty starting gap!
          ───────────────────────────────────────────────────────────── */}
      <div className="relative w-full flex-1 min-h-0 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. DIRECTLY BELOW 3D OBJECT: METALLIC RAKSHAK LOGO
          Proportioned to fit perfectly within one screen frame!
          ───────────────────────────────────────────────────────────── */}
      <div className="w-full max-w-[1260px] px-6 text-center my-1 pointer-events-none z-10 shrink-0">
        <div className="flex items-center justify-between w-full">
          {["R", "A", "K", "S", "H", "A", "K"].map((letter, idx) => (
            <span
              key={idx}
              className="text-[38px] sm:text-[64px] md:text-[96px] lg:text-[124px] xl:text-[145px] font-black tracking-tighter leading-none select-none"
              style={{
                background: "linear-gradient(180deg, #FDE68A 0%, #D97706 50%, #78350F 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 0 25px rgba(217, 119, 6, 0.3))",
                opacity: 0.95,
              }}
            >
              {letter}
            </span>
          ))}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. BOTTOM FLOATING CONTROLS (Tucked neatly in the same frame)
          Left: TEAM ROSTER
          Center: SCROLL TO EXPLORE
          Right: LAUNCH LIVE TRIAGE
          ───────────────────────────────────────────────────────────── */}
      <div className="w-full px-6 md:px-12 flex items-center justify-between z-20 pointer-events-none shrink-0 pb-1">
        
        {/* Left: TEAM ROSTER */}
        <div className="pointer-events-auto">
          <button
            type="button"
            onClick={onOpenRoster}
            className="group inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider text-amber-200 transition-all duration-300 hover:brightness-110"
            style={{
              background: "linear-gradient(180deg, rgba(217, 119, 6, 0.45) 0%, rgba(120, 53, 15, 0.65) 100%)",
              border: "1.5px solid rgba(251, 191, 36, 0.7)",
              boxShadow: "0 0 25px rgba(217, 119, 6, 0.35), inset 0 1px 1px rgba(254, 243, 199, 0.4)",
            }}
          >
            <Users className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform" />
            <span>TEAM ROSTER</span>
          </button>
        </div>

        {/* Center: SCROLL TO EXPLORE */}
        <div className="flex flex-col items-center gap-1 text-center pointer-events-auto">
          <a
            href="#triage"
            className="flex flex-col items-center group text-amber-400/80 hover:text-amber-300 transition-colors"
          >
            <div className="w-4 h-7 rounded-full border-2 border-amber-400/70 flex items-start justify-center p-0.5 shadow-[0_0_12px_rgba(251,191,36,0.3)]">
              <span className="w-1 h-2 rounded-full bg-amber-400 animate-bounce" />
            </div>
            <span className="mt-1 text-[9px] uppercase font-bold tracking-[0.25em] text-amber-400/90 flex items-center gap-1">
              SCROLL TO EXPLORE
              <ChevronDown className="w-3 h-3 animate-pulse" />
            </span>
          </a>
        </div>

        {/* Right: LAUNCH LIVE TRIAGE */}
        <div className="pointer-events-auto">
          <button
            type="button"
            onClick={onLaunchTriage}
            className="group inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider text-amber-200 transition-all duration-300 hover:brightness-110"
            style={{
              background: "linear-gradient(180deg, rgba(217, 119, 6, 0.55) 0%, rgba(146, 64, 14, 0.8) 100%)",
              border: "1.5px solid rgba(251, 191, 36, 0.8)",
              boxShadow: "0 0 30px rgba(217, 119, 6, 0.45), inset 0 1px 2px rgba(254, 243, 199, 0.5)",
            }}
          >
            <Sparkles className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
            <span>LAUNCH LIVE TRIAGE &rarr;</span>
          </button>
        </div>

      </div>
    </div>
  );
}
