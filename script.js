const contactForm = document.getElementById('contactForm');
const contactTableBody = document.querySelector('#contactTable tbody');

// Armazenar contatos para verificação de duplicatas
let contacts = [];

// Evento de envio do formulário
contactForm.addEventListener('submit', function(event) {
    event.preventDefault();  // Evita o recarregamento da página

    // Coleta os valores dos campos
    const name = document.getElementById('name').value.trim();
    let phone = document.getElementById('phone').value.trim();

    // Remover todos os caracteres não numéricos do telefone
    phone = phone.replace(/\D/g, '');

    // Verificar se o telefone tem exatamente 11 dígitos
    if (phone.length !== 11) {
        alert('O número de telefone deve conter exatamente 11 dígitos.');
        return;
    }

    // Formatar o número de telefone para (00)000000000
    phone = `(${phone.slice(0, 2)})${phone.slice(2)}`;

    // Verificar duplicatas
    const isDuplicate = contacts.some(contact => 
        contact.name.toLowerCase() === name.toLowerCase() || contact.phone === phone
    );

    if (isDuplicate) {
        alert('Nome ou telefone já existe na lista.');
        return;
    }

    // Adiciona o contato ao array
    const contact = { name, phone };
    contacts.push(contact);

    // Cria uma nova linha e células para a tabela
    const newRow = document.createElement('tr');

    const nameCell = document.createElement('td');
    const phoneCell = document.createElement('td');
    const actionsCell = document.createElement('td');

    // Preenche as células com os valores
    nameCell.textContent = name;
    phoneCell.textContent = phone;

    // Cria botões de ação
    // Botão Copiar
    const copyBtn = document.createElement('button');
    copyBtn.classList.add('action-btn');
    copyBtn.title = 'Copiar Telefone';
    copyBtn.innerHTML = '<img src="./imagens/copy.png" alt="Copiar">';
    copyBtn.addEventListener('click', () => copyPhone(phone));

    // Botão Editar
    const editBtn = document.createElement('button');
    editBtn.classList.add('action-btn');
    editBtn.title = 'Editar Contato';
    editBtn.innerHTML = '<img src="./imagens/edit.png" alt="Editar">';
    editBtn.addEventListener('click', () => editContact(newRow, contact));

    // Botão Remover
    const removeBtn = document.createElement('button');
    removeBtn.classList.add('action-btn');
    removeBtn.title = 'Remover Contato';
    removeBtn.innerHTML = '<img src="./imagens/remove.png" alt="Remover">';
    removeBtn.addEventListener('click', () => removeContact(newRow, contact));

    // Adiciona os botões à célula de ações
    actionsCell.appendChild(copyBtn);
    actionsCell.appendChild(editBtn);
    actionsCell.appendChild(removeBtn);

    // Adiciona as células à linha
    newRow.appendChild(nameCell);
    newRow.appendChild(phoneCell);
    newRow.appendChild(actionsCell);

    // Adiciona a nova linha ao corpo da tabela
    contactTableBody.appendChild(newRow);

    // Limpa os campos do formulário
    contactForm.reset();
});

// Função para copiar o telefone para a área de transferência
function copyPhone(phone) {
    navigator.clipboard.writeText(phone).then(() => {
        alert(`Telefone ${phone} copiado para a área de transferência.`);
    }).catch(err => {
        alert('Falha ao copiar o telefone.');
        console.error('Erro ao copiar:', err);
    });
}

// Função para editar um contato
function editContact(row, contact) {
    const newName = prompt('Editar Nome:', contact.name);
    if (newName === null) return; // Cancelou a edição

    let newPhone = prompt('Editar Telefone:', contact.phone);
    if (newPhone === null) return; // Cancelou a edição

    // Remover caracteres não numéricos do novo número
    newPhone = newPhone.replace(/\D/g, '');

    // Verifica se o novo telefone tem 11 dígitos
    if (newPhone.length !== 11) {
        alert('O número de telefone deve conter exatamente 11 dígitos.');
        return;
    }

    // Formatar o novo telefone para (00)000000000
    newPhone = `(${newPhone.slice(0, 2)})${newPhone.slice(2)}`;

    // Verificar duplicatas, exceto o contato atual
    const isDuplicate = contacts.some(c => 
        (c.name.toLowerCase() === newName.trim().toLowerCase() || c.phone === newPhone) && c !== contact
    );

    if (isDuplicate) {
        alert('Nome ou telefone já existe na lista.');
        return;
    }

    // Atualiza os valores no array de contatos
    contact.name = newName.trim();
    contact.phone = newPhone;

    // Atualiza as células na tabela
    row.children[0].textContent = contact.name;
    row.children[1].textContent = contact.phone;
}

// Função para remover um contato
function removeContact(row, contact) {
    if (confirm(`Tem certeza que deseja remover o contato ${contact.name}?`)) {
        // Remove do array de contatos
        contacts = contacts.filter(c => c !== contact);
        // Remove a linha da tabela
        row.remove();
    }
}
