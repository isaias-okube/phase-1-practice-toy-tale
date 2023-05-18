let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
     //hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
     }
  });
});
document.addEventListener('DOMContentLoaded', () => {
  const toyCollection = document.getElementById('toy-collection');
  const toyForm = document.querySelector('.add-toy-form');

  function fetchToys() {
    fetch('http://localhost:3000/toys')
      .then(response => response.json())
      .then(toys => {
        toys.forEach(toy => {
          const card = createToyCard(toy);
          toyCollection.appendChild(card);
        });
      });
  }

  function createToyCard(toy) {
    const card = document.createElement('div');
    card.classList.add('card');

    const h2 = document.createElement('h2');
    h2.textContent = toy.name;

    const img = document.createElement('img');
    img.src = toy.image;
    img.classList.add('toy-avatar');

    const p = document.createElement('p');
    p.textContent = `${toy.likes} Likes`;

    const button = document.createElement('button');
    button.classList.add('like-btn');
    button.dataset.id = toy.id;
    button.textContent = 'Like ❤️';
    button.addEventListener('click', () => {
      increaseLikes(toy.id);
    });

    card.appendChild(h2);
    card.appendChild(img);
    card.appendChild(p);
    card.appendChild(button);

    return card;
  }

  toyForm.addEventListener('submit', event => {
    event.preventDefault();
    const nameInput = toyForm.querySelector('input[name="name"]');
    const imageInput = toyForm.querySelector('input[name="image"]');
    const name = nameInput.value;
    const image = imageInput.value;

    createToy(name, image);
    nameInput.value = '';
    imageInput.value = '';
  });

  function createToy(name, image) {
    const toyData = {
      name,
      image,
      likes: 0
    };

    fetch('http://localhost:3000/toys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(toyData)
    })
      .then(response => response.json())
      .then(newToy => {
        const card = createToyCard(newToy);
        toyCollection.appendChild(card);
      });
  }

  function increaseLikes(toyId) {
    const toyCard = document.querySelector(`.card button[data-id="${toyId}"]`);
    const likeCount = toyCard.previousElementSibling;
    const currentLikes = parseInt(likeCount.textContent);
    const newLikes = currentLikes + 1;

    fetch(`http://localhost:3000/toys/${toyId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({ likes: newLikes })
    })
      .then(response => response.json())
      .then(updatedToy => {
        likeCount.textContent = `${updatedToy.likes} Likes`;
      });
  }

  fetchToys();
});