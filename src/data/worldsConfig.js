import { 
  Layers, 
  ListOrdered, 
  Link, 
  Network, 
  Share2, 
  Mountain,
  Search,
  ArrowDownUp,
  BrainCircuit,
  Code2,
} from 'lucide-react';

export const worldsConfig = [
  {
    id: 'codestudio',
    title: 'Code-to-3D Studio',
    subtitle: 'Live Code Visualizer',
    icon: Code2,
    color: '#38bdf8', // Cyber Blue
    locked: false,
  },
  {
    id: 'stack',
    title: 'Stack Kingdom',
    subtitle: 'Learn LIFO Stack',
    icon: Layers,
    color: '#22d3ee', // Cyan
    locked: false,
  },
  {
    id: 'queue',
    title: 'Queue City',
    subtitle: 'Master FIFO Queues',
    icon: ListOrdered,
    color: '#a855f7', // Purple
    locked: false,
  },
  {
    id: 'linkedlist',
    title: 'Linked List Forest',
    subtitle: 'Pointers & Memory',
    icon: Link,
    color: '#22c55e', // Green
    locked: false,
  },
  {
    id: 'tree',
    title: 'Tree Nexus',
    subtitle: 'Binary Trees & BST',
    icon: Network,
    color: '#14b8a6', // Teal
    locked: false,
  },
  {
    id: 'graph',
    title: 'Graph Realm',
    subtitle: 'Graphs & Traversals',
    icon: Share2,
    color: '#6366f1', // Indigo
    locked: false,
  },
  {
    id: 'heap',
    title: 'Heap Citadel',
    subtitle: 'Priority Queues',
    icon: Mountain,
    color: '#f97316', // Orange
    locked: false,
  },
  {
    id: 'trie',
    title: 'Trie Temple',
    subtitle: 'Coming Soon',
    icon: Search,
    color: '#94a3b8', // Gray
    locked: true,
  },
  {
    id: 'sorting',
    title: 'Sorting Arena',
    subtitle: 'Coming Soon',
    icon: ArrowDownUp,
    color: '#94a3b8',
    locked: true,
  },
  {
    id: 'dp',
    title: 'DP Lab',
    subtitle: 'Coming Soon',
    icon: BrainCircuit,
    color: '#94a3b8',
    locked: true,
  }
];
