import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';  // usar fs/promises para leitura async
import path from 'path';
const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());
app.use(express.json());

// Define o caminho do arquivo cursos.json
const cursosFilePath = path.resolve('./src/cursos.json');

// Variável global para armazenar os cursos
let cursos = [];
let nextId = 1;

// Rota para pegar a lista de cursos
app.get('/cursos', async (req, res) => {
  try {
    const data = await fs.readFile(cursosFilePath, 'utf-8'); // lê o JSON
    const cursos = JSON.parse(data); // parse para objeto JS
    res.json(cursos); // envia para frontend
  } catch (error) {
    console.error('Erro ao ler cursos.json:', error);
    res.status(500).json({ error: 'Erro ao carregar cursos' });
  }
});

// Rota para adicionar um novo curso
app.post('/cursos', (req, res) => {
  const novoCurso = { id: nextId++, ...req.body };
  cursos.push(novoCurso);
  res.status(201).json(novoCurso);
});

// Rota para atualizar um curso existente
app.put('/cursos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = cursos.findIndex(curso => curso.id === id);

  if (index !== -1) {
    cursos[index] = { id, ...req.body };
    res.json(cursos[index]);
  } else {
    res.status(404).json({ message: 'Curso não encontrado' });
  }
});

// Rota para deletar um curso
app.delete('/cursos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  cursos = cursos.filter(curso => curso.id !== id);
  res.status(204).send();
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
