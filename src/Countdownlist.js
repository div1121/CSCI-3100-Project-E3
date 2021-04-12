import React,{ useState, useEffect} from "react";

function Countdownlist( {setCountdown} ) {
  const [time, setTime] = useState("");
  useEffect(() => {
    let countDownDate = new Date("10:00").getTime();
    let x = setInterval(function() {
      let now = new Date().getTime();
      let distance = countDownDate - now;
      let minutes = Math.floor((distance % (1000*60*60)) / (1000 * 60));
      let seconds = Math.floor((distance % (1000*60)) / 1000);
      
      setTime(minutes + "m " + seconds + "s ")
      
      if ( distance < 0) {
        clearInterval(x);
        setTime("Game Over");
        setCountdown(true);
        setTimeout(() => {
          setCountdown(false);
        }, 15000);
      }
    },1000);
  }, []);
  return <div style={style}>{time}</div>;
  }
            const style = {
            fontSize: "40px",
            textAlign: "top, right",
            };
            export default Countdownlist;
