export const elements = {
  form: document.querySelector('.rss-form'),
  input: document.querySelector('#input-RSS'),
  feedback: document.querySelector('.feedback'),
  posts: document.querySelector('.posts'),
  feeds: document.querySelector('.feeds'),
};

export const renderFeedback = (message, isSuccess) => {
  if (isSuccess) {
    elements.feedback.classList.add('text-success');
    elements.feedback.classList.remove('text-danger');
    elements.input.classList.remove('is-invalid');
    elements.input.value = '';
  } else {
    elements.feedback.classList.remove('text-success');
    elements.feedback.classList.add('text-danger');
    elements.input.classList.add('is-invalid');
  }
  elements.feedback.textContent = message;
};

export const createLiElementForPost = (id, title, link) => {
  const ulElement = document.querySelector('#postsList');

  const liElement = document.createElement('li');
  liElement.classList.add(
    'list-group-item',
    'd-flex',
    'justify-content-between',
    'align-items-start',
    'border-0',
    'border-end-0',
  );

  const liLink = document.createElement('a');
  liLink.setAttribute('href', link);
  liLink.classList.add('fw-bold');
  liLink.setAttribute('data-id', id);
  liLink.setAttribute('target', '_blank');
  liLink.setAttribute('rel', 'noopener noreferrer');
  liLink.onclick = function clicked() {
    liLink.classList.add('fw-normal', 'link-secondary');
    liLink.classList.remove('fw-bold');
  };
  liLink.textContent = title;

  const liButton = document.createElement('button');
  liButton.setAttribute('type', 'button');
  liButton.classList.add('btn', 'btn-outline-primary', 'btn-sm');
  liButton.setAttribute('data-id', id);
  liButton.setAttribute('data-bs-toggle', 'modal');
  liButton.setAttribute('data-bs-target', '#modal');
  liButton.textContent = 'Просмотр';

  liElement.appendChild(liLink);
  liElement.appendChild(liButton);
  ulElement.prepend(liElement);
};

export const createLiElementForFeed = (id, title, description) => {
  const ulElement = document.querySelector('#feedsList');

  const liElement = document.createElement('li');
  liElement.classList.add('list-group-item', 'border-0', 'border-end-0');
  liElement.setAttribute('id', id);

  const liTitle = document.createElement('h3');
  liTitle.classList.add('h6', 'm-0');
  liTitle.textContent = title;

  const liDescription = document.createElement('p');
  liDescription.classList.add('m-0', 'small', 'text-black-50');
  liDescription.textContent = description;

  liElement.appendChild(liTitle);
  liElement.appendChild(liDescription);
  ulElement.prepend(liElement);
};

export const createFeed = (parsedXml, state) => {
  const feedTitle = parsedXml.querySelector('title').textContent;
  const feedDescription = parsedXml.querySelector('description').textContent;
  const feedId = state.feeds.length + 1;
  createLiElementForFeed(feedId, feedTitle, feedDescription);
  state.feeds.push({ id: feedId, title: feedTitle, description: feedDescription });
};

export const createPosts = (parsedXml, state) => {
  const items = [...parsedXml.querySelectorAll('item')];
  items.reverse().map((elem) => {
    const postId = state.posts.length + state.feeds.length + 1;
    const postTitle = elem.querySelector('title').textContent;
    const postDescription = elem.querySelector('description').textContent;
    const postLink = elem.querySelector('link').textContent;
    state.posts.push({
      id: postId,
      title: postTitle,
      description: postDescription,
      link: postLink,
    });
    return createLiElementForPost(postId, postTitle, postLink);
  });
};

export const createFeedsFirstTime = (parsedXml, state) => {
  const divCard = document.createElement('div');
  divCard.classList.add('card', 'border-0');

  const divCardBody = document.createElement('div');
  divCardBody.classList.add('card-body');

  const cardTitle = document.createElement('h2');
  cardTitle.classList.add('card-title', 'h4');
  cardTitle.textContent = 'Фиды';

  divCardBody.appendChild(cardTitle);
  divCard.appendChild(divCardBody);

  const listGroup = document.createElement('ul');
  listGroup.classList.add('list-group', 'border-0', 'rounded-0');
  listGroup.setAttribute('id', 'feedsList');

  divCard.appendChild(listGroup);
  elements.feeds.appendChild(divCard);

  createFeed(parsedXml, state);
};

export const createPostsFirstTime = (parsedXml, state) => {
  const divCard = document.createElement('div');
  divCard.classList.add('card', 'border-0');

  const divCardBody = document.createElement('div');
  divCardBody.classList.add('card-body');

  const cardTitle = document.createElement('h2');
  cardTitle.classList.add('card-title', 'h4');
  cardTitle.textContent = 'Посты';

  divCardBody.appendChild(cardTitle);
  divCard.appendChild(divCardBody);

  const listGroup = document.createElement('ul');
  listGroup.classList.add('list-group', 'border-0', 'rounded-0');
  listGroup.setAttribute('id', 'postsList');

  divCard.appendChild(listGroup);
  elements.posts.appendChild(divCard);

  createPosts(parsedXml, state);
};
