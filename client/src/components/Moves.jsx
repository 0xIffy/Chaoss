import React from 'react';
import Move from './Move';
// import { DataGrid } from '@mui/x-data-grid'
// import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

class Moves extends React.Component {
  // state = {
  //   columns: this.cols,
  //   rows: []
  // }

  columns = [
    { field: 'num', headerName: null, width: 50 },
    { field: 'white', headerName: null, width: 50},
    { field: 'black', headerName: null, width: 50},
  ]

  getRows = () => {
    const { moves, gamePos, onBoardUpdate, onClick, } = this.props;
    let rows = [];
    let len = Math.ceil(moves.length / 2);

    for(let i = 0; i < len; i++){
      rows.push({
        id: i,
        num: <span className="font-medium italic opacity-100">{i+1}.</span>,
        white: (
          <Move
            key={moves[2*i].timestamp}
            move={moves[2*i]}
            gamePos={gamePos}
            onBoardUpdate={onBoardUpdate}
            onClick={onClick}
          />
        ),
        black: (2 * i) + 1 < moves.length ?
          <Move
            key={moves[2*i+1].timestamp}
            move={moves[2*i+1]}
            gamePos={gamePos}
            onBoardUpdate={onBoardUpdate}
            onClick={onClick}
          />
        : null
      });
    }

    // this.setState({ rows: rows });

    // console.log(rows)
    return rows;
  }

  // componentDidMount(){
  //   console.log("hey")
  //   this.getRows();
  // }

  render() { 
    return (
      <div className="text-white bg-tirsh opacity-80 rounded-lg max-w-xs h-96 ml-4 pl-2 overflow-y-auto overflow-x-hidden">
        <table width="250px" >
          <colgroup>
            <col style={{width:'10%'}}/>
            <col style={{width:'45%'}}/>
            <col style={{width:'45%'}}/>
          </colgroup>
          <thead className="sticky top-0 bg-tirsh">
            <tr height="20px" >
              <td className="font-sans font-bold tracking-wide text-left" colSpan="3">
                Moves
              </td>
            </tr>
          </thead>
          <tbody className="">
            {this.getRows().map((row) =>{
              return (
                <tr key={row.id} height="20px">
                  {this.columns.map((col, i) => {
                    return (
                      <td key={col.field} align='center' size='small'>
                        {row[col.field]}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      // <TableContainer sx={{ maxHeight: 450, maxWidth: 300 }}>
      //   <Table>
          // <colgroup>
          //   <col style={{width:'20%'}}/>
          //   <col style={{width:'40%'}}/>
          //   <col style={{width:'40%'}}/>
          // </colgroup>
      //     <TableHead>
      //       <TableCell sx={{ fontWeight: 'bold' }} align='left' colSpan={3} size='small'>
      //         Moves:
      //       </TableCell>
      //     </TableHead>
      //     <TableBody>
            // {this.getRows().map((row) =>{
            //   return (
            //     <TableRow key={row.id}>
            //       {this.columns.map((col, i) => {
            //         return (
            //           <TableCell key={col.field} align='center' size='small'>
            //             {row[col.field]}
            //           </TableCell>
            //         );
            //       })}
            //     </TableRow>
            //   );
            // })}
      //     </TableBody>
      //   </Table>
      // </TableContainer>
    );
  }
}
 
export default Moves;