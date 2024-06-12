const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

let clientes = []; // Simulação de banco de dados em memória

app.get('/listar', (req, res) => {
  const clientesOrdenados = clientes.sort((a, b) => a.nome.localeCompare(b.nome));
  res.json(clientesOrdenados);
});


app.post('/cadastrar', (req, res) => {
    const cliente = req.body;
    clientes.push(cliente);
    res.status(201).json(cliente);
});

app.put('/alterar', (req, res) => {
    const clienteAlterado = req.body;
    const index = clientes.findIndex(cliente => cliente.cpf === clienteAlterado.cpf);
    if (index !== -1) {
        clientes[index] = clienteAlterado;
        res.json(clienteAlterado);
    } else {
        res.status(404).json({ error: 'Cliente não encontrado' });
    }
});

app.delete('/excluir/:cpf', (req, res) => {
    const cpf = req.params.cpf;
    const index = clientes.findIndex(cliente => cliente.cpf === cpf);
    if (index !== -1) {
        clientes.splice(index, 1);
        res.status(204).send();
    } else {
        res.status(404).json({ error: 'Cliente não encontrado' });
    }
});

app.get('/buscar/:busca', (req, res) => {
    const busca = req.params.busca.toLowerCase();
    const clientesFiltrados = clientes.filter(cliente =>
        cliente.nome.toLowerCase().includes(busca) ||
        cliente.cpf.includes(busca) ||
        cliente.telefone.includes(busca) ||
        cliente.cidade.toLowerCase().includes(busca) ||
        cliente.genero.toLowerCase().includes(busca)
    );
    res.json(clientesFiltrados);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
