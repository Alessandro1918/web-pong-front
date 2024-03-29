import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

type RectangleProps = {
  x: number,
  y: number,
  width: number,
  height: number,
  color: string
}

function App() {
  
  const [count, setCount] = useState(0)

  const [ball, setBall] = useState<RectangleProps>({
    x: 0,
    y: 190,
    width: 50,
    height: 50,
    color: "orange"
  })

  const [p1, setP1] = useState<RectangleProps>({
    x: 70,
    y: 100,
    width: 50,
    height: 100,
    color: "green"
  })

  const [p2, setP2] = useState<RectangleProps>({
    x: 200,
    y: 130,
    width: 50,
    height: 100,
    color: "red"
  })

  function moveBall(dx: number, dy: number) {
    const newBallPos = {
      ...ball,
      x: ball.x + dx,
      y: ball.y + dy,
    }
    setBall(newBallPos)
  }

  function isColliding(obj1: RectangleProps, obj2: RectangleProps) {
    //https://www.jeffreythompson.org/collision-detection/rect-rect.php
    return (
      obj1.x + obj1.width >= obj2.x &&    // rect1 right edge past rect2 left
      obj1.x <= obj2.x + obj2.width &&    // r1 left edge past r2 right
      obj1.y + obj1.height > obj2.y &&    // r1 top edge past r2 bottom (top-bottom collision: my case does not need the "or equal" sign)
      obj1.y < obj2.y + obj2.height       // r1 bottom edge past r2 top (top-bottom collision: my case does not need the "or equal" sign)
    )
  }

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <button onClick={() => moveBall(0, -10)}>Up</button>
        <button onClick={() => moveBall(0, 10)}>Down</button>
        <button onClick={() => moveBall(-10, 0)}>Left</button>
        <button onClick={() => moveBall(10, 0)}>Right</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>

      {/* Ball */}
      <div style={{
        position: "absolute",
        top: ball.y, 
        left: ball.x, 
        width: ball.width, 
        height: ball.height, 
        background: ball.color
      }}></div>

      {/* Player 1 */}
      <div style={{
        position: "absolute",
        top: p1.y, 
        left: p1.x, 
        width: p1.width, 
        height: p1.height, 
        background: p1.color
      }}></div>

      {/* Player 2 */}
      <div style={{
        position: "absolute",
        top: p2.y, 
        left: p2.x, 
        width: p2.width, 
        height: p2.height, 
        background: p2.color
      }}></div>

    </>
  )
}

export default App
