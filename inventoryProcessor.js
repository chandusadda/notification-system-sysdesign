const { getInventory } = require("./inventoryData");
const inventoryData = getInventory();

/**
 * productMostInStock returns an array of products with max stock.
 */
const productMostInStock = () => {
    return inventoryData.reduce((prevProduct, currentProduct) =>
        (prevProduct.instockCount > currentProduct.instockCount)
            ? prevProduct : currentProduct)
};

/**
 * inventoryClusters returns an array of products with exact categories.
 */
const inventoryClusters = () => {
    return Object.values(
        inventoryData.reduce((localArry, product) => {
            localArry[product.categories] = localArry[product.categories] || [];
            localArry[product.categories].push(product);
            return localArry;
        }, {})
    );
};

/**
 * getClosest returns an array of products that are closest with maxCalories.
 * @param maxCalories A numeric with max calories.
 * @param productsArr An array with products list.
 */
const getClosest = (maxCalories, productsArr) => {
    return productsArr
        .sort(
            (previous, current) =>
                Math.abs(previous.servingCalories - maxCalories) -
                Math.abs(current.servingCalories - maxCalories)
        )
        .slice(0, 2);
};

/**
 * shuffleArray returns an array of products that are randomised/shuffled every time.
 * @param inventoryArr An array with products list.
 */
const shuffleArray = (inventoryArr) => {
    for (var index = inventoryArr.length - 1; index > 0; index--) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        const currentProduct = inventoryArr[index];
        const productToSwap = inventoryArr[swapIndex];
        inventoryArr[index] = productToSwap;
        inventoryArr[swapIndex] = currentProduct;
    }
    return inventoryArr;
};

/**
 * recommendProducts returns an array of products that are equar or lesser(closest) with maxCalories.
 * @param maxCalories A numeric with max calories.
 */
const recommendProducts = (maxCalories) => {
    let newRecomArr = [];
    if (maxCalories > 1500) {
        return [];
    }
    const copyInventoryArr = [...inventoryData]
    const shuffledInventoryArr = shuffleArray(copyInventoryArr);
    for (let i = 0; i < shuffledInventoryArr.length - 1; i++) {
        let current = shuffledInventoryArr[i];
        for (let j = i + 1; j < shuffledInventoryArr.length; j++) {
            let next = shuffledInventoryArr[j];
            if (
                current.servingCalories + next.servingCalories ===
                maxCalories
            ) {
                newRecomArr.push(current, next);
                break;
            }
        }
        if (newRecomArr.length > 0) {
            break;
        }
    }
    // if no data found while exact match, then will get closest calories
    if (newRecomArr.length === 0) {
        newRecomArr = [...getClosest(maxCalories, shuffledInventoryArr)]
    }
    return newRecomArr;
};

exports.productMostInStock = productMostInStock;
exports.inventoryClusters = inventoryClusters;
exports.recommendProducts = recommendProducts;
