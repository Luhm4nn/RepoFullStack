import { Button } from "flowbite-react";


function MainPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <h1 className="bg-red-500">Main Page</h1>

      <p className="text-gray-100">Welcome to the main page!</p>
      <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-80 focus:ring-purple-200 dark:focus:ring-purple-800">Click Me</Button>
    </div>
  );
}

export default MainPage;