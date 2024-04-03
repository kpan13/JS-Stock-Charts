async function main() {

    const timeChartCanvas = document.querySelector('#time-chart');
    const highestPriceChartCanvas = document.querySelector('#highest-price-chart');
    const averagePriceChartCanvas = document.querySelector('#average-price-chart');
    const timeChartContext = timeChartCanvas.getContext('2d');
    const highPriceChartContext = highestPriceChartCanvas.getContext('2d')
    const averagePriceChartContext = averagePriceChartCanvas.getContext('2d')
    let response = await fetch('https://api.twelvedata.com/time_series?symbol=GME,MSFT,DIS,BNTX&interval=1min&apikey=d1fff28e2ee647afa5b3612bb3e6a10e')
    let result = await response.json()
    console.log(result)

    // IMPORTANT: CHANGE = mockdata TO = result WHEN FINISHED
    const {GME, MSFT, DIS, BNTX} = result
    const stocks = [GME, MSFT, DIS, BNTX]
    console.log(stocks)
    
    // Now, to find the highest overall data point
    let allHighValues = stocks.flatMap(stock => stock.values.map(value => parseFloat(value.high)));
    let highestOverall = Math.max(...allHighValues);
    
    // set max size of Y axis
    let suggestedMax = highestOverall * 1.02;
    
    // Initialize an object and array to hold the highest points for each stock
    let highestPointPerStock = {};
    let highestPricePerStock = [];
    let averagePointPerStock = {};
    let averagePricePerStock = [];

    // Log the results
    console.log('All High Values:', allHighValues)
    console.log("Highest Overall Data Point:", highestOverall);
    console.log('Average Price Per Stock:', averagePricePerStock)
    console.log('Highest Price Per Stock:', highestPricePerStock)
    console.log("Highest Points Per Stock:", highestPointPerStock);


    function getHighestStock() {
        // Iterate over each stock to find the highest point
        stocks.forEach(stock => {
            if (stock && stock.values) {
                // Extract the high values for this stock and convert them to numbers
                let highValues = stock.values.map(value => parseFloat(value.high));
                
                // Find the highest value for this stock
                let highestForStock = Math.max(...highValues);
                console.log(`Highest for ${stock.meta.symbol} is ${highestForStock}`)

                // Store the highest value using the stock symbol as the key
                highestPointPerStock[stock.meta.symbol] = highestForStock;
                highestPricePerStock.push(highestForStock);
            }    
        });
        return highestPricePerStock;   
    }

    function getAverageStock() {
        // Iterate over each stock to find the average for each type of stock
        stocks.forEach(stock => {
            if (stock && stock.values) {
                // Extract the high values for this stock and convert them to numbers
                let highValues = stock.values.map(value => parseFloat(value.high));
                // Find the highest value for this stock
                let averagePrice = calculateAverage(highValues);
                console.log(`Average for ${stock.meta.symbol} is ${averagePrice}`)

                // Store the highest value using the stock symbol as the key
                averagePointPerStock[stock.meta.symbol] = averagePrice;
                averagePricePerStock.push(averagePrice);
            }    
        });
        return averagePricePerStock; 
    }

    // create timeChart
    let timeChart = new Chart(timeChartContext, {
        type: 'line',
        data: {
            labels: stocks[0].values.map(value => value.datetime),
            datasets: stocks.map(stock => ({
                label: stock.meta.symbol,
                data: stock.values.map(value => parseFloat(value.high)),
                backgroundColor: getColor(stock.meta.symbol),
                borderColor: getColor(stock.meta.symbol),
            }))
        },
        options: {
            scales: {
                y: {
                    beginAtZero: false, // Consider setting to true if you have values close to 0
                    suggestedMax: suggestedMax, // Use the dynamically calculated max value
                }
            }
        }
    });

    let highestPriceChart = new Chart(highPriceChartContext, {
        type: 'bar',
        data: {
            labels: stocks.map(stock => stock.meta.symbol),
            datasets: [{
                label: 'highest',
                data: getHighestStock(),
                backgroundColor: stocks.map(stock => getColor(stock.meta.symbol)),
                borderColor: stocks.map(stock => getColor(stock.meta.symbol))
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: false, // Consider setting to true if you have values close to 0
                    suggestedMax: suggestedMax, // Use the dynamically calculated max value
                }
            }
        }
    });
    

    var averagePriceChart = new Chart(averagePriceChartContext, {
        type: 'pie',
        data: {
            labels: stocks.map(stock => stock.meta.symbol),
            datasets: [{
                label: 'Average Price',
                data: getAverageStock(),
                backgroundColor: stocks.map(stock => getColor(stock.meta.symbol)),
                borderColor: stocks.map(stock => getColor(stock.meta.symbol)),
            }]
        }
    });
}

function getColor(stock){
    if(stock === "GME"){
        return 'rgba(61, 161, 61, 0.7)'
    }
    if(stock === "MSFT"){
        return 'rgba(209, 4, 25, 0.7)'
    }
    if(stock === "DIS"){
        return 'rgba(18, 4, 209, 0.7)'
    }
    if(stock === "BNTX"){
        return 'rgba(166, 43, 158, 0.7)'
    }
}

function calculateAverage(prices) {
    const total = prices.reduce((acc, price) => acc + price, 0);
    return total / prices.length;
}


main()
