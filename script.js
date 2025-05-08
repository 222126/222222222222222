// 加密貨幣圖標映射
const cryptoIcons = {
    'BTC': 'fab fa-bitcoin',
    'ETH': 'fab fa-ethereum',
    'BNB': 'fas fa-coins',
    'SOL': 'fas fa-coins',
    'XRP': 'fas fa-coins',
    'USDC': 'fas fa-dollar-sign',
    'USDT': 'fas fa-dollar-sign',
    'ADA': 'fas fa-coins',
    'AVAX': 'fas fa-coins',
    'DOGE': 'fas fa-dog',
    'DOT': 'fas fa-coins',
    'TRX': 'fas fa-coins',
    'MATIC': 'fas fa-coins',
    'LINK': 'fas fa-link',
    'WBTC': 'fab fa-bitcoin',
    'TON': 'fas fa-coins',
    'SHIB': 'fas fa-dog',
    'DAI': 'fas fa-dollar-sign',
    'LTC': 'fas fa-coins',
    'UNI': 'fas fa-coins',
    'ATOM': 'fas fa-atom',
    'XLM': 'fas fa-coins',
    'BCH': 'fab fa-bitcoin',
    'NEAR': 'fas fa-coins',
    'XMR': 'fas fa-coins',
    'OKB': 'fas fa-coins',
    'FIL': 'fas fa-coins',
    'INJ': 'fas fa-coins',
    'APT': 'fas fa-coins',
    'HBAR': 'fas fa-coins',
    'VET': 'fas fa-coins',
    'OP': 'fas fa-coins',
    'MKR': 'fas fa-coins',
    'CRO': 'fas fa-coins',
    'RUNE': 'fas fa-coins',
    'KAS': 'fas fa-coins',
    'GRT': 'fas fa-coins',
    'PEPE': 'fas fa-frog',
    'THETA': 'fas fa-coins',
    'FTM': 'fas fa-coins',
    'RNDR': 'fas fa-coins',
    'AAVE': 'fas fa-coins',
    'QNT': 'fas fa-coins',
    'ALGO': 'fas fa-coins',
    'ARB': 'fas fa-coins',
    'STX': 'fas fa-coins',
    'FLOW': 'fas fa-coins',
    'EGLD': 'fas fa-coins',
    'EOS': 'fas fa-coins',
    'XTZ': 'fas fa-coins'
};

// 加密貨幣名稱映射
const cryptoNames = {
    'BTC': '比特幣',
    'ETH': '以太幣',
    'BNB': '幣安幣',
    'SOL': '索拉納',
    'XRP': '瑞波幣',
    'USDC': 'USD Coin',
    'USDT': 'Tether',
    'ADA': '卡爾達諾',
    'AVAX': '雪崩協議',
    'DOGE': '狗狗幣',
    'DOT': '波卡',
    'TRX': '波場',
    'MATIC': 'Polygon',
    'LINK': 'Chainlink',
    'WBTC': 'Wrapped Bitcoin',
    'TON': 'Toncoin',
    'SHIB': '柴犬幣',
    'DAI': 'Dai',
    'LTC': '萊特幣',
    'UNI': 'Uniswap',
    'ATOM': 'Cosmos',
    'XLM': '恆星幣',
    'BCH': '比特幣現金',
    'NEAR': 'NEAR Protocol',
    'XMR': '門羅幣',
    'OKB': 'OKB',
    'FIL': 'Filecoin',
    'INJ': 'Injective',
    'APT': 'Aptos',
    'HBAR': 'Hedera',
    'VET': '唯鏈',
    'OP': 'Optimism',
    'MKR': 'Maker',
    'CRO': 'Cronos',
    'RUNE': 'THORChain',
    'KAS': 'Kaspa',
    'GRT': 'The Graph',
    'PEPE': 'Pepe',
    'THETA': 'Theta Network',
    'FTM': 'Fantom',
    'RNDR': 'Render',
    'AAVE': 'Aave',
    'QNT': 'Quant',
    'ALGO': 'Algorand',
    'ARB': 'Arbitrum',
    'STX': 'Stacks',
    'FLOW': 'Flow',
    'EGLD': 'Elrond',
    'EOS': 'EOS',
    'XTZ': 'Tezos'
};

// 搜索功能
function searchCrypto() {
    const searchInput = document.getElementById('crypto-search');
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    if (searchTerm) {
        const cryptoGrid = document.getElementById('cryptoGrid');
        const cards = cryptoGrid.getElementsByClassName('crypto-card');
        
        Array.from(cards).forEach(card => {
            const name = card.querySelector('h2').textContent.toLowerCase();
            if (name.includes(searchTerm)) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    } else {
        const cards = document.getElementsByClassName('crypto-card');
        Array.from(cards).forEach(card => card.style.display = '');
    }
}

// Function to update cryptocurrency prices
async function updatePrices() {
    try {
        const response = await fetch('prices.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const prices = await response.json();
        if (!Array.isArray(prices) || prices.length === 0) {
            throw new Error('Invalid or empty price data');
        }
        
        const cryptoGrid = document.getElementById('cryptoGrid');
        cryptoGrid.innerHTML = '';
        
        let totalMarketCap = 0;
        let totalVolume = 0;
        let btcMarketCap = 0;
        
        prices.forEach(crypto => {
            try {
                totalMarketCap += crypto.market_cap || 0;
                totalVolume += crypto.volume_24h || 0;
                if (crypto.symbol === 'BTC') {
                    btcMarketCap = crypto.market_cap || 0;
                }
                
                const card = document.createElement('div');
                card.className = 'crypto-card';
                card.setAttribute('data-symbol', crypto.symbol);
                
                // 添加點擊事件
                card.addEventListener('click', () => {
                    window.location.href = `crypto-detail.html?symbol=${crypto.symbol}`;
                });
                
                const iconClass = cryptoIcons[crypto.symbol] || 'fas fa-coins';
                const name = cryptoNames[crypto.symbol] || crypto.name || crypto.symbol;
                
                // 格式化價格顯示
                const formattedPrice = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 8
                }).format(crypto.price || 0);
                
                // 格式化交易量
                const formattedVolume = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    notation: 'compact',
                    maximumFractionDigits: 2
                }).format(crypto.volume_24h || 0);
                
                // 格式化高低價
                const formattedHigh = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 8
                }).format(crypto.high_24h || 0);
                
                const formattedLow = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 8
                }).format(crypto.low_24h || 0);
                
                card.innerHTML = `
                    <div class="crypto-header">
                        <div class="crypto-icon">
                            <i class="${iconClass}"></i>
                        </div>
                        <div class="crypto-info">
                            <div class="crypto-name">${name}</div>
                            <div class="crypto-symbol">${crypto.symbol}</div>
                        </div>
                    </div>
                    <div class="crypto-price">
                        <div class="price">${formattedPrice}</div>
                        <div class="price-change ${(crypto.change_24h || 0) >= 0 ? 'positive' : 'negative'}">
                            <i class="fas fa-arrow-${(crypto.change_24h || 0) >= 0 ? 'up' : 'down'}"></i>
                            ${Math.abs(crypto.change_24h || 0).toFixed(2)}%
                        </div>
                    </div>
                    <div class="crypto-stats">
                        <div class="stat-item">
                            <span class="stat-label">24h Volume</span>
                            <span class="stat-value">${formattedVolume}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">24h High</span>
                            <span class="stat-value">${formattedHigh}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">24h Low</span>
                            <span class="stat-value">${formattedLow}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Market Cap</span>
                            <span class="stat-value">${formatMarketCap(crypto.market_cap || 0)}</span>
                        </div>
                    </div>
                `;
                
                cryptoGrid.appendChild(card);
            } catch (error) {
                console.error(`Error processing crypto ${crypto.symbol}:`, error);
                continue;
            }
        });
        
        // Update market stats
        document.getElementById('totalMarketCap').textContent = formatMarketCap(totalMarketCap);
        document.getElementById('totalVolume').textContent = formatVolume(totalVolume);
        document.getElementById('btcDominance').textContent = 
            `${((btcMarketCap / totalMarketCap) * 100).toFixed(1)}%`;
        
        // Update timestamp
        document.querySelector('.last-updated').textContent = 
            `Last Updated: ${new Date().toLocaleString()}`;
            
    } catch (error) {
        console.error('Error updating prices:', error);
        // 顯示錯誤訊息給用戶
        const cryptoGrid = document.getElementById('cryptoGrid');
        cryptoGrid.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>無法載入加密貨幣數據，請稍後再試</p>
                <button onclick="updatePrices()">重試</button>
            </div>
        `;
    }
}

// Helper function to format market cap
function formatMarketCap(value) {
    if (value >= 1e12) {
        return `$${(value / 1e12).toFixed(2)}T`;
    } else if (value >= 1e9) {
        return `$${(value / 1e9).toFixed(2)}B`;
    } else if (value >= 1e6) {
        return `$${(value / 1e6).toFixed(2)}M`;
    } else if (value >= 1e3) {
        return `$${(value / 1e3).toFixed(2)}K`;
    }
    return `$${value.toFixed(2)}`;
}

// Helper function to format volume
function formatVolume(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: 'compact',
        maximumFractionDigits: 2
    }).format(value);
}

// 添加詳細頁面的加載函數
async function loadCryptoDetail() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const symbol = urlParams.get('symbol');
        
        if (!symbol) {
            window.location.href = 'index.html';
            return;
        }
        
        const response = await fetch('prices.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const prices = await response.json();
        if (!Array.isArray(prices) || prices.length === 0) {
            throw new Error('Invalid or empty price data');
        }
        
        const crypto = prices.find(c => c.symbol === symbol);
        if (!crypto) {
            window.location.href = 'index.html';
            return;
        }
        
        // 更新頁面標題
        document.title = `${cryptoNames[crypto.symbol] || crypto.name} (${crypto.symbol}) - 加密貨幣詳情`;
        
        // 更新詳細資訊
        const detailContainer = document.querySelector('.crypto-detail-container');
        detailContainer.innerHTML = `
            <div class="crypto-detail-header">
                <div class="crypto-info">
                    <i class="${cryptoIcons[crypto.symbol] || 'fas fa-coins'} crypto-icon"></i>
                    <h1>${cryptoNames[crypto.symbol] || crypto.name}</h1>
                    <span class="crypto-symbol">${crypto.symbol}</span>
                </div>
                <div class="crypto-price-info">
                    <div class="current-price">
                        <span class="price">${new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 8
                        }).format(crypto.price || 0)}</span>
                        <span class="price-change ${(crypto.change_24h || 0) >= 0 ? 'positive' : 'negative'}">
                            <i class="fas fa-arrow-${(crypto.change_24h || 0) >= 0 ? 'up' : 'down'}"></i>
                            ${Math.abs(crypto.change_24h || 0).toFixed(2)}%
                        </span>
                    </div>
                    <div class="price-stats">
                        <div class="stat">
                            <span class="label">24h 高點</span>
                            <span class="value">${new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'USD',
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 8
                            }).format(crypto.high_24h || 0)}</span>
                        </div>
                        <div class="stat">
                            <span class="label">24h 低點</span>
                            <span class="value">${new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'USD',
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 8
                            }).format(crypto.low_24h || 0)}</span>
                        </div>
                        <div class="stat">
                            <span class="label">24h 交易量</span>
                            <span class="value">${formatVolume(crypto.volume_24h || 0)}</span>
                        </div>
                        <div class="stat">
                            <span class="label">市值</span>
                            <span class="value">${formatMarketCap(crypto.market_cap || 0)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error loading crypto detail:', error);
        const detailContainer = document.querySelector('.crypto-detail-container');
        detailContainer.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>無法載入加密貨幣詳細資料，請稍後再試</p>
                <button onclick="loadCryptoDetail()">重試</button>
            </div>
        `;
    }
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', () => {
    // 檢查是否在詳細頁面
    if (window.location.pathname.includes('crypto-detail.html')) {
        loadCryptoDetail();
    } else {
        updatePrices();
        setInterval(updatePrices, 60000); // Update prices every minute
    }
});

// 導航欄活動狀態
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', function() {
        document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
        this.classList.add('active');
    });
});

// News handling functions
function loadNews() {
    fetch('news.json')
        .then(response => response.json())
        .then(news => {
            const newsGrid = document.getElementById('newsGrid');
            newsGrid.innerHTML = '';
            
            news.forEach(article => {
                const newsCard = document.createElement('article');
                newsCard.className = 'news-card';
                
                const date = new Date(article.published_at * 1000);
                const formattedDate = date.toLocaleDateString('zh-TW', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
                
                newsCard.innerHTML = `
                    <div class="news-content">
                        <a href="${article.link}" target="_blank">
                            <h3>${article.title}</h3>
                        </a>
                        <p class="news-snippet">${article.snippet}</p>
                        <div class="news-meta">
                            <span class="news-source">${article.source}</span>
                            <span class="news-date">${formattedDate}</span>
                        </div>
                    </div>
                `;
                
                newsGrid.appendChild(newsCard);
            });
        })
        .catch(error => console.error('Error loading news:', error));
}

// 更新加密貨幣數據
async function updateCryptoData() {
    try {
        const response = await fetch('prices.json');
        const data = await response.json();
        
        // 更新最後更新時間
        const lastUpdated = document.querySelector('.last-updated');
        lastUpdated.textContent = `最後更新: ${new Date().toLocaleTimeString('zh-TW')}`;
        
        // 更新市場概況
        document.getElementById('totalMarketCap').textContent = `$${formatNumber(data.totalMarketCap)}`;
        document.getElementById('totalVolume').textContent = `$${formatNumber(data.totalVolume)}`;
        document.getElementById('btcDominance').textContent = `${data.btcDominance}%`;
        
        // 更新加密貨幣卡片
        const cryptoGrid = document.getElementById('cryptoGrid');
        cryptoGrid.innerHTML = '';
        
        data.cryptos.forEach(crypto => {
            const changeClass = crypto.change24h >= 0 ? 'positive' : 'negative';
            const changeIcon = crypto.change24h >= 0 ? 'fa-arrow-up' : 'fa-arrow-down';
            
            cryptoGrid.innerHTML += `
                <div class="crypto-card">
                    <div class="crypto-header">
                        <i class="crypto-icon ${crypto.icon}"></i>
                        <h2>${crypto.name} <span class="crypto-symbol">${crypto.symbol}</span></h2>
                    </div>
                    <div class="crypto-price">
                        <span class="price">$${formatNumber(crypto.price)}</span>
                        <span class="change ${changeClass}">
                            <i class="fas ${changeIcon}"></i>
                            ${Math.abs(crypto.change24h)}%
                        </span>
                    </div>
                    <div class="crypto-details">
                        <div class="volume">
                            <span>24h 交易量:</span>
                            <span>$${formatNumber(crypto.volume24h)}</span>
                        </div>
                        <div class="high-low">
                            <span>高: $${formatNumber(crypto.high24h)}</span>
                            <span>低: $${formatNumber(crypto.low24h)}</span>
                        </div>
                    </div>
                    <div class="crypto-chart">
                        <canvas id="chart-${crypto.symbol.toLowerCase()}"></canvas>
                    </div>
                </div>
            `;
        });
        
        // 更新圖表
        updateCharts(data.cryptos);
        
    } catch (error) {
        console.error('更新數據時發生錯誤:', error);
    }
}

// 初始化並設置定時更新
async function initialize() {
    await updateCryptoData();
    // 每分鐘更新一次數據
    setInterval(updateCryptoData, 60000);
}

// 頁面加載時初始化
document.addEventListener('DOMContentLoaded', initialize); 