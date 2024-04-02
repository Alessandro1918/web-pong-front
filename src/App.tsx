/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useState, useEffect } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'

type RectangleProps = {
  x: number,      //pos at X axis 
  y: number,      //pos at Y axis
  dx?: number,    //speed at X axis
  dy?: number,    //spreed at Y axis
  width: number,
  height: number,
  color: string
}

type ScoreProps = {
  p1: number,     //4
  p2: number      //2
}

type ConnectionStatusProps = {
  p1: boolean,    //connected
  p2: boolean     //not connected
}

function App() {

  const screen = {
    width: window.innerWidth,
    // height: window.innerHeight     //Desktops can't hide toolbar (url address bar)
    height: window.screen.height      //Mobile browsers can
  }

  const [ isPaused, setIsPaused ] = useState(true)

  const [ score, setScore ] = useState<ScoreProps>({
    p1: 0,
    p2: 0
  })

  const [ connectionStatus, setConnectionStatus ] = useState<ConnectionStatusProps>({
    p1: false,
    p2: true
  })

  const [ball, setBall] = useState<RectangleProps>({
    x: 400,
    y: 100,
    dx: 0,
    dy: 0,
    width: screen.height / 10,
    height: screen.height / 10,
    color: "orange"
  })

  const [p1, setP1] = useState<RectangleProps>({
    x: 0,
    y: screen.height / 10 * 4,  //middle of Y axis
    width: screen.height / 10,  //half of paddle height
    height: screen.height / 5,  //20% of screen height
    color: "green"
  })

  const [p2, setP2] = useState<RectangleProps>({
    x: screen.width - screen.height / 10,
    y: screen.height / 10 * 4,
    width: screen.height / 10,
    height: screen.height / 5,
    color: "red"
  })

  const upperWall = {
    x: 0,
    y: 0,
    width: screen.width,
    height: 5,
    color: "blue"
  }

  const lowerWall = {
    x: 0,
    y: screen.height - 5,
    width: screen.width,
    height: 5,
    color: "blue"
  }

  const leftWall = {
    x: 0,
    y: 0,
    width: 5,
    height: screen.height,
    color: "yellow"
  }

  const rightWall = {
    x: screen.width - 5,
    y: 0,
    width: 5,
    height: screen.height,
    color: "yellow"
  }

  //At "Play", init ball with random speed and direction
  useEffect(() => {
    const rx = Math.random() > 0.5 ? 30 : -30     //Or 20, or -20 (don't go straight up/down)
    const ry = Math.random() > 0.5
      ? (Math.random() * (50 - 5) + 5)            //Or between 50 to 5,
      : (Math.random() * ((-5) - (-50)) + (-5))   //or between -5 to -50 (don't go straight left/right)
    if (!isPaused) {
      setBall({
        ...ball,
        dx: rx,
        dy: ry
      })
    }
  }, [isPaused])

  //Each time the ball moves, wait a time interval and change the ball position again
  useEffect(() => {

    //Paddle kick: change ball's horizontal direction
    if ((isColliding(ball, p1) && ball.dx! < 0) ||
        (isColliding(ball, p2) && ball.dx! > 0)) {
      setBall({...ball, dx: -ball.dx!})
    }

    //Wall kick: change ball's vertical direction
    if ((isColliding(ball, upperWall) && ball.dy! < 0) ||
        (isColliding(ball, lowerWall) && ball.dy! > 0)) {
      setBall({...ball, dy: -ball.dy!})
    }

    //P1 scored
    if (isColliding(ball, rightWall)) {
      setIsPaused(true)
      //TODO: score, reset ball
    }

    //P2 scored
    if (isColliding(ball, leftWall)) {
      setIsPaused(true)
      //TODO: score, reset ball
    }

    const interval = setInterval(() => {
      moveBall(ball.dx!, ball.dy!)
    }, 150) //ms
    return () => clearInterval(interval)
  }, [ball, isPaused])

  function moveBall(dx: number, dy: number) {
    if (!isPaused) {
      setBall({
        ...ball,
        x: ball.x + dx,
        y: ball.y + dy,
      })
    }
  }

  function movePlayer(playerId: string, newPos: number) {
    if (playerId == "P1") {
      setP1({...p1, y: newPos})
    } else {
      setP2({...p2, y: newPos})
    }
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

  //Returns a string with a certain number of non-breaking space characters
  function space(nSpaces: number) {
    let s = ''
    for (let i = 0; i< nSpaces; i++) {
      s = s + "\xA0"
    }
    return s
  }

  return (
    <>
      {/* Header */}
      <div className="header">
        <h1>{
          `${score.p1} ${space(10)} ${score.p2}`}
        </h1>
        <h3>{
          `${connectionStatus.p1 ? space(21) : "[OFFLINE]"}
           ${space(10)}
           ${connectionStatus.p2 ? space(21) : "[OFFLINE]"}`}
        </h3>
      </div>

      <div className="vertical_dotted_line"></div>

      {/* Ball */}
      <div style={{
        position: "absolute",
        transition: "0.35s",
        top: ball.y, 
        left: ball.x, 
        width: ball.width, 
        height: ball.height, 
        background: ball.color
      }}></div>

      {/* Player 1 */}
      <div style={{
        position: "absolute",
        transition: "0.35s",
        top: p1.y, 
        left: p1.x, 
        width: p1.width, 
        height: p1.height, 
        background: p1.color
      }}></div>

      {/* Player 2 */}
      <div style={{
        position: "absolute",
        transition: "0.35s",
        top: p2.y, 
        left: p2.x, 
        width: p2.width, 
        height: p2.height, 
        background: p2.color
      }}></div>

      {/* Upper Wall */}
      <div style={{
        position: "absolute",
        transition: "0.35s",
        top: upperWall.y, 
        left: upperWall.x, 
        width: upperWall.width, 
        height: upperWall.height, 
        background: upperWall.color
      }}></div>

      {/* Lower Wall */}
      <div style={{
        position: "absolute",
        transition: "0.35s",
        top: lowerWall.y, 
        left: lowerWall.x, 
        width: lowerWall.width, 
        height: lowerWall.height, 
        background: lowerWall.color
      }}></div>

      {/* Left Wall */}
      <div style={{
        position: "absolute",
        transition: "0.35s",
        top: leftWall.y, 
        left: leftWall.x, 
        width: leftWall.width, 
        height: leftWall.height, 
        background: leftWall.color
      }}></div>

      {/* Right Wall */}
      <div style={{
        position: "absolute",
        transition: "0.35s",
        top: rightWall.y, 
        left: rightWall.x, 
        width: rightWall.width, 
        height: rightWall.height, 
        background: rightWall.color
      }}></div>

      <button onClick={() => moveBall(0, -10)}>Up</button>
      <button onClick={() => moveBall(0, 10)}>Down</button>
      <button onClick={() => moveBall(-10, 0)}>Left</button>
      <button onClick={() => moveBall(10, 0)}>Right</button>

      <button onClick={() => setIsPaused(!isPaused)}>Play/Pause</button>

      <button onClick={() => movePlayer("P1", Math.random() * 500)}>Move P1</button>
      <button onClick={() => movePlayer("P2", Math.random() * 500)}>Move P2</button>
    </>
  )
}

export default App
