export default {
  content: [
    "./src/components/QuickStyle.jsx"
  ],
  theme: { extend: {} },
  plugins: [],
  safelist: [
    'border', 'border-1', 'bg-black',
    'w-96', 'h-96', 'min-h-48',
    'z-10', 'rounded',
    'flex', 'flex-col', 'justify-between',
    'text-lg', 'p-2', 'hover:bg-gray-800', 'text-white'
  ]
}