import { useState, useEffect } from 'react';
import { BsTrash } from "react-icons/bs";
import axios from 'axios'

import './App.css';

const API = "http://localhost:5000";

function App() {
  const [title, setTitle] = useState("");
  const [todos,setTodos] = useState([]);
  const [loading,setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      const res = await fetch(API + "/todos")
      .then((res) => res.json())
      .then((data) => data)
      .catch((err) => console.log(err));

      setLoading(false);
      setTodos(res);
    };

    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const todo = {
      id: Math.random(),
      title,
      done:false,
    };

    await fetch(API + "/todos", {
      method:"POST",
      body:JSON.stringify(todo),
      headers:{
        "Content-Type": "application/json",
      },
    }); 

    setTodos((prevState) => [...prevState, todo]);
    setTitle("");
  };

  const handleDelete = async (id) => {
    await fetch(API + "/todos/" + id, {
      method:"DELETE"
    });
    setTodos((prevState) => prevState.filter((todo) => todo.id !== id));
  }

  if(loading){
    return <p>carregando...</p>
  }

  return (
    <div className='App'>
      <div className='todo-header'>
        <h1>To do list</h1>
      </div>

      <div className='form-todo'>
        <h2>Digite sua proxima tarefa</h2>
        <form onSubmit={handleSubmit}>

          <div className='form-control'>
            <label htmlFor="title">O que você vai fazer?</label>
            <input type="text" name='title' placeholder='titulo da tarefa' onChange={(e) => setTitle(e.target.value)} value={title || ""} required/>
          </div>
          
          <input type="submit" value="Enviar"/>
        </form>
      </div>

      <div className='list-todo'>
      <h2>Lista de tarefas:</h2>
      {todos.length === 0 && <p>Não há tarefas!</p>}
      {todos.map((todo) => (
        <div className="todo" key={todo.id}>  
        <p>{todo.title}</p>
        <div className='actions'>
          <BsTrash onClick={() => handleDelete(todo.id)} />
        </div>
        </div>
      ))}
      </div>
    </div>
  )
}

export default App
