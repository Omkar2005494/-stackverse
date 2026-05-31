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
];