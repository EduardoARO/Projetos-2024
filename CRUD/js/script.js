var clientes = [];
var clienteAlterado = null;

function adicionar() {
    document.getElementById("cpf").disabled = false;
    clienteAlterado = null;
    mostrarModal();
    limparForm();
}

function alterar(cpf) {
    for (let i = 0; i < clientes.length; i++) {
        let cliente = clientes[i];
        if (cliente.cpf == cpf) {
            document.getElementById("nome").value = cliente.nome;
            document.getElementById("cpf").value = cliente.cpf;
            document.getElementById("telefone").value = cliente.telefone;
            document.getElementById("cidade").value = cliente.cidade;
            document.getElementById("genero").value = cliente.genero;
            clienteAlterado = cliente;
        }
    }
    document.getElementById("cpf").disabled = true;
    mostrarModal();
}

function excluir(cpf) {
    if (confirm("Deseja realmente excluir?")) {
        fetch("http://localhost:3000/excluir/" + cpf, {
            headers: {
                "Content-type": "application/json"
            },
            method: "DELETE"
        }).then((response) => {
            recarregarClientes();
            alert("Cliente excluído com sucesso!");
        }).catch((error) => {
            console.log(error);
            alert("Ops...");
        });
    }
}

function mostrarModal() {
    let containerModal = document.getElementById("container-modal");
    containerModal.style.display = "flex";
}

function ocultarModal() {
    let containerModal = document.getElementById("container-modal");
    containerModal.style.display = "none";
}

function cancelar() {
    ocultarModal();
    limparForm();
}

function salvar() {
    let nome = document.getElementById("nome").value;
    let cpf = document.getElementById("cpf").value;
    let telefone = document.getElementById("telefone").value;
    let cidade = document.getElementById("cidade").value;
    let genero = document.getElementById("genero").value;

    if (clienteAlterado == null) {
        let cliente = {
            "nome": nome,
            "cpf": cpf,
            "telefone": telefone,
            "cidade": cidade,
            "genero": genero
        };

        fetch("http://localhost:3000/cadastrar", {
            headers: {
                "Content-type": "application/json"
            },
            method: "POST",
            body: JSON.stringify(cliente)
        }).then(() => {
            clienteAlterado = null;
            recarregarClientes();
            limparForm();
            ocultarModal();
            alert("Cliente cadastrado com sucesso!");
        }).catch(() => {
            alert("Ops...");
        });

    } else {
        clienteAlterado.nome = nome;
        clienteAlterado.cpf = cpf;
        clienteAlterado.telefone = telefone;
        clienteAlterado.cidade = cidade;
        clienteAlterado.genero = genero;
        fetch("http://localhost:3000/alterar", {
            headers: {
                "Content-type": "application/json"
            },
            method: "PUT",
            body: JSON.stringify(clienteAlterado)
        }).then((response) => {
            clienteAlterado = null;
            recarregarClientes();
            limparForm();
            ocultarModal();
            alert("Cliente alterado com sucesso!");
        }).catch((error) => {
            alert("Ops...");
        });
    }
}

function exibirDados(clientesExibir = clientes) {
    clientesExibir.sort((a, b) => a.nome.localeCompare(b.nome));

    let tbody = document.querySelector("#table-customers tbody");
    tbody.innerHTML = "";

    for (let i = 0; i < clientesExibir.length; i++) {
        let linha = `
        <tr>
            <td>${clientesExibir[i].nome}</td>
            <td>${clientesExibir[i].cpf}</td>
            <td>${clientesExibir[i].telefone}</td>
            <td>${clientesExibir[i].cidade}</td>
            <td>${clientesExibir[i].genero}</td>
            <td>
                <button onclick="alterar('${clientesExibir[i].cpf}')">Alterar</button>
                <button onclick="excluir('${clientesExibir[i].cpf}')" class="botao-excluir">Excluir</button>
            </td>
        </tr>`;
        
        let tr = document.createElement("tr");
        tr.innerHTML = linha;

        tbody.appendChild(tr);
    }
}

function limparForm() {
    document.getElementById("nome").value = "";
    document.getElementById("cpf").value = "";
    document.getElementById("telefone").value = "";
    document.getElementById("cidade").value = "";
    document.getElementById("genero").value = "";
}

function recarregarClientes() {
    fetch("http://localhost:3000/listar", {
        headers: {
            "Content-type": "application/json"
        },
        method: "GET"
    }).then((response) => response.json())
    .then((response) => {
        clientes = response;
        exibirDados();
    }).catch((error) => {
        alert("Erro ao listar os clientes");
    });
}

function buscar() {
    let busca = document.getElementById("buscar").value.trim().toLowerCase();

    if (busca === "") {
        recarregarClientes();
    } else {
        fetch(`http://localhost:3000/buscar/${busca}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(clientesFiltrados => {
            exibirDados(clientesFiltrados);
        })
        .catch(error => {
            console.error('Erro ao buscar clientes:', error);
            alert('Erro ao buscar clientes');
        });
    }
}
