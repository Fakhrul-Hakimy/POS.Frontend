const categoryApiHost = window.location.hostname === '127.0.0.1' ? '127.0.0.1' : 'localhost';
const CATEGORY_API_BASE_URL = `http://${categoryApiHost}:5260`;

async function addCategory() {
    $('#addCategoryBtn').prop('disabled', true).text('Adding...');

    const name = $('#categoryName').val().trim();
    const description = $('#categoryDescription').val().trim();

    if (!name) {
        alert('Category name is required.');
        $('#addCategoryBtn').prop('disabled', false).text('Add Category');
        return;
    }
    try {
        const response = await fetch(`${CATEGORY_API_BASE_URL}/api/category`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, description }),
            credentials: 'include'
        });
        if (response) {
            $('.feedbackMsg').addClass('alert alert-success').removeClass('d-none').text('Category added successfully!').show();
            $('#categoryName').val('');
            $('#categoryDescription').val('');
            setTimeout(() => {
                $('.feedbackMsg').fadeOut();
                $('.feedbackMsg').removeClass('alert alert-success').addClass('d-none').text('');
            }, 3000);

        } else {
            $('.feedbackMsg').addClass('alert alert-danger').removeClass('d-none').text('Failed to add category. Please try again.').show();

             setTimeout(() => {
                $('.feedbackMsg').fadeOut();
                $('.feedbackMsg').removeClass('alert alert-danger').addClass('d-none').text('');
            }, 3000);
        }
        


    }    catch (error) {
        console.error('Error adding category:', error);
        alert('An error occurred while adding the category. Please try again.');
    } finally {
        $('#addCategoryBtn').prop('disabled', false).text('Add Category');
    }
}

async function loadData() {
    try {
        var url = `${CATEGORY_API_BASE_URL}/api/category`;

        if ($.fn.DataTable.isDataTable('#categoryTable')) {
            $('#categoryTable').DataTable().ajax.reload(null, false);
            return;
        }

        $('#categoryTable').DataTable({
            ajax: {
                url: url,
                type: 'GET',
                xhrFields: { withCredentials: true },
                dataSrc: ''
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
                    data: null,
                    title: 'Actions',
                    render: function(data, type, row) {
                        return `<button class="btn btn-sm btn-primary edit-btn" data-id="${row.id}" onclick="editMode(${row.id})">Edit</button>
                            <button class="btn btn-sm btn-danger delete-btn" data-id="${row.id}" onclick="deleteCategory(${row.id})">Delete</button>`;
                    }
                }
            ]
        });
    } catch (error) {
        console.error('Error loading categories:', error);
        alert('An error occurred while loading categories. Please try again.');
    }
}

function refreshCategoryTable() {
    if ($.fn.DataTable.isDataTable('#categoryTable')) {
        $('#categoryTable').DataTable().ajax.reload(null, false);
    }
}

async function deleteCategory(id) {
    var response = await fetch(`${CATEGORY_API_BASE_URL}/api/category/${id}`, {
        method: 'DELETE',
        credentials: 'include'
    });
    if (response.ok) {
            $('.feedbackMsg').addClass('alert alert-success').removeClass('d-none').text('Category deleted successfully!').show();
            $('#categoryName').val('');
            $('#categoryDescription').val('');
            refreshCategoryTable();
            setTimeout(() => {
                $('.feedbackMsg').fadeOut();
                $('.feedbackMsg').removeClass('alert alert-success').addClass('d-none').text('');
            }, 3000);

        } else {
            $('.feedbackMsg').addClass('alert alert-danger').removeClass('d-none').text('Failed to delete category. Please try again.').show();

             setTimeout(() => {
                $('.feedbackMsg').fadeOut();
                $('.feedbackMsg').removeClass('alert alert-danger').addClass('d-none').text('');
            }, 3000);
        }

}

async function editMode(id) {
    showForms("editMode");
    $('.editMode').attr('data-id', id)
        try {
        const response = await fetch(`${CATEGORY_API_BASE_URL}/api/category/${id}`, {
            method: 'GET',
            credentials: 'include'
        });
        const category = await response.json();
        $('#categoryName').val(category.name);
        $('#categoryDescription').val(category.description);
    } catch (error) {
        console.error('Error fetching category details:', error);
        alert('An error occurred while fetching category details. Please try again.');
    }

}

async function editCategory() {
    var Id = $('.editMode').attr('data-id');
    console.log(Id);
    const name = $('#categoryName').val().trim();
    const description = $('#categoryDescription').val().trim();

    try{
        const response = await fetch(`${CATEGORY_API_BASE_URL}/api/category/${Id}`, {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, description }),
        });
        if(response){
            $('.feedbackMsg').addClass('alert alert-success').removeClass('d-none').text('Category updated successfully!').show();
            $('#categoryName').val('');
            $('#categoryDescription').val('');
            refreshCategoryTable();
            setTimeout(() => {
                $('.feedbackMsg').fadeOut();
                $('.feedbackMsg').removeClass('alert alert-success').addClass('d-none').text('');
            }, 3000);
        } else {
            $('.feedbackMsg').addClass('alert alert-danger').removeClass('d-none').text('Failed to update category. Please try again.').show();
                setTimeout(() => {
                $('.feedbackMsg').fadeOut();
                $('.feedbackMsg').removeClass('alert alert-danger').addClass('d-none').text('');
            }, 3000);

        }
    }catch (error) {
        console.error('Error updating category:', error);
        alert('An error occurred while updating the category. Please try again.');
    }

}