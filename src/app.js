const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];


// MIDDLEWARES
// VALIDATE IF REPOSITORY EXISTS
function validateRepository(request, response, next) {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repo => repo.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.'})
  }

  response.locals.repositoryIndex = repositoryIndex;
  console.log('Validate OK');
  return next();
};


app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.status(200).json(repository);

});

app.put("/repositories/:id", validateRepository, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } =  request.body;
  const index = response.locals.repositoryIndex;

    const repository = {
      id,
      title,
      url,
      techs,
      likes: 0,
    };

    repositories[index] = repository;

    return response.json(repository);
  
});

app.delete("/repositories/:id", validateRepository, (request, response) => {

    const index = response.locals.repositoryIndex;
    
    repositories.splice(index, 1);
    return response.status(204).send();

});

app.post("/repositories/:id/like", validateRepository, (request, response) => {

  const index = response.locals.repositoryIndex;
  const like = repositories[index].likes;
  
  repositories[index].likes = like + 1;

  return response.json(repositories[index]);

});

module.exports = app;
