import * as PIXI from "pixi.js";
import { Live2DModel } from "pixi-live2d-display";
import { useEffect, useRef, useState } from "react";
import { MotionSync } from "live2d-motionsync";
import "./styles.css";

(window as any).PIXI = PIXI;
console.log(MotionSync);
const modelUrl =
  "https://cdn.jsdelivr.net/gh/liyao1520/live2d-motionSync/docs/public/models/kei_vowels_pro/kei_vowels_pro.model3.json";

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const motionsync = useRef<MotionSync>();
  useEffect(() => {
    const loadModel = async () => {
      if (!canvasRef.current) return;
      const app = new PIXI.Application({
        view: canvasRef.current,
        resizeTo: canvasRef.current.parentElement || undefined,
        backgroundAlpha: 0,
      });
      const model = await Live2DModel.from(modelUrl, { autoInteract: false });
      const modelRatio = model.width / model.height;
      const centerModel = () => {
        // 让模型height为画布一半
        model.height = app.view.height;
        model.width = model.height * modelRatio;
        model.x = (app.view.width - model.width) / 2;
        model.y = 0;
      };
      motionsync.current = new MotionSync(model.internalModel);
      // motionsync.current.loadDefaultMotionSync();
      motionsync.current.loadMotionSyncFromUrl(
        "https://cdn.jsdelivr.net/gh/liyao1520/live2d-motionSync/docs/public/models/kei_vowels_pro/kei_vowels_pro.motionsync.json"
      );
      centerModel();
      app.stage.addChild(model);
    };
    loadModel();
  }, []);
  const onPlay = () => {
    motionsync.current?.play("/sayhi.wav");
  };
  const onStop = () => {
    motionsync.current?.reset();
  };
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div style={{ width: "100%", height: `calc(100% - 50px)` }}>
        <canvas ref={canvasRef} />
      </div>
      <div
        style={{
          height: 50,
        }}
      >
        <button onClick={onPlay}>Play</button>
        <button onClick={onStop}>Stop</button>
      </div>
    </div>
  );
}
