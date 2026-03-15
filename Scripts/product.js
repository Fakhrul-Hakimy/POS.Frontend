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