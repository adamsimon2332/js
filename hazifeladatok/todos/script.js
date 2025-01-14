fetch("https://jsonplaceholder.typicode.com/todos&quot", {

    method: "GET"
})

.then(response => response.json())
.then(json => {
  let li = `<tr><th>Title</th><th>Completed</th></tr>`;
  json.forEach(todo => {
    li += `<tr>
    <td>${todo.title}</td>
    <td>${todo.completed}</td>
    </tr>`;
  });
  document.getElementById("todos").innerHTML = li;
});


fetch("https://jsonplaceholder.typicode.com/todos&quot", {

  method: "POST",

  body: JSON.stringify({
    title: "foo",
    completed: false,
    userId: 1
  }),

  headers: {
    "Content-type": "application/json; charset=UTF-8"
  }
})

.then(response => response.json())

.then(json => console.log(json));


fetch("https://jsonplaceholder.typicode.com/todos/1&quot", {

  method: "PUT",

  body: JSON.stringify({
    id: 1,
    title: "foo",
    completed: false,
    userId: 1
  }),

  headers: {
    "Content-type": "application/json; charset=UTF-8"
  }
})

.then(response => response.json())

.then(json => console.log(json));


fetch("https://jsonplaceholder.typicode.com/todos/1&quot", {

  method: "PATCH",

  body: JSON.stringify({
    title: "foo",
    completed: false
  }),

  headers: {
    "Content-type": "application/json; charset=UTF-8"
  }
})

.then(response => response.json())

.then(json => console.log(json));


fetch("https://jsonplaceholder.typicode.com/todos/1&quot", {

  method: "DELETE",

  headers: {
    "Content-type": "application/json; charset=UTF-8"
  }
})

.then(response => {
  if (response.ok) {
    return response.json();
  }
  throw new Error('Network response was not ok.');
})

.then(json => console.log(json))
.catch(error => console.error('There was a problem with the fetch operation:', error));