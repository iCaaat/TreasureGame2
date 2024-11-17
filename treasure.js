const backgroundMusic = document.getElementById('background-music');
const playPauseBtn = document.getElementById('playPauseBtn');
const volumeControl = document.getElementById('volumeControl');


// 使用 fetch API 加载元素描述
async function loadElementDescriptions() {
    try {
        const response = await fetch('data/elements.txt');
        if (!response.ok) {
            throw new Error('无法加载元素描述文件');
        }
        const descriptions = await response.text();
        displayDescriptions(descriptions);
    } catch (error) {
        console.error('加载描述数据失败:', error);
        displayMessage('加载元素描述数据失败，请稍后再试。', true);
    }
}

// 显示描述信息
function displayDescriptions(descriptions) {
    const outputDiv = document.getElementById('output');
    const p = document.createElement('p');
    p.textContent = descriptions;
    outputDiv.appendChild(p);
}

// 显示信息并增加动画效果
function displayMessage(message, isError = false) {
    const outputDiv = document.getElementById('output');
    const p = document.createElement('p');
    p.classList.add('message');
    p.textContent = message;
    if (isError) {
        p.classList.add('error');
    }
    outputDiv.appendChild(p);
    
    setTimeout(() => p.classList.add('visible'), 50);
}

// 保存玩家信息到 localStorage
function savePlayerInfo(id, nickname) {
    const playerInfo = { id, nickname, history: [] };
    localStorage.setItem('playerInfo', JSON.stringify(playerInfo));
}

// 从 localStorage 获取玩家信息
function getPlayerInfo() {
    const playerInfo = JSON.parse(localStorage.getItem('playerInfo'));
    if (playerInfo) {
        displayPlayerInfo(playerInfo);
        return playerInfo;
    } else {
        return null;
    }
}

// 显示玩家信息和游戏历史
function displayPlayerInfo(playerInfo) {
    const playerInfoDiv = document.getElementById('player-info');
    playerInfoDiv.innerHTML = `<strong>玩家ID:</strong> ${playerInfo.id} <br> <strong>昵称:</strong> ${playerInfo.nickname}`;
    
    // 显示游戏历史
    const historyDiv = document.createElement('div');
    historyDiv.innerHTML = `<strong>游戏历史:</strong><br>`;
    
    playerInfo.history.forEach((item, index) => {
        const historyItem = document.createElement('p');
        historyItem.textContent = `${index + 1}. ${item}`;
        historyDiv.appendChild(historyItem);

        // 添加分隔线
        const separator = document.createElement('hr');  // 创建分隔线
        historyDiv.appendChild(separator);
    });
    
    playerInfoDiv.appendChild(historyDiv);
}

// 更新游戏历史
function updatePlayerHistory(message) {
    const playerInfo = getPlayerInfo();
    if (playerInfo) {
        playerInfo.history.push(message);
        localStorage.setItem('playerInfo', JSON.stringify(playerInfo));
    }
}

// 模拟宝藏地图API
class TreasureHunt {
    static getInitialClue() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve("在古老的图书馆里找到了第一个线索...");
            }, 1000);
        });
    }

    static decodeAncientScript(clue) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (!clue) {
                    reject("没有线索可以解码!");
                }
                resolve("解码成功!宝藏在一座古老的神庙中...");
            }, 1500);
        });
    }

    static crossAncientBridge() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const decision = Math.random();  // 50% chance
                if (decision > 0.5) {
                    resolve("你成功穿越了桥梁，前方的道路依然清晰...");
                } else {
                    reject("桥梁突然断裂，你摔进了河中！");
                }
            }, 2000);
        });
    }

    static enterMaze() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const solved = Math.random() > 0.3;  // 70% chance of solving the maze
                if (solved) {
                    resolve("你成功解开了迷宫的谜题，通往神庙的路再次开启...");
                } else {
                    reject("迷宫太复杂了，你迷失了方向！");
                }
            }, 2500);
        });
    }

    static exploreCave() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const encounter = Math.random();  // 50% chance of encountering an enemy
                if (encounter > 0.5) {
                    const battleOutcome = Math.random();  // 50% chance of winning
                    if (battleOutcome > 0.5) {
                        resolve("你击败了敌人，成功穿越了洞窟！");
                    } else {
                        reject("敌人太强大，你被击败了！");
                    }
                } else {
                    resolve("洞窟很安静，你顺利通过了...");
                }
            }, 3000);
        });
    }

    static openTreasureBox() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve("恭喜!你找到了传说中的宝藏!");
            }, 1000);
        });
    }

    // 新增情节：探索地下洞窟
    static exploreUndergroundCavern() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const decision = Math.random();  // 50% chance of success
                if (decision > 0.5) {
                    resolve("你发现了地下洞窟，里面埋藏着一部分古老的遗物...");
                } else {
                    reject("洞窟深处突然塌陷，你不得不迅速撤退！");
                }
            }, 2500);
        });
    }
}

// 清除上一个选择并显示新选项
function clearChoices() {
    const choicesDiv = document.getElementById('choices');
    choicesDiv.innerHTML = '';
}

// 创建选择按钮并添加事件监听
function displayChoices(options, callback) {
    const choicesDiv = document.getElementById('choices');
    clearChoices();
    options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option.text;
        button.classList.add('choice-button');
        button.addEventListener('click', () => {
            clearChoices();
            displayMessage(option.result);
            callback(option);
        });
        choicesDiv.appendChild(button);
    });
}

// 主寻宝流程
async function startTreasureHunt(playerInfo) {
    try {
        const clue = await TreasureHunt.getInitialClue();
        displayMessage(clue);
        updatePlayerHistory(clue);

        const decodedLocation = await TreasureHunt.decodeAncientScript(clue);
        displayMessage(decodedLocation);
        updatePlayerHistory(decodedLocation);

        const bridgeMessage = await TreasureHunt.crossAncientBridge();
        displayMessage(bridgeMessage);
        updatePlayerHistory(bridgeMessage);

        const mazeMessage = await TreasureHunt.enterMaze();
        displayMessage(mazeMessage);
        updatePlayerHistory(mazeMessage);

        // 新增情节：探索地下洞窟
        const cavernMessage = await TreasureHunt.exploreUndergroundCavern();
        displayMessage(cavernMessage);
        updatePlayerHistory(cavernMessage);

        const treasure = await TreasureHunt.openTreasureBox();
        displayMessage(treasure);
        updatePlayerHistory(treasure);

    } catch (error) {
        displayMessage("任务失败: " + error, true);
    }
}

// 初始化游戏
function initializeGame() {
    const playerInfo = getPlayerInfo();
    if (playerInfo) {
        startTreasureHunt(playerInfo);
        
    } else {
        const id = prompt("请输入玩家ID:");
        const nickname = prompt("请输入昵称:");
        savePlayerInfo(id, nickname);
        startTreasureHunt({ id, nickname });
    }
}
backgroundMusic.play();

// 监听按钮点击事件，切换播放和暂停
playPauseBtn.addEventListener('click', () => {
    if (backgroundMusic.paused) {
        backgroundMusic.play();
        playPauseBtn.textContent = '暂停音乐';  // 更改按钮文字为“暂停音乐”
    } else {
        backgroundMusic.pause();
        playPauseBtn.textContent = '播放音乐';  // 更改按钮文字为“播放音乐”
    }
});
// 监听音量控制变化，调整音量
volumeControl.addEventListener('input', (event) => {
    const volume = event.target.value;  // 获取音量值（0-1）
    backgroundMusic.volume = volume;  // 调整音频音量
});
// 启动游戏
loadElementDescriptions();
initializeGame();

