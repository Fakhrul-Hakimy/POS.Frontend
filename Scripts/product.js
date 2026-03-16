async function getDropdown(){
    var url = `${CATEGORY_API_BASE_URL}/api/category`;

    try{

        const response = await fetch(`${CATEGORY_API_BASE_URL}/api/category`, {
            method: 'GET',
            credentials: 'include'
        });
        var data = await response.json();
        console.log(data);
        if(data==null){
            alert('No categories found. Please add a category first.');
        }else{
            $('.categoryDropdown').append(new Option("Please select Category", ""));
            data.forEach(e => {
                $('.categoryDropdown').append(new Option(e.name, e.id));
            });
        }


    }catch(error){
        console.error('Error fetching categories:', error);
        alert('An error occurred while fetching categories. Please try again.');
    }
}

async function addProduct(){
    var name = $('#productName').val();
    var price = $('#productPrice').val();
    var description = $('#productDescription').val();
    var categoryId = $('.categoryDropdown').val();
    console.log(name, price, description, categoryId);
    var productData = {
        name: name,
        price: parseFloat(price),
        description: description,
        categoryId: parseInt(categoryId)
    };

    try{
        const response = await fetch(`${CATEGORY_API_BASE_URL}/api/product`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(productData)
        });
        if(response.ok){
            alert('Product added successfully!');
            // Clear form fields
            $('#productName').val('');
            $('#productPrice').val('');
            $('#productDescription').val('');
            $('.categoryDropdown').val('');
        }else{
            const errorData = await response.json();
            console.error('Error adding product:', errorData);
            alert('Failed to add product: ' + (errorData.message || 'Unknown error'));
        }
    }catch(error){
        console.error('Error adding product:', error);
        alert('An error occurred while adding the product. Please try again.');
    }



}