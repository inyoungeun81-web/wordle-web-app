/* =========================================
   워들 게임 JavaScript
========================================= */


/* =========================================
   1. 사용할 5글자 영어 단어 목록
========================================= */

const words = [
    "APPLE",
    "BRAIN",
    "CHAIR",
    "DREAM",
    "EARTH",
    "FLAME",
    "GRAPE",
    "HOUSE",
    "LIGHT",
    "MOUSE",
    "PLANT",
    "RIVER",
    "SMART",
    "TABLE",
    "TRAIN"
];


/* =========================================
   2. 게임 상태 변수
========================================= */

// 정답 단어
let targetWord = "";

// 현재 입력 중인 행
let currentRow = 0;

// 현재 입력 중인 열
let currentCol = 0;

// 6행 × 5열 게임판 데이터
let board = [];

// 게임 종료 여부
let gameOver = false;


/* =========================================
   3. 게임 시작
========================================= */

function startGame() {

    // 단어 목록 중 랜덤으로 정답 선택
    targetWord =
        words[Math.floor(Math.random() * words.length)];

    // 현재 위치 초기화
    currentRow = 0;
    currentCol = 0;

    // 게임 종료 상태 초기화
    gameOver = false;

    // 6 × 5 빈 배열 생성
    board = Array.from(
        { length: 6 },
        () => Array(5).fill("")
    );

    // 메시지 표시
    document.getElementById("message").textContent =
        "첫 번째 단어를 입력하세요!";

    // 다시 시작 버튼 숨기기
    document.getElementById("restart-button").style.display =
        "none";

    // 게임판 생성
    createBoard();

    // 화면 키보드 생성
    createKeyboard();

    // 개발 확인용
    console.log("정답:", targetWord);
}


/* =========================================
   4. 게임판 생성
========================================= */

function createBoard() {

    const gameBoard =
        document.getElementById("game-board");

    // 기존 게임판 삭제
    gameBoard.innerHTML = "";

    // 6줄 생성
    for (let row = 0; row < 6; row++) {

        const rowElement =
            document.createElement("div");

        rowElement.classList.add("row");


        // 한 줄에 5칸 생성
        for (let col = 0; col < 5; col++) {

            const tile =
                document.createElement("div");

            tile.classList.add("tile");

            // 위치 저장
            tile.dataset.row = row;
            tile.dataset.col = col;

            rowElement.appendChild(tile);
        }

        gameBoard.appendChild(rowElement);
    }
}


/* =========================================
   5. 화면 키보드 생성
========================================= */

function createKeyboard() {

    const keyboard =
        document.getElementById("keyboard");

    keyboard.innerHTML = "";

    const keyboardRows = [

        ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],

        ["A", "S", "D", "F", "G", "H", "J", "K", "L"],

        [
            "ENTER",
            "Z", "X", "C", "V", "B", "N", "M",
            "BACK"
        ]
    ];


    // 키보드 줄 생성
    keyboardRows.forEach(row => {

        const rowElement =
            document.createElement("div");

        rowElement.classList.add("keyboard-row");


        // 키 버튼 생성
        row.forEach(key => {

            const button =
                document.createElement("button");

            button.textContent = key;

            button.classList.add("key");


            // ENTER, BACK 버튼 크기 조정
            if (
                key === "ENTER" ||
                key === "BACK"
            ) {
                button.classList.add("wide-key");
            }


            // 버튼 클릭 이벤트
            button.addEventListener(
                "click",
                () => handleInput(key)
            );

            rowElement.appendChild(button);
        });

        keyboard.appendChild(rowElement);
    });
}


/* =========================================
   6. 입력 처리
========================================= */

function handleInput(key) {

    // 게임 종료 시 입력 금지
    if (gameOver) return;


    // ENTER 입력
    if (key === "ENTER") {

        checkWord();

        return;
    }


    // BACK 입력
    if (key === "BACK") {

        deleteLetter();

        return;
    }


    // 알파벳 입력
    addLetter(key);
}


/* =========================================
   7. 글자 입력
========================================= */

function addLetter(letter) {

    // 이미 5글자 입력
    if (currentCol >= 5) return;


    // 배열에 글자 저장
    board[currentRow][currentCol] =
        letter;


    // 화면 칸 찾기
    const tile =
        document.querySelector(
            `.tile[data-row="${currentRow}"][data-col="${currentCol}"]`
        );


    // 글자 표시
    tile.textContent = letter;

    tile.classList.add("active");


    // 다음 칸으로 이동
    currentCol++;
}


/* =========================================
   8. 글자 삭제
========================================= */

function deleteLetter() {

    // 첫 번째 칸이면 삭제 불가
    if (currentCol <= 0) return;


    // 이전 칸으로 이동
    currentCol--;


    // 배열에서 삭제
    board[currentRow][currentCol] = "";


    // 화면에서 삭제
    const tile =
        document.querySelector(
            `.tile[data-row="${currentRow}"][data-col="${currentCol}"]`
        );

    tile.textContent = "";

    tile.classList.remove("active");
}


/* =========================================
   9. 단어 정답 확인
========================================= */

function checkWord() {

    // 5글자를 입력하지 않았을 경우
    if (currentCol < 5) {

        document.getElementById("message").textContent =
            "5글자를 모두 입력하세요!";

        return;
    }


    // 현재 입력 단어 생성
    const guess =
        board[currentRow].join("");


    // 중복 글자 처리를 위한 배열
    const targetLetters =
        targetWord.split("");


    // 기본값은 모두 회색
    const result =
        Array(5).fill("absent");


    /* -----------------------------------------
       1단계
       글자와 위치가 모두 정확
       → 초록색
    ----------------------------------------- */

    for (let i = 0; i < 5; i++) {

        if (guess[i] === targetLetters[i]) {

            result[i] = "correct";

            // 사용한 글자는 제거
            targetLetters[i] = null;
        }
    }


    /* -----------------------------------------
       2단계
       글자는 있지만 위치가 다름
       → 노란색
    ----------------------------------------- */

    for (let i = 0; i < 5; i++) {

        // 이미 초록색이면 건너뜀
        if (result[i] === "correct") continue;


        // 정답 단어에서 글자 찾기
        const index =
            targetLetters.indexOf(guess[i]);


        if (index !== -1) {

            result[i] = "present";

            // 사용한 글자 제거
            targetLetters[index] = null;
        }
    }


    /* -----------------------------------------
       3단계
       결과를 화면에 적용
    ----------------------------------------- */

    for (let i = 0; i < 5; i++) {

        const tile =
            document.querySelector(
                `.tile[data-row="${currentRow}"][data-col="${i}"]`
            );


        // 입력 중 테두리 제거
        tile.classList.remove("active");


        // correct / present / absent 적용
        tile.classList.add(result[i]);
    }


    /* -----------------------------------------
       4단계
       정답 확인
    ----------------------------------------- */

    if (guess === targetWord) {

        document.getElementById("message").textContent =
            `🎉 정답입니다! "${targetWord}"를 맞혔습니다!`;

        gameOver = true;

        showRestartButton();

        return;
    }


    // 다음 행으로 이동
    currentRow++;

    currentCol = 0;


    /* -----------------------------------------
       5단계
       6번 모두 실패했는지 확인
    ----------------------------------------- */

    if (currentRow === 6) {

        document.getElementById("message").textContent =
            `게임 종료! 정답은 "${targetWord}"였습니다.`;

        gameOver = true;

        showRestartButton();

    } else {

        document.getElementById("message").textContent =
            `${currentRow + 1}번째 기회입니다!`;
    }
}


/* =========================================
   10. 실제 키보드 입력
========================================= */

document.addEventListener(
    "keydown",
    event => {

        // 게임 종료 시 입력 금지
        if (gameOver) return;


        const key =
            event.key.toUpperCase();


        // 알파벳 입력
        if (/^[A-Z]$/.test(key)) {

            handleInput(key);
        }


        // Enter 키
        else if (event.key === "Enter") {

            handleInput("ENTER");
        }


        // Backspace 키
        else if (event.key === "Backspace") {

            handleInput("BACK");
        }
    }
);


/* =========================================
   11. 다시 시작 버튼 표시
========================================= */

function showRestartButton() {

    document.getElementById(
        "restart-button"
    ).style.display = "block";
}


/* =========================================
   12. 다시 시작 버튼 클릭
========================================= */

document
    .getElementById("restart-button")
    .addEventListener(
        "click",
        startGame
    );


/* =========================================
   13. 페이지 실행 시 게임 시작
========================================= */

startGame();