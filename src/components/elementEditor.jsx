export default function ElementEditor() {

  return (
    <div class="bg-blue-700">
      Class Editor
      <ClassInput/>
    </div>
  )
}


const addedClasses = [];

const classes = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-orange-500",

  "text-red-500",
  "text-blue-500",
  "text-green-500",
  "text-purple-500",

  "p-1",
  "p-2",
  "p-3",
  "p-4",
  "p-6",
  "p-8",

  "px-2",
  "px-4",
  "px-6",

  "py-2",
  "py-4",
  "py-6",

  "rounded",
  "rounded-md",
  "rounded-lg",
  "rounded-xl",

  "flex",
  "grid",
  "items-center",
  "justify-center"
];

function addClass(cls) {
  console.log("adding class");
  addedClasses[addedClasses.length] = cls;  
  console.log(addedClasses);
}

function ClassInput() {
  return (
    <div>
      <input 
      placeholder="add a class..."
      list="class-list"
      id="country-choice" 
      name="country-choice" 
      onKeyDown={(e) => {
        if(e.key === "Enter") {
          addClass(e.target.value.trim())
          e.target.value = ""
        }
      }}
      />
      <datalist id="class-list">
        {classes.map((classes) => (
          <option key={classes} value={classes} />
        ))}
      </datalist>
    </div>
  );
}