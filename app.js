const { createClient } = supabase

let supabaseUrl = 'https://xuyftnjfzjriqjorjnuv.supabase.co'
let supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1eWZ0bmpmempyaXFqb3JqbnV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0MzExNjEsImV4cCI6MjA4NzAwNzE2MX0.2XZ7jTmPuMBgqJqaxLWEYIfNwg9XYU609oKGw-Jv4q4'
// Create a single supabase client for interacting with your database
const supabaseClient = createClient(supabaseUrl, supabaseKey)


let userInput = document.querySelector('#todoInput')
let addBtn = document.querySelector('#add-btn')
console.log(addBtn)
let todoList = document.querySelector('#todoList')

addBtn.addEventListener('click', addTodo)
async function addTodo() {

    let inputValue = userInput.value
    if (inputValue.trim() === '') return;
    const { error } = await supabaseClient
        .from('todo')
        .insert({
            list: inputValue,
            isCompleted: false
        })
    userInput.value = ''
    console.log(error)
    fetchTasks()


}

document.body.addEventListener('click', async (el) => {
    console.log(el)
    if (el.target.id === 'checkBtn') {
        console.log(el.target.id)
        const li = el.target.parentElement.parentElement;
        let checkState = li.classList.contains('completed')

        console.log(li.classList.contains('completed'));

        const { error } = await supabaseClient
            .from('todo')
            .update({ isCompleted: checkState })
            .eq('id', li.id)
        console.log(error)

        fetchTasks()
    }

    if (el.target.id === 'editBtn') {
        console.log(el.target.id)
        const li = el.target.parentElement.parentElement;
        const span = li.querySelector('span');

        const updatedText = prompt('Edit your task:', span.innerText);

        if (updatedText !== null && updatedText.trim() !== '') {
            span.innerText = updatedText;
            const { error } = await supabaseClient
                .from('todo')
                .update({ list: updatedText })
                .eq('id', li.id)
            console.log(error);
            fetchTasks()
        }
    }

    if (el.target.id === 'deleteBtn') {
        console.log(el.target.id)
        const response = await supabaseClient
            .from('todo')
            .delete()
            .eq('id', el.target.parentElement.parentElement.id)
        fetchTasks()
    }


})


async function fetchTasks() {

    const { data, error } = await supabaseClient
        .from('todo')
        .select()
    let tasks = data || []
    console.log(tasks);
    todoList.innerHTML = ''
    tasks.forEach(el => {
        const li = document.createElement('li');
        el.isCompleted ? li.classList.add('completed') : li.classList.remove('completed')
        li.id = el.id
        li.innerHTML = `
        <span >${el.list}</span>
        <div class="actions">
          <button id='checkBtn'>check</button>
          <button id='editBtn'>Edit</button>
          <button id='deleteBtn'>X</button>
        </div>`
        todoList.appendChild(li)
    });
}
