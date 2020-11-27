//HANDLE THE DELETE REQUEST:

/* $(document).ready(() => {
    $('#delete-article').on('click', (e) => {
        $target = $(e.target);
        const id = $target.attr('data-id');
        $.ajax({
            type: 'DELETE',
            url: '/articles/'+id,
            success: (response) => {
                alert('Deleting article');
                window.location.href= '/';
            },
            error: (err) => {
                console.log(err);
            }
        });
    });
}); */

/* Jquery code but with vanilla javascript, does the same job but the problem is, it will also run when the delete button is not loaded, meaning if a person views the article of another author, the document.getElementById will still search for something with the id of delete-article, and since it will not find that button, it will return a typeError, because it will be null. That is why I wrapped it around an if statement, on the condition that it does not return null. Although simple and practical, it seems a bit naive as a practice.
That is the problem that makes jquery more efficient here:
console.log($('#delete-article'));
console.log(document.getElementById('delete-article'));
These two return different things: if the element with the id delete-article does not exist in the page, the first line returns an empty object, while the second one returns null. That's why if we try to add an event listener on a non existent element, a type error will be caught on the null value. */

function deleteArticle(event) {
    const id = event.target.getAttribute('data-id');

    let xhr = new XMLHttpRequest();

    xhr.open('DELETE', '/articles/'+id, true);

    xhr.onload = (response) => {
        alert('Deleting article');
        window.location.href = '/';
    };

    xhr.onerror = (err) => {
        console.log(err);
    };

    xhr.send();
}

if(document.getElementById('delete-article')){
    document.getElementById('delete-article').addEventListener('click', deleteArticle);
}

