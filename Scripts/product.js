const ApiHost = window.location.hostname === '127.0.0.1' ? '127.0.0.1' : 'localhost';
const PRODUCT_API_BASE_URL = `http://${ApiHost}:5260`;


async function getDropdown(){
    var url = `${PRODUCT_API_BASE_URL}/api/category`;

    try{

        const response = await fetch(`${PRODUCT_API_BASE_URL}/api/category`, {
            method: 'GET',
            credentials: 'include'
        });
        var data = await response.json();
        console.log(data);
        if(data==null){
            alert('No categories found. Please add a category first.');
        }else{
            $('.addcategoryDropdown').empty();
            $('.editcategoryDropdown').empty();
            $('.addcategoryDropdown').append(new Option("Please select Category", ""));
            $('.editcategoryDropdown').append(new Option("Please select Category", ""));
            data.forEach(e => {
                $('.addcategoryDropdown').append(new Option(e.name, e.id));
                $('.editcategoryDropdown').append(new Option(e.name, e.id));
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
    var categoryId = $('.addcategoryDropdown').val();
    var parsedCategoryId = Number(categoryId);

    if (!Number.isInteger(parsedCategoryId)) {
        alert('Please select a valid category.');
        return;
    }

    console.log(name, price, description, categoryId);
    var productData = {
        name: name,
        price: parseFloat(price),
        description: description,
        categoryId: parsedCategoryId
    };

    try{
        const response = await fetch(`${PRODUCT_API_BASE_URL}/api/product`, {
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
            $('.addcategoryDropdown').val('');
        }else{
            const errorText = await response.text();
            let errorMessage = 'Unknown error';

            try {
                const errorData = JSON.parse(errorText);
                errorMessage = errorData.message || errorData.title || errorText || errorMessage;
                console.error('Error adding product:', errorData);
            } catch {
                errorMessage = errorText || errorMessage;
                console.error('Error adding product:', errorText);
            }

            alert('Failed to add product: ' + errorMessage);
        }
    }catch(error){
        console.error('Error adding product:', error);
        alert('An error occurred while adding the product. Please try again.');
    }



}


async function loadProductData() {
    try {
        var url = `${PRODUCT_API_BASE_URL}/api/product`;

        if ($.fn.DataTable.isDataTable('#ProductTable')) {
            $('#ProductTable').DataTable().ajax.reload(null, false);
            return;
        }

        $('#ProductTable').DataTable({
            ajax: {
                url: url,
                type: 'GET',
                xhrFields: { withCredentials: true },
                dataSrc: ''
            },
            success: function(data) {
                console.log('Products loaded:', data);
            },
            error: function(xhr, status, error) {
                console.error('Error loading products:', error);
                alert('An error occurred while loading products. Please try again.');
            },
            columns: [
                {
                    data: 'name',
                    title: 'Name'
                },
                {
                    data: 'description',
                    title: 'Description'
                },
                {
                    data: 'price',
                    title: 'Price'
                },
                {
                    data: 'categoryName',
                    title: 'Category'
                },
                
                {
                    data: null,
                    title: 'Actions',
                    render: function(data, type, row) {
                        return `<button class="btn btn-sm btn-primary edit-btn" data-id="${row.id}" onclick="editModeProduct(${row.id})">Edit</button>
                            <button class="btn btn-sm btn-danger delete-btn" data-id="${row.id}" onclick="deleteProduct(${row.id})">Delete</button>`;
                    }
                }
            ]
        });
    } catch (error) {
        console.error('Error loading products:', error);
        alert('An error occurred while loading products. Please try again.');
    }
}

function refreshProductTable() {
    if ($.fn.DataTable.isDataTable('#ProductTable')) {
        $('#ProductTable').DataTable().ajax.reload(null, false);
    }
}

async function deleteProduct(id) {
    var response = await fetch(`${PRODUCT_API_BASE_URL}/api/product/${id}`, {
        method: 'DELETE',
        credentials: 'include'
    });
    if (response.ok) {
            $('.feedbackMsg').addClass('alert alert-success').removeClass('d-none').text('Product deleted successfully!').show();
            $('#productName').val('');
            $('#productPrice').val('');
            $('#productDescription').val('');
            refreshProductTable();
            setTimeout(() => {
                $('.feedbackMsg').fadeOut();
                $('.feedbackMsg').removeClass('alert alert-success').addClass('d-none').text('');
            }, 3000);

        } else {
            $('.feedbackMsg').addClass('alert alert-danger').removeClass('d-none').text('Failed to delete product. Please try again.').show();

             setTimeout(() => {
                $('.feedbackMsg').fadeOut();
                $('.feedbackMsg').removeClass('alert alert-danger').addClass('d-none').text('');
            }, 3000);
        }

}

async function editModeProduct(id) {
    showForms("editMode");
    $('.editMode').attr('data-id', id)
        try {
            await getDropdown();

        const response = await fetch(`${PRODUCT_API_BASE_URL}/api/product/${id}`, {
            method: 'GET',
            credentials: 'include'
        });
        const product = await response.json();
        $('#EditproductName').val(product.name);
        $('#EditproductPrice').val(product.price);
        $('#EditproductDescription').val(product.description);

            const categoryId = product.categoryId ?? product.CategoryId ?? product.categoryID;
            if (categoryId != null) {
                $('.editcategoryDropdown').val(String(categoryId));
            }
    } catch (error) {
        console.error('Error fetching product details:', error);
        alert('An error occurred while fetching product details. Please try again.');
    }

}