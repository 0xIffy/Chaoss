import React from 'react';
import { Tooltip } from '@mui/material';

class Move extends React.Component {
  render() { 
    const { gamePos, move, onClick, onBoardUpdate} = this.props;
    const { address, pos, san} = move;


    return (
      <div className="text-accent text-sm">
        <Tooltip title={"Played by: " + address} placement="right" arrow><span>
          <button 
            className="font-bold font-mono px-2 py-0.5 rounded hover:bg-secondary  disabled:bg-secondary  disabled:opacity-70"
            disabled={pos === gamePos}
            onClick={() => { onClick(); onBoardUpdate(pos) }}
          >
            {san}
          </button>
        </span></Tooltip>
      </div>

    );
      //  <Tooltip title={"Played by: " + address} placement="right" arrow>
      //   <span>
      //     <Button 
      //       style={{textTransform: 'none', fontWeight: 'bold'}}
      //       color="secondary" 
      //       size="small" 
      //       variant={pos === gamePos ? 'contained' : 'text'}
      //       fontSize="small"
      //       disabled={pos === gamePos}
      //       onClick={() => { onClick(); onBoardUpdate(pos) }}>
      //       {san}
      //     </Button>
      //   </span>
      // </Tooltip> 
    // );
  }
}
 
export default Move;