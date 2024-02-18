import { useEffect, useRef, useState } from "react";
import styles from "./App.module.css";

type Action = "accelerate" | "brake" | null;
const App = () => {
  const [speed, setSpeed] = useState(0);
  const [displaySpeed, setDisplaySpeed] = useState(0);
  const [updateInterval, setUpdateInterval] = useState(300);
  const action = useRef<Action>(null);
  const lastUpdate = useRef(Date.now());

  useEffect(() => {
    const updateSpeed = () => {
      const autoDecceleration = Math.max(0.035, speed * 0.002);
      if (action.current === "accelerate") {
        const resistance = speed * 0.00269;
        const acceleration = Math.max(0, 0.7 - resistance);
        setSpeed(speed + acceleration);
      } else if (action.current === "brake") {
        setSpeed(Math.max(0, speed - autoDecceleration - 0.5));
      } else if (speed > 0) {
        setSpeed(Math.max(0, speed - autoDecceleration));
      }
    };
    const interval = setInterval(updateSpeed, 10);
    return () => clearInterval(interval);
  }, [speed]);

  useEffect(() => {
    const now = Date.now();
    const deltaTime = now - lastUpdate.current;
    const shouldUpdateDisplaySpeed = deltaTime >= updateInterval;
    if (shouldUpdateDisplaySpeed || speed === 0) {
      setDisplaySpeed(Math.floor(speed));
      lastUpdate.current = now;
    }
  }, [speed, updateInterval]);

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
      <h1>{`${Math.floor(displaySpeed)}km/h`}</h1>
      <button
        className={styles.button}
        onMouseDown={handleAccelerate}
        onMouseUp={handleRelease}
      >
        가속
      </button>
      <button
        className={styles.button}
        onMouseDown={handleBrake}
        onMouseUp={handleRelease}
      >
        감속
      </button>
      <input
        type="range"
        min="10"
        max="2000"
        value={updateInterval}
        onChange={handleUpdateIntervalChange}
      />
      <p>{`${updateInterval}ms`}</p>
    </div>
  );
};

export default App;
