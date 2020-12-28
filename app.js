// Variables

const carritoBtn = document.querySelector(".carrito-btn");
const cerrarCarritoBtn = document.querySelector(".cerrar-carrito");
const carritoDOM = document.querySelector(".cart");
const carritoOverlay = document.querySelector(".carrito-overlay");
const carritoItems = document.querySelector(".carrito-items");
const carritoTotal = document.querySelector(".carrito-total");
const carritoContenido = document.querySelector(".carrito-contenido");
const productosDOM = document.querySelector(".centro-productos");


// Carrito
let cart = [];
// Botones
let botonesDOM = [];

// Obtener los productos
class Products{
    async getProductos(){
        try{
            let result = await fetch('productos.json');
            let data = await result.json();
            let products = data.items;
            products = products.map(item =>{
                const {titulo,autor,precio} = item.fields;
                const {id} = item.sys;
                const imagen = item.fields.imagen.fields.file.url;
                return {titulo,autor,precio,id,imagen};
            })
            return products;
        } catch (error) {
            console.log(error);
        }
    let result = await fetch('productos.json')
    }
}
// Mostrar productos
class UI {
    displayProductos(products){
        let result = '';
        products.forEach(product => {
            result += `
            <!-- single product -->
            <article class="product">
                <div class="img-container">
                    <img src=${product.imagen} alt="product" class="product-img"/>
                    <button class="bag-btn" data-id=${product.id}>
                        <i class="fas fa-shopping-cart"></i>
                        agregar al carrito
                    </button>
                </div>
                <h3>${product.titulo}</h3>
                <h5>${product.autor}</h5>
                <h4>$${product.precio}</h4>
            </article>
            <!-- end of single product -->
            `;
        });
        productosDOM.innerHTML = result;
    }

    getBotonesCarrito(){
        const botones = [...document.querySelectorAll(".bag-btn")];
        botonesDOM = botones;
        botones.forEach(boton =>{
            let id = boton.dataset.id;
            let inCart = cart.find(item => item.id === id);
            if(inCart){
                boton.innerText = "Agregado";
                boton.disabled = true;
            }
            
            boton.addEventListener('click',(event)=>{
                event.target.innerText = "Agregado";
                event.target.disabled = true;
                // Obtener producto de productos
                let carritoItem = {...Storage.getProducto(id),cantidad:1};
                // Agregar producto al carrito
                cart = [...cart,carritoItem];
                // Guardar carrito en local storage
                Storage.guardarCarrito(cart)
                // Set valores carrito
                this.setValoresCarrito(cart);
                // Display items carrito
                this.addCarritoItem(carritoItem);
                // Mostrar el carrito
                this.mostrarCarrito();

            })
            
        })
    }

    setValoresCarrito(cart){
        let tempTotal = 0;
        let itemsTotal = 0;
        cart.map(item =>{
            tempTotal += item.precio * item.cantidad;
            itemsTotal += item.cantidad;
        })
        carritoTotal.innerText = parseFloat(tempTotal.toFixed(2));
        carritoItems.innerText = itemsTotal;
    }

    addCarritoItem(item){
        const div = document.createElement('div');
        div.classList.add('item-carrito');
        div.innerHTML = `
        <img src=${item.imagen} alt="producto">
                    <div>
                        <h4>${item.titulo}</h4>
                        <h6>${item.autor}</h6>
                        <h5>$${item.precio}</h5>
                        <span class="remove-item" data-id=${item.id}>quitar</span>
                    </div>
                    <div>
                        <i class="fas fa-chevron-up" data-id=${item.id}></i>
                        <p class="cantidad-item">${item.cantidad}</p>
                        <i class="fas fa-chevron-down" data-id=${item.id}></i>

                    </div>
        `;
    carritoContenido.appendChild(div);
    }

    mostrarCarrito(){
        carritoOverlay.classList.add('transparentBcg');
        carritoDOM.classList.add('mostrarCarrito');
    }

    setupAPP(){
        cart = Storage.getCarrito();
        this.setValoresCarrito(cart);
        this.popularCarrito(cart);
        carritoBtn.addEventListener('click',this.mostrarCarrito);
        cerrarCarritoBtn.addEventListener('click',this.ocultarCarrito);
    }

    popularCarrito(cart){
        cart.forEach(item => this.addCarritoItem(item));
    }

    ocultarCarrito(){
        carritoOverlay.classList.remove("transparentBcg");
        carritoDOM.classList.remove("mostrarCarrito");
    }
}
// Local storage
class Storage{
    static guardarProductos(products){
        localStorage.setItem("products",JSON.stringify(products));
    }
    static getProducto(id){
        let products = JSON.parse(localStorage.getItem('products'));
        return products.find(product => product.id === id);
    }
    static guardarCarrito(cart) {
        localStorage.setItem('cart',JSON.stringify(cart))
    }
    static getCarrito(){
        return localStorage.getItem('cart')?JSON.parse(localStorage.getItem('cart')):[];
    }
}

document.addEventListener("DOMContentLoaded",()=>{
    const ui = new UI();
    const products = new Products();
    // Setup app
    ui.setupAPP();

    // Obtener todos los productos
    products.getProductos().then(products => {
        ui.displayProductos(products);
        Storage.guardarProductos(products);
    }).then(()=>{
        ui.getBotonesCarrito();
    });
});
