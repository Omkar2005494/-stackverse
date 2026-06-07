export const missions = [
  {
    id: 1,
    text: "Build stack size 3",
    check: (stack) => stack.length === 3,
  },

  {
    id: 2,
    text: "Reach combo x5",
    check: (_, combo) => combo >= 5,
  },

  {
    id: 3,
    text: "Empty the stack",
    check: (stack) => stack.length === 0,
  },

  {
    id: 4,
    text: "Traverse a Linked List",
    check: (_, __, stats) =>
      (stats?.linkedListTraversals || 0) >= 1,
  },

  {
    id: 5,
    text: "Perform 10 Linked List Operations",
    check: (_, __, stats) =>
      (stats?.linkedListOperations || 0) >= 10,
  },

  {
    id: 6,
    text: "Become a Forest Explorer",
    check: (_, __, stats) =>
      (stats?.linkedListOperations || 0) >= 20,
  },
];