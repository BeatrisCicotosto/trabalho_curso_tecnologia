import React, { useState, useEffect } from 'react';

function App() {
  const [cursos, setCursos] = useState([]);
  const [form, setForm] = useState({
    nome: '',
    instituicao: '',
    nivel: '',
    grande_area: '',
    vagas: '',
    ano_inauguracao: '',
    nome_professor: '',
    idioma: ''
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/cursos')
      .then(res => res.json())
      .then(data => setCursos(data))
      .catch(err => console.error('Erro ao buscar cursos:', err));
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (editId !== null) {
      fetch(`http://localhost:3001/cursos/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      .then(res => res.json())
      .then(updated => {
        setCursos(cursos.map(curso => curso.id === editId ? updated : curso));
        resetForm();
      });
    } else {
      fetch('http://localhost:3001/cursos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      .then(res => res.json())
      .then(novoCurso => {
        setCursos([...cursos, novoCurso]);
        resetForm();
      });
    }
  }

  function resetForm() {
    setForm({
      nome: '',
      instituicao: '',
      nivel: '',
      grande_area: '',
      vagas: '',
      ano_inauguracao: '',
      nome_professor: '',
      idioma: ''
    });
    setEditId(null);
  }

  function handleEdit(curso) {
    setEditId(curso.id);
    setForm(curso);
  }

  function handleDelete(id) {
    fetch(`http://localhost:3001/cursos/${id}`, { method: 'DELETE' })
      .then(() => setCursos(cursos.filter(curso => curso.id !== id)));
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: 'auto' }}>
      <h1>Cadastro de Cursos de Tecnologia</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        <input name="nome" value={form.nome} onChange={handleChange} placeholder="Nome" required style={{ flex: '1 1 200px' }} />
        <input name="instituicao" value={form.instituicao} onChange={handleChange} placeholder="Instituição" required style={{ flex: '1 1 200px' }} />
        <input name="nivel" value={form.nivel} onChange={handleChange} placeholder="Nível" required style={{ flex: '1 1 200px' }} />
        <input name="grande_area" value={form.grande_area} onChange={handleChange} placeholder="Grande Área" required style={{ flex: '1 1 200px' }} />
        <input name="vagas" value={form.vagas} onChange={handleChange} placeholder="Vagas" type="number" required style={{ flex: '1 1 100px' }} />
        <input name="ano_inauguracao" value={form.ano_inauguracao} onChange={handleChange} placeholder="Ano de Inauguração" type="number" required style={{ flex: '1 1 100px' }} />
        <input name="nome_professor" value={form.nome_professor} onChange={handleChange} placeholder="Nome do Professor" required style={{ flex: '1 1 200px' }} />
        <input name="idioma" value={form.idioma} onChange={handleChange} placeholder="Idioma" required style={{ flex: '1 1 150px' }} />
        <button
          type="submit"
          style={{
            flex: '1 1 100px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '10px',
            cursor: 'pointer'
          }}>
          {editId !== null ? 'Atualizar' : 'Adicionar'}
        </button>
      </form>

      <table className="responsive-table">
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
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {cursos.map(curso => (
            <tr key={curso.id}>
              <td data-label="Nome">{curso.nome}</td>
              <td data-label="Instituição">{curso.instituicao}</td>
              <td data-label="Nível">{curso.nivel}</td>
              <td data-label="Grande Área">{curso.grande_area}</td>
              <td data-label="Vagas">{curso.vagas}</td>
              <td data-label="Ano">{curso.ano_inauguracao}</td>
              <td data-label="Professor">{curso.nome_professor}</td>
              <td data-label="Idioma">{curso.idioma}</td>
              <td data-label="Ações">
                <button onClick={() => handleEdit(curso)} style={{ marginRight: '5px' }}>Editar</button>
                <button onClick={() => handleDelete(curso.id)} style={{ backgroundColor: '#f44336', color: 'white' }}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* CSS Mobile First para responsividade */}
      <style>{`
        .responsive-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }
        .responsive-table thead {
          display: none;
        }
        .responsive-table tbody tr {
          display: block;
          margin-bottom: 15px;
          border: 1px solid #ccc;
          padding: 10px;
          border-radius: 8px;
        }
        .responsive-table tbody tr td {
          display: flex;
          justify-content: space-between;
          padding: 5px 0;
          border-bottom: 1px solid #eee;
        }
        .responsive-table tbody tr td:last-child {
          border-bottom: none;
        }
        .responsive-table tbody tr td::before {
          content: attr(data-label);
          font-weight: bold;
          flex-basis: 50%;
        }
        @media (min-width: 600px) {
          .responsive-table thead {
            display: table-header-group;
          }
          .responsive-table tbody tr {
            display: table-row;
            border: none;
            margin-bottom: 0;
          }
          .responsive-table tbody tr td {
            display: table-cell;
            border-bottom: 1px solid #ccc;
            padding: 8px;
          }
          .responsive-table tbody tr td::before {
            content: none;
          }
        }
        button {
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}

export default App;
