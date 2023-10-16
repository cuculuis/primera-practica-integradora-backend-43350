const socket = io()

const divProducts = document.getElementById("productsMain");
const tableProducts = document.getElementById("bodyProducts");

function updateProducts(table, productsArray) {
    document.getElementById("bodyProducts").innerHTML = "";
    productsArray.forEach((element) => {
        let row = table.insertRow();
        row.insertCell().innerHTML = element.id;
        row.insertCell().innerHTML = element.title;
        row.insertCell().innerHTML = element.description;
        row.insertCell().innerHTML = element.code;
        row.insertCell().innerHTML = element.price;
        row.insertCell().innerHTML = element.status;
        row.insertCell().innerHTML = element.stock;
        row.insertCell().innerHTML = `<img src="${element.thumbnail}" alt="${element.title}" width="60px">`;
        row.insertCell().innerHTML = element.category;
    });
}

function addProduct() {
        const product = {
            title: document.getElementById("title").value,
            description: document.getElementById("description").value,
            code: document.getElementById("code").value,
            price: document.getElementById("price").value,
            status: document.getElementById("status").value,
            stock: document.getElementById("stock").value,
            thumbnail: document.getElementById("thumbnail").value,
            category: document.getElementById("category").value,
    }


    socket.emit("newProduct", product)
    return;
    }

    socket.on("products", (data) => {
        data.length > 0
        ? updateProducts(tableProducts, data)
        : (document.getElementById("productsMain").innerHTML = `<h3 class="container alert alert-danger">THERE ARE NO PRODUCTS</h3>`);
    });