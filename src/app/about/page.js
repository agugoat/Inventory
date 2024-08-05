"use client";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-100" data-theme="mytheme">
      {/* DaisyUI Navigation Bar */}
      <div className="navbar bg-base-100">
        <div className="navbar-start">
          <div className="dropdown">
            <button tabindex="0" role="button" className="btn btn-ghost lg:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </button>
            <ul tabindex="0" className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
              <li><a>Item 1</a></li>
              <li>
                <a>Parent</a>
                <ul className="p-2">
                  <li><a>Submenu 1</a></li>
                  <li><a>Submenu 2</a></li>
                </ul>
              </li>
              <li><a>Item 3</a></li>
            </ul>
          </div>
          <a className="btn btn-ghost text-xl">Inventory Manager</a>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li><a href="/">Home</a></li>
            <li><a href="/inventory">Inventory</a></li>
            <li><a href="/about">About</a></li>
          </ul>
        </div>
        <div className="navbar-end">
        </div>
      </div>
      
      {/* About Page Content */}
      <div className="mt-6 flex flex-col items-center">
        <h2 className="text-2xl font-bold">About</h2>
        <p className="mt-4 text-center max-w-lg">
          This is a pantry management application using Next.js, TailwindCSS and Firebase. Also uses OpenAI to make recipe suggestions of the items you have in your pantry. Made by Princeobiuto Aguguo
        </p>
      </div>
    </div>
  );
}