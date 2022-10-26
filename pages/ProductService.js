async function getProducts() {
    const response = await fetch('demo/data/products.json');
    const response_json = await response.json()
    return response_json.data;
}

export { getProducts };
