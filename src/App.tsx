import { useEffect, useRef, useState } from "react";
import styles from "./App.module.css";

type Action = "accelerate" | "brake" | null;
const App = () => {
  const [displaySpeed, setDisplaySpeed] = useState(0);
  const [needleSpeed, setNeedleSpeed] = useState(0);
  const [updateInterval, setUpdateInterval] = useState(300);
  const lastFrameTime = useRef(0);
  const lastDisplaySpeedUpdateTime = useRef(Date.now());
  const updateIntervalRef = useRef(updateInterval);
  const speed = useRef(0);
  const action = useRef<Action>(null);
  const fps = 60;
  const frameInterval = 1000 / fps;

  useEffect(() => {
    updateIntervalRef.current = updateInterval;
  }, [updateInterval]);

  const updateSpeed = () => {
    const autoDecceleration = Math.max(0.12, speed.current * 0.003);
    if (action.current === "accelerate") {
      const resistance = (speed.current * 0.7) / 260;
      const acceleration = Math.max(0, 0.7 - resistance);
      speed.current += acceleration;
    } else if (action.current === "brake") {
      speed.current = Math.max(0, speed.current - 1);
    } else if (speed.current > 0) {
      speed.current = Math.max(0, speed.current - autoDecceleration);
    }
  };

  const updateDisplaySpeed = () => {
    const now = Date.now();
    const deltaDisplaySpeedUpdateTime =
      now - lastDisplaySpeedUpdateTime.current;
    const shouldUpdateDisplaySpeed =
      deltaDisplaySpeedUpdateTime >= updateIntervalRef.current;
    if (shouldUpdateDisplaySpeed || speed.current === 0) {
      setDisplaySpeed(Math.floor(speed.current));
      lastDisplaySpeedUpdateTime.current = now;
    }
  };

  const updateNeedleSpeed = () => {
    setNeedleSpeed(speed.current);
  };

  useEffect(() => {
    let animationFrameId: number;
    const animate = (time: number) => {
      animationFrameId = requestAnimationFrame(animate);
      const deltaFrameTime = time - lastFrameTime.current;
      if (deltaFrameTime < frameInterval) {
        return;
      }
      lastFrameTime.current = time - (deltaFrameTime % frameInterval);

      updateDisplaySpeed();
      updateNeedleSpeed();
      updateSpeed();
    };

    requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const handleAccelerate = () => {
    action.current = "accelerate";
  };
  const handleBrake = () => {
    action.current = "brake";
  };
  const handleRelease = () => {
    action.current = null;
  };
  const handleUpdateIntervalChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setUpdateInterval(Number(e.target.value));
  };

  return (
    <div className={styles.container}>
      <div className={styles.speedometer}>
        <div
          className={styles.needle}
          style={{
            transform: `translate(-50%, -100%) rotate(${
              (needleSpeed * 300) / 260 - 180
            }deg)`,
          }}
        />
        <div className={styles.speedText}>{`${Math.floor(
          displaySpeed
        )}km/h`}</div>
      </div>
      <div className={styles.pedals}>
        <button
          className={`${styles.pedal} ${styles.brakePedal}`}
          onMouseDown={handleBrake}
          onMouseUp={handleRelease}
        >
          -
        </button>
        <button
          className={`${styles.pedal} ${styles.acceleratorPedal}`}
          onMouseDown={handleAccelerate}
          onMouseUp={handleRelease}
        >
          +
        </button>
      </div>
      <input
        className={styles.updateIntervalInput}
        type="range"
        min="16"
        max="2000"
        value={updateInterval}
        onChange={handleUpdateIntervalChange}
      />
      <p
        className={styles.updateIntervalText}
      >{`디지털 속도 업데이트 주기: ${updateInterval}ms`}</p>
    </div>
  );
};

export default App;
