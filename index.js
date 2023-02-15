const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

app.use(express.json());
app.use(cors());
app.use(express.static('build'));

morgan.token('body', (req, res) => {
  const body = JSON.stringify(req.body);
  return body === '{}' ? '' : body;
});

app.use(
  morgan((tokens, req, res) =>
    [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'),
      '-',
      tokens['response-time'](req, res),
      'ms',
      tokens.body(req, res),
    ].join(' ')
  )
);

app.get('/api/persons', (request, response) => {
  Person.find({}).then((notes) => {
    response.json(notes);
  });
});

app.post('/api/persons', (request, response) => {
  const { name, number } = request.body;

  if (!name || !number) {
    return response.status(400).json({ error: 'content missing' });
  }

  const person = new Person({
    name,
    number,
  });

  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

app.get('/api/persons/:id', (request, response) => {
  const { id } = request.params;
  const person = persons.find((person) => person.id === +id);
  person ? response.json(person) : response.status(404).end();
});

app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => console.log(error));
});

app.get('/info', (request, response) => {
  response.send(`<p>Phonebook has info for ${persons.length} people</p>
  <p>${new Date()}</p>`);
});

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body;
  const { id } = request.params;

  Person.findByIdAndUpdate(id, { name, number }, { new: true })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
