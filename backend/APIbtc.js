async function getBTCprice() {
    try {
        const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd");
        const data = await response.json();
        console.log(`Current BTC price: $${data.bitcoin.usd}`);

        document.getElementById("btc-price").innerHTML = `${data.bitcoin.usd}`;
    } catch (error) {
        console.error("Error fetching BTC price:", error);
    }
}

async function getETHprice() {
    try {
        const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd");
        const data = await response.json();
        console.log(`Current ETH price: $${data.ethereum.usd}`);

        document.getElementById("eth-price").innerHTML = `${data.ethereum.usd}`;
    } catch (error) {
        console.error("Error fetching ETH price:", error);
    }
}

// Initial call to fetch BTC price
getBTCprice();
setInterval(getBTCprice, 60000); // Update every 60 seconds

// Initial call to fetch ETH price
getETHprice();
setInterval(getETHprice, 60000); // Update every 60 seconds