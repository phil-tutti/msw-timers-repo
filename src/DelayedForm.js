import React, { useState, useEffect } from 'react'

export const DelayedForm = () => {
  const [delay, setDelay] = useState("");
  useEffect(() => {
    (async () => {
      console.log("calling endpoint");
      const delayRes = await fetch("http://localhost/delay");
      console.log("here");
      setDelay(await delayRes.text());
    })()
  }, [])

  console.log("delay", delay, Date.now().toString());

  if (delay === "") {
    return (
      <div data-testid="loading">
        Still loading...
      </div>
    )
  }

  return (
    <div data-testid="loaded">{delay}</div>
  )
}
