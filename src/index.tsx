import {renderToString} from "react-dom/server";
import {ToDoType} from "./types";

const server = Bun.serve({
  hostname: 'localhost',
  port: 8080,
  fetch: handler,
});

const todos: ToDoType[] = []

console.log(`Server running at ${server.hostname}:${server.port}`);

async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);

  if (url.pathname === '/' || url.pathname === '') {
    return new Response(Bun.file('src/index.html'), );
  }

  if (url.pathname === '/todos' && req.method === 'GET') {
    return new Response(renderToString(<TodoList todos={todos} />));
  }

  if (url.pathname === '/todos' && req.method === 'POST') {
    const { task } = await req.json();

    if (!task) {
      return new Response('Invalid input', { status: 500 });
    }

    todos.push({
      id: todos.length + 1,
      task: task as string,
    });

    return new Response(renderToString(<TodoList todos={todos} />));
  }

  return new Response('Not found', {
    status: 404,
  });
}

function TodoList(props: { todos: ToDoType[]}) {
  const isTodosEmpty = props.todos.length === 0;
  return (
    <ul>
      {!isTodosEmpty ? props.todos.map(todo => (
        <li key={todo.id}>{todo.task}</li>
      )) : 'No todos found'
      }
    </ul>
  );
}

