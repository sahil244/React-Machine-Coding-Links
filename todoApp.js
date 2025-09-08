Todo App : https://stackblitz.com/edit/react-rhz1fwad?file=src%2FApp.js,src%2Fcomponents%2FTodoItem.js

So I built a simple Todo app using React. I’m storing the todos in component state as an array of objects with { id, text, done }.
I chose useState here since it’s a small app, but in a larger codebase I’d switch to useReducer or even a global store for cleaner state management.
All updates are done immutably — for example, toggle and edit use map, and delete uses filter. That ensures React can re-render correctly. 
Each operation is O(n) because we traverse the list, which is fine for typical usage. 
If I had to scale this to thousands of items, I’d consider using a Map for O(1) lookups combined with an array for order.
I’ve handled edge cases like ignoring empty todos, trimming whitespace, and treating an empty edit as delete. 
The UI is also keyboard-friendly — Enter to add or save, and Escape to cancel — plus I’ve added aria-labels for accessibility.
In terms of improvements, I’d add localStorage persistence with a simple useEffect, filters for active vs completed tasks, 
and break this into smaller components like TodoList and TodoItem for better testability. For very large lists I’d also look at virtualization to keep rendering fast.
Finally, I’d test this with React Testing Library — for example, add a todo and check it appears, 
toggle and check for strike-through, edit and check text updates, and delete to ensure it’s removed.
Overall, this is a straightforward app but it demonstrates handling state immutably, thinking about complexity, accessibility, and how I’d scale the design.”





Testing 


import { render, screen, fireEvent } from "@testing-library/react";
import TodoApp from "./TodoApp";

test("adds a todo", () => {
  render(<TodoApp />);
  const input = screen.getByPlaceholderText(/enter todo/i);
  const addBtn = screen.getByText(/add/i);

  fireEvent.change(input, { target: { value: "Learn React" } });
  fireEvent.click(addBtn);

  expect(screen.getByText("Learn React")).toBeInTheDocument();
});

test("toggles a todo", () => {
  render(<TodoApp />);
  const input = screen.getByPlaceholderText(/enter todo/i);
  fireEvent.change(input, { target: { value: "Task 1" } });
  fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

  const checkbox = screen.getByRole("checkbox");
  fireEvent.click(checkbox);

  expect(checkbox).toBeChecked();
});

test("edits a todo", () => {
  render(<TodoApp />);
  const input = screen.getByPlaceholderText(/enter todo/i);
  fireEvent.change(input, { target: { value: "Old Task" } });
  fireEvent.keyDown(input, { key: "Enter" });

  fireEvent.click(screen.getByText("Edit"));
  const editBox = screen.getByDisplayValue("Old Task");
  fireEvent.change(editBox, { target: { value: "New Task" } });
  fireEvent.keyDown(editBox, { key: "Enter", code: "Enter" });

  expect(screen.getByText("New Task")).toBeInTheDocument();
});

test("deletes a todo", () => {
  render(<TodoApp />);
  const input = screen.getByPlaceholderText(/enter todo/i);
  fireEvent.change(input, { target: { value: "Task to delete" } });
  fireEvent.keyDown(input, { key: "Enter" });

  fireEvent.click(screen.getByText("Del"));

  expect(screen.queryByText("Task to delete")).not.toBeInTheDocument();
});
