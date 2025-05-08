import requests
import json
import logging
from datetime import datetime
import time

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def get_crypto_prices():
    try:
        # CoinDesk API endpoints
        btc_url = "https://api.coindesk.com/v1/bpi/currentprice.json"
        eth_url = "https://api.coindesk.com/v1/bpi/currentprice/ETH.json"
        
        # API parameters
        headers = {
            "Accept": "application/json"
        }
        
        # 添加重試機制
        max_retries = 3
        retry_delay = 2  # 秒
        
        market_data = {
            "totalMarketCap": 0,
            "totalVolume": 0,
            "btcDominance": 0,
            "cryptos": [],
            "timestamp": datetime.now().isoformat()
        }
        
        # 獲取比特幣價格
        for attempt in range(max_retries):
            try:
                logger.info(f"Fetching Bitcoin price (attempt {attempt + 1}/{max_retries})...")
                btc_response = requests.get(btc_url, headers=headers, timeout=10)
                
                if btc_response.status_code == 200:
                    btc_data = btc_response.json()
                    btc_price = float(btc_data["bpi"]["USD"]["rate"].replace(",", ""))
                    
                    # 添加比特幣數據
                    btc_data = {
                        "symbol": "BTC",
                        "name": "Bitcoin",
                        "price": btc_price,
                        "change_24h": 0,  # CoinDesk API 不提供24小時變化
                        "volume_24h": 0,  # CoinDesk API 不提供交易量
                        "high_24h": btc_price,  # 使用當前價格作為高點
                        "low_24h": btc_price,   # 使用當前價格作為低點
                        "market_cap": 0  # CoinDesk API 不提供市值
                    }
                    market_data["cryptos"].append(btc_data)
                    break
                else:
                    logger.error(f"Bitcoin API request failed with status code: {btc_response.status_code}")
                    if attempt < max_retries - 1:
                        time.sleep(retry_delay)
                        continue
                    else:
                        raise Exception(f"Bitcoin API request failed after {max_retries} attempts")
                    
            except requests.exceptions.RequestException as e:
                logger.error(f"Network error while fetching Bitcoin price: {e}")
                if attempt < max_retries - 1:
                    time.sleep(retry_delay)
                    continue
                else:
                    raise
        
        # 獲取以太坊價格
        for attempt in range(max_retries):
            try:
                logger.info(f"Fetching Ethereum price (attempt {attempt + 1}/{max_retries})...")
                eth_response = requests.get(eth_url, headers=headers, timeout=10)
                
                if eth_response.status_code == 200:
                    eth_data = eth_response.json()
                    eth_price = float(eth_data["bpi"]["USD"]["rate"].replace(",", ""))
                    
                    # 添加以太坊數據
                    eth_data = {
                        "symbol": "ETH",
                        "name": "Ethereum",
                        "price": eth_price,
                        "change_24h": 0,  # CoinDesk API 不提供24小時變化
                        "volume_24h": 0,  # CoinDesk API 不提供交易量
                        "high_24h": eth_price,  # 使用當前價格作為高點
                        "low_24h": eth_price,   # 使用當前價格作為低點
                        "market_cap": 0  # CoinDesk API 不提供市值
                    }
                    market_data["cryptos"].append(eth_data)
                    break
                else:
                    logger.error(f"Ethereum API request failed with status code: {eth_response.status_code}")
                    if attempt < max_retries - 1:
                        time.sleep(retry_delay)
                        continue
                    else:
                        raise Exception(f"Ethereum API request failed after {max_retries} attempts")
                    
            except requests.exceptions.RequestException as e:
                logger.error(f"Network error while fetching Ethereum price: {e}")
                if attempt < max_retries - 1:
                    time.sleep(retry_delay)
                    continue
                else:
                    raise
        
        # 保存到 JSON 文件
        try:
            with open('prices.json', 'w', encoding='utf-8') as f:
                json.dump(market_data["cryptos"], f, ensure_ascii=False, indent=4)
            logger.info("Successfully saved prices to prices.json")
            return market_data
        except Exception as e:
            logger.error(f"Error saving to JSON file: {e}")
            raise
                
    except Exception as e:
        logger.error(f"Error fetching prices: {e}")
        # 如果發生錯誤，嘗試讀取緩存數據
        try:
            with open('prices.json', 'r', encoding='utf-8') as f:
                cached_data = json.load(f)
                logger.info("Using cached data due to error")
                return {"cryptos": cached_data}
        except Exception as cache_error:
            logger.error(f"Error reading cached data: {cache_error}")
            return {"cryptos": []}

if __name__ == '__main__':
    get_crypto_prices() 