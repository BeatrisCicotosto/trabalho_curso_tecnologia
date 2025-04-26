import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());
app.use(express.json());

const cursosFilePath = path.resolve('./cursos.json');

let cursos = [];
let nextId = 1;

// Função para carregar cursos no array global
async function carregarCursos() {
  try {
    const data = await fs.readFile(cursosFilePath, 'utf-8');
    cursos = JSON.parse(data);
    // Atualiza nextId para não repetir ids
    nextId = cursos.reduce((maxId, curso) => Math.max(maxId, curso.id), 0) + 1;
  } catch (error) {
    console.error('Erro ao carregar cursos.json:', error);
    cursos = [];
  }
}

// Carrega os cursos assim que o servidor iniciar
carregarCursos();

// Rota GET usa o array global
app.get('/cursos', (req, res) => {
  res.json(cursos);
});

// Atualiza o arquivo JSON quando adicionar, editar ou deletar curso
async function salvarCursos() {
  try {
    await fs.writeFile(cursosFilePath, JSON.stringify(cursos, null, 2), 'utf-8');
  } catch (error) {
    console.error('Erro ao salvar cursos.json:', error);
  }
}

app.post('/cursos', async (req, res) => {
  const novoCurso = { id: nextId++, ...req.body };
  cursos.push(novoCurso);
  await salvarCursos();
  res.status(201).json(novoCurso);
});

app.put('/cursos/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const index = cursos.findIndex(curso => curso.id === id);
  if (index !== -1) {
    cursos[index] = { id, ...req.body };
    await salvarCursos();
    res.json(cursos[index]);
  } else {
    res.status(404).json({ message: 'Curso não encontrado' });
  }
});

app.delete('/cursos/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  cursos = cursos.filter(curso => curso.id !== id);
  await salvarCursos();
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
