import React, { useState, useEffect } from 'react';

function App() {
  const [cursos, setCursos] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/cursos')  // URL do backend
      .then(res => res.json())
      .then(data => setCursos(data))
      .catch(err => console.error('Erro ao carregar cursos:', err));
  }, []);

  return (
    <div>
      <h1>Lista de Cursos</h1>
      <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Instituição</th>
            <th>Nível</th>
            <th>Grande Área</th>
            <th>Vagas</th>
            <th>Ano</th>
            <th>Professor</th>
            <th>Idioma</th>
          </tr>
        </thead>
        <tbody>
          {cursos.map((curso, index) => (
            <tr key={index}>
              <td>{curso.nome}</td>
              <td>{curso.instituicao}</td>
              <td>{curso.nivel}</td>
              <td>{curso.grande_area}</td>
              <td>{curso.vagas}</td>
              <td>{curso.ano_inauguracao}</td>
              <td>{curso.nome_professor}</td>
              <td>{curso.idioma}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
