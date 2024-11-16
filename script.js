// 获取页面元素
const locationTitle = document.getElementById('location-title');
const locationData = document.getElementById('location-data');
const storyContent = document.getElementById('story-content');
const choicesDiv = document.getElementById('choices');
const gameHistoryDiv = document.getElementById('game-history');
const restartButton = document.getElementById('restart-button');
const backgroundMusic = document.getElementById('background-music');

// 玩家信息存储
let gameHistory = [];

// 当前情节
let currentScene = 'library'; // 初始情节是图书馆

// 读取并显示背景信息
async function displayBackgroundInfo(scene) {
    try {
        // 加载txt文件中的数据
        const response = await fetch('data.txt');
        const data = await response.text();
        const scenes = parseScenes(data);
        
        locationTitle.innerText = scenes[scene].title;
        locationData.innerText = scenes[scene].description;
        storyContent.innerText = scenes[scene].story;
        updateChoices(scenes[scene].options);
    } catch (error) {
        console.error('加载背景信息失败:', error);
    }
}

// 解析txt文件内容
function parseScenes(data) {
    const scenes = {};
    const lines = data.split('\n');
    let currentScene = null;

    lines.forEach(line => {
        if (line.trim() === '') return;

        const [title, description] = line.split('：');
        const options = [
            { text: `前往${title}`, nextScene: title.toLowerCase() }
        ];

        scenes[title.toLowerCase()] = {
            title: title,
            description: description,
            story: `你来到${title}，${description}`,
            options: options
        };
    });

    return scenes;
}

// 更新选择按钮
function updateChoices(options) {
    choicesDiv.innerHTML = '';
    options.forEach(option => {
        const button = document.createElement('button');
        button.innerText = option.text;
        button.onclick = () => makeChoice(option.nextScene);
        choicesDiv.appendChild(button);
    });
}

// 处理按钮点击
function makeChoice(nextScene) {
    // 记录玩家选择
    gameHistory.push(`你选择了：${nextScene}`);
    updateHistoryDisplay();

    // 更新当前情节并显示新的背景信息
    currentScene = nextScene;
    displayBackgroundInfo(currentScene);
}

// 更新游戏历史
function updateHistoryDisplay() {
    gameHistoryDiv.innerHTML = gameHistory.join('<br>');
}

// 结束游戏并显示重新开始按钮
function endGame() {
    storyContent.innerHTML = '游戏结束，感谢参与！';
    restartButton.style.display = 'inline-block';  // 显示重新开始按钮
    restartButton.onclick = restartGame;
}

// 重新开始游戏
function restartGame() {
    gameHistory = [];  // 清空游戏历史
    updateHistoryDisplay();

    currentScene = 'library';  // 重置为初始情节
    displayBackgroundInfo(currentScene);

    restartButton.style.display = 'none';  // 隐藏重新开始按钮
}

// 初始化游戏
function startGame() {
    // 显示图书馆的背景信息
    displayBackgroundInfo(currentScene);
    backgroundMusic.play();  // 开始背景音乐
}

// 页面加载完成后初始化游戏
window.onload = function () {
    startGame();
};
