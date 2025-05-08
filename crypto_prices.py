import requests
import json
import logging
from datetime import datetime

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_crypto_prices():
    try:
        # CryptoCompare API endpoint
        url = "https://min-api.cryptocompare.com/data/top/mktcapfull"
        
        # API parameters
        params = {
            "limit": 50,  # 獲取前50種加密貨幣
            "tsym": "USD",
            "api_key": "YOUR_CRYPTOCOMPARE_API_KEY"  # 請替換為您的 API key
        }
        
        logger.info("Fetching cryptocurrency prices...")
        response = requests.get(url, params=params)
        
        if response.status_code != 200:
            logger.error(f"API request failed with status code: {response.status_code}")
            logger.error(f"Response content: {response.text}")
            return {}
        
        data = response.json()
        logger.info("Successfully received data from CryptoCompare API")
        
        # 初始化市場數據
        market_data = {
            "totalMarketCap": 0,
            "totalVolume": 0,
            "btcDominance": 0,
            "cryptos": [],
            "timestamp": datetime.now().isoformat()
        }
        
        # 處理每個加密貨幣的數據
        for crypto in data["Data"]:
            coin_info = crypto["CoinInfo"]
            raw_data = crypto["RAW"]["USD"]
            
            # 計算總市值和交易量
            market_data["totalMarketCap"] += raw_data["MKTCAP"]
            market_data["totalVolume"] += raw_data["VOLUME24HOUR"]
            
            # 如果是比特幣，記錄其市值用於計算主導率
            if coin_info["Name"] == "BTC":
                btc_market_cap = raw_data["MKTCAP"]
            
            # 添加加密貨幣數據
            crypto_data = {
                "symbol": coin_info["Name"],
                "name": coin_info["FullName"],
                "price": raw_data["PRICE"],
                "change_24h": raw_data["CHANGEPCT24HOUR"],
                "volume_24h": raw_data["VOLUME24HOUR"],
                "high_24h": raw_data["HIGH24HOUR"],
                "low_24h": raw_data["LOW24HOUR"],
                "market_cap": raw_data["MKTCAP"]
            }
            market_data["cryptos"].append(crypto_data)
        
        # 計算比特幣主導率
        market_data["btcDominance"] = (btc_market_cap / market_data["totalMarketCap"]) * 100
        
        # 保存到 JSON 文件
        with open('prices.json', 'w', encoding='utf-8') as f:
            json.dump(market_data["cryptos"], f, ensure_ascii=False, indent=4)
        
        logger.info("Successfully saved prices to prices.json")
        return market_data
        
    except Exception as e:
        logger.error(f"Error fetching prices: {e}")
        return {}

if __name__ == '__main__':
    get_crypto_prices() 