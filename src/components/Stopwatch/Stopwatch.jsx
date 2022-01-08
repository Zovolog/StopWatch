import React from "react";
import { useEffect, useState } from "react";
import { interval, Subject, fromEvent } from "rxjs";
import { map, buffer, debounceTime, filter, takeUntil } from "rxjs/operators";

import "./style.css";

export function Stopwatch() {
  const [sec, setSec] = useState(0);
  const [status, setStatus] = useState("stop");

  useEffect(() => {
    const unsubscribe$ = new Subject();

    const awaitBtn = document.querySelector(`.await-button`);
    const click$ = fromEvent(awaitBtn, "click");

    const doubleClick$ = click$
      .pipe(
        buffer(click$.pipe(debounceTime(300))),
        map((list) => {
          return list.length;
        }),
        filter((x) => x === 2)
      )
      .subscribe(() => {
        setStatus("await");
      });

    interval(1000)
      .pipe(takeUntil(unsubscribe$))
      .subscribe(() => {
        if (status === "run") {
          setSec((val) => val + 1000);
        }
      });
    return () => {
      unsubscribe$.next();
      unsubscribe$.complete();
    };
  });

  const start = () => {
    setStatus("run");
  };

  const stop = () => {
    setStatus("stop");
    setSec(0);
  };

  const reset = () => {
    setSec(0);
  };
  const wait = () => {};
  return (
    <div className="content">
      <h1 className="head-text">Stopwatch</h1>
      <span className="time"> {new Date(sec).toISOString().slice(11, 19)}</span>
      <div className="btns">
        <button className="start-button btn-green" onClick={start}>
          Start
        </button>
        <button className="stop-button btn-green" onClick={stop}>
          Stop
        </button>
        <button onClick={reset} className="start-reset btn-green">
          Reset
        </button>
        <button className="await-button btn-green" onClick={wait}>
          Wait
        </button>
      </div>
    </div>
  );
}
