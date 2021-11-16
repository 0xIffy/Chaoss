import React from 'react';

class Navbar extends React.Component {

  render() { 
    return (
      <nav>
        <div className="bg-gray h-12 flex items-center">
          <div className="flex justify-left ml-3">
            <p className="text-accent text-3xl font-bold hover:text-accent2">Chaoss</p>
          </div>
        </div>
      </nav>
    );
  }
}
 
export default Navbar;