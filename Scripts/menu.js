// Define your categories as an array of strings
const categories = ['Food', 'Drink', 'Dessert', 'Promos'];
const order = []; // This will hold the items added to the order
const food = [{'name': 'Burger' , 'price': 10.99 ,'category' : 'Food'}, {'name': 'Pizza', 'price': 12.99, 'category': 'Food'}, {'name': 'Pasta', 'price': 8.99, 'category': 'Food'}];
const drinks = [{'name': 'Coke', 'price': 2.99, 'category': 'Drink'}, {'name': 'Pepsi', 'price': 2.99, 'category': 'Drink'}, {'name': 'Water', 'price': 1.99, 'category': 'Drink'}];
const desserts = [{'name': 'Ice Cream', 'price': 5.99, 'category': 'Dessert'}, {'name': 'Cake', 'price': 6.99, 'category': 'Dessert'}, {'name': 'Pie', 'price': 7.99, 'category': 'Dessert'}];
const promos = [{'name': 'Happy Hour', 'price': 20, 'category': 'Promos'}, {'name': 'Family Deal', 'price': 32, 'category': 'Promos'}, {'name': 'Student Discount', 'price': 2, 'category': 'Promos'}];



window.onload = () => {
    const menuContainer = document.querySelector('.menu');
    
    // Clear the "1" you had in there for testing
    menuContainer.innerHTML = ''; 

    // Loop through and create buttons for the sidebar
    const list = document.createElement('ul');
    list.style.listStyle = 'none'; // Removes the bullet points
    list.style.padding = '0';

   categories.forEach(item => {
        // 2. Create the list item wrapper
        const li = document.createElement('li');
        li.style.marginBottom = '10px';

        // 3. Create the button
        const btn = document.createElement('button');
        btn.className = 'menu-btn';
        btn.innerText = item;
        btn.addEventListener('click', () => menuChange(item));

        // 4. NEST THEM: Button -> LI -> UL
        li.appendChild(btn);
        list.appendChild(li);
    });

    // 5. Put the whole list into the Sidebar
    menuContainer.appendChild(list);

}

function menuChange(category) {
    const contentContainer = document.querySelector('.item');
    contentContainer.innerHTML = ''; // Clear previous content
    let items = [];
    switch(category) {
        case 'Food':
            items = food;
            break;
        case 'Drink':
            items = drinks;
            break;
        case 'Dessert':
            items = desserts;
            break;
        case 'Promos':
            items = promos;
            break;
    }
    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'content-item';
        div.innerText = `${item.name} - $${item.price.toFixed(2)}`;
        div.addEventListener('click', () => addToOrder(item));
        contentContainer.appendChild(div);
    }
        );
}

function addToOrder(item) {
    // This function will handle adding items to the order
    console.log(`Added ${item.name} to order!`);
    console.log(`Price: $${item.price.toFixed(2)}`);
    console.log(item);
    order.push(item);
    console.log(order);
    updateOrderDisplay();
}

function updateOrderDisplay() {
    let total = 0;
    const orderContainer = document.querySelector('.order');
    orderContainer.innerHTML = ''; // Clear everything

    // 1. Create a scrolling container for items
    const itemList = document.createElement('div');
    itemList.className = 'order-list';

    order.forEach(item => {
        const div = document.createElement('div');
        div.className = 'order-item';
        div.style.color = "white";
        div.style.padding = "5px 0";
        div.style.borderBottom = "1px solid #333";
        div.innerText = `${item.name} - $${item.price.toFixed(2)}`;
        div.addEventListener('click', () => {
            // Remove item from order
            const index = order.indexOf(item);
            if (index > -1) {
                order.splice(index, 1);
                updateOrderDisplay();
            }
        }
        );
        itemList.appendChild(div);
        if (item.category === 'Promos') {
            total -= item.price; // Subtract promo discounts
        }else{
              total += item.price;
        }
      
    });

    // 2. Create the fixed Total box
    const totalDiv = document.createElement('div');
    totalDiv.className = 'total-box';
    totalDiv.innerHTML = `
        <div style="display: flex; justify-content: space-between;">
            <span>Items: ${order.length}</span>
            <span style="color: #ff4d4d; font-weight: bold;">Total: $${total.toFixed(2)}</span>
        </div>
        <button class="btn btn-primary" style="margin-bottom: 30px;">PAY NOW</button>
    `;

    // 3. Append them in order
    orderContainer.appendChild(itemList);
    orderContainer.appendChild(totalDiv);

    // Auto-scroll to the bottom when a new item is added
    itemList.scrollTop = itemList.scrollHeight;
}
