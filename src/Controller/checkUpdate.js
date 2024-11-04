import axios from 'axios';
import proxy from './proxy.js';
import parser from './parser.js';
import { createLiElementForPost } from '../view.js';

const checkUpdate = (state) => {
  state.addedRSS.forEach((url) => {
    axios.get(proxy(url))
      .then((response) => response.data.contents)
      .then((content) => {
        const parsedXml = parser(content);
        const oldPostsTitles = state.posts.map((post) => post.title);
        const posts = parsedXml.querySelectorAll('item');
        posts.forEach((post) => {
          const title = post.querySelector('title').textContent;
          const description = post.querySelector('description').textContent;
          const link = post.querySelector('link').textContent;
          const id = state.posts.length + state.feeds.length + 1;
          if (!oldPostsTitles.includes(title)) {
            state.posts.push({
              id,
              title,
              description,
              link,
            });
            createLiElementForPost(id, title, description, link);
          }
        });
      })
      .catch((error) => {
        console.error(`Ошибка чтения RSS ленты: ${error}`);
      });
    return state;
  });
  setTimeout(() => checkUpdate(state), 5000);
};

export default checkUpdate;
