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
class TreasureMap {
    static async getInitialClue() {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return "在古老的图书馆里找到了第一个线索...";
    }

    static async decodeAncientScript(clue) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        if (!clue) {
            throw "没有线索可以解码!";
        }
        return "解码成功!宝藏在一座古老的神庙中...";
    }

    static async searchTemple(location) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const random = Math.random();
        if (random < 0.5) {
            throw "糟糕!遇到了神庙守卫!";
        }
        return "成功找到神庙，获得了神秘的宝箱...";
    }

    static async openTreasureBox() {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return "恭喜!你找到了传说中的宝藏!";
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
        const clue = await TreasureMap.getInitialClue();
        displayMessage(clue);
        updatePlayerHistory(clue);

        const decodedLocation = await TreasureMap.decodeAncientScript(clue);
        displayMessage(decodedLocation);
        updatePlayerHistory(decodedLocation);

        const templeMessage = await TreasureMap.searchTemple(decodedLocation);
        displayMessage(templeMessage);
        updatePlayerHistory(templeMessage);

        const treasure = await TreasureMap.openTreasureBox();
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

// 启动游戏
loadElementDescriptions();
initializeGame();
