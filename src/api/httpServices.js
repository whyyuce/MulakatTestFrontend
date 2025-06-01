// httpService.js

const BASE_URL = 'http://localhost:3000/api/';

export async function getRemarks() {
  const response = await fetch(`${BASE_URL}remarks`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
}
export async function getUsers() {
  const response = await fetch(`${BASE_URL}users`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
}
export async function getProjects() {
  const response = await fetch(`${BASE_URL}project`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
}

export async function addRemark(remarkData) {
  const response = await fetch(`${BASE_URL}remarks/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(remarkData),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
}

export async function updateRemark(id, updates) {
  const response = await fetch(`${BASE_URL}remarks/update/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
}

export async function deleteRemark(id) {
  const response = await fetch(`${BASE_URL}remarks/delete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ _id: id }),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
}
export async function getSpools() {
  const response = await fetch(`${BASE_URL}construction/data?type=spool`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
}
export async function getValves() {
  const response = await fetch(`${BASE_URL}construction/data?type=valf`);
  

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
}
