document.addEventListener("DOMContentLoaded",function(){
    const maingame = document.getElementById("main")
    const mainsize = 600
    const gridsize = 20
    let score = 0
    let gamestarted = false
    let food = {x:300,y:200}
    let snakesize = [{x:160,y:200},{x:140,y:200},{x:120,y:200}]
    let dx = gridsize; // +20
    let dy = 0;
    let intervalid;
    let gameSpeed = 200;


    function moveFood() {
        let newX, newY;
        const maxGridCount = mainsize / gridsize; // Ensure food is within the game area
    
        do {
            newX = Math.floor(Math.random() * maxGridCount) * gridsize;
            newY = Math.floor(Math.random() * maxGridCount) * gridsize;
        } while(snakesize.some(snakeCell => snakeCell.x === newX && snakeCell.y === newY));
    
        food = {
            x: Math.min(newX, mainsize - gridsize),
            y: Math.min(newY, mainsize - gridsize)
        };
    }




    function updateSnake() {
        const newHead = { x: snakesize[0].x + dx, y: snakesize[0].y + dy };
        snakesize.unshift(newHead); // Add new head to the snake

        // check collision with food
        if(newHead.x === food.x && newHead.y === food.y) {
            score += 10;
            moveFood();

            if(gameSpeed > 50) {
                clearInterval(intervalid);
                gameSpeed -= 10;
                moveFood()
                gameloop();
            }

        } else {
            snakesize.pop(); // Remove tail
        }
    }



    function changeDirection(e) {
        console.log("key pressed", e);
        const isGoingDown = dy === gridsize;
        const isGoingUp = dy === -gridsize;
        const isGoingRight = dx === gridsize;
        const isGoingLeft = dx === -gridsize;
        if(e.key === 'ArrowUp' && !isGoingDown) {
            dx = 0;
            dy = -gridsize;
        } else if(e.key === 'ArrowDown' && !isGoingUp) {
            dx = 0;
            dy = gridsize;
        } else if(e.key === 'ArrowLeft' && !isGoingRight) {
            dx = -gridsize;
            dy = 0;
        } else if(e.key === 'ArrowRight' && !isGoingLeft) {
            dx = gridsize;
            dy = 0;
        }
    }

    function drawDiv(x,y,classname){
        const divElement = document.createElement('div')
        divElement.classList.add(classname)
        divElement.style.top = `${y}px`
        divElement.style.left = `${x}px`
        return divElement;
    }
    
    function initiategame(){
        const scoreBoard = document.createElement('div')
        scoreBoard.id = 'score-board'
        document.body.insertBefore(scoreBoard,maingame)

        const startButton = document.createElement('button')
        startButton.textContent = "Start Game"
        startButton.classList.add('start-button')
        document.body.appendChild(startButton)
        console.log("buttom created")
        startButton.addEventListener('click',()=>{
            startButton.style.display = "none"
            rungame()
        })
    }

    function isGameOver() {
        // snake collision checks
        for(let i = 1; i < snakesize.length; i++) {
            if(snakesize[0].x === snakesize[i].x && snakesize[0].y === snakesize[i].y) {
                return true;
            }
        }

        // wall collision checks
        const hitLeftWall = snakesize[0].x < 0; // snake[0] -> head
        const hitRightWall = snakesize[0].x >= mainsize - gridsize;
        const hitTopWall = snakesize[0].y < 0;
        const hitBottomWall = snakesize[0].y >= mainsize - gridsize;
        return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
    }

    function gameloop(){
        intervalid = setInterval(() => {
            if(isGameOver()){
                clearInterval(intervalid)
                gamestarted = false
                alert("Game Over"+'\n'+'Your Score:'+score)
                return;
            }
            updateSnake()
            drawFoodandSnake()
            
        }, gameSpeed);
    }

    function rungame(){
        if(!gamestarted){
            gamestarted=true
            document.addEventListener('keydown',changeDirection)
            gameloop();
            console.log("rungame function in call")

        }
    }

    function drawFoodandSnake(){
        maingame.innerHTML=''  //redraw new position

        const foodElement = drawDiv(food.x,food.y,'food')
        maingame.appendChild(foodElement);

        snakesize.forEach((snakecell)=>{
            const snakeElement = drawDiv(snakecell.x,snakecell.y,'snakesize')
            maingame.appendChild(snakeElement)
        })
    }
    initiategame()
    console.log("call initiate game")
})