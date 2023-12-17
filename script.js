const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const gravity = 9.8;


function checkSelection(){
  const choices = document.getElementsByClassName('.fieldSize');
  for(const choice of choices){
    if(choice.checked){
      return true;
    }
    return false;
  }
}

function ballsColor(){
  const ballColor = document.getElementsByClassName('ballColor');
  let chosenBallColorOption;
  for (const choice of ballColor) {
     if (choice.checked) {
      chosenBallColorOption = choice.nextElementSibling.innerHTML;
      break;
    }
  }

  if(chosenBallColorOption === 'Random'){
    chosenBallColorOption = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`
  }

  return chosenBallColorOption
}

function ballsSize(){
  const ballSize = document.getElementsByClassName('ballSize');
  let chosenBallSizeOption;
  for (const choice of ballSize) {
     if (choice.checked) {
      chosenBallSizeOption = choice.nextElementSibling.innerHTML;
      break;
    }
  }

  if(chosenBallSizeOption === "Small"){
    chosenBallSizeOption = 5;
  } else if(chosenBallSizeOption === "Medium"){
    chosenBallSizeOption = 15;
  } else {
    chosenBallSizeOption = 25;
  }


  return chosenBallSizeOption;
}


function setChoice(event) {
  event.preventDefault();
  const choices = document.querySelectorAll('input[type="radio"][name="choice"]');
  const box = document.querySelector(".gameBox");
  const title = document.querySelector("h1");
  let chosenOption;

  for (const choice of choices) {
    if (choice.checked) {
      chosenOption = choice.nextElementSibling.innerHTML;
      break;
    }
  }

  if (chosenOption) {
    document.querySelector('.choiceBox').classList.add('active');

    switch (chosenOption) {
      case "3 X 3":
        canvas.width = 300;
        canvas.height = 150;
        canvas.style.margin = "0 19%"
        box.style.padding = "0 30%";
        title.style.margin = "25px 9%"
        break;
      case "4 X 4":
        canvas.width = 600;
        canvas.height = 300;
        title.style.margin = "25px 9%"
        box.style.padding = "0 30%";
        break;
      case "5 X 5":
        canvas.width = 900;
        canvas.height = 450;
        box.style.padding = "0 20%";
        title.style.margin = "25px 22%"
        break;
    }

  } else {
    console.warn("No radio option selected!");
  }

  if (chosenOption) {
    document.querySelector('.choiceBox').classList.add('active');
    document.querySelector('.gameBox').classList.add('active');
  } else {
    document.querySelector('.choiceBox').classList.remove('active');
    document.querySelector('.gameBox').classList.remove('active');
  }
}


const confirmButton = document.querySelector('.confirmButton');
confirmButton.addEventListener('click', setChoice);

const balls = [];
const initialSpeed = 5;
let lastTime = 0;

canvas.addEventListener("click", (event) => {
  if (balls.length === 15) {
      balls.shift();
  }

  const x = event.offsetX;
  const y = event.offsetY;

  balls.push({
      x,
      y,
      vy: initialSpeed,
      vx: 0,
      radius: ballsSize(),
      color: ballsColor(),
  });
});

function tick(currentTime) {
  const deltaTime = (currentTime - lastTime) / 1000; 
  lastTime = currentTime;

  context.clearRect(0, 0, canvas.width, canvas.height);

  balls.forEach(ball => {
      ball.vy += gravity * deltaTime; 
      ball.y += ball.vy;
      
      if (ball.y + ball.radius > canvas.height) {
          ball.y = canvas.height - ball.radius;
          ball.vy *= -0.6;
      }else if(ball.y - ball.radius < 0){
        ball.y = ball.radius;
        ball.vy *= -0.6;

      }
      if(ball.x + ball.radius > canvas.width) {
          ball.x = canvas.width - ball.radius
          ball.xv *=-1
      } else if(ball.x - ball.radius < 0){
        ball.x += ball.radius
        ball.xv *=-1
      }

        for (let i = 0; i < balls.length; i++) {
          for (let j = i + 1; j < balls.length; j++) {
            const dx = balls[i].x - balls[j].x;
            const dy = balls[i].y - balls[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
      
            const minDistance = balls[i].radius + balls[j].radius;
      
            if (distance < minDistance) {
              const angle = Math.atan2(dy, dx);
              const overlap = minDistance - distance;
      
              balls[i].x += overlap * Math.cos(angle);
              balls[i].y += overlap * Math.sin(angle);
              balls[j].x -= overlap * Math.cos(angle);
              balls[j].y -= overlap * Math.sin(angle);
      
              balls[i].xv *= -1;
              balls[i].yv *= -1;
              balls[j].xv *= -1;
              balls[j].yv *= -1;
            }
          }
        }

      context.beginPath();
      context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, false);
      context.fillStyle = ball.color;
      context.fill();
      context.closePath();
  });

  requestAnimationFrame(tick);
}

requestAnimationFrame(tick);

