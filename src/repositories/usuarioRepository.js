const usuarios = [];
let nextId = 1;

function criar({ nome, email, senha }) {
  const agora = new Date().toISOString();
  const row = {
    id: nextId++,
    nome,
    email: email.trim().toLowerCase(),
    senha,
    created_at: agora,
  };
  usuarios.push(row);
  return row;
}

function buscarPorEmail(email) {
  const e = email.trim().toLowerCase();
  return usuarios.find((u) => u.email === e) ?? null;
}

function buscarPorId(id) {
  return usuarios.find((u) => u.id === id) ?? null;
}

function listarTodos() {
  return [...usuarios];
}

function atualizar(id, campos) {
  const row = buscarPorId(id);
  if (!row) return null;
  if (campos.nome !== undefined) row.nome = campos.nome;
  if (campos.email !== undefined) row.email = campos.email;
  if (campos.senha !== undefined) row.senha = campos.senha;
  return row;
}

function remover(id) {
  const idx = usuarios.findIndex((u) => u.id === id);
  if (idx === -1) return false;
  usuarios.splice(idx, 1);
  return true;
}

module.exports = {
  criar,
  buscarPorEmail,
  buscarPorId,
  listarTodos,
  atualizar,
  remover,
};
