//crudcrud info
const CRUD_ENDPOINT_ID = "/133b95e28ebb497489ef2eff102bab09/";
const CRUD_ENDPOINT_URL = "https://crudcrud.com/api";

//open library api
const OPEN_LIBRARY_WORKS = "https://openlibrary.org/authors/OL23919A/works.json?limit=1"
const OPEN_LIBRARY_AUTHOR = "https://openlibrary.org/search/authors.json?q=";
const OPEN_LIBRARY_TITLE = "http://openlibrary.org/search.json?title="
//loged in user variable

let currentUserID = 'user2';
let myJson;
let currentBookList;
//search open library books for specific author

async function searchAuthor()
{
    let authorName = document.getElementById('searchBook').value
    //fix authorName string (i.e spaces = %20)
    if(authorName.includes(' '))
    {
        authorName = authorName.replace(/ /g, '%20');
        
    }
    console.log(authorName);


    const response = await fetch(OPEN_LIBRARY_AUTHOR+authorName);
    const myJson = await response.json(); //extract JSON from the http response
    // do something with myJson
   displayBookResults(myJson, '');


   

}
async function userAction(apiURL) {
    const response = await fetch(apiURL);
    myJson = await response.json(); //extract JSON from the http response
    // do something with myJson
    console.log(myJson);
    return myJson;
  }
//search open library books for specifc book title
async function searchTitle()
{
    let bookName = document.getElementById('searchBook').value
    //fix authorName string (i.e spaces = %20)
    if(bookName.includes(' '))
    {
        bookName = bookName.replace(/ /g, '+');
        
    }
    console.log(bookName);
    let myJson = await userAction(OPEN_LIBRARY_TITLE+bookName);
   displayBookResults(myJson, '');
}

//add book to user library
//CREATE REQUEST
function addToMyLibrary(jsonResponse)
{


  let bookValue = this.value;
  bookListItem =
  {
      title: myJson.docs[bookValue].title,
      author: myJson.docs[bookValue].author_name[0]
  }
  fetch((CRUD_ENDPOINT_URL+CRUD_ENDPOINT_ID+ currentUserID), {
    method: 'POST', // or 'PUT'
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bookListItem),
  })
  .then(response => response.json())
  .then(data => {
    console.log('Success:', data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}

function removeFromMyLibrary()
{
  //get current book list
  let bookValue = this.value;
  delete currentBookList[bookValue];

  currentBookList = currentBookList.filter(function(x) { return x !== null });
  console.log(currentBookList);

  fetch(CRUD_ENDPOINT_URL+CRUD_ENDPOINT_ID+ currentUserID, {
    method: "DELETE",
    mode: "no-cors"
  })
  .then(response => response.json())
  .then(data =>console.log(data));
 

  
  // fetch((CRUD_ENDPOINT_URL+CRUD_ENDPOINT_ID+ currentUserID), {
  //   method: 'POST', // or 'PUT'
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify(currentBookList),
  // })
  // .then(response => response.json())
  // .then(data => {
  //   console.log('Success:', data);
  // })
  // .catch((error) => {
  //   console.error('Error:', error);
  // });

}

//create user
function createUser(email, name)
{
    //create empty book list for them. 
}

async function displayUserBookList()
{
    await fetch(CRUD_ENDPOINT_URL+CRUD_ENDPOINT_ID+ currentUserID)
    .then(response => response.json())
    .then(data => {
    console.log('Success:', data);
     currentBookList = data;
    displayBookResults(data, currentUserID);
    })

   
}

function displayBookResults(jsonResponse, currentUserID)
{
    //console.log(jsonResponse);

    //list only first 10 for example purposes
    //console.log(jsonResponse.numFound);
    clearListContainer();
    let length;
    if(jsonResponse.hasOwnProperty('numFound')){
      length = jsonResponse.numFound;
    }
    else 
    {
      length = Object.keys(jsonResponse).length;
    }
    console.log(length);
    for(let x = 0; (x < length && x < 10); x++)
    {
      console.log("READING");
        let titleContent;
        let authorContent;
        let myBookItem;


        if(currentUserID != '')
        {
          let titleContent = jsonResponse[x].title;
          let authorContent = jsonResponse[x].author;
          myBookItem = ` <h4> ${titleContent} - <span>${authorContent} </span></h4><button class="removeListBtn" value="${x}">Remove from My List</button>`;
          
        }
        else
        {
          titleContent = jsonResponse.docs[x].title;
          authorContent = jsonResponse.docs[x].author_name[0];
          myBookItem = ` <h4> ${titleContent} - <span>${authorContent} </span></h4><button class="addListBtn" value="${x}">Add To My List</button>`;
         
         
        }

        let bookContainer = document.getElementById("bookListContainer");
        let bookItemContainer = document.createElement('div');
        bookItemContainer.classList.add("bookItem")
        bookItemContainer.innerHTML = myBookItem;
        bookContainer.append(bookItemContainer);

     
    }

    var removeList = document.getElementsByClassName('removeListBtn');
    for(let x = 0; x < removeList.length; x++)
    {
      removeList[x].addEventListener('click', removeFromMyLibrary);

    }

    var addList = document.getElementsByClassName('addListBtn');
    //event listener
    for(let x = 0; x <addList.length; x++)
    {
      addList[x].addEventListener('click', addToMyLibrary);
      console.log('test');
    }
}

function clearListContainer()
{
  let bookContainer = document.getElementById("bookListContainer");
  bookContainer.innerHTML = "";
}