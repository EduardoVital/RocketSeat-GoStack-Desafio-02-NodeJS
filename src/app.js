const express = require("express");
const { uuid } = require('uuidv4')
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  const { title, url, techs } = request.query
  // const { title } = request.query

  const results = title
    ? repositories.filter( repo => repo.title.includes( title ) )
    : repositories

  return response.json(results)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = { 
    id: uuid(), 
    url, 
    title, 
    techs, 
    likes: 0 
  }

  repositories.push(repository)

  return response.json(repository)
});

// o que vier depois do /: é a variavel, agora no caso é o id /repositories/:id --> id é a variavel
app.put("/repositories/:id", (request, response) => {
  const { id } = request.params
  const { title, url, techs } = request.body

  const repositoryIndex = repositories.findIndex( repo => repo.id === id )

  if ( repositoryIndex  < 0 ) {
    return response.status(400).json({ error: 'Repository does not exist.' }) 
  }
  
  const repository = {
    id,
    url,
    title,
    techs,
    likes: 0,
  }

  repositories[ repositoryIndex ] = repository

  return response.json( repository )
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params

  const repositoryIndex = repositories.findIndex( repo => repo.id === id )

  if ( repositoryIndex  >= 0 ) {
    repositories.splice(repositoryIndex, 1)
  } else {
    return response.status(400).json({ error: 'Repository does not exist.' }) 
  }

  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params

  const repositoryIndex = repositories.findIndex( repo => repo.id === id )

  if ( repositoryIndex  < 0 ) {
    return response.status(400).json({ error: 'Repository does not exist.' }) 
  }

  repositories[ repositoryIndex ].likes++

  return response.json( repositories[ repositoryIndex ] )

});

// app.listen(3334, () => {
//   console.log('Started!')
// })

module.exports = app;
